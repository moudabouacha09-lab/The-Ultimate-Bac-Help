"use client";

import { useState } from "react";

export type StreamKey =
  | "Scientific"
  | "Mathematical"
  | "Technical"
  | "Literature"
  | "Languages"
  | "Management";

interface StreamBarProps {
  activeStream?: StreamKey;
  onStreamChange?: (stream: StreamKey) => void;
}

const streams: { key: StreamKey; label: string; icon: string }[] = [
  { key: "Scientific", label: "علوم تجريبية", icon: "🧬" },
  { key: "Mathematical", label: "رياضيات", icon: "∑" },
  { key: "Technical", label: "تقني رياضي", icon: "⚙️" },
  { key: "Literature", label: "آداب وفلسفة", icon: "📜" },
  { key: "Languages", label: "لغات أجنبية", icon: "🌐" },
  { key: "Management", label: "تسيير واقتصاد", icon: "📊" },
];

export function StreamBar({ activeStream = "Scientific", onStreamChange }: StreamBarProps) {
  const [selected, setSelected] = useState<StreamKey>(activeStream);

  const handleSelect = (key: StreamKey) => {
    setSelected(key);
    if (onStreamChange) onStreamChange(key);
  };

  return (
    <div className="mobile-stream-bar" aria-label="اختيار الشعبة الدراسية">
      <div className="mobile-stream-scroller">
        {streams.map((s) => {
          const isActive = s.key === selected;
          return (
            <button
              key={s.key}
              type="button"
              className={`stream-pill ${isActive ? "is-active" : ""}`}
              onClick={() => handleSelect(s.key)}
              aria-pressed={isActive}
            >
              <span className="stream-pill-icon" aria-hidden="true">{s.icon}</span>
              <span className="stream-pill-label">{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
