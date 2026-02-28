"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Category } from "@/types/database";

interface CategoryFilterProps {
  categories: Category[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeId,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeId === null
            ? "text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        style={
          activeId === null
            ? { backgroundColor: "var(--primary)" }
            : undefined
        }
      >
        All
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeId === cat.id
              ? "text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          style={
            activeId === cat.id
              ? { backgroundColor: "var(--primary)" }
              : undefined
          }
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
