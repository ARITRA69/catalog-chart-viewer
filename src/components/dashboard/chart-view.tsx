"use client";
import { Expand, GitCompare, X } from "lucide-react";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { subDays } from "date-fns";
import toast from "react-hot-toast";
import { useData } from "@/context/data-provider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { BRANDS } from "@/constants";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ChartViewProps = {
  data: {
    [key: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
};

const timeRanges = {
  "1D": 1,
  "3D": 3,
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
  max: Infinity,
};

const formatData = (
  data: Record<string, Record<string, string>>,
  days: number
) => {
  const today = new Date();
  const filteredData = Object.keys(data)
    .filter((date) => {
      const dataDate = new Date(date);
      return days === Infinity || dataDate >= subDays(today, days);
    })
    .map((date) => ({
      date,
      volume: parseFloat(data[date]["5. volume"]),
    }))
    .reverse();

  return filteredData;
};

export const ChartView: FC<ChartViewProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<keyof typeof timeRanges>("6M");
  const [filteredData, setFilteredData] = useState(() =>
    formatData(data, timeRanges["max"])
  );
  const [compareAlertDialogOpen, setCompareAlertDialogOpen] = useState(false);
  const [fullScreenDialogOpen, setFullScreenDialogOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const { setOutputSize } = useData();

  useEffect(() => {
    setFilteredData(formatData(data, timeRanges[timeRange]));
  }, [timeRange, data]);

  const handleTimeRangeChange = (range: keyof typeof timeRanges) => {
    setTimeRange(range);
    if (range === "max") {
      setOutputSize("full");
    } else {
      setOutputSize("compact");
    }
  };

  const handleCompareAlertDialogOpen = () => {
    setCompareAlertDialogOpen(true);
  };

  const handleBrandSelection = (symbol: string) => {
    setSelectedBrands((prevSelected) => {
      if (prevSelected.includes(symbol)) {
        return prevSelected.filter((s) => s !== symbol);
      } else {
        if (prevSelected.length < 4) {
          return [...prevSelected, symbol];
        }
        return prevSelected;
      }
    });
  };

  const handleFullScreenDialogOpen = () => {
    setFullScreenDialogOpen(true);
  };

  const handleCompareAction = () => {
    console.log("Selected brands for comparison:", selectedBrands);
    toast.error("Functionality not implemented yet");
    setCompareAlertDialogOpen(false);
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={handleFullScreenDialogOpen}
            >
              <Expand size={18} />
              Fullscreen
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={handleCompareAlertDialogOpen}
            >
              <GitCompare size={18} />
              Compare
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {Object.keys(timeRanges).map((range) => (
              <Button
                key={range}
                onClick={() =>
                  handleTimeRangeChange(range as keyof typeof timeRanges)
                }
                variant={timeRange === range ? "default" : "ghost"}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <h1 className="font-medium">APPLE INC. STOCK VOLUME</h1>
          <ResponsiveContainer>
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0000FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0000FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#0000FF"
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Dialog
        open={fullScreenDialogOpen}
        onOpenChange={setFullScreenDialogOpen}
      >
        <DialogContent className="h-[90vh]">
          <DialogHeader>
            <DialogTitle>APPLE INC. STOCK VOLUME</DialogTitle>
            <DialogDescription>
              Bellow shown detailed graph of Apple Inc. stock volume for the
              last {timeRanges[timeRange]} days.
            </DialogDescription>
          </DialogHeader>
          <DialogClose className="absolute right-4 top-4 p-4 rounded-full bg-foreground/75 text-background">
            <X size={18} />
          </DialogClose>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0000FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0000FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <XAxis dataKey="date" className="text-xs" />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#0000FF"
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={compareAlertDialogOpen}
        onOpenChange={setCompareAlertDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select Brands to Compare</AlertDialogTitle>
            <AlertDialogDescription>
              Select at least 2 and up to 4 brands to compare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <Button
                key={brand.symbol}
                variant={
                  selectedBrands.includes(brand.symbol) ? "default" : "ghost"
                }
                onClick={() => handleBrandSelection(brand.symbol)}
              >
                {brand.name}
              </Button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompareAction}
              disabled={selectedBrands.length < 2 || selectedBrands.length > 4}
            >
              Compare
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};
