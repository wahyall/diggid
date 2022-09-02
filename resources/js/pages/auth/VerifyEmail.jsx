import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/inertia-react";
import { Show } from "react-haiku";

export default function VerifyEmail({ auth: { user }, status }) {
  const { post, processing } = useForm();

  useEffect(() => {
    if (processing) {
      KTApp.block("#verify-email", {
        overlayColor: "#000000",
        type: "loader",
        state: "success",
        message: "Processing...",
      });
    } else {
      KTApp.unblock("#verify-email");
    }
  }, [processing]);

  const submit = (e) => {
    e.preventDefault();
    post(route("verification.send"));
  };

  return (
    <>
      <Head title="Verifikasi Email" />
      <div
        id="verify-email"
        className="d-flex flex-column flex-root"
        style={{ minHeight: "100vh" }}
      >
        <div className="d-flex flex-column flex-column-fluid">
          <div className="d-flex flex-column flex-column-fluid justify-content-center p-15 py-lg-15 text-center">
            <a href={route("home")} className="mb-10 pt-lg-10">
              <img
                alt="Logo"
                src={assets("assets/media/logos/logo-sikatana.svg")}
                className="h-40px mb-5"
              />
            </a>
            <div className="pt-lg-10 mb-10">
              <h1 className="fw-bolder fs-2qx text-gray-800 mb-7">
                Verifikasi Email Anda
              </h1>
              <div className="fs-3 fw-bold text-muted mb-10">
                {status === "verification-link-sent"
                  ? "Email verifikasi berhasil dikirim ulang ke"
                  : "Kami telah mengirimkan email verifikasi ke"}
                <a className="text-primary fw-bolder d-inline-block ms-1">
                  {user.email}
                </a>
                <br />
                Silahkan cek email Anda.
              </div>
              <form onSubmit={submit} className="fs-5">
                <div className="fw-bold text-gray-700">
                  Tidak menerima email verifikasi?
                </div>
                <button type="submit" className="btn btn-lg btn-primary mt-4">
                  Kirim Ulang
                </button>
              </form>

              <div className="fs-6 fw-bold text-muted my-10">
                Jika Anda masih belum menerima email verifikasi, silahkan cek
                folder "Spam" Anda.
              </div>
            </div>
            <div
              className="d-flex flex-row-auto bgi-no-repeat bgi-position-x-center bgi-size-contain bgi-position-y-bottom min-h-100px min-h-lg-350px"
              style={{
                backgroundImage: `url(${assets(
                  "assets/media/illustrations/sketchy-1/17.png"
                )})`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
