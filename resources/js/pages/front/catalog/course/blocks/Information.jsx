import React, { memo, Fragment } from "react";

import { useQueryClient } from "@tanstack/react-query";
import parse from "html-react-parser";

import { Tab, Disclosure } from "@headlessui/react";
import { For, Show, If } from "react-haiku";
import { asset } from "@/libs/utils";

import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const Information = memo(({ slug }) => {
  const queryClient = useQueryClient();
  const course = queryClient.getQueryData(["catalog", "course", slug]);

  return (
    <section className="mt-8 lg:grid grid-cols-[2fr_1fr] px-4 md:px-0">
      <div>
        <Tab.Group>
          <Tab.List className="tabs tabs-boxed mb-6">
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={`tab xs:tab-lg ${
                    selected && "tab-active !bg-slate-700"
                  }`}
                >
                  Deskripsi
                </a>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={`tab xs:tab-lg ${
                    selected && "tab-active !bg-slate-700"
                  }`}
                >
                  Silabus
                </a>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={`tab xs:tab-lg ${
                    selected && "tab-active !bg-slate-700"
                  }`}
                >
                  Review
                </a>
              )}
            </Tab>
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={`tab xs:tab-lg ${
                    selected && "tab-active !bg-slate-700"
                  }`}
                >
                  Showcase
                </a>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <h4 className="text-2xl font-bold mb-6">Kembangkan Skillmu</h4>
              <div className="prose max-w-none mb-8">
                {parse(course?.description)}
              </div>

              <If isTrue={course.sneak_peeks.length}>
                <h4 className="text-2xl font-bold mb-6">Highlight Kelas</h4>
                <LightGallery
                  plugins={[lgThumbnail, lgZoom]}
                  elementClassNames="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  <For
                    each={course.sneak_peeks}
                    render={(sneakPeek) => (
                      <a href={sneakPeek}>
                        <img
                          src={sneakPeek}
                          className="aspect-video object-cover rounded-md"
                        />
                      </a>
                    )}
                  />
                </LightGallery>
              </If>
            </Tab.Panel>
            <Tab.Panel>
              <h4 className="text-2xl font-bold mb-6">Daftar Materi Kelas</h4>
              <For
                each={course?.lessons}
                render={(lesson, i) => (
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center h-12 w-12 rounded-md bg-slate-200">
                        {i + 1}
                      </span>
                    </div>
                    <div className="w-full">
                      <Disclosure defaultOpen={i < 2}>
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              as="div"
                              className="btn btn-ghost normal-case w-full justify-between px-4 py-2 hover:bg-transparent"
                            >
                              {lesson.name}
                              <i
                                className={`fas fa-${
                                  open ? "chevron-up" : "chevron-down"
                                }`}
                              ></i>
                            </Disclosure.Button>
                            <Disclosure.Panel className="mt-4">
                              <For
                                each={lesson.videos}
                                render={(video) => (
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      {video.is_free ? (
                                        <i className="fa fa-play-circle text-xl"></i>
                                      ) : (
                                        <i className="fa fa-lock text-xl text-slate-200"></i>
                                      )}
                                      <span className="text-lg">
                                        {video.name}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-slate-600">
                                        {video.duration} min
                                      </span>
                                    </div>
                                  </div>
                                )}
                              />
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  </div>
                )}
              />
            </Tab.Panel>
            <Tab.Panel>
              <h4 className="text-2xl font-bold mb-6">Apa Kata Mereka</h4>
              <Show>
                <Show.When isTrue={course?.reviews?.length}>
                  <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-8">
                    <For
                      each={course?.reviews}
                      render={(review) => (
                        <div className="card card-compact bg-base-100 shadow-sm">
                          <div className="card-body">
                            <div className="flex items-center gap-4">
                              <img
                                className="h-16 w-16 rounded-full"
                                src={asset(review.user?.thumbnail)}
                                alt={review.user?.name}
                              />
                              <span className="text-2xl font-semibold">
                                {review.user?.name}
                              </span>
                            </div>
                            <div className="prose max-w-none mt-2 text-lg">
                              <p>{review.review}</p>
                            </div>
                            <div className="rating">
                              <input
                                type="radio"
                                name="rating-2"
                                className="mask mask-star-2 bg-yellow-400 cursor-default"
                                disable
                                checked={parseInt(review.rating) === 1}
                              />
                              <input
                                type="radio"
                                name="rating-2"
                                className="mask mask-star-2 bg-yellow-400 cursor-default"
                                disable
                                checked={parseInt(review.rating) === 2}
                              />
                              <input
                                type="radio"
                                name="rating-2"
                                className="mask mask-star-2 bg-yellow-400 cursor-default"
                                disable
                                checked={parseInt(review.rating) === 3}
                              />
                              <input
                                type="radio"
                                name="rating-2"
                                className="mask mask-star-2 bg-yellow-400 cursor-default"
                                disable
                                checked={parseInt(review.rating) === 4}
                              />
                              <input
                                type="radio"
                                name="rating-2"
                                className="mask mask-star-2 bg-yellow-400 cursor-default"
                                disable
                                checked={parseInt(review.rating) === 5}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </Show.When>
                <Show.Else>
                  <p className="text-lg">Belum ada review untuk kursus ini</p>
                </Show.Else>
              </Show>
            </Tab.Panel>
            <Tab.Panel>
              <h4 className="text-2xl font-bold mb-6">
                Proyek Hasil Karya Peserta
              </h4>
              <Show>
                <Show.When isTrue={course?.showcases?.length}>
                  <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-8">
                    <For
                      each={course?.showcases}
                      render={(showcase) => (
                        <div className="card card-compact bg-base-100 shadow-sm">
                          <figure>
                            <img src={asset(showcase.thumbnail)} alt="Shoes" />
                          </figure>
                          <div className="card-body">
                            <h1 className="card-title font-semibold line-clamp-2 mb-2 text-lg">
                              {showcase.name}
                            </h1>
                            <div className="flex mt-auto items-center gap-4">
                              <img
                                src={asset(showcase.user?.avatar)}
                                className="aspect-square rounded-full object-cover"
                                width={32}
                              />
                              <span className="text-slate-600 font-medium text-base">
                                {showcase.user?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </Show.When>
                <Show.Else>
                  <p className="text-lg">Belum ada showcase untuk kursus ini</p>
                </Show.Else>
              </Show>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
});

export default Information;
