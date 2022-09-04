import React, { useEffect } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { Head, Link } from "@inertiajs/inertia-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { Inertia } from "@inertiajs/inertia";

const schema = yup
  .object({
    name: yup.string().required("Isian nama lengkap wajib diisi"),
    email: yup
      .string()
      .email("Masukkan Email yang valid")
      .required("Isian email wajib diisi"),
    password: yup
      .string()
      .required("Isian password wajib diisi")
      .min(8, "Password Harus Berisi Minimal 8 Karakter"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Konfirmasi password tidak sesuai"),
  })
  .required();

const Register = ({ redirect }) => {
  const {
    register: form,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const register = useMutation((data) => axios.post(route("register"), data), {
    onError: (error) => {
      KTApp.unblock("#auth-layout");
      for (const key in error.response.data.errors) {
        if (Object.hasOwnProperty.call(error.response.data.errors, key)) {
          setError(key, { message: error.response.data.errors[key][0] });
        }
      }
    },
    onSuccess: ({ data }) => Inertia.visit(data.redirect),
  });

  const onSubmit = (data) => {
    KTApp.block("#auth-layout");
    register.mutate(data);
  };

  return (
    <>
      <Head title="Daftar" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form w-100"
        noValidate="novalidate"
        id="form-register"
      >
        <div className="text-center mb-11">
          <h1 className="text-dark fw-bolder mb-3">Buat Akun Baru</h1>
          <div className="text-gray-500 fw-semibold fs-6"></div>
        </div>
        <div className="fv-row mb-8">
          <div className="form-floating">
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              className="form-control bg-transparent"
              placeholder="Nama Lengkap"
              {...form("name")}
            />
            <label htmlFor="nama">Nama Lengkap</label>
          </div>
          {errors.name && (
            <span className="text-danger mt-2 d-block">
              {errors.name.message}
            </span>
          )}
        </div>
        <div className="fv-row mb-8">
          <div className="form-floating">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              className="form-control bg-transparent"
              placeholder="Email"
              {...form("email")}
            />
            <label htmlFor="email">Email</label>
          </div>
          {errors.email && (
            <span className="text-danger mt-2 d-block">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="fv-row mb-8">
          <div className="form-floating">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              className="form-control bg-transparent"
              placeholder="Password"
              {...form("password")}
            />
            <label htmlFor="password">Password</label>
          </div>
          {errors.password && (
            <span className="text-danger mt-2 d-block">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="fv-row mb-8">
          <div className="form-floating">
            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              autoComplete="off"
              className="form-control bg-transparent"
              placeholder="Konfirmasi Password"
              {...form("password_confirmation")}
            />
            <label htmlFor="password_confirmation">Password</label>
          </div>
          {errors.password_confirmation && (
            <span className="text-danger mt-2 d-block">
              {errors.password_confirmation.message}
            </span>
          )}
        </div>
        <div className="d-grid mb-10">
          <button
            type="submit"
            id="kt_sign_in_submit"
            className="btn btn-primary"
          >
            <span className="indicator-label">Daftar</span>
          </button>
        </div>
        <div className="text-gray-500 text-center fw-semibold fs-6">
          Sudah Memiliki Akun?
          <Link
            href={route("login")}
            data={{ redirect }}
            className="link-primary ms-2"
          >
            Masuk
          </Link>
        </div>
      </form>
    </>
  );
};

Register.layout = (page) => <AuthLayout children={page} />;

export default Register;
