import { Link } from "@inertiajs/inertia-react";
import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div
      className="d-flex flex-column flex-root"
      id="kt_app_root"
      style={{ minHeight: "100vh" }}
    >
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        <div
          id="auth-layout"
          className="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
        >
          <div className="d-flex flex-center flex-column flex-lg-row-fluid">
            <div className="w-100 p-10">{children}</div>
          </div>
        </div>
        <div
          className="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2 min-h-200px"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(24, 16, 28, 0.5), rgba(24, 16, 28, 0.75)), url(${assets(
              "assets/media/misc/bg-auth.jpg"
            )})`,
          }}
        >
          <div className="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
            <Link href={route("home")} className="mb-0 mb-lg-12">
              <img
                alt="Logo"
                src={assets("assets/media/logos/logo-sikatana.svg")}
                className="h-60px h-lg-75px"
              />
            </Link>
            <h1 className="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7">
              Mulai Belajar Coding dan Design serta Bangun Karir Impianmu
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
