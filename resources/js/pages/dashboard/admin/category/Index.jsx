import React, { useMemo, useCallback, useState } from "react";
import Paginate from "@/components/Paginate";
import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import Form from "./components/Form";

const columnHelper = createColumnHelper();

export default function Index() {
  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const edit = useCallback((uuid) => {
    setSelected(uuid);
    setOpenForm(true);
  }, []);

  const hapus = useCallback((uuid) => {
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
        console.log(result);
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
        }
      });
  }, []);

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
        cell: (cell) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary btn-icon"
              data-id={cell.getValue()}
              onClick={() => edit(cell.getValue())}
            >
              <i className="la la-pencil"></i>
            </button>
            <button
              className="btn btn-sm btn-danger btn-icon"
              data-id={cell.getValue()}
              onClick={() => hapus(cell.getValue())}
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
    <section>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false))}
          selected={selected}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Kategori</h1>
            <If isTrue={!openForm}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => setOpenForm(true)}
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
