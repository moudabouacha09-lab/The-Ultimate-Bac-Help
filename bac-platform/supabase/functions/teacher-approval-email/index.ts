import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ApprovalRecord = {
  id?: string | number;
  user_id?: string;
  status?: string;
  role_requested?: string;
  full_name?: string;
  email?: string;
  contact_email?: string;
  approval_email_sent_at?: string | null;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  record?: ApprovalRecord;
  old_record?: ApprovalRecord | null;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isApproved(value: unknown) {
  return String(value ?? "").trim().toLowerCase() === "approved";
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const webhookSecret = Deno.env.get("TEACHER_APPROVAL_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("Missing TEACHER_APPROVAL_WEBHOOK_SECRET");
    return json({ error: "Webhook authentication is not configured" }, 500);
  }

  const suppliedSecret = request.headers.get("x-teacher-approval-secret")
    ?? request.headers.get("x-webhook-secret")
    ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (suppliedSecret !== webhookSecret) {
    return json({ error: "Unauthorized" }, 401);
  }

  let payload: WebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  if (payload.table && payload.table !== "contributor_applications") {
    return json({ ok: true, skipped: "unexpected_table" });
  }

  const record = payload.record;
  const oldRecord = payload.old_record;

  if (!record || !isApproved(record.status) || isApproved(oldRecord?.status)) {
    return json({ ok: true, skipped: "not_newly_approved" });
  }

  // Do not send an approval email for other contributor roles.
  if (record.role_requested && record.role_requested !== "teacher") {
    return json({ ok: true, skipped: "not_teacher_application" });
  }

  // The migration adds this field. If it is present in the webhook payload,
  // use it to avoid sending duplicate emails when a webhook is retried.
  if (Object.prototype.hasOwnProperty.call(record, "approval_email_sent_at")
      && record.approval_email_sent_at) {
    return json({ ok: true, skipped: "already_sent" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const emailFrom = Deno.env.get("EMAIL_FROM");
  const appUrl = Deno.env.get("APP_URL")?.replace(/\/$/, "");

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !emailFrom) {
    console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, or EMAIL_FROM");
    return json({ error: "Email service is not configured" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let recipient = record.email?.trim() || record.contact_email?.trim() || "";
  let recipientName = record.full_name?.trim() || "أستاذنا الكريم";

  if (!recipient && record.user_id) {
    const { data, error } = await admin.auth.admin.getUserById(record.user_id);
    if (error) {
      console.error("Could not load the applicant from Auth:", error.message);
    } else if (data.user) {
      recipient = data.user.email ?? "";
      recipientName = String(data.user.user_metadata?.full_name ?? recipientName);
    }
  }

  if (!recipient) {
    return json({ error: "The approved application has no email address" }, 422);
  }

  // The approval workflow normally updates profiles.role itself. This safe,
  // best-effort update also grants teacher access when the role column exists.
  if (record.user_id) {
    const { error } = await admin
      .from("profiles")
      .update({ role: "teacher", updated_at: new Date().toISOString() })
      .eq("id", record.user_id);

    if (error) {
      console.warn("Teacher role was not updated automatically:", error.message);
    }
  }

  const safeName = escapeHtml(recipientName);
  const uploadUrl = appUrl ? `${appUrl}/contribute/upload-exam` : "";
  const button = uploadUrl
    ? `<p style="margin:28px 0"><a href="${uploadUrl}" style="background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;padding:12px 20px;display:inline-block;font-weight:700">ابدأ رفع المحتوى</a></p>`
    : "";

  const html = `
    <div dir="rtl" lang="ar" style="font-family:Arial,sans-serif;line-height:1.9;color:#172033;max-width:620px;margin:auto">
      <h1 style="color:#2563eb">تم قبول طلبك بنجاح 🎉</h1>
      <p>مرحباً ${safeName}،</p>
      <p>يسعدنا إبلاغك بأن طلبك للانضمام إلى فريق المساهمين في <strong>باك الجزائر</strong> قد تم قبوله.</p>
      <p>لديك الآن صلاحية رفع الاختبارات والدروس والملخصات التعليمية ليستفيد منها طلبة البكالوريا.</p>
      ${button}
      <p>شكراً لمساهمتك، وبالتوفيق في رسالتك التعليمية.</p>
      <p>فريق باك الجزائر</p>
    </div>`;

  const text = [
    `مرحباً ${recipientName}،`,
    "تم قبول طلبك للانضمام إلى فريق المساهمين في باك الجزائر بنجاح.",
    "لديك الآن صلاحية رفع الاختبارات والدروس والملخصات التعليمية.",
    uploadUrl ? `ابدأ رفع المحتوى: ${uploadUrl}` : "",
    "شكراً لمساهمتك، وبالتوفيق.",
  ].filter(Boolean).join("\n\n");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [recipient],
      subject: "تم قبول طلبك للانضمام إلى فريق المساهمين 🎉",
      html,
      text,
    }),
  });

  if (!emailResponse.ok) {
    const details = await emailResponse.text();
    console.error("Resend rejected the email:", details);
    return json({ error: "Email provider rejected the message" }, 502);
  }

  if (Object.prototype.hasOwnProperty.call(record, "approval_email_sent_at") && record.id) {
    const { error } = await admin
      .from("contributor_applications")
      .update({ approval_email_sent_at: new Date().toISOString() })
      .eq("id", record.id);

    if (error) {
      console.warn("Email sent, but the sent marker could not be stored:", error.message);
    }
  }

  return json({ ok: true, sentTo: recipient });
});
