import React, { useCallback, useState, memo } from "react";

import { createColumnHelper } from "@tanstack/react-table";
import { If } from "react-haiku";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { toast } from "react-toastify";

import Paginate from "@/pages/dashboard/components/Paginate";

const columnHelper = createColumnHelper();

function Index() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus } = useMutation(
    (data) =>
      axios.post(`/admin/payment-method/${data.uuid}/status`, {
        is_active: data.is_active,
      }),
    {
      onMutate: () => KTApp.block("#my-table"),
      onSettled: () => {
        queryClient.invalidateQueries(["/admin/payment-method/paginate"]);
        KTApp.unblock("#my-table");
      },
      onError: (error) => toast.error(error.response.data.message),
    }
  );

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
            .delete(`/admin/payment-method/${uuid}/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          queryClient.invalidateQueries(["/admin/payment-method/paginate"]);
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
    columnHelper.accessor("logo", {
      header: "Logo",
      cell: (cell) => (
        <img
          className="img-thumbnail"
          width={50}
          src={asset(cell.getValue())}
          key={cell.getValue()}
        />
      ),
    }),
    columnHelper.accessor("name", {
      cell: (cell) => cell.getValue(),
      header: "Nama",
    }),
    columnHelper.accessor("uuid", {
      id: "status",
      cell: (cell) => cell.getValue(),
      header: "Status",
      style: {
        width: "200px",
      },
      cell: (cell) => (
        <div className="form-check form-switch form-check-custom form-check-solid">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${cell.getValue()}`}
            checked={cell.row.original.is_active}
            onChange={useCallback(
              (ev) =>
                updateStatus({
                  uuid: cell.getValue(),
                  is_active: ev.target.checked,
                }),
              []
            )}
          />
          <label
            className="form-check-label"
            htmlFor={`status-${cell.getValue()}`}
          >
            {cell.row.original.is_active ? "Aktif" : "Tidak Aktif"}
          </label>
        </div>
      ),
    }),
  ];

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Metode Pembayaran</h1>
          </div>
        </div>
        <div className="card-body">
          <Paginate
            id="my-table"
            columns={columns}
            url="/admin/payment-method/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
