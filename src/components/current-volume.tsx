"use client";

import { useEffect, useState } from "react";
import { useData } from "@/context/data-provider";
import { Minus, Plus } from "lucide-react";

export const CurrentVolume = () => {
  const { data } = useData();
  const [currentVolume, setCurrentVolume] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      const recentDates = Object.keys(data).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      if (recentDates.length >= 2) {
        const latestDate = recentDates[0];
        const previousDate = recentDates[1];

        const latestVolume = parseFloat(data[latestDate]["5. volume"]);
        const previousVolume = parseFloat(data[previousDate]["5. volume"]);

        setCurrentVolume(latestVolume);

        const change = ((latestVolume - previousVolume) / previousVolume) * 100;
        setPercentageChange(change);
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-4 w-full relative w-max">
      <h1 className="font-medium text-6xl">
        {currentVolume !== null ? currentVolume.toLocaleString() : "Loading..."}
      </h1>
      {percentageChange !== null ? (
        <p
          className={`${
            percentageChange !== null && percentageChange >= 0
              ? "text-green-500"
              : "text-red-500"
          } flex items-center gap-1`}
        >
          {percentageChange >= 0 ? <Plus size={18} /> : <Minus size={18} />} $
          {Math.abs(percentageChange).toFixed(2)}% in the last 24 hours
        </p>
      ) : (
        "Loading..."
      )}
      <p className="bg-foreground/5 font-medium px-3 py-1 rounded absolute top-0 -right-20">
        USD
      </p>
    </div>
  );
};
