import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Skeleton from "react-loading-skeleton";

const Index = memo(() => {
  const { data: transactions, isLoading } = useQuery(
    ["me", "transaction"],
    () => axios.get("/me/transaction").then((res) => res.data)
  );

  return <main></main>;
});

export default Index;
