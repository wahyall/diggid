import React, { memo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { asset, currency } from "@/libs/utils";
import { usePage } from "@inertiajs/inertia-react";
import useCopyText from "@/hooks/useCopyText";

import Skeleton from "react-loading-skeleton";
import { If, Show, For } from "react-haiku";

const Detail = memo(() => {
  const {
    route: {
      parameters: { uuid },
    },
  } = usePage().props;
  const { data: transaction = { body: {}, courses: [] }, isLoading } = useQuery(
    ["me", "transaction", uuid],
    () => axios.get(`/me/transaction/${uuid}`).then((res) => res.data),
    {
      refetchInterval: (data) => (data?.status === "pending" ? 10000 : false),
      refetchIntervalInBackground: true,
    }
  );

  const { copy, isCopied } = useCopyText(transaction.body.payment_code);

  if (isLoading)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <Skeleton width={200} height={32} className="mb-12 lg:mt-12" />
        <section className="grid sm:grid-cols-[2fr_1fr] gap-12">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
        </section>
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h6 className="font-bold mb-12 lg:mt-12">
        Pembelian pada tanggal {transaction.date}
      </h6>
      <section className="grid sm:grid-cols-[2fr_1.5fr] gap-12">
        <div>
          <For
            each={transaction.courses}
            render={({ course }) => (
              <div className="card card-compact shadow border mb-4">
                <div className="card-header">
                  <h6 className="card-title">Kursus yang Dibeli</h6>
                </div>
                <div className="card-body">
                  <div className="flex gap-4">
                    <img
                      src={asset(course.thumbnail)}
                      className="aspect-video object-cover w-36 rounded-md"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg mb-2 line-clamp-2">
                        {course.name}
                      </span>
                      <span className="text-lg font-bold">
                        Rp {currency(transaction.amount, {})},00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
        <div className="card card-compact bg-base-100 shadow border">
          <div className="card-header justify-between items-center">
            <h6 className="card-title">Pembayaran</h6>
            <If isTrue={transaction.status === "pending"}>
              <span className="badge badge-warning rounded-full">
                Belum Dibayar
              </span>
            </If>
            <If isTrue={transaction.status === "success"}>
              <span className="badge badge-success rounded-full">Lunas</span>
            </If>
            <If isTrue={transaction.status === "failed"}>
              <span className="badge badge-danger rounded-full">Gagal</span>
            </If>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={asset(transaction.payment_method.logo)}
                alt={transaction.payment_method.name}
                className="w-24"
              />
              <span className="text-lg font-medium">
                {transaction.payment_method.name}
              </span>
            </div>
            <div className="flex flex-col mb-2">
              <span className="text-lg">Total Harga :</span>
              <span className="text-2xl font-bold">
                Rp {currency(transaction.amount, {})},00
              </span>
            </div>
            <Show>
              <Show.When
                isTrue={
                  transaction.payment_method.slug === "indomaret" ||
                  transaction.payment_method.slug === "alfamart"
                }
              >
                <div className="mb-2">
                  <span className="text-lg">Kode Pembayaran :</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      {transaction.body.payment_code}
                    </span>
                    <If isTrue={transaction.status === "pending"}>
                      <button
                        className="btn btn-sm btn-primary ml-2"
                        onClick={copy}
                      >
                        {isCopied ? "Tersalin" : "Salin"}
                      </button>
                    </If>
                  </div>
                </div>
              </Show.When>
            </Show>
          </div>
        </div>
      </section>
    </main>
  );
});

export default Detail;
