import React, { memo, useState, useEffect } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Skeleton from "react-loading-skeleton";
import { For, Show } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";
import { useQueryClient } from "@tanstack/react-query";
import VideoPlayer from "@/pages/front/components/VideoPlayer";

const FreeVideo = memo(({ slug, addToCart, isCartLoading }) => {
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState({});

  const course = queryClient.getQueryData(["catalog", "course", slug]);
  const { data: videos = [], isLoading } = useQuery(
    ["catalog", "course", slug, "free-video"],
    () => axios.get(`/course/${slug}/video/free`).then((res) => res.data)
  );

  useEffect(() => videos.length && setSelectedVideo(videos[0]), [videos]);

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
            <li>
              <div className="rounded-full btn btn-ghost w-full justify-start gap-2 px-4 py-2 mb-4 normal-case flex-nowrap bg-slate-200 hover:bg-slate-200 cursor-default">
                <i className="fa fa-play-circle text-xl"></i>
                <span className="font-medium truncate">
                  {course.videos_count - videos.length} video lainnya
                </span>
              </div>
            </li>
          </ul>
        </div>
        <Show>
          <Show.When isTrue={course.is_purchased}>
            <Link
              href={route("front.me.course.lesson", course.slug)}
              className="btn btn-lg btn-primary rounded-t-none w-full"
              data-ripplet
            >
              Mulai Belajar
            </Link>
          </Show.When>
          <Show.Else>
            <button
              className={`btn btn-lg btn-primary rounded-t-none w-full ${
                isCartLoading && "loading"
              }`}
              disabled={isCartLoading}
              data-ripplet
              onClick={addToCart}
            >
              Gabung Kelas
            </button>
          </Show.Else>
        </Show>
      </div>
    </section>
  );
});

export default FreeVideo;
