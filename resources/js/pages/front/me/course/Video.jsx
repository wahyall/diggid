import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";

const Video = memo(() => {
  const {
    route: {
      parameters: { slug, order },
    },
  } = usePage().props;

  return (
    <main>
      <h1>
        {slug} - {order}
      </h1>
    </main>
  );
});

export default Video;
