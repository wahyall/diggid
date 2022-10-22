import React, { memo, Fragment } from "react";

import { useQueryClient } from "@tanstack/react-query";
import parse from "html-react-parser";

import { Tab, Disclosure, Transition } from "@headlessui/react";
import { For } from "react-haiku";

const Information = memo(({ slug }) => {
  const queryClient = useQueryClient();
  const course = queryClient.getQueryData(["catalog", "course", slug]);

  return (
    <section className="mt-8 grid grid-cols-[2fr_1fr]">
      <div>
        <Tab.Group>
          <Tab.List className="tabs tabs-boxed mb-4">
            <Tab as={Fragment}>
              {({ selected }) => (
                <a
                  className={`tab tab-lg ${
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
                  className={`tab tab-lg ${
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
                  className={`tab tab-lg ${
                    selected && "tab-active !bg-slate-700"
                  }`}
                >
                  Review
                </a>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>{parse(course?.description)}</Tab.Panel>
            <Tab.Panel>
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
            <Tab.Panel>Content 3</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
});

export default Information;
