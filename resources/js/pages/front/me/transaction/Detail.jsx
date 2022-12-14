import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";

import Skeleton from "react-loading-skeleton";

const Detail = memo(() => {
  const {
    route: {
      parameters: { uuid },
    },
  } = usePage().props;
  const { data: transaction, isLoading } = useQuery(
    ["me", "transaction", uuid],
    () => axios.get(`/me/transaction/${uuid}`).then((res) => res.data)
  );

  return <main></main>;
});

export default Detail;
