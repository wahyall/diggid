import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function Index({ auth: { user } }) {
  useEffect(() => {
    setTimeout(() => {
      Inertia.visit(route(`dashboard.${user.role}`));
    }, 100);
  }, []);
  return <h1>Redirecting ...</h1>;
}
