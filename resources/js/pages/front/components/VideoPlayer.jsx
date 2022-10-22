import React, { memo, useEffect, useMemo, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

import ReactPlayer from "react-player";

const VideoPlayer = memo(({ course, video }) => {
  const [videoUrl, setVideoUrl] = useState();
  const url = useMemo(
    () => `/course/${course?.slug}/video/${video?.slug}`,
    [video, course?.slug]
  );

  const { mutate: getVideo } = useMutation(
    () => axios.get(url).then((res) => res.data),
    {
      onSuccess: (data) => setVideoUrl(data),
    }
  );

  useEffect(() => video?.slug && getVideo(), [video]);

  return (
    <ReactPlayer
      url={videoUrl}
      controls
      className="aspect-video rounded-lg overflow-hidden"
      width="100%"
      height="100%"
      light={video?.thumbnail}
      config={{ file: { forceHLS: true, forceVideo: true } }}
    />
  );
});

export default VideoPlayer;
