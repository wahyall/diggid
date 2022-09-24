import React, { memo, useState, useCallback } from "react";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5-custom-build/build/ckeditor";

import { toast } from "react-toastify";

function Project({ close, selected, csrfToken }) {
  const [editor, setEditor] = useState();
  const [deletedImages, setDeletedImages] = useState([]);

  const { data: course } = useQuery(
    [`/api/course/${selected}/project`],
    () => {
      KTApp.block("#form-course-project");
      return axios
        .get(`/api/course/${selected}/project`)
        .then((res) => res.data);
    },
    {
      cacheTime: 0,
      placeholderData: {},
      onSettled: () => KTApp.unblock("#form-course-project"),
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        course?.project?.uuid
          ? `/api/course/${selected}/project/update`
          : `/api/course/${selected}/project/store`,
        data
      ),
    {
      onSettled: () => {
        KTApp.unblock("#form-course-project");
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        close();
      },
      onError: ({ response }) => {
        toast.error(response.data.message);
      },
    }
  );

  const deleteProject = (uuid) => {
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
            .delete(`/api/course/${selected}/project/destroy`)
            .catch((error) => {
              Swal.showValidationMessage(error.response.data.message);
            });
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          mySwal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          close();
        }
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    deletedImages.forEach((image) =>
      formData.append("deleted_images[]", image)
    );
    formData.append("description", editor.getData());

    KTApp.block("#form-course-project");
    submit(formData);
  };

  const onEditorReady = useCallback((ckeditor) => setEditor(ckeditor), []);
  const editorConfig = {
    simpleUpload: {
      uploadUrl: `${import.meta.env.VITE_URL}/api/course/upload-image`,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": csrfToken,
      },
    },
    imageRemoveEvent: {
      callback: (imagesSrc) =>
        setDeletedImages((images) => [...images, ...imagesSrc]),
    },
  };

  return (
    <form className="card mb-12" id="form-course-project" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          <h3>Proyek Kursus: {course?.name || ""}</h3>
          <button
            type="button"
            className="btn btn-light-danger btn-sm ms-auto"
            onClick={close}
          >
            <i className="las la-times-circle"></i>
            Batal
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-12">
            <div className="mb-10">
              <label htmlFor="name" className="form-label required">
                Judul Proyek :
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                autoComplete="off"
                defaultValue={course?.project?.name}
              />
            </div>
            <div className="col-12 mb-10">
              <label htmlFor="description" className="form-label required">
                Deskripsi :
              </label>
              <CKEditor
                editor={ClassicEditor} // Berasal dari CKEditor Custom Build
                config={editorConfig}
                data={course?.project?.description}
                onReady={onEditorReady}
              />
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-end mt-8 gap-8">
                {!!course?.project?.uuid && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm d-block"
                    onClick={deleteProject}
                  >
                    <i className="las la-trash fs-3"></i>
                    Hapus
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-sm d-block"
                >
                  <i className="las la-save fs-3"></i>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(Project);
