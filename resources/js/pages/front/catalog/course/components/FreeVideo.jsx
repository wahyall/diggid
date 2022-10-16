import React, { memo, useState, useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

import ReactPlayer from "react-player";
import Skeleton from "react-loading-skeleton";
import { If, For } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";

const FreeVideo = memo(({ slug }) => {
  const queryClient = useQueryClient();
  const [video, setVideo] = useState({});
  const [videoUrl, setVideoUrl] = useState();

  const course = queryClient.getQueryData(["catalog", "course", slug]);
  const { data: videos = [], isLoading } = useQuery(
    ["catalog", "course", slug, "free-video"],
    () => axios.get(`/course/${slug}/video/free`).then((res) => res.data),
    {
      onSuccess: (data) => setVideo(data[0]),
    }
  );
  const { mutate: getVideo } = useMutation(
    () =>
      axios.get(`/course/${slug}/video/${video?.uuid}`).then((res) => res.data),
    {
      onSuccess: (data) => setVideoUrl(data),
    }
  );

  useEffect(() => video?.uuid && getVideo(), [video]);

  if (isLoading)
    return (
      <section className="grid grid-cols-[2fr_1fr]">
        <Skeleton className="aspect-video" />
        <div>
          <h4 className="">
            {course?.videos_count} Materi ({course?.finish_estimation} jam)
          </h4>
        </div>
      </section>
    );

  return (
    <section className="grid grid-cols-[2fr_1fr]">
      <ReactPlayer
        url={videoUrl}
        controls
        className="aspect-video rounded-lg overflow-hidden"
        width="100%"
        height="100%"
        light
      />
      <div className="rounded-lg">
        <div className="p-6 bg-slate-100">
          <h4 className="text-xl font-bold mb-4">
            {course?.videos_count} Materi ({course?.finish_estimation} jam)
          </h4>
          <ul className="-mb-4">
            <For
              each={videos}
              render={(video) => (
                <li>
                  <button
                    type="button"
                    className="bg-slate-200 rounded-full btn btn-ghost w-full justify-start gap-2 px-4 py-2 mb-4"
                  >
                    <i className="fa fa-play-circle text-xl"></i>
                    <span className="font-medium">{video.name}</span>
                  </button>
                </li>
              )}
            />
          </ul>
        </div>
      </div>
    </section>
  );
});

export default FreeVideo;
