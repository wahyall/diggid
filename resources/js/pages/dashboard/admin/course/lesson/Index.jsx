import React, { memo, useState, useMemo } from "react";

import { If } from "react-haiku";
import { createColumnHelper } from "@tanstack/react-table";
import SortablePaginate from "@/components/SortablePaginate";
import { extractUuidFromUrl } from "@/libs/utils";
import { usePage } from "@inertiajs/inertia-react";

const columnHelper = createColumnHelper();

function Index() {
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const { url } = usePage();
  const uuid = useMemo(() => extractUuidFromUrl(url), [url]);

  const columns = useMemo(() => [
    columnHelper.accessor("nomor", {
      header: "#",
      style: {
        width: "25px",
      },
      cell: (cell) => <span>{cell.getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      cell: (cell) => cell.getValue(),
      header: "Nama",
    }),
  ]);

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Daftar Materi untuk Kursus: </h1>
            <If isTrue={!openForm}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (
                  setSelected(null), setOpenForm(true), KTUtil.scrollTop()
                )}
              >
                <i className="las la-plus"></i>
                Materi Baru
              </button>
            </If>
          </div>
        </div>
        <div className="card-body">
          <SortablePaginate
            id="my-table"
            columns={columns}
            url={`/api/course/paginate`}
          ></SortablePaginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
