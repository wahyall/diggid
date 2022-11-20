import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Skeleton from "react-loading-skeleton";

const Index = memo(() => {
  const { data: courses, isLoading } = useQuery(["me", "course"], () =>
    axios.get("/me/course").then((res) => res.data)
  );

  return <main></main>;
});

export default Index;
