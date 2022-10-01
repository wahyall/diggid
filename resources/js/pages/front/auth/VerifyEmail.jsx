import React, { useState } from "react";
import { Head } from "@inertiajs/inertia-react";
import AuthLayout from "../layouts/AuthLayout";
import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

const VerifyEmail = ({ auth: { user }, status }) => {
  const [hasSent, setHasSent] = useState(false);
  const { mutate: resend, isLoading } = useMutation(
    () => axios.post(route("verification.send")),
    {
      onSuccess: () => setHasSent(true),
    }
  );

  const submit = (e) => {
    e.preventDefault();
    resend();
  };

  return (
    <>
      <Head title="Verifikasi Email" />
      <div className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-slate-800 text-3xl md:text-4xl font-bold mb-2">
            Verifikasi Email Anda
          </h1>
        </div>
        <article className="prose">
          <p>
            {hasSent
              ? "Email verifikasi berhasil dikirim ulang ke"
              : "Kami telah mengirimkan email verifikasi ke"}{" "}
            <span className="text-primary fw-bolder d-inline-block ms-1">
              {user.email}
            </span>
            <br />
            Silahkan cek email kamu.
          </p>
          <form onSubmit={submit} className="fs-5">
            <div className="font-medium">Tidak menerima email verifikasi?</div>
            <button
              type="submit"
              className={`btn btn-primary mt-4 w-full ${
                isLoading && "loading"
              }`}
              disabled={isLoading}
              data-ripplet
            >
              Kirim Ulang
            </button>
          </form>
          <p>
            Jika kamu masih belum menerima email verifikasi, silahkan cek folder{" "}
            {""}
            <strong>"Spam"</strong>.
          </p>
        </article>
      </div>
    </>
  );
};

VerifyEmail.layout = (page) => <AuthLayout children={page} />;

export default VerifyEmail;
