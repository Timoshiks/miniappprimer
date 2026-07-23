"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/lib/types";

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="rounded-2xl bg-[#F9FAFB] px-4 border border-gray-100">
      {items.map((item, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} className="border-b border-gray-100 last:border-none">
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : idx)}
              className="w-full flex items-center justify-between py-3.5 text-left"
            >
              <span className="text-[14px] font-medium text-[#111827] pr-4">{item.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#8B5CF6]" : ""
                }`}
              />
            </button>
            {isOpen && (
              <p className="text-[13px] text-gray-500 leading-relaxed pb-4 pr-2 animate-fadeIn">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
