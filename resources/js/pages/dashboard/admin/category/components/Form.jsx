import React, { memo, useState, useEffect } from "react";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

function Form({ close, selected }) {
  const [files, setFiles] = useState([]);
  const queryClient = useQueryClient();
  const { data: category } = useQuery([`/api/category/${selected}/edit`], () =>
    axios.get(`/api/category/${selected}/edit`).then((res) => res.data)
  );

  const { mutate: submit } = useMutation(
    (data) => axios.post("/api/category/store", data),
    {
      onError: (error) => {
        toastr.error(error.response.data.message);
        KTApp.unblock("#form-category");
      },
      onSuccess: ({ data }) => {
        toastr.success(data.message);
        KTApp.unblock("#form-category");
        queryClient.invalidateQueries(["/api/category/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("icon", files[0].file);

    KTApp.block("#form-category");
    submit(formData);
  };

  return (
    <form className="card mb-12" id="form-category" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          <h3>Tambah Kategori</h3>
          <button
            type="button"
            className="btn btn-light-danger btn-sm ms-auto"
            onClick={close}
          >
            <i className="las la-chevron-left"></i>
            Kembali
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-3">
            <label htmlFor="name" className="form-label">
              Icon :
            </label>
            <FilePond
              files={selected ? [{ source: assets(category?.icon) }] : files}
              onupdatefiles={setFiles}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              required
            />
          </div>
          <div className="col-9">
            <div>
              <label htmlFor="name" className="form-label">
                Nama :
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nama Kategori"
                className="form-control required"
                required
                defaultValue={selected ? category?.name : ""}
              />
            </div>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-sm ms-auto mt-8 d-block"
            >
              <i className="las la-save"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(Form);
