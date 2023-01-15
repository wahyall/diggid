import React, { memo, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Skeleton from "react-loading-skeleton";
import { For, If, Show } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";
import CourseCard from "../../components/CourseCard";

const Index = memo(() => {
  const { data: courses = [], isLoading } = useQuery(["me", "course"], () =>
    axios.get("/me/course").then((res) => res.data)
  );

  useEffect(() => console.log(courses), [courses]);

  if (isLoading)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <h1 className="text-3xl font-bold mb-12 lg:mt-12">Mulai Belajar</h1>
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-3xl font-bold mb-12 lg:mt-12">Mulai Belajar</h1>
      <Show>
        <Show.When isTrue={!!courses.length}>
          <section>
            <For
              each={courses}
              render={(course) => (
                <CourseCard
                  {...course}
                  href={route("front.me.course.learn", course.course.slug)}
                />
              )}
            />
          </section>
        </Show.When>
        <Show.Else>
          <div className="mt-10 flex items-center flex-col">
            <img
              src={asset("assets/media/icons/empty-cart.png")}
              className="opacity-50 w-1/2"
            />
            <Link
              href={route("front.catalog")}
              className="btn btn-ghost mt-8 bg-slate-200"
              data-ripplet
            >
              Lihat Kelas
            </Link>
          </div>
        </Show.Else>
      </Show>
    </main>
  );
});

export default Index;
