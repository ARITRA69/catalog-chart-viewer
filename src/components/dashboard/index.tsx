"use client";
import React from "react";
import { AnimatedTabs } from "@/components/animated-tabs";
import { ChartView } from "./chart-view";
import { useData } from "@/context/data-provider";

interface Tab {
  id: number;
  label: string;
  content: JSX.Element;
}

export const Dashboard: React.FC = () => {
  const { data, setOutputSize } = useData();

  const tabs: Tab[] = [
    {
      id: 1,
      label: "Summary",
      content: <div>Summary</div>,
    },
    {
      id: 2,
      label: "Chart",
      content: data ? <ChartView data={data} /> : <div>Loading...</div>,
    },
    {
      id: 3,
      label: "Statistics",
      content: <div>Statistics</div>,
    },
    {
      id: 4,
      label: "Analysis",
      content: <div>Analysis</div>,
    },
    {
      id: 5,
      label: "Settings",
      content: <div>Settings</div>,
    },
  ];

  return <AnimatedTabs tabs={tabs} />;
};
