import React, { memo } from "react";

import MainLayout from "../../layouts/MainLayout";
import CourseLayout from "../../layouts/CourseLayout";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";
import parse from "html-react-parser";

import Skeleton from "react-loading-skeleton";
import VideoPlayerSecure from "../../components/VideoPlayerSecure";

const Video = memo(() => {
  const {
    route: {
      parameters: { course: courseSlug, lesson: lessonSlug, video: videoSlug },
    },
  } = usePage().props;

  const queryClient = useQueryClient();
  const course = queryClient.getQueryData(["me", "course", courseSlug]);
  const { data: video = {}, isLoading } = useQuery(
    ["me", "course", "video", courseSlug, lessonSlug, videoSlug],
    () =>
      axios
        .get(`/me/course/${courseSlug}/${lessonSlug}/${videoSlug}`)
        .then((res) => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["me", "course"], { exact: true });
      },
    }
  );

  if (isLoading)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <Skeleton height={48} className="mb-4" />
        <Skeleton className="w-full aspect-video mb-8" />
        <Skeleton height={24} className="mb-4" />
        <Skeleton height={24} className="mb-4" />
        <Skeleton height={24} className="mb-4" />
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-2xl font-semibold mb-4">{video.name}</h1>
      <VideoPlayerSecure
        course={course?.course}
        lesson={video?.lesson}
        video={video}
        className="mb-8"
      />
      <article>
        <h1 className="text-lg font-medium mb-4">Deskripsi</h1>
        <div className="prose">{parse(video.description || "")}</div>
      </article>
    </main>
  );
});

Video.layout = (page) => (
  <MainLayout {...page.props}>
    <CourseLayout children={page} {...page.props}></CourseLayout>
  </MainLayout>
);

export default Video;
