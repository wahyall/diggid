import React, { memo } from "react";

import { Link } from "@inertiajs/inertia-react";

const UserLayout = ({ children, auth: { user } }) => {
  return (
    <main className="-mt-4">
      <aside className="drawer drawer-mobile lg:px-8 h-auto">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content container mx-auto">
          <label
            for="my-drawer-2"
            className="btn btn-square btn-ghost lg:hidden mt-8 ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          {children}
        </div>
        <div className="drawer-side !max-h-none">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 bg-base-100 text-base-content">
            <section className="mt-4">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full">
                  <img src={user.photo_url} />
                </div>
              </div>
              <h6 className="text-xl font-semibold mb-0">{user.name}</h6>
            </section>
            <div className="divider my-4"></div>
            <li>
              <Link
                href={route("front.me")}
                className={`active:bg-slate-50 active:text-slate-800 ${
                  route().current() === "front.me" && "bg-primary text-white"
                }`}
                data-ripplet
              >
                <i className="fa fa-user"></i>
                Profil
              </Link>
            </li>
            <li>
              <Link
                href={route("front.me.course")}
                className={`active:bg-slate-50 active:text-slate-800 ${
                  route().current() === "front.me.course" &&
                  "bg-primary text-white"
                }`}
                data-ripplet
              >
                <i className="fa fa-desktop"></i>
                Kelas Saya
              </Link>
            </li>
            <li>
              <Link
                href={route("front.me.transaction")}
                className={`active:bg-slate-50 active:text-slate-800 ${
                  route().current() === "front.me.transaction" &&
                  "bg-primary text-white"
                }`}
                data-ripplet
              >
                <i className="fa fa-money-bill-alt"></i>
                Pembelian
              </Link>
            </li>
            <li>
              <Link
                href={route("front.me.cart")}
                className={`active:bg-slate-50 active:text-slate-800 ${
                  route().current() === "front.me.cart" &&
                  "bg-primary text-white"
                }`}
                data-ripplet
              >
                <i className="fa fa-shopping-cart"></i>
                Keranjang
              </Link>
            </li>
            <div className="divider"></div>
            <li>
              <Link
                href={route("logout")}
                className="text-red-500 active:bg-red-500 active:text-white"
                data-ripplet
              >
                <i className="fa fa-sign-out-alt"></i>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </main>
  );
};

export default memo(UserLayout);
