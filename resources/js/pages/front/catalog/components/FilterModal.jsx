import React, { memo, useRef } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "@/libs/axios";
import { extractRouteParams } from "@/libs/utils";
import { Inertia } from "@inertiajs/inertia";

import { If, For } from "react-haiku";
import Skeleton from "react-loading-skeleton";

const FilterModal = memo(({ id, refetch, setValue, ...props }) => {
  const params = useRef(extractRouteParams(window.location.search));
  const { register: form, handleSubmit } = useForm({
    defaultValues: {
      ...params.current,
      ...(!params.current.sort ? { sort: "newest" } : {}),
    },
    mode: "onSubmit",
  });
  const { data: categoryGroups = [], isSuccess: isGroupCategoriesSuccess } =
    useQuery(["catalog", "category", "group"], () =>
      axios.get("/catalog/category").then((res) => res.data)
    );

  const onSubmit = (data) => {
    setValue("category", data.category);
    setValue("sort", data.sort);
    setValue("level", data.level);
    // Inertia.visit(route("front.catalog"), {
    //   data,
    //   onSuccess: refetch,
    // });
  };

  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal modal-bottom sm:modal-middle">
        <label className="modal-box" htmlFor="">
          <form onSubmit={handleSubmit(onSubmit)}>
            <If isTrue={isGroupCategoriesSuccess}>
              <For
                each={categoryGroups}
                render={(group) => (
                  <div className="collapse collapse-arrow">
                    <input type="checkbox" className="peer" />
                    <h2 className="collapse-title text-lg font-semibold p-0 flex items-center py-4">
                      {group.name}
                    </h2>
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
            <If isTrue={!isGroupCategoriesSuccess}>
              <Skeleton className="my-4 w-1/2 h-6" />
              <Skeleton count={3} className="h-8" />

              <Skeleton className="my-4 w-1/2 h-6" />
              <Skeleton count={3} className="h-8" />
            </If>
            <div className="modal-action">
              <label htmlFor={id}>
                <button type="submit" className="btn btn-primary" data-ripplet>
                  Terapkan
                </button>
              </label>
            </div>
          </form>
        </label>
      </label>
    </>
  );
});

export default FilterModal;
