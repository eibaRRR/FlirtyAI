"use client";

import { GENDERS, type Gender } from "@/lib/schema";
import { Segmented } from "./Segmented";

type Props = {
  label: string;
  value: Gender;
  onChange: (g: Gender) => void;
};

const LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

export function GenderToggle({ label, value, onChange }: Props) {
  return (
    <div>
      <div className="text-eyebrow mb-2">{label}</div>
      <Segmented<Gender>
        size="sm"
        options={GENDERS.map((g) => ({ value: g, label: LABELS[g] }))}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
