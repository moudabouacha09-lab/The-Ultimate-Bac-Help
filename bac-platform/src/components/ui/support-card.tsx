"use client";

import { useState } from "react";
import { Copy, Check, CreditCard } from "lucide-react";

interface SupportCardProps {
  ripNumber?: string;
  accountHolder?: string;
}

export function SupportCard({
  ripNumber = "00799999002345678901",
  accountHolder = "المكتبة الرقمية للبكالوريا (BaridiMob)"
}: SupportCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ripNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = ripNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="support-card">
      <div className="support-card-header">
        <span className="support-card-icon" aria-hidden="true"><CreditCard size={22} /></span>
        <div>
          <h3>دعم المنصة مجاناً</h3>
          <p>ساهم في استمرار الموارد مجانية وبدون إعلانات</p>
        </div>
      </div>

      <div className="support-rip-box">
        <div className="support-rip-info">
          <small>الحساب الجاري (RIP BaridiMob):</small>
          <strong>{ripNumber}</strong>
          <span className="support-holder-name">{accountHolder}</span>
        </div>

        <button
          type="button"
          className={`support-copy-btn ${copied ? "is-copied" : ""}`}
          onClick={handleCopy}
          aria-label="نسخ رقم RIP"
        >
          {copied ? (
            <><Check size={16} /> تم النسخ!</>
          ) : (
            <><Copy size={16} /> نسخ الحساب</>
          )}
        </button>
      </div>
    </div>
  );
}
