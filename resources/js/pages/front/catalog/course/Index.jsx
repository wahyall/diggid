import React, { memo, useMemo, Fragment } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { usePage } from "@inertiajs/inertia-react";
import { asset, currency } from "@/libs/utils";

import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import { For, Show } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import FreeVideo from "./blocks/FreeVideo";
import Information from "./blocks/Information";

const Index = memo(() => {
  const queryClient = useQueryClient();
  const {
    route: {
      parameters: { slug },
    },
  } = usePage().props;

  const { data: course = {}, isLoading } = useQuery(
    ["catalog", "course", slug],
    () => axios.get(`/catalog/course/${slug}`).then((res) => res.data)
  );

  const level = useMemo(() => {
    if (course.level === "1") return "Pemula";
    if (course.level === "2") return "Menengah";
    if (course.level === "3") return "Mahir";
    return "";
  }, [course]);

  const { mutate: addToCart, isLoading: isCartLoading } = useMutation(
    () => axios.post("/me/cart", { course_uuid: course.uuid }),
    {
      onSuccess: () => {
        Inertia.visit(route("front.me.cart"));
        queryClient.invalidateQueries(["me", "cart"]);
      },
      onError: (error) => {
        if (error.response.status === 401)
          Inertia.visit(route("login"), {
            data: {
              redirect: route("front.catalog.course", course.slug),
            },
          });
      },
    }
  );

  if (isLoading)
    return (
      <article className="md:container mx-auto md:px-4">
        <header className="md:grid grid-cols-[2fr_3fr] gap-8 md:py-20">
          <Skeleton className="aspect-video" />
          <div className="px-4 md:px-0">
            <div className="flex gap-2 my-4">
              <Skeleton height={24} width={72} />
              <Skeleton height={24} width={72} />
              <Skeleton height={24} width={72} />
            </div>
            <Skeleton height={48} className="mb-2" />
            <Skeleton height={48} />
            <div className="flex gap-x-8 my-4">
              <Skeleton height={24} width={120} />
              <Skeleton height={24} width={120} />
            </div>
            <Skeleton height={20} className="mb-2" />
            <Skeleton height={20} className="mb-2" />
            <Skeleton height={20} width={220} />
          </div>
        </header>
      </article>
    );

  return (
    <article className="md:container mx-auto md:px-4">
      <header className="md:grid grid-cols-[2fr_3fr] lg:gap-8 md:gap-4 md:py-20">
        <img
          src={asset(course.thumbnail)}
          alt={course.name}
          className="aspect-video md:rounded-md"
        />
        <div className="prose px-4 md:px-0 mx-auto md:mx-0">
          <div className="flex gap-2 mb-2 mt-6 md:mt-0">
            <For
              each={course.categories}
              render={(category) => (
                <div className="badge badge-ghost" key={category.uuid}>
                  {category.name}
                </div>
              )}
            />
          </div>
          <h1 className="mb-4 font-bold">{course.name}</h1>
          <div className="flex gap-x-8 my-4">
            <div className="flex items-center gap-2">
              <svg
                className="svg-icon -mt-3 -mr-2"
                style={{
                  width: "2rem",
                  height: "2rem",
                  overflow: "hidden",
                  fill: "#570df8",
                  verticalAlign: "middle",
                }}
                viewBox="0 0 1280 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M432 576h-96c-17.68 0-32 14.32-32 32v384c0 17.68 14.32 32 32 32h96c17.68 0 32-14.32 32-32V608c0-17.68-14.32-32-32-32zM176 768H80c-17.68 0-32 14.32-32 32v192c0 17.68 14.32 32 32 32h96c17.68 0 32-14.32 32-32v-192c0-17.68-14.32-32-32-32z m512-384h-96c-17.68 0-32 14.32-32 32v576c0 17.68 14.32 32 32 32h96c17.68 0 32-14.32 32-32V416c0-17.68-14.32-32-32-32z" />
              </svg>
              <span className="font-medium">Level: {level}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="far fa-clock text-xl"></i>
              <span className="font-medium">
                Durasi: {course.finish_estimation} Jam
              </span>
            </div>
          </div>
          <p>{course.caption}</p>
        </div>
      </header>
      <FreeVideo
        slug={course?.slug}
        addToCart={addToCart}
        isCartLoading={isCartLoading}
      />
      <Information slug={course?.slug} />
      <div className="text-center mt-20 mb-12">
        <div className="px-4 py-2 rounded-full bg-blue-200 inline-block">
          <h6 className="text-primary text-md font-bold">#ExploreYourSkills</h6>
        </div>
      </div>
      <section className="max-w-3xl mx-auto flex flex-col justify-center gap-4 px-4 md:px-0">
        <h1 className="font-bold text-center text-3xl">{course.name}</h1>
        <h6 className="text-center text-3xl my-4">{currency(course.price)}</h6>
        <Show>
          <Show.When isTrue={course.is_purchased}>
            <Link
              href={route("front.me.course.lesson", course.slug)}
              className="btn btn-lg btn-primary"
              data-ripplet
            >
              Mulai Belajar
            </Link>
          </Show.When>
          <Show.Else>
            <button
              onClick={addToCart}
              className={`btn btn-lg btn-primary ${isCartLoading && "loading"}`}
              disabled={isCartLoading}
              data-ripplet
            >
              Gabung Kelas
            </button>
          </Show.Else>
        </Show>
      </section>
    </article>
  );
});

export default Index;
