import React, { memo, useState, useCallback } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5-custom-build/build/ckeditor";

function Form({ close, course_uuid, selected, csrfToken }) {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState();
  const [deletedImages, setDeletedImages] = useState([]);

  const { data: lesson } = useQuery(
    [`/admin/course/${course_uuid}/lesson/${selected}/edit`],
    () => {
      KTApp.block("#form-course-lesson");
      return axios
        .get(`/admin/course/${course_uuid}/lesson/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      enabled: !!selected,
      cacheTime: 0,
      placeholderData: {},
      onSettled: () => KTApp.unblock("#form-course-lesson"),
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        lesson?.uuid
          ? `/admin/course/${course_uuid}/lesson/${selected}/update`
          : `/admin/course/${course_uuid}/lesson/store`,
        data
      ),
    {
      onSettled: () => {
        KTApp.unblock("#form-course-lesson");
      },
      onSuccess: ({ data }) => {
        toastr.success(data.message);
        queryClient.invalidateQueries([`/admin/course/${course_uuid}/lesson`]);
        close();
      },
      onError: ({ response }) => {
        toastr.error(response.data.message);
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    deletedImages.forEach((image) =>
      formData.append("deleted_images[]", image)
    );
    formData.append("description", editor.getData());

    KTApp.block("#form-course-lesson");
    submit(formData);
  };

  const onEditorReady = useCallback((ckeditor) => setEditor(ckeditor), []);
  const editorConfig = {
    simpleUpload: {
      uploadUrl: `${import.meta.env.VITE_URL}/admin/course/upload-image`,
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
    <form className="card mb-12" id="form-course-lesson" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          {lesson?.uuid ? `Edit Silabus: ${lesson?.name}` : "Buat Silabus Baru"}
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
                Judul Silabus :
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                autoComplete="off"
                defaultValue={lesson?.name}
              />
            </div>
            <div className="col-12 mb-10">
              <label htmlFor="description" className="form-label required">
                Deskripsi :
              </label>
              <CKEditor
                editor={ClassicEditor} // Berasal dari CKEditor Custom Build
                config={editorConfig}
                data={lesson?.description}
                onReady={onEditorReady}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-end mt-8 gap-8">
              <button type="submit" className="btn btn-primary btn-sm d-block">
                <i className="las la-save fs-3"></i>
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(Form);
