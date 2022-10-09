import React, { memo, useRef, useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { extractRouteParams } from "@/libs/utils";
import { useForm, useWatch } from "react-hook-form";
import { Inertia } from "@inertiajs/inertia";
import { useUpdateEffect } from "react-haiku";

import { For, If } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import CourseCard from "../components/CourseCard";

const Index = () => {
  const queryClient = useQueryClient();
  const params = useRef(extractRouteParams(window.location.search));
  const {
    register: form,
    watch,
    control,
    handleSubmit,
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

  const { data: groupCategories = [], isSuccess: isGroupCategoriesSuccess } =
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
    <main>
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
          <button type="submit" className="btn btn-primary">
            Cari
          </button>
        </form>
      </section>
      <section className="mb-12 grid grid-cols-[1fr_4fr] gap-4">
        <div className="overflow-auto max-h-screen scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded">
          <If isTrue={isGroupCategoriesSuccess}>
            <For
              each={groupCategories}
              render={(group) => (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{group.name}</h2>
                  <ul className="mt-2">
                    <For
                      each={group.categories}
                      render={(category) => (
                        <li>
                          <div className="form-control">
                            <label className="label cursor-pointer">
                              <input
                                type="checkbox"
                                name="category"
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
          <If isTrue={!isGroupCategoriesSuccess}>
            <Skeleton className="my-4 w-1/2 h-6" />
            <Skeleton count={3} className="h-8" />

            <Skeleton className="my-4 w-1/2 h-6" />
            <Skeleton count={3} className="h-8" />
          </If>
        </div>
        <div className="grid grid-cols-3 gap-4 items-start">
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
    </main>
  );
};

export default memo(Index);
