"use client";

import { LANGUAGES, LANGUAGE_LABELS, type Language } from "@/lib/schema";
import { Pill } from "@/components/ui";

type Props = {
  value: Language;
  onChange: (l: Language) => void;
};

export function LanguageSelector({ value, onChange }: Props) {
  return (
    <div>
      <div className="text-eyebrow mb-2">Reply language</div>
      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((l) => (
          <Pill
            key={l}
            size="sm"
            selected={value === l}
            onClick={() => onChange(l)}
          >
            {LANGUAGE_LABELS[l]}
          </Pill>
        ))}
      </div>
    </div>
  );
}
