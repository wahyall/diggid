import React, { memo, useMemo } from "react";
import { currency } from "@/libs/utils";

import { For } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";

const CourseCard = ({ course }) => {
  const level = useMemo(() => {
    if (course.level === "1") return "Pemula";
    if (course.level === "2") return "Menengah";
    if (course.level === "3") return "Mahir";
  });

  return (
    <Link
      href={route("front.catalog.course", course.slug)}
      className="card card-compact bg-base-100 shadow-xl"
    >
      <figure>
        <img src={asset(course.thumbnail)} alt="Shoes" />
      </figure>
      <div className="card-body">
        <div className="flex gap-2">
          <For
            each={course.categories}
            render={(category) => (
              <div className="badge badge-ghost badge-sm" key={category.uuid}>
                {category.name}
              </div>
            )}
          />
        </div>
        <h1 className="card-title font-bold line-clamp-2 mb-2">
          {course.name}
        </h1>
        <div className="flex justify-between mt-auto">
          <span className="text-lg">
            {currency(course.price - (course.price * course.discount) / 100)}
          </span>
          <span
            className={`tooltip tooltip-primary tooltip-left before:text-xs before:content-[attr(data-tip)]`}
            data-tip={level}
          >
            <svg
              className="svg-icon -mt-6 -mr-4"
              style={{
                width: "3rem",
                height: "3rem",
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
          </span>
        </div>
      </div>
    </Link>
  );
};

export default memo(CourseCard);
