"use client";

import { useState, type ReactNode } from "react";
import { Provider as StyletronProvider } from "styletron-react";
import {
  Client as StyletronClientEngine,
  Server as StyletronServerEngine,
} from "styletron-engine-atomic";
import { BaseProvider } from "baseui";
import { SnackbarProvider, PLACEMENT } from "baseui/snackbar";
import { skTheme } from "@/lib/baseTheme";

/**
 * We deliberately don't extract server-collected styles into the SSR'd HTML (no
 * useServerInsertedHTML). Styletron's atomic engine assigns classnames sequentially in render
 * order, so a fresh Server engine (SSR) and a fresh Client engine (hydration) that see the same
 * component tree in the same order land on identical classnames on their own — no hydrate-array
 * reconciliation needed, and no risk of the two engines drifting out of sync. The tradeoff is a
 * brief unstyled flash of Base Web components on a hard page load, before the client engine
 * inserts its <style> rules; Tailwind-styled content is unaffected since it's compiled CSS.
 */
export const BaseWebProvider = ({ children }: { children: ReactNode }) => {
  const [engine] = useState<
    | InstanceType<typeof StyletronServerEngine>
    | InstanceType<typeof StyletronClientEngine>
  >(() =>
    typeof window === "undefined"
      ? new StyletronServerEngine()
      : new StyletronClientEngine(),
  );

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={skTheme}>
        <SnackbarProvider placement={PLACEMENT.bottom}>
          {children}
        </SnackbarProvider>
      </BaseProvider>
    </StyletronProvider>
  );
};
