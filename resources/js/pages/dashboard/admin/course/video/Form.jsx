import React, { memo, useState, useCallback } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5-custom-build/build/ckeditor";

import FileUpload from "@/components/FileUpload";

import { toast } from "react-toastify";

function Form({ close, lesson_uuid, selected, csrfToken }) {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState();
  const [deletedImages, setDeletedImages] = useState([]);
  const [videoFile, setVideoFile] = useState([]);

  const { data: video } = useQuery(
    [`/api/course/lesson/${lesson_uuid}/video/${selected}/edit`],
    () => {
      KTApp.block("#form-course-lesson-video");
      return axios
        .get(`/api/course/lesson/${lesson_uuid}/video/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      enabled: !!selected,
      cacheTime: 0,
      placeholderData: {},
      onSettled: () => KTApp.unblock("#form-course-lesson-video"),
      onSuccess: ({ name, file_size }) => {
        setVideoFile([
          {
            options: {
              file: {
                name: `${name}.mp4`,
                type: "video/mp4",
                size: file_size,
              },
            },
          },
        ]);
      },
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios
        .post(
          video?.uuid
            ? `/api/course/lesson/${lesson_uuid}/video/${selected}/update`
            : `/api/course/lesson/${lesson_uuid}/video/store`,
          data
        )
        .then((res) => res.data),
    {
      onSettled: () => {
        KTApp.unblock("#form-course-lesson-video");
      },
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries([
          `/api/course/lesson/${lesson_uuid}/video`,
        ]);

        if (videoFile[0]?.file.constructor === File) uploadVideo(data);
        setTimeout(() => {
          close();
        }, 500);
      },
      onError: ({ response }) => {
        toast.error(response.data.message);
      },
    }
  );

  const { mutate: uploadVideo } = useMutation(
    ({ uuid, name }) => {
      const formData = new FormData(
        document.querySelector("#form-course-lesson-video")
      );
      formData.append("video", videoFile[0].file);

      return axios
        .post(
          `/api/course/lesson/${lesson_uuid}/video/${uuid}/upload`,
          formData,
          {
            onUploadProgress: (ev) => {
              const progress = ev.loaded / ev.total;
              const toastList = queryClient.getQueryData(["toast-list"]) || [];

              if (!toastList.includes(uuid)) {
                toast(`Sedang mengupload video ${name}`, {
                  toastId: uuid,
                  progress,
                  closeButton: false,
                  closeOnClick: false,
                  draggable: false,
                });
                queryClient.setQueryData(["toast-list"], (items) =>
                  items ? [...items, uuid] : [uuid]
                );
              } else {
                toast.update(uuid, { progress });
              }
            },
          }
        )
        .then((res) => {
          toast.done(uuid);
          queryClient.setQueryData(["toast-list"], (items) =>
            items.filter((i) => i !== uuid)
          );
          return res.data;
        });
    },
    {
      onSuccess: ({ data }) => {
        toast.success(data.message);
      },
      onError: ({ response }) => {
        toast.error(response.data.message);
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

    KTApp.block("#form-course-lesson-video");
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
    <form
      className="card mb-12"
      id="form-course-lesson-video"
      onSubmit={onSubmit}
    >
      <div className="card-header">
        <div className="card-title w-100">
          {video?.uuid ? `Edit Video: ${video?.name}` : "Buat Video Baru"}
          <button
            type="button"
            className="btn btn-light-danger btn-sm ms-auto"
            onClick={close}
          >
            <i className="las la-chevron-left"></i>
            Batal
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <div>
              <label htmlFor="video" className="form-label required">
                Video :
              </label>
              <FileUpload
                files={videoFile}
                onupdatefiles={setVideoFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["video/*"]}
                required
              />
            </div>
          </div>
          <div className="col-8">
            <div className="mb-10">
              <label htmlFor="name" className="form-label required">
                Judul Video :
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                autoComplete="off"
                defaultValue={video?.name}
              />
            </div>
            <div className="col-12 mb-10">
              <label htmlFor="description" className="form-label">
                Deskripsi :
              </label>
              <CKEditor
                editor={ClassicEditor} // Berasal dari CKEditor Custom Build
                config={editorConfig}
                data={video?.description ?? ""}
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
