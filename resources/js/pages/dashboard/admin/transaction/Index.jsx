import React, {
  useMemo,
  useCallback,
  useState,
  memo,
  useEffect,
  useRef,
} from "react";

import { Link } from "@inertiajs/inertia-react";
import Paginate from "@/pages/dashboard/components/Paginate";
import { If, Show } from "react-haiku";
import { createColumnHelper } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { currency } from "@/libs/utils";
import useDownloadPdf from "@/hooks/useDownloadPdf";

import Detail from "./Detail";
import Select from "react-select";

const columnHelper = createColumnHelper();

const statusOptions = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

function Index() {
  const [selected, setSelected] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();
  const paginate = useRef();

  const handleDetail = (uuid) => {
    setSelected(uuid);
    setOpenDetail(true);
    KTUtil.scrollTop();
  };

  const Filter = () => (
    <>
      <label htmlFor="limit" className="form-label ms-5">
        Status
      </label>
      <Select
        options={statusOptions}
        value={statusOptions.filter((opt) => opt.value === status)}
        onChange={(ev) => setStatus(ev.value)}
      />
    </>
  );

  useEffect(() => {
    paginate.current && paginate.current.refetch();
  }, [status]);

  const { download: downloadPdf } = useDownloadPdf({
    onDownload: () => KTApp.block("#my-table"),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("nomor", {
        header: "#",
        style: {
          width: "25px",
        },
        cell: (cell) => <span>{cell.getValue()}</span>,
      }),
      columnHelper.accessor("user.name", {
        header: "User",
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("amount", {
        header: "Nominal",
        cell: (cell) => currency(cell.getValue()),
      }),
      columnHelper.accessor("date", {
        header: "Tanggal",
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("payment_method.name", {
        header: "Metode Pembayaran",
        cell: (cell) => cell.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (cell) => (
          <Show>
            <Show.When isTrue={cell.getValue() === "pending"}>
              <span className="badge badge-warning">{cell.getValue()}</span>
            </Show.When>
            <Show.When isTrue={cell.getValue() === "success"}>
              <span className="badge badge-success">{cell.getValue()}</span>
            </Show.When>
            <Show.When isTrue={cell.getValue() === "failed"}>
              <span className="badge badge-danger">{cell.getValue()}</span>
            </Show.When>
          </Show>
        ),
      }),
      columnHelper.accessor("uuid", {
        id: "uuid",
        header: "Aksi",
        style: {
          width: "100px",
        },
        cell: (cell) =>
          !openDetail && (
            <div className="d-flex gap-2">
              <button
                title="Detail"
                className="btn btn-sm btn-info btn-icon"
                onClick={useCallback(() => handleDetail(cell.getValue()), [])}
              >
                <i className="la la-eye fs-3"></i>
              </button>
              <button
                className="btn btn-sm btn-danger d-flex gap-2 align-items-center pe-3"
                style={{ whiteSpace: "nowrap" }}
                onClick={useCallback(() =>
                  downloadPdf(`/admin/transaction/${cell.getValue()}/report`)
                )}
              >
                Report
                <i className="la la-file-pdf fs-3"></i>
              </button>
            </div>
          ),
      }),
    ],
    [openDetail]
  );

  return (
    <section>
      <If isTrue={openDetail}>
        <Detail
          close={useCallback(() => setOpenDetail(false), [])}
          selected={selected}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Transaksi Pembelian Kelas</h1>
          </div>
        </div>
        <div className="card-body">
          <Paginate
            id="my-table"
            columns={columns}
            url="/admin/transaction/paginate"
            payload={{ status }}
            Plugin={Filter}
            ref={paginate}
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
