import React, { memo, useRef } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { extractRouteParams, asset } from "@/libs/utils";
import { useForm, useWatch } from "react-hook-form";
import { Inertia } from "@inertiajs/inertia";
import { useUpdateEffect } from "react-haiku";

import { For, If } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import CourseCard from "../components/CourseCard";
import FilterModal from "./components/FilterModal";

const Index = () => {
  const params = useRef(extractRouteParams(window.location.search));
  const {
    register: form,
    watch,
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      ...params.current,
      ...(!params.current.sort ? { sort: "newest" } : {}),
    },
    mode: "onSubmit",
  });
  const filter = useWatch({
    control,
    name: ["sort", "category", "level"],
  });

  const { data: categoryGroups = [], isSuccess: isCategoryGroupsSuccess } =
    useQuery(["catalog", "category", "group"], () =>
      axios.get("/catalog/category").then((res) => res.data)
    );

  const {
    data: courses = [],
    isSuccess: isCoursesSuccess,
    refetch,
  } = useQuery(["catalog", "course"], () =>
    axios.post("/catalog/course", { ...watch() }).then((res) => res.data)
  );

  useUpdateEffect(() => {
    Inertia.visit(route("front.catalog"), {
      data: { ...watch() },
      onSuccess: refetch,
    });
  }, [filter]);

  const handleSearch = (data) => {
    Inertia.visit(route("front.catalog"), {
      data,
      onSuccess: refetch,
    });
  };

  return (
    <main className="container mx-auto px-4">
      <header className="py-20 prose text-center max-w-none">
        <h1 className="text-navy">Eksplor Semua Kelas Kami</h1>
        <p className="max-w-lg mx-auto text-navy">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui aperiam
          rerum, quisquam sequi nostrum numquam nulla?
        </p>
      </header>
      <section className="mb-12">
        <form
          onSubmit={handleSubmit(handleSearch)}
          className="max-w-3xl flex gap-2 mx-auto"
        >
          <input
            type="text"
            className="input input-bordered w-full border border-primary"
            autoComplete="off"
            name="search"
            placeholder="Cari kelas yang ingin dipelajari..."
            {...form("search")}
          />
          <button type="submit" className="btn btn-primary" data-ripplet>
            Cari
          </button>
        </form>
      </section>
      <section className="mb-12 md:grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr] md:gap-4">
        {/* begin::Filter on Mobile */}
        <div className="rounded-md md:hidden" data-ripplet>
          <label
            htmlFor="filter-modal"
            className="flex rounded-md p-4 shadow mb-8 justify-between cursor-pointer"
          >
            <h6 className="text-lg">Filter Pencarian</h6>
            <i className="fa fa-sliders-h text-xl"></i>
          </label>
        </div>
        {/* end::Filter on Mobile */}

        {/* begin::Filter on Desktop */}
        <div className="hidden md:block overflow-auto max-h-screen scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded">
          <h2 className="text-lg font-semibold mb-4">Kategori</h2>
          <If isTrue={isCategoryGroupsSuccess}>
            <For
              each={categoryGroups}
              render={(group) => (
                <div className="collapse collapse-arrow py-2">
                  <input type="checkbox" className="peer" />
                  <span className="collapse-title text-lg font-normal p-0 flex items-center">
                    <img src={asset(group.icon)} className="w-6 mr-4" />
                    {group.name}
                  </span>
                  <div className="collapse-content p-0">
                    <ul className="mt-2">
                      <For
                        each={group.categories}
                        render={(category) => (
                          <li>
                            <div className="form-control">
                              <label className="label cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="category[]"
                                  className="checkbox checkbox-primary"
                                  value={category.slug}
                                  {...form("category")}
                                />
                                <span className="label-text text-navy">
                                  {category.name}
                                </span>
                              </label>
                            </div>
                          </li>
                        )}
                      />
                    </ul>
                  </div>
                </div>
              )}
            />
            <div className="divider mr-4"></div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Urutkan</h2>
              <ul className="mt-2">
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        className="radio radio-primary"
                        value="newest"
                        {...form("sort")}
                      />
                      <span className="label-text text-navy">Terbaru</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name="sort"
                        className="radio radio-primary"
                        value="popular"
                        {...form("sort")}
                      />
                      <span className="label-text text-navy">Terpopuler</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div className="divider mr-4"></div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Tingkatan</h2>
              <ul className="mt-2">
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        name="level"
                        className="checkbox checkbox-primary"
                        value="1"
                        {...form("level")}
                      />
                      <span className="label-text text-navy">Pemula</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        name="level"
                        className="checkbox checkbox-primary"
                        value="2"
                        {...form("level")}
                      />
                      <span className="label-text text-navy">Menengah</span>
                    </label>
                  </div>
                </li>
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        name="level"
                        className="checkbox checkbox-primary"
                        value="3"
                        {...form("level")}
                      />
                      <span className="label-text text-navy">Mahir</span>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </If>
          <If isTrue={!isCategoryGroupsSuccess}>
            <Skeleton className="my-4 w-1/2 h-6" />
            <Skeleton count={3} className="h-8" />

            <Skeleton className="my-4 w-1/2 h-6" />
            <Skeleton count={3} className="h-8" />
          </If>
        </div>
        {/* end::Filter on Desktop */}

        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-6 items-start">
          <If isTrue={isCoursesSuccess}>
            <For
              each={courses}
              render={(course) => (
                <CourseCard course={course} key={course.uuid} />
              )}
            />
          </If>
          <If isTrue={!isCoursesSuccess}>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </If>
        </div>
      </section>

      <FilterModal id="filter-modal" reset={reset} />
    </main>
  );
};

export default memo(Index);
