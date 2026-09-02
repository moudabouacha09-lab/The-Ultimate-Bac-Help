# Teacher approval emails

`teacher-approval-email` is a Supabase Edge Function intended to be called by a
Database Webhook when `public.contributor_applications.status` changes from
`pending` to `approved`.

## Deploy

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
supabase functions deploy teacher-approval-email --no-verify-jwt
```

Set the function secrets in the Supabase dashboard under **Edge Functions → Secrets**:

- `RESEND_API_KEY`: API key from Resend.
- `EMAIL_FROM`: a verified sender, for example `باك الجزائر <noreply@example.com>`.
- `APP_URL`: the deployed site URL, such as `https://your-app.vercel.app`.
- `TEACHER_APPROVAL_WEBHOOK_SECRET`: a long random value used by the webhook.

The same values can be configured from a terminal (PowerShell or Bash):

```bash
supabase secrets set RESEND_API_KEY=re_... EMAIL_FROM="باك الجزائر <noreply@example.com>" APP_URL=https://your-app.vercel.app TEACHER_APPROVAL_WEBHOOK_SECRET="replace-with-a-long-random-secret"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided by Supabase for the
function. Never expose the service-role key or Resend key to the browser.

## Create the webhook

In Supabase: **Database → Webhooks → Create webhook**.

- Table: `contributor_applications`
- Events: `Update`
- URL: `https://<project-ref>.supabase.co/functions/v1/teacher-approval-email`
- Add header `x-teacher-approval-secret` with the same secret configured above.

The function sends only for a newly approved teacher application. The migration
adds `approval_email_sent_at` so webhook retries do not send the message again,
and adds the `profiles.role` column when it is missing. The function sets
`profiles.role = 'teacher'` for the approved application so the existing upload
gate immediately grants teacher access.
