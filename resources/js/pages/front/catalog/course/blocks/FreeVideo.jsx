import React, { memo, useState, useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Skeleton from "react-loading-skeleton";
import { For } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";
import VideoPlayer from "@/pages/front/components/VideoPlayer";

const FreeVideo = memo(({ slug }) => {
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState({});

  const course = queryClient.getQueryData(["catalog", "course", slug]);
  const { data: videos = [], isLoading } = useQuery(
    ["catalog", "course", slug, "free-video"],
    () => axios.get(`/course/${slug}/video/free`).then((res) => res.data),
    {
      onSuccess: (data) => setSelectedVideo(data[0]),
    }
  );

  if (isLoading)
    return (
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 px-4 lg:px-0 mt-8">
        <Skeleton className="aspect-video" />
        <div>
          <Skeleton className="h-full" />
        </div>
      </section>
    );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 px-4 lg:px-0 mt-8">
      <VideoPlayer course={course} video={selectedVideo} />
      <div>
        <div className="p-6 bg-slate-100 rounded-t-md">
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
                    className={`rounded-full btn btn-ghost w-full justify-start gap-2 px-4 py-2 mb-4 normal-case flex-nowrap ${
                      selectedVideo.uuid === video.uuid
                        ? "bg-slate-700 text-white"
                        : "bg-slate-200"
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <i className="fa fa-play-circle text-xl"></i>
                    <span className="font-medium truncate">{video.name}</span>
                  </button>
                </li>
              )}
            />
          </ul>
        </div>
        <button className="btn btn-lg btn-primary rounded-t-none w-full">
          Gabung Kelas
        </button>
      </div>
    </section>
  );
});

export default FreeVideo;
