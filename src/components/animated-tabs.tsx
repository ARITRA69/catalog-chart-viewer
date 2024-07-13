"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Tab = {
  id: number;
  label: string;
  content: React.ReactNode;
};

type AnimatedTabsProps = {
  tabs: Tab[];
};

export function AnimatedTabs({ tabs }: AnimatedTabsProps) {
  let [activeTab, setActiveTab] = useState(tabs[1].id);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id ? "text-black" : "hover:text-black/60"
            } relative h-full px-3 text-2xl text-black transition focus-visible:outline-2`}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="underline"
                className="absolute -bottom-2 left-0 right-0 h-1 bg-violet-500 rounded-full"
                style={{ borderRadius: 9999 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center w-full">
        <AnimatePresence mode="wait">
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <motion.div
                key={tab.id}
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
