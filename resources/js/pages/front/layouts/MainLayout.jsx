import React, { memo, useState, useRef } from "react";

import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { If, Show } from "react-haiku";
import { ToastContainer } from "react-toastify";

import { extractRouteParams } from "@/libs/utils";

import "react-loading-skeleton/dist/skeleton.css";

const MainLayout = ({ children, auth: { user } }) => {
  const params = useRef(extractRouteParams(window.location.search));
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState(params.current.search);

  const handleSearch = (e) => {
    e.preventDefault();
    Inertia.visit(route("front.catalog"), {
      data: { ...params.current, search },
    });
  };

  return (
    <main>
      <div className="navbar bg-white w-full fixed top-0 border-b-2 lg:px-12 border-b-slate-300 z-50">
        <div className="navbar-start w-full lg:w-auto">
          {route().current() !== "front.catalog" ? (
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost px-2 lg:hidden"
                data-ripplet
              >
                <i className="las la-search text-2xl"></i>
              </label>
              <form
                onSubmit={handleSearch}
                tabIndex={0}
                className="menu rounded-none menu-compact dropdown-content mt-2 py-2 shadow -ml-2 w-screen px-3 bg-white"
              >
                <input
                  type="text"
                  className="input input-bordered w-full cursor-text border border-primary"
                  autoComplete="off"
                  name="search"
                  placeholder="Cari kelas yang ingin dipelajari..."
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </form>
            </div>
          ) : (
            <div className="aspect-square h-12"></div>
          )}
          <Link
            href={route("front.home")}
            className="btn btn-ghost px-2 mx-auto"
          >
            <img
              src={asset("assets/media/logos/logo-diggid.svg")}
              alt="Logo DIGGID"
              className="w-16"
            />
          </Link>
        </div>
        {route().current() !== "front.catalog" && (
          <form
            onSubmit={handleSearch}
            className="navbar-center hidden lg:flex lg:shrink lg:grow max-w-xl ml-2"
          >
            <div
              className={`px-3 flex ml-4 items-center w-full border border-slate-300 rounded-md ${
                focus &&
                "border-primary outline outline-4 outline-offset-1 outline-brand-200"
              }`}
            >
              <i className="las la-search text-xl"></i>
              <input
                type="text"
                className="input w-full px-3 cursor-text focus:outline-none border-none"
                autoComplete="off"
                name="search"
                placeholder="Cari kelas yang ingin dipelajari..."
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </div>
          </form>
        )}
        <div className="navbar-end ml-auto w-auto">
          <Show>
            <Show.When isTrue={!!user}>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost px-2" data-ripplet>
                  <span className="font-medium normal-case hidden lg:inline-block mr-4 text-base">
                    Halo, {user?.name?.split(" ")[0]}
                  </span>
                  <div className="avatar rounded-full">
                    <If isTrue={user?.photo}>
                      <img
                        src={user?.photo_url}
                        alt="Photo Profile"
                        className="rounded-full aspect-square object-cover w-10"
                      />
                    </If>
                    <If isTrue={!user?.photo}>
                      <i className="las la-user-circle text-4xl"></i>
                    </If>
                  </div>
                  <i className="fas fa-caret-down text-xl hidden lg:inline-block ml-1"></i>
                </label>
                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-slate-50 w-52 rounded-md"
                >
                  <If isTrue={user?.role === "admin"}>
                    <li>
                      <a
                        href={route("dashboard")}
                        className={`text-base ${
                          route().current() === "dashboard" &&
                          "bg-primary text-white"
                        }`}
                      >
                        <i className="fa fa-th-large"></i>
                        Dashboard
                      </a>
                    </li>
                  </If>
                  <li>
                    <Link
                      href={route("front.me")}
                      className={`text-base ${
                        route().current() === "front.me" &&
                        "bg-primary text-white"
                      }`}
                    >
                      <i className="fa fa-user"></i>
                      Profil
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={route("front.me.cart")}
                      className={`text-base ${
                        route().current() === "front.me.cart" &&
                        "bg-primary text-white"
                      }`}
                    >
                      <i className="fa fa-shopping-cart"></i>
                      Keranjang
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={route("logout")}
                      className="text-red-500 active:bg-red-500 active:text-white"
                    >
                      <i className="fa fa-sign-out-alt"></i>
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </Show.When>
            <Show.Else>
              <Link
                href={route("login")}
                className="btn btn-ghost mr-2"
                data-ripplet
              >
                Masuk
              </Link>
              <If
                isTrue={
                  route().current() !== "front.home" &&
                  route().current() !== "front.catalog"
                }
              >
                <Link
                  href={route("register")}
                  className="btn btn-primary"
                  data-ripplet
                >
                  Daftar
                </Link>
              </If>
            </Show.Else>
          </Show>
        </div>
      </div>
      <div className="mt-16 md:mt-20 pb-10">{children}</div>
      <ToastContainer
        newestOnTop={false}
        position="bottom-right"
        theme="dark"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </main>
  );
};

export default memo(MainLayout);
