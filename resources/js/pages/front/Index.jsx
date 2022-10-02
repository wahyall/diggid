import React, { memo } from "react";

import { Link } from "@inertiajs/inertia-react";
import { If } from "react-haiku";

const Index = ({ auth: { user } }) => {
  return (
    <header className="grid grid-cols-2 items-center h-[calc(100vh-8rem)] gap-12">
      <div className="prose">
        <h1 className="text-5xl mb-8">Bangun Karir Digitalmu Bersama Kami</h1>
        <p className="font-medium text-lg">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
          sunt suscipit, ipsa voluptatibus minus perferendis commodi unde iste
          incidunt vitae?
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            href={!!user ? route("front.catalog") : route("register")}
            className="btn btn-primary px-8"
            data-ripplet
          >
            {!!user ? "Mulai Belajar" : "Daftar Sekarang"}
          </Link>
          <If isTrue={!user}>
            <Link
              href={route("front.catalog")}
              className="btn btn-ghost px-8"
              data-ripplet
            >
              Lihat Kelas
            </Link>
          </If>
        </div>
      </div>
      <div>
        <img
          src={asset("assets/media/misc/hero.jpg")}
          alt="Hero"
          className="rounded-md object-cover aspect-[4/3]"
        />
      </div>
    </header>
  );
};

export default memo(Index);
