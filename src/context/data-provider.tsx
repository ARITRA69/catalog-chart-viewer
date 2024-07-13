"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TimeSeriesData {
  [key: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
}

interface DataContextProps {
  data: TimeSeriesData | null;
  setOutputSize: (size: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<TimeSeriesData | null>(null);
  const [outputSize, setOutputSize] = useState<string>("compact");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&outputsize=${outputSize}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      setData(data["Time Series (Daily)"]);
    };

    fetchData();
  }, [outputSize]);

  return (
    <DataContext.Provider value={{ data, setOutputSize }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
