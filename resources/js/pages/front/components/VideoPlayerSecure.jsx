import React, { memo, useEffect, useMemo, useState } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import ReactPlayer from "react-player";

const VideoPlayerSecure = memo(({ course, lesson, video, className }) => {
  const [videoUrl, setVideoUrl] = useState();
  const url = useMemo(
    () => `/me/course/${course?.slug}/${lesson?.slug}/${video?.slug}`,
    [course, lesson, video]
  );

  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    "me",
    "course",
    "video",
    course.slug,
    lesson.slug,
    video.slug,
  ]);

  return (
    <ReactPlayer
      url={data.url}
      controls
      className={`aspect-video rounded-lg overflow-hidden ${className}`}
      width="100%"
      height="100%"
      light={video?.thumbnail}
      config={{ file: { forceHLS: true, forceVideo: true } }}
    />
  );
});

export default VideoPlayerSecure;
