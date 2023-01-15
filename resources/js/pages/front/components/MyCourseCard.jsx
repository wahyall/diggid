import React, { memo, useMemo } from "react";
import { currency, asset } from "@/libs/utils";

import { For } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";

const MyCourseCard = ({
  course,
  progress,
  total_progress,
  className,
  as = Link,
  href,
}) => {
  const level = useMemo(() => {
    if (course.level === "1") return "Pemula";
    if (course.level === "2") return "Menengah";
    if (course.level === "3") return "Mahir";
  }, [course.level]);

  const Component = as;

  return (
    <Component
      href={href || route("front.catalog.course", course.slug)}
      className={`card card-compact bg-base-100 shadow-xl ${className}`}
    >
      <figure>
        <img
          src={asset(course.thumbnail)}
          alt="Shoes"
          className="aspect-video"
        />
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
        <div className="mt-auto">
          <progress
            className="progress progress-primary w-full"
            value={progress}
            max={total_progress}
          ></progress>
          <div className="text-lg text-right">
            <span className="font-bold">{progress}</span>/{total_progress}
          </div>
        </div>
      </div>
    </Component>
  );
};

export default memo(MyCourseCard);
