import React, { memo } from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { currency, asset } from "@/libs/utils";

import Skeleton from "react-loading-skeleton";
import { For, If } from "react-haiku";
import { Link } from "@inertiajs/inertia-react";

const Index = memo(() => {
  const { data: transactions = [], isLoading } = useQuery(
    ["me", "transaction"],
    () => axios.get("/me/transaction").then((res) => res.data)
  );

  if (isLoading)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <h1 className="text-3xl font-bold mb-12 lg:mt-12">Riwayat Pembelian</h1>
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
        <Skeleton height={100} className="mb-4" />
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-3xl font-bold mb-12 lg:mt-12">Riwayat Pembelian</h1>
      <section>
        <For
          each={transactions}
          render={(transaction) => (
            <Link
              href={route("front.me.transaction.detail", transaction.uuid)}
              className="card card-compact border shadow mb-4 hover:bg-slate-200"
            >
              <div className="card-body flex-row gap-4 items-center">
                <div className="flex flex-col flex-grow md:flex-row gap-4 md:items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-medium">#</span>
                    <div>
                      <div className="mb-2">
                        <span className="text-sm text-gray-500 mr-4">
                          {transaction.date}
                        </span>
                        <If isTrue={transaction.status === "pending"}>
                          <span className="badge badge-warning rounded-full">
                            Belum Dibayar
                          </span>
                        </If>
                        <If isTrue={transaction.status === "success"}>
                          <span className="badge badge-success rounded-full">
                            Lunas
                          </span>
                        </If>
                        <If isTrue={transaction.status === "failed"}>
                          <span className="badge badge-danger rounded-full">
                            Gagal
                          </span>
                        </If>
                      </div>
                      <h6 className="text-2xl font-bold">
                        {currency(transaction.amount)}
                      </h6>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-end">
                    <span className="text-sm text-gray-500 mb-2 text-right">
                      Metode Pembayaran
                    </span>
                    <img
                      src={asset(transaction.payment_method.logo)}
                      alt={transaction.payment_method.name}
                      className="w-24"
                    />
                  </div>
                </div>
                <div>
                  <i className="fas fa-chevron-right text-lg"></i>
                </div>
              </div>
            </Link>
          )}
        />
      </section>
    </main>
  );
});

export default Index;
