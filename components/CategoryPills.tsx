"use client";

import React from "react";
import { CATEGORIES } from "@/lib/mock-data";

interface CategoryPillsProps {
  active: string;
  onChange: (cat: string) => void;
  showAllOption?: boolean;
}

export default function CategoryPills({ active, onChange, showAllOption = true }: CategoryPillsProps) {
  const list = showAllOption ? CATEGORIES : CATEGORIES.filter((c) => c !== "Все");

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
      {list.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            active === cat
              ? "bg-[#111827] text-white"
              : "bg-[#F9FAFB] text-[#111827] border border-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
