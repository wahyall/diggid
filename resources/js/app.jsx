import "./bootstrap";
import "../css/app.css";

import React from "react";
import { render } from "react-dom";
import { createInertiaApp } from "@inertiajs/inertia-react";
import { InertiaProgress } from "@inertiajs/progress";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

// React-Query
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Jotai
import { Provider as JotaiProvider } from "jotai";
import { queryClientAtom } from "jotai/query";

import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      retry: false,
      staleTime: 1000 * 60 * 60 * 1,
    },
  },
});

const appName =
  window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

window.assets = function (path) {
  return (
    import.meta.env.VITE_URL + "/" + path?.split("/").filter(Boolean).join("/")
  );
};

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => {
    const page = resolvePageComponent(
      `./pages/${name}.jsx`,
      import.meta.glob("./pages/**/*.jsx")
    );
    page.then((module) => {
      if (name.startsWith("dashboard")) {
        module.default.layout = (page) => (
          <DashboardLayout children={page} {...page.props} />
        );
      }
    });
    return page;
  },
  setup({ el, App, props }) {
    return render(
      <QueryClientProvider client={queryClient}>
        <JotaiProvider initialValues={[[queryClientAtom, queryClient]]}>
          <App {...props} />
          <ReactQueryDevtools initialIsOpen={false} />
        </JotaiProvider>
      </QueryClientProvider>,
      el
    );
  },
});

InertiaProgress.init({ color: "#2563eb" });
