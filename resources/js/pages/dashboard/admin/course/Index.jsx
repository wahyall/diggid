import React, { useMemo, useCallback, useState, memo } from "react";

import { Link } from "@inertiajs/inertia-react";
import Paginate from "@/components/Paginate";
import { If } from "react-haiku";
import { createColumnHelper } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";

import Form from "./Form";
import Project from "./Project";

const columnHelper = createColumnHelper();

function Index({ csrf_token }) {
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openProject, setOpenProject] = useState(false);

  const queryClient = useQueryClient();

  const courseProject = (uuid) => {
    setSelected(uuid);
    setOpenProject(true);
    KTUtil.scrollTop();
  };

  const editCourse = (uuid) => {
    setSelected(uuid);
    setOpenForm(true);
    KTUtil.scrollTop();
  };

  const deleteCourse = (uuid) => {
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
            .delete(`/api/admin/course/${uuid}/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          queryClient.invalidateQueries(["/api/admin/course/paginate"]);
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
      columnHelper.accessor((row) => row.thumbnail, {
        header: "Thumbnail",
        cell: (cell) => (
          <img
            className="img-thumbnail"
            width={250}
            src={asset(cell.getValue())}
          />
        ),
      }),
      columnHelper.accessor("name", {
        cell: (cell) => cell.getValue(),
        header: "Nama",
      }),
      columnHelper.accessor("price", {
        cell: (cell) =>
          Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(cell.getValue()),
        header: "Harga",
      }),
      columnHelper.accessor("uuid", {
        id: "uuid",
        header: "Aksi",
        style: {
          width: "100px",
        },
        cell: (cell) =>
          !openForm &&
          !openProject && (
            <div className="d-flex gap-2">
              <Link
                href={route("dashboard.admin.course.lesson", cell.getValue())}
                className="btn btn-sm btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                <i className="la la-chalkboard fs-3"></i>
                Silabus
              </Link>
              <button
                className="btn btn-sm btn-primary"
                style={{ whiteSpace: "nowrap" }}
                onClick={useCallback(() => courseProject(cell.getValue()), [])}
              >
                <i className="la la-tasks fs-3"></i>
                Proyek
              </button>
              <button
                className="btn btn-sm btn-warning btn-icon"
                onClick={useCallback(() => editCourse(cell.getValue()), [])}
              >
                <i className="la la-pencil fs-3"></i>
              </button>
              <button
                className="btn btn-sm btn-danger btn-icon"
                onClick={useCallback(() => deleteCourse(cell.getValue()), [])}
              >
                <i className="la la-trash fs-3"></i>
              </button>
            </div>
          ),
      }),
    ],
    [openForm, openProject]
  );

  return (
    <section>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false), [])}
          selected={selected}
          csrfToken={csrf_token}
        />
      </If>
      <If isTrue={openProject}>
        <Project
          close={useCallback(() => setOpenProject(false), [])}
          selected={selected}
          csrfToken={csrf_token}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Kursus</h1>
            <If isTrue={!openForm && !openProject}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (
                  setSelected(null), setOpenForm(true), KTUtil.scrollTop()
                )}
              >
                <i className="las la-plus"></i>
                Kursus Baru
              </button>
            </If>
          </div>
        </div>
        <div className="card-body">
          <Paginate
            id="my-table"
            columns={columns}
            url="/api/admin/course/paginate"
          ></Paginate>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
