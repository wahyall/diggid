import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

import Skeleton from "react-loading-skeleton";
import { For, If, Show } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";
import { useEffect } from "react";

const CourseLayout = memo(({ children, auth: { user } }) => {
  const {
    route: {
      parameters: { course: courseSlug, lesson: lessonSlug, video: videoSlug },
    },
  } = usePage().props;

  const {
    data: course = {},
    isLoading,
    isError,
    error,
  } = useQuery(["me", "course", courseSlug], () =>
    axios.get(`/me/course/${courseSlug}`).then((res) => res.data)
  );

  useEffect(() => {
    if (!isLoading && !isError) {
      if (!videoSlug || !lessonSlug) {
        Inertia.visit(
          route("front.me.course.lesson.video", [
            courseSlug,
            course.course.lessons[0].slug,
            course.course.lessons[0].videos[0].slug,
          ])
        );
      }
    }
  }, [isLoading, course, courseSlug, lessonSlug, videoSlug]);

  if (isError)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <h1 className="text-3xl font-bold text-center lg:mt-12">
          Kamu tidak memilki akses ke Kelas ini
        </h1>
        <div className="mt-4 flex items-center flex-col">
          <h6 className="text-lg">Yuk lihat semua Kelas kami yang menarik.</h6>
          <Link
            href={route("front.catalog")}
            className="btn btn-ghost mt-8 bg-slate-200"
            data-ripplet
          >
            Cari Kelas
          </Link>
        </div>
      </main>
    );

  return (
    <main className="-mt-4">
      <aside className="drawer drawer-mobile lg:px-8 h-auto">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content container mx-auto lg:relative lg:!z-50">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-square btn-ghost lg:hidden mt-8 ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          {!isLoading && !!videoSlug && !!lessonSlug && children}
        </div>
        <div className="drawer-side !max-h-none">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-96 bg-base-100 text-base-content">
            <section className="mt-4">
              <h6 className="text-xl font-semibold mb-0">
                {course.course?.name}
              </h6>
            </section>
            <div className="divider my-4"></div>
            <Show>
              <Show.When isTrue={isLoading}>
                <div>
                  <Skeleton height={48} className="mb-4" />
                </div>
                <div>
                  <Skeleton height={48} className="mb-4" />
                </div>
                <div>
                  <Skeleton height={48} className="mb-4" />
                </div>
                <div>
                  <Skeleton height={48} className="mb-4" />
                </div>
              </Show.When>
              <Show.Else>
                <For
                  each={course.course?.lessons}
                  render={(lesson) => (
                    <div className="collapse collapse-arrow mb-2 py-2">
                      <input type="checkbox" className="peer" />
                      <span className="collapse-title text-lg font-normal p-0 flex items-center">
                        {lesson.name}
                      </span>
                      <div className="collapse-content !p-0">
                        <ul className="mt-2">
                          <For
                            each={lesson.videos}
                            render={(video) => (
                              <li>
                                <Link
                                  href={route("front.me.course.lesson.video", [
                                    course.course?.slug,
                                    lesson.slug,
                                    video.slug,
                                  ])}
                                  className={`rounded-full btn btn-ghost w-full justify-start gap-2 px-4 py-2 mb-4 normal-case flex-nowrap ${
                                    lessonSlug == lesson.slug &&
                                    videoSlug == video.slug
                                      ? "bg-primary text-white hover:bg-primary"
                                      : "bg-slate-200"
                                  }`}
                                  data-ripplet
                                >
                                  <i className="fa fa-play-circle text-xl"></i>
                                  <span className="font-medium truncate">
                                    {video.name}
                                  </span>
                                </Link>
                              </li>
                            )}
                          />
                        </ul>
                      </div>
                    </div>
                  )}
                />
              </Show.Else>
            </Show>
          </ul>
        </div>
      </aside>
    </main>
  );
});

export default CourseLayout;
