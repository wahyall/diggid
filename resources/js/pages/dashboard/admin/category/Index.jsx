import React, { useCallback, useState, memo } from "react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";

import Form from "./Form";
import Categories from "./Categories";

const columnHelper = createColumnHelper();

function Index() {
  const [openForm, setOpenForm] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const handleSub = (uuid) => {
    setSelected(uuid);
    setOpenSub(true);
    KTUtil.scrollTop();
  };

  const handleEdit = (uuid) => {
    setSelected(uuid);
    setOpenForm(true);
    KTUtil.scrollTop();
  };

  const handleDelete = (uuid) => {
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
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batalkan!",
        reverseButtons: true,
        preConfirm: () => {
          return axios
            .delete(`/admin/category/group/${uuid}/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          queryClient.invalidateQueries(["/admin/category/group/paginate"]);
        }
      });
  };

  const columns = [
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
    columnHelper.accessor("caption", {
      cell: (cell) => cell.getValue(),
      header: "Caption",
    }),
    columnHelper.accessor("icon", {
      header: "Ikon",
      cell: (cell) => (
        <img
          className="img-thumbnail"
          width={50}
          src={asset(cell.getValue())}
          key={cell.getValue()}
        />
      ),
    }),
    columnHelper.accessor("uuid", {
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
              onClick={useCallback(() => handleSub(cell.getValue()), [])}
            >
              <i className="la la-tag fs-3"></i> Kategori
            </button>
            <button
              className="btn btn-sm btn-warning btn-icon"
              onClick={useCallback(() => handleEdit(cell.getValue()), [])}
            >
              <i className="la la-pencil fs-3"></i>
            </button>
            <button
              className="btn btn-sm btn-danger btn-icon"
              onClick={useCallback(() => handleDelete(cell.getValue()), [])}
            >
              <i className="la la-trash fs-3"></i>
            </button>
          </div>
        ),
    }),
  ];

  return (
    <section>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false), [])}
          selected={selected}
        />
      </If>
      <If isTrue={openSub}>
        <Categories
          close={useCallback(() => setOpenSub(false), [])}
          selected={selected}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Grup Kategori</h1>
            <If isTrue={!openForm && !openSub}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (
                  setSelected(null), setOpenForm(true), KTUtil.scrollTop()
                )}
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
            url="/admin/category/group/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
