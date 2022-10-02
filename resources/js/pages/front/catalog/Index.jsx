import React, { memo, useRef, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { extractRouteParams } from "@/libs/utils";
import { useForm } from "react-hook-form";
import { Inertia } from "@inertiajs/inertia";

import { For } from "react-haiku";

const Index = () => {
  const params = useRef(extractRouteParams(window.location.search));
  const { register: form, watch } = useForm({
    defaultValues: params.current,
  });
  const { data: groupCategories } = useQuery(
    ["category", "group"],
    () =>
      axios.get("/catalog/category", params.current).then((res) => res.data),
    {
      placeholderData: [],
    }
  );

  useEffect(() => {
    if (
      watch("category")?.length &&
      JSON.stringify(watch("category")) !==
        JSON.stringify(params.current.category)
    ) {
      Inertia.visit(route("front.catalog"), {
        data: { ...params.current, ...watch() },
      });
    }
  }, [watch()]);

  return (
    <main>
      <header className="py-20 prose text-center max-w-none">
        <h1>Eksplor Semua Kelas Kami</h1>
        <p className="max-w-lg mx-auto">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui aperiam
          rerum, quisquam sequi nostrum numquam nulla?
        </p>
      </header>
      <section className="mt-8 grid grid-cols-[1fr_4fr] gap-4">
        <div className="overflow-auto max-h-80 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded">
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
                              {...form(`category`)}
                            />
                            <span className="label-text">{category.name}</span>
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
                    />
                    <span className="label-text">Terbaru</span>
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
                    />
                    <span className="label-text">Terpopuler</span>
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>2</div>
      </section>
    </main>
  );
};

export default memo(Index);
