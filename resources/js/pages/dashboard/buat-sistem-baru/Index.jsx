import React, { useMemo, useCallback, useState, memo, useEffect } from "react";
import Paginate from "@/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function BuatSistemBaru() {
  const edit = useCallback(() => {
    console.log("edit");
  }, []);

  const hapus = useCallback(() => {
    console.log("hapus");
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("nama", {
        cell: (info) => info.getValue(),
        header: "Nama",
      }),
      columnHelper.accessor("email", {
        cell: (info) => info.getValue(),
        header: "Email",
      }),
      columnHelper.accessor("telepon", {
        cell: (info) => info.getValue(),
        header: "No. Telepon",
      }),
      columnHelper.accessor((row) => row.uuid, {
        id: "uuid",
        header: "Aksi",
        style: {
          width: "100px",
        },
        cell: (cell) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary btn-icon"
              data-id={cell.getValue()}
              onClick={edit}
            >
              <i className="la la-pencil"></i>
            </button>
            <button
              className="btn btn-sm btn-danger btn-icon"
              data-id={cell.getValue()}
              onClick={hapus}
            >
              <i className="la la-trash"></i>
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  return (
    <div>
      <h1>Buat Sistem Baru</h1>
      <Paginate id="my-table" columns={columns} url="/api/users"></Paginate>
    </div>
  );
}

export default memo(BuatSistemBaru);
