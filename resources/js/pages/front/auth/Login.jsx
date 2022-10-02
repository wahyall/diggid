import React, { useEffect } from "react";
import AuthLayout from "@/pages/front/layouts/AuthLayout";
import { Head, Link } from "@inertiajs/inertia-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { Inertia } from "@inertiajs/inertia";

const schema = yup
  .object({
    email: yup
      .string()
      .email("Masukkan Email yang valid")
      .required("Isian email wajib diisi"),
    password: yup.string().required("Isian password wajib diisi"),
  })
  .required();

const Login = ({ redirect }) => {
  const {
    register: form,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: login, isLoading } = useMutation(
    (data) => axios.post(route("login"), data),
    {
      onError: (error) => {
        for (const key in error.response.data.errors) {
          if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
            setError(key, { message: error.response.data.errors[key][0] });
          }
        }
      },
      onSuccess: ({ data }) => Inertia.visit(redirect || data.redirect),
    }
  );

  const onSubmit = (data) => login(data);

  // return (
  //   <>
  //     <Head title="Masuk" />
  //     <form
  //       onSubmit={handleSubmit(onSubmit)}
  //       className="form w-100"
  //       noValidate="novalidate"
  //       id="form-login"
  //     >
  //       <div className="text-center mb-11">
  //         <h1 className="text-dark fw-bolder mb-3">Selamat Datang Kembali</h1>
  //         <div className="text-gray-500 fw-semibold fs-6">DIGGID</div>
  //       </div>
  //       <div className="fv-row mb-8">
  //         <div className="form-floating">
  //           <input
  //             type="email"
  //             name="email"
  //             id="email"
  //             autoComplete="off"
  //             className="form-control bg-transparent"
  //             placeholder="Email"
  //             {...form("email")}
  //           />
  //           <label htmlFor="email">Email</label>
  //         </div>
  //         {errors.email && (
  //           <span className="text-danger mt-2 d-block">
  //             {errors.email.message}
  //           </span>
  //         )}
  //       </div>
  //       <div className="fv-row mb-8">
  //         <div className="form-floating">
  //           <input
  //             type="password"
  //             name="password"
  //             id="password"
  //             autoComplete="off"
  //             className="form-control bg-transparent"
  //             placeholder="Password"
  //             {...form("password")}
  //           />
  //           <label htmlFor="password">Password</label>
  //         </div>
  //         {errors.password && (
  //           <span className="text-danger mt-2 d-block">
  //             {errors.password.message}
  //           </span>
  //         )}
  //       </div>
  //       <div className="d-grid mb-10">
  //         <button
  //           type="submit"
  //           id="kt_sign_in_submit"
  //           className="btn btn-primary"
  //         >
  //           <span className="indicator-label">Masuk</span>
  //         </button>
  //       </div>
  //       <div className="text-gray-500 text-center fw-semibold fs-6">
  //         Karang Taruna Baru?
  //         <Link
  //           href={route("register")}
  //           data={{ redirect }}
  //           className="link-primary ms-2"
  //         >
  //           Daftar
  //         </Link>
  //       </div>
  //     </form>
  //   </>
  // );

  return (
    <>
      <Head title="Masuk" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate="novalidate"
        id="form-login"
        className="w-full"
      >
        <div className="mb-16">
          <h1 className="text-slate-800 text-3xl md:text-4xl font-bold">
            Selamat Datang Kembali
          </h1>
        </div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Email :</span>
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("email")}
          />
          {errors.email && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.email.message}
              </span>
            </label>
          )}
        </div>
        <div className="form-control w-full mb-8">
          <label className="label">
            <span className="label-text">Password :</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="input input-bordered w-full"
            autoComplete="off"
            {...form("password")}
          />
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-red-500">
                {errors.password.message}
              </span>
            </label>
          )}
        </div>
        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading && "loading"}`}
          disabled={isLoading}
          data-ripplet
        >
          Masuk
        </button>
        <div className="mt-8">
          Belum memiliki akun?{" "}
          <Link
            href={route("register")}
            data={{ redirect }}
            className="link-primary ms-2"
          >
            Daftar
          </Link>
        </div>
      </form>
    </>
  );
};

Login.layout = (page) => <AuthLayout children={page} />;

export default Login;
