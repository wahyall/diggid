import React, { memo, useState, useMemo, useCallback } from "react";

import { If } from "react-haiku";
import { createColumnHelper } from "@tanstack/react-table";
import SortableTable from "@/components/SortableTable";
import { extractUuidFromUrl } from "@/libs/utils";
import { Link, usePage } from "@inertiajs/inertia-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import Form from "./Form";
import axios from "@/libs/axios";

const columnHelper = createColumnHelper();

function Index({ csrf_token }) {
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const { url } = usePage();
  const course_uuid = useMemo(() => extractUuidFromUrl(url), [url]);

  const { data: course } = useQuery([`/api/admin/course/${course_uuid}`], () =>
    axios.get(`/api/admin/course/${course_uuid}`).then((res) => res.data)
  );

  const editLesson = (uuid) => {
    setOpenForm(true);
    setSelected(uuid);
    KTUtil.scrollTop();
  };

  const deleteLesson = (uuid) => {
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
            .delete(`/api/admin/course/${course_uuid}/lesson/${uuid}/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          queryClient.invalidateQueries([
            `/api/admin/course/${course_uuid}/lesson`,
          ]);
        }
      });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("order", {
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
      columnHelper.accessor("uuid", {
        id: "action",
        header: "Aksi",
        style: {
          width: "100px",
        },
        cell: (cell) =>
          !openForm && (
            <div className="d-flex gap-2 ms-auto">
              <Link
                href={route("dashboard.admin.course.lesson.video", [
                  course_uuid,
                  cell.getValue(),
                ])}
                className="btn btn-sm btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                <i className="la la-video fs-3"></i>
                Video
              </Link>
              <button
                className="btn btn-sm btn-warning btn-icon"
                onClick={useCallback(() => editLesson(cell.getValue()), [])}
              >
                <i className="la la-pencil fs-3"></i>
              </button>
              <button
                className="btn btn-sm btn-danger btn-icon"
                onClick={useCallback(() => deleteLesson(cell.getValue()), [])}
              >
                <i className="la la-trash fs-3"></i>
              </button>
            </div>
          ),
      }),
    ],
    [openForm]
  );

  const { mutate: reorder } = useMutation(
    (data) =>
      axios.post(`/api/admin/course/${course_uuid}/lesson/reorder`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          `/api/admin/course/${course_uuid}/lesson`,
        ]);
      },
    }
  );

  const handleOnSorted = useCallback((sortItems) => {
    const data = sortItems.map((item, index) => ({
      uuid: item,
      order: index + 1,
    }));
    reorder(data);
  }, []);

  return (
    <section>
      <Link
        href={route("dashboard.admin.course")}
        className="btn btn-light-danger btn-sm ms-auto mb-4"
      >
        <i className="las la-chevron-left"></i>
        Kembali
      </Link>
      <If isTrue={openForm}>
        <Form
          close={useCallback(() => setOpenForm(false), [])}
          selected={selected}
          csrfToken={csrf_token}
          course_uuid={course_uuid}
        />
      </If>
      <div className="card">
        <div className="card-header">
          <div className="card-title w-100">
            <h1>Daftar Silabus dari Kursus: {course?.name}</h1>
            <If isTrue={!openForm}>
              <button
                type="button"
                className="btn btn-primary btn-sm ms-auto"
                onClick={() => (
                  setSelected(null), setOpenForm(true), KTUtil.scrollTop()
                )}
              >
                <i className="las la-plus"></i>
                Silabus Baru
              </button>
            </If>
          </div>
        </div>
        <div className="card-body">
          <SortableTable
            id="my-table"
            columns={columns}
            url={`/api/admin/course/${course_uuid}/lesson`}
            onSorted={handleOnSorted}
          ></SortableTable>
        </div>
      </div>
    </section>
  );
}

export default memo(Index);
