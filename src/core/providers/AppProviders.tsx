import type { ReactNode } from "react";

import { OnlinePresence } from "@/components/system/online-presence";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      <OnlinePresence />
      {children}
    </>
  );
}