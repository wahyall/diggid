import React, { memo, useMemo } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { asset, currency } from "@/libs/utils";
import { Inertia } from "@inertiajs/inertia";

import { For, Show, If } from "react-haiku";
import Skeleton from "react-loading-skeleton";
import { Link } from "@inertiajs/inertia-react";
import { toast } from "react-toastify";

const Index = memo(() => {
  const queryClient = useQueryClient();
  const { data: paymentMethods = [], isSuccess: isPaymentSuccess } = useQuery(
    ["payment-methods"],
    () => axios.get("/checkout/payment-methods").then((res) => res.data)
  );

  const { data: carts = [], isSuccess: isCartSuccess } = useQuery(
    ["me", "cart"],
    () => axios.get("/me/cart").then((res) => res.data)
  );

  const totalPrice = useMemo(() => {
    return carts.reduce(
      (acc, curr) =>
        acc + (curr.course.price - curr.course.price * curr.course.discount),
      0
    );
  }, [carts]);

  const { mutate: charge, isLoading: isChargeLoading } = useMutation(
    (data) => axios.post("/checkout/charge", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success("Transaksi berhasil dibuat.");
        Inertia.visit(route("front.me.transaction.detail", data.order_id)); // Order ID = UUID in transactions
        queryClient.invalidateQueries(["me", "cart"]);
      },
      onError: () => {
        toast.error("Transaksi gagal dibuat.");
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const data = new FormData(ev.target);
    charge(data);
  };

  if (!isPaymentSuccess || !isCartSuccess)
    return (
      <main className="container mx-auto max-w-5xl px-4 pt-10">
        <h1 className="text-3xl font-bold my-12">Checkout</h1>
        <section className="grid sm:grid-cols-[1.5fr_1fr] gap-12">
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

  if (!carts.length)
    return (
      <main className="flex items-center justify-center min-h-[75vh]">
        <div className="text-center">
          <img
            src={asset("assets/media/icons/empty-cart.png")}
            alt="Empty Cart"
            className="w-48 mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">Keranjang belanja kosong</h1>
          <p className="text-gray-500">
            Silahkan memilih kelas yang ingin dibeli terlebih dahulu
          </p>
          <Link href={route("front.catalog")} className="btn btn-primary mt-4">
            Lihat Kelas
          </Link>
        </div>
      </main>
    );

  return (
    <main className="container mx-auto max-w-5xl px-4 pt-10">
      <h1 className="text-3xl font-bold my-12">Checkout</h1>
      <div className="grid sm:grid-cols-[1.5fr_1fr] gap-12">
        <section className="mb-8">
          <h6 className="text-lg font-bold mb-6">Detail Pembelian</h6>
          <ul className="rounded-md border border-slate-200 p-4 mb-4 list-disc">
            <For
              each={carts}
              render={({ course }) => (
                <li className="ml-6 mb-4">
                  <div className="grid grid-cols-[2fr_1fr]">
                    <span className="line-clamp-2">{course.name}</span>
                    <span className="text-right font-semibold">
                      {currency(
                        course.price - (course.price * course.discount) / 100
                      )}
                    </span>
                  </div>
                </li>
              )}
            />
            <div className="divider"></div>
            <li className="list-none">
              <div className="flex justify-between items-center">
                <span className="text-xl ml-6">Total Harga</span>
                <span className="text-2xl font-bold">
                  Rp {currency(totalPrice, {})},00
                </span>
              </div>
            </li>
          </ul>
        </section>
        <form onSubmit={onSubmit}>
          <h6 className="text-lg font-bold mb-6">Metode Pembayaran</h6>
          <ul className="rounded-md border border-slate-200 p-4 mb-4">
            <For
              each={paymentMethods}
              render={(payment, i) => (
                <>
                  <li>
                    <label
                      htmlFor={`payment-method-${payment.uuid}`}
                      className="flex items-center justify-between label cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={asset(payment.logo)}
                          alt={payment.name}
                          className="w-20 aspect-video object-contain"
                        />
                        <span>{payment.name}</span>
                      </div>
                      <input
                        type="radio"
                        id={`payment-method-${payment.uuid}`}
                        name="payment_method_uuid"
                        value={payment.uuid}
                        className="radio radio-primary"
                        required
                      />
                    </label>
                  </li>
                  <If isTrue={i !== paymentMethods.length - 1}>
                    <div className="divider my-2"></div>
                  </If>
                </>
              )}
            />
          </ul>
          <button
            type="submit"
            className={`btn btn-lg btn-primary w-full ${
              isChargeLoading && "loading"
            }`}
            disabled={isChargeLoading}
          >
            Bayar Sekarang
          </button>
        </form>
      </div>
    </main>
  );
});

export default Index;
