"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "USDC" | "USDT";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USDC");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("paysted_pref_currency") as Currency;
    if (saved === "USDC" || saved === "USDT") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("paysted_pref_currency", curr);
  };

  if (!mounted) {
    return <CurrencyContext.Provider value={{ currency: "USDC", setCurrency }}>{children}</CurrencyContext.Provider>;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
}
