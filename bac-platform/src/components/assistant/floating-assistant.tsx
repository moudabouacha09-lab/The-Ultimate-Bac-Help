// src/components/assistant/floating-assistant.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  text: string;
}

const DAILY_LIMIT = 8;
const USAGE_KEY = "bac_ai_assistant_usage";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function getStoredDailyCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayString()) {
      localStorage.setItem(USAGE_KEY, JSON.stringify({ date: getTodayString(), count: 0 }));
      return 0;
    }
    return typeof parsed.count === "number" ? parsed.count : 0;
  } catch {
    return 0;
  }
}

function incrementStoredDailyCount(): number {
  if (typeof window === "undefined") return 1;
  const current = getStoredDailyCount();
  const next = current + 1;
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify({ date: getTodayString(), count: next }));
  } catch {}
  return next;
}

const quickQuestions = [
  "كيف أحسب معدلي؟ 🧮",
  "من هم أفضل أساتذة الرياضيات؟ 📐",
  "نصائح لتنظيم الوقت ⏱️",
  "أين أجد ملخصات العلوم؟ 🧬"
];

const ENABLE_FLOATING_ASSISTANT = false; // Disabled until further notice

export function FloatingAssistant() {
  if (!ENABLE_FLOATING_ASSISTANT) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "مرحباً بك! 👋 أنا مساعدك الذكي في منصة باك الجزائر. كيف يمكنني مساعدتك اليوم في تحضيرك للبكالوريا؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDailyCount(getStoredDailyCount());
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const remainingQuestions = Math.max(0, DAILY_LIMIT - dailyCount);
  const isLimitReached = dailyCount >= DAILY_LIMIT;

  const handleSend = async (textToSend?: string) => {
    if (isLimitReached) return;

    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", text: messageText }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    const newCount = incrementStoredDailyCount();
    setDailyCount(newCount);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json().catch(() => ({}));
      if (data.rateLimited) {
        setDailyCount(DAILY_LIMIT);
      }

      if (data.reply) {
        setMessages([...newMessages, { role: "model", text: data.reply }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: "model", text: data.error }]);
      } else {
        setMessages([
          ...newMessages,
          { role: "model", text: "أهلاً بك! يمكنك تصفح قسم الأدوات والمواد الدراسية لحساب المعدل والمراجعة. 🚀" }
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "model", text: "أهلاً بك! يمكنك تصفح قسم الأدوات والمواد الدراسية لحساب المعدل والمراجعة. 🚀" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assistant-widget">
      {/* Floating Circle Trigger Button */}
      <button
        className={`assistant-trigger ${isOpen ? "is-active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="فتح المساعد الذكي"
        type="button"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chat Window Container */}
      {isOpen && (
        <div className="assistant-window" aria-label="نافذة الدردشة مع المساعد الذكي">
          <header className="assistant-header">
            <div className="assistant-brand">
              <span className="assistant-avatar">🤖</span>
              <div>
                <strong>مساعد باك الجزائر</strong>
                <small style={{ color: remainingQuestions > 0 ? "#a8d2e2" : "#fca5a5" }}>
                  الأسئلة المتبقية اليوم: {remainingQuestions} / {DAILY_LIMIT}
                </small>
              </div>
            </div>
            <button className="assistant-close" onClick={() => setIsOpen(false)} type="button">
              ✕
            </button>
          </header>

          <div className="assistant-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`assistant-bubble ${
                  msg.role === "user" ? "bubble-user" : "bubble-model"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="assistant-bubble bubble-model bubble-loading">
                <span>.</span><span>.</span><span>.</span> جاري التفكير
              </div>
            )}

            {isLimitReached && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "0.65rem",
                  fontSize: "0.8rem",
                  color: "#ef4444",
                  textAlign: "center",
                  lineHeight: "1.5"
                }}
              >
                ⚠️ استوفيت الحد الأقصى اليومي (8 أسئلة). يمكنك العودة غداً أو استخدام حاسبة المعدل والأدوات مباشرة!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          {!isLimitReached && messages.length < 3 && (
            <div className="assistant-quick-chips">
              {quickQuestions.map((q) => (
                <button key={q} type="button" onClick={() => handleSend(q)} disabled={isLoading}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            className="assistant-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={isLimitReached ? "استوفيت الحد اليومي (8/8 أسئلة)..." : "اكتب سؤالك هنا..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || isLimitReached}
            />
            <button type="submit" disabled={isLoading || isLimitReached || !input.trim()}>
              إرسال ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
