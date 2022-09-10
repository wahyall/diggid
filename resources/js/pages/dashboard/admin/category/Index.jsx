import React, { useMemo, useCallback, useState } from "react";
import Paginate from "@/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";

import Form from "./components/Form";
import SubCategory from "./components/SubCategory";

const columnHelper = createColumnHelper();

export default function Index() {
  const [openForm, setOpenForm] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const sub = (uuid) => {
    setSelected(uuid);
    setOpenSub(true);
    KTUtil.scrollTop();
  };

  const edit = (uuid) => {
    setSelected(uuid);
    setOpenForm(true);
    KTUtil.scrollTop();
  };

  const hapus = (uuid) => {
    const mySwal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger btn-sm",
        cancelButton: "btn btn-secondary btn-sm",
      },
      buttonsStyling: false,
    });

    mySwal
      .fire({
        title: "Apakah anda yakin?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batalkan!",
        reverseButtons: true,
        preConfirm: () => {
          return axios
            .delete(`/api/category/${uuid}/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          queryClient.invalidateQueries(["/api/category/paginate"]);
        }
      });
  };

  const columns = useMemo(
    () => [
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
      columnHelper.accessor((row) => row.icon, {
        header: "Ikon",
        cell: (cell) => (
          <img
            className="img-thumbnail"
            width={50}
            src={assets(cell.getValue())}
          />
        ),
      }),
      columnHelper.accessor((row) => row.uuid, {
        id: "uuid",
        header: "Aksi",
        style: {
          width: "100px",
        },
        cell: (cell) =>
          !openForm &&
          !openSub && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-primary"
                style={{ whiteSpace: "nowrap" }}
                data-id={cell.getValue()}
                onClick={useCallback(() => sub(cell.getValue()), [])}
              >
                <i className="la la-tag fs-3"></i> Sub Kategori
              </button>
              <button
                className="btn btn-sm btn-warning btn-icon"
                data-id={cell.getValue()}
                onClick={useCallback(() => edit(cell.getValue()), [])}
              >
                <i className="la la-pencil fs-3"></i>
              </button>
              <button
                className="btn btn-sm btn-danger btn-icon"
                data-id={cell.getValue()}
                onClick={useCallback(() => hapus(cell.getValue()), [])}
              >
                <i className="la la-trash fs-3"></i>
              </button>
            </div>
          ),
      }),
    ],
    [openForm, openSub]
  );

  return (
    <section>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false), [])}
          selected={selected}
        />
      </If>
      <If isTrue={openSub}>
        <SubCategory
          close={useCallback(() => setOpenSub(false), [])}
          selected={selected}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Kategori</h1>
            <If isTrue={!openForm && !openSub}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (setSelected(null), setOpenForm(true))}
              >
                <i className="las la-plus"></i>
                Tambah
              </button>
            </If>
          </div>
        </div>
        <div className="card-body">
          <Paginate
            id="my-table"
            columns={columns}
            url="/api/category/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}
