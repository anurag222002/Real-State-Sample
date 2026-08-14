"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { NavOverlay } from "@/components/layout/NavOverlay";
import { Footer } from "@/components/layout/Footer";
import { ReserveModal } from "@/components/ui/ReserveModal";
import { PageTransition } from "@/components/transition/PageTransition";

type UIContextValue = {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
  reserveOpen: boolean;
  setReserveOpen: (open: boolean) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within AppProviders");
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  const value = useMemo(
    () => ({ navOpen, setNavOpen, reserveOpen, setReserveOpen }),
    [navOpen, reserveOpen],
  );

  return (
    <UIContext.Provider value={value}>
      <SmoothScroll />
      <CustomCursor />
      <Preloader />
      <div className="grain" />
      <PageTransition>
        <Header />
        <NavOverlay />
        <ReserveModal />
        <main>{children}</main>
        <Footer />
      </PageTransition>
    </UIContext.Provider>
  );
}
