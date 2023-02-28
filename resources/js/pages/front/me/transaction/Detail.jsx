import React, { memo, useMemo } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
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
  const {
    data: transaction = { body: {}, courses: [], payment_method: {} },
    isLoading,
    refetch,
  } = useQuery(
    ["me", "transaction", uuid],
    () => axios.get(`/me/transaction/${uuid}`).then((res) => res.data),
    {
      refetchInterval: (data) => (data?.status === "pending" ? 10000 : false),
      refetchIntervalInBackground: true,
    }
  );

  const payment_code = useMemo(() => {
    let value = "";
    switch (transaction.payment_method.slug) {
      case "bank-bca":
        value = transaction.body.va_numbers?.[0]?.va_number;
        break;

      case "bank-bri":
        value = transaction.body.va_numbers?.[0]?.va_number;
        break;

      case "bank-bni":
        value = transaction.body.va_numbers?.[0]?.va_number;
        break;

      case "indomaret":
        value = transaction.body.payment_code;
        break;

      case "alfamart":
        value = transaction.body.payment_code;
        break;

      default:
        break;
    }

    return value;
  }, [transaction]);

  const { copy, isCopied } = useCopyText(payment_code);

  const { mutate: cancel, isLoading: isCancelLoading } = useMutation(
    () => axios.post(`/me/transaction/${uuid}/cancel`),
    {
      onSuccess: () => {
        document.getElementById("cancel-transaction-modal").checked = false;
        refetch();
      },
    }
  );

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
        <div>
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
                <span className="badge badge-error text-white rounded-full">
                  Batal
                </span>
              </If>
            </div>
            <div className="card-body">
              <div className="flex flex-col mb-4">
                <span className="text-lg mb-2">Metode Pembayaran :</span>
                <img
                  src={asset(transaction.payment_method.logo)}
                  alt={transaction.payment_method.name}
                  className="w-36"
                />
              </div>
              <div className="flex flex-col mb-4">
                <span className="text-lg">Total Harga :</span>
                <span className="text-2xl font-bold">
                  Rp {currency(transaction.amount, {})},00
                </span>
              </div>
              <Show>
                <Show.When
                  isTrue={["indomaret", "alfamart"].includes(
                    transaction.payment_method.slug
                  )}
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
                <Show.When
                  isTrue={["bank-bca", "bank-bri", "bank-bni"].includes(
                    transaction.payment_method.slug
                  )}
                >
                  <div className="mb-2">
                    <span className="text-lg">Virtual Account :</span>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold">
                        {transaction.body.va_numbers?.[0]?.va_number}
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
                <Show.When
                  isTrue={["gopay"].includes(transaction.payment_method.slug)}
                >
                  <div className="mb-2">
                    <span className="text-lg">Scan QR :</span>
                    <img
                      src={transaction.body.actions?.[0].url}
                      className="w-72"
                    />
                  </div>
                </Show.When>
              </Show>

              {transaction.status === "pending" && (
                <div className="mb-2">
                  <span className="text-lg">Harap Dibayar Sebelum :</span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-red-500">
                      {transaction.max_date_payment}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <If isTrue={transaction.status === "pending"}>
            <label
              htmlFor="cancel-transaction-modal"
              className="btn btn-error w-full text-white mt-4"
              data-ripplet
            >
              Batalkan Pembelian
            </label>

            <input
              type="checkbox"
              id="cancel-transaction-modal"
              className="modal-toggle"
            />
            <label
              htmlFor="cancel-transaction-modal"
              className="modal cursor-pointer"
            >
              <label className="modal-box relative" htmlFor="">
                <h3 className="font-bold text-lg">Batalkan Pembelian Kelas</h3>
                <p className="py-4">
                  Apakah anda yakin ingin membatalkan pembelian kelas ini?
                </p>
                <div className="modal-action">
                  <label
                    htmlFor="cancel-transaction-modal"
                    className="btn btn-ghost"
                  >
                    Kembali
                  </label>
                  <button
                    className={`btn btn-error text-white ${
                      isCancelLoading && "loading"
                    }`}
                    disabled={isCancelLoading}
                    onClick={cancel}
                  >
                    Batalkan
                  </button>
                </div>
              </label>
            </label>
          </If>
        </div>
      </section>
    </main>
  );
});

export default Detail;
