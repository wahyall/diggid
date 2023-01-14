import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";

import Skeleton from "react-loading-skeleton";
import { For, If, Show } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";

const CourseLayout = memo(() => {
  const {
    route: {
      parameters: { slug },
    },
  } = usePage().props;

  const { data: course = {}, isLoading } = useQuery(
    ["me", "course", slug],
    () => axios.get(`/me/course/${slug}`).then((res) => res.data)
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
          {children}
        </div>
        <div className="drawer-side !max-h-none">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-base-100 text-base-content">
            <section className="mt-4">
              <h6 className="text-xl font-semibold mb-0">
                {course.course.name}
              </h6>
            </section>
            <div className="divider my-4"></div>
            <For
              each={course.course.lessons}
              render={(lesson) => (
                <div className="collapse collapse-arrow mb-2 py-2">
                  <input type="checkbox" className="peer" />
                  <span className="collapse-title text-lg font-normal p-0 flex items-center">
                    {lesson.name}
                  </span>
                  <div className="collapse-content p-0">
                    <ul className="mt-2">
                      <For
                        each={lesson.videos}
                        render={(video) => (
                          <li>
                            <Link
                              href={route(
                                "front.me.course.learn.video",
                                video.order
                              )}
                              className={`rounded-full btn btn-ghost w-full justify-start gap-2 px-4 py-2 mb-4 normal-case flex-nowrap`}
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
          </ul>
        </div>
      </aside>
    </main>
  );
});

export default CourseLayout;
