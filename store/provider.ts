"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { createElement, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return createElement(Provider, { store, children });
}