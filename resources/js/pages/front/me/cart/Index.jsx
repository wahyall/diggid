import React, { memo, useMemo } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { asset, currency } from "@/libs/utils";
import { toast } from "react-toastify";

import CourseCard from "../../components/CourseCard";
import { For, Show, If } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import { Link } from "@inertiajs/inertia-react";

const Index = memo(() => {
  const {
    data: carts = [],
    isLoading,
    refetch,
  } = useQuery(["me", "cart"], () =>
    axios.get("/me/cart").then((res) => res.data)
  );

  const { mutate: removeFromCart, isLoading: isRemoveLoading } = useMutation(
    (data) => axios.delete(`/me/cart/${data.uuid}`),
    {
      cacheTime: 0,
      onSuccess: refetch,
      onError: ({ response }) => toast.error(response?.data?.message),
    }
  );

  const totalPrice = useMemo(() => {
    return carts.reduce(
      (acc, curr) =>
        acc + (curr.course.price - curr.course.price * curr.course.discount),
      0
    );
  }, [carts]);

  if (isLoading || isRemoveLoading)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <h1 className="text-3xl font-bold mb-12 lg:mt-12">Keranjang Belanja</h1>
        <section className="grid sm:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <Skeleton height={250} className="mb-4" />
            <Skeleton height={250} className="mb-4" />
          </div>
          <div>
            <Skeleton height={24} width={120} className="mb-6" />
            <Skeleton height={64} className="mb-4" />
            <Skeleton height={64} className="mb-4" />
            <Skeleton height={64} className="mb-4" />

            <Skeleton height={24} width={120} className="my-6" />
            <Skeleton height={72} className="mb-4" />
          </div>
        </section>
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-3xl font-bold mb-12 lg:mt-12">Keranjang Belanja</h1>
      <section className="grid sm:grid-cols-[1fr_1.5fr] gap-12">
        <div>
          <Show>
            <Show.When isTrue={!!carts.length}>
              <div className="grid xs:grid-cols-2 sm:!grid-cols-1 gap-8">
                <For
                  each={carts}
                  render={(cart) => (
                    <>
                      <div className="relative">
                        <CourseCard course={cart.course} />
                        <label
                          htmlFor={`course-${cart.course.uuid}`}
                          className="btn btn-sm btn-error modal-button absolute -top-4 -right-4 rounded-full text-white w-10 h-10"
                          data-ripplet
                        >
                          <i className="fa fa-trash"></i>
                        </label>
                      </div>

                      <input
                        type="checkbox"
                        id={`course-${cart.course.uuid}`}
                        className="modal-toggle"
                      />
                      <label
                        htmlFor={`course-${cart.course.uuid}`}
                        className="modal cursor-pointer"
                      >
                        <label className="modal-box relative" htmlFor="">
                          <h3 className="text-lg font-bold">
                            Menghapus "{cart.course.name}".
                          </h3>
                          <p className="py-4">
                            Aksi ini tidak dapat dibatalkan. Anda yakin ingin
                            melanjutkan?
                          </p>
                          <div className="modal-action">
                            <label
                              htmlFor={`course-${cart.course.uuid}`}
                              className="btn btn-ghost normal-case font-medium"
                              data-ripplet
                            >
                              Batal
                            </label>
                            <label
                              htmlFor={`course-${cart.course.uuid}`}
                              className="btn btn-error text-white normal-case font-medium"
                              data-ripplet
                              onClick={() => removeFromCart(cart)}
                            >
                              Ya, Hapus
                            </label>
                          </div>
                        </label>
                      </label>
                    </>
                  )}
                />
              </div>
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
        </div>
        <div>
          <section className="mb-10">
            <h6 className="text-lg font-bold mb-6">
              Keuntungan Yang Didapatkan
            </h6>
            <ul>
              <li className="flex rounded-md border border-slate-200 px-4 py-2 gap-4 items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <img
                    src={asset("assets/media/icons/course.png")}
                    width="48"
                  />
                  <span className="text-xl font-bold">
                    Akses Kelas Selamanya
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="la la-check text-md text-primary"></i>
                </span>
              </li>
              <li className="flex rounded-md border border-slate-200 px-4 py-2 gap-4 items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <img
                    src={asset("assets/media/icons/discussion.png")}
                    width="48"
                  />
                  <span className="text-xl font-bold">Diskusi Tanya Jawab</span>
                </div>
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="la la-check text-md text-primary"></i>
                </span>
              </li>
              <li className="flex rounded-md border border-slate-200 px-4 py-2 gap-4 items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={asset("assets/media/icons/certificate.png")}
                    width="48"
                  />
                  <span className="text-xl font-bold">
                    Sertifikat Kelulusan
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className="la la-check text-md text-primary"></i>
                </span>
              </li>
            </ul>
          </section>

          <If isTrue={!!carts.length}>
            <section>
              <h6 className="text-lg font-bold mb-6">Detail Pembayaran</h6>
              <div className="flex rounded-md border border-slate-200 p-4 gap-4 items-center justify-between mb-4">
                <span className="text-2xl font-bold">Rp</span>
                <span className="text-2xl">{currency(totalPrice, {})},00</span>
              </div>
              <Link
                href={route("front.checkout")}
                className="btn btn-primary btn-lg w-full"
              >
                Beli Kelas
              </Link>
            </section>
          </If>
        </div>
      </section>
    </main>
  );
});

export default Index;
