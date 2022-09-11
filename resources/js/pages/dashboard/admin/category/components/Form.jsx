import React, { memo, useState, useEffect } from "react";

import ImageUpload from "@/components/ImageUpload";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

function Form({ close, selected }) {
  const [file, setFile] = useState([]);
  const queryClient = useQueryClient();
  const { data: category } = useQuery(
    [`/api/category/${selected}/edit`],
    () => {
      KTApp.block("#form-category");
      return axios
        .get(`/api/category/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-category"),
      enabled: !!selected,
      cacheTime: 0,
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/api/category/${selected}/update` : "/api/category/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-subcategory"),
      onError: (error) => {
        toastr.error(error.response.data.message);
      },
      onSuccess: ({ data }) => {
        toastr.success(data.message);
        queryClient.invalidateQueries(["/api/category/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    formData.append("icon", file[0].file);

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
          <div className="col-2">
            <label htmlFor="name" className="form-label">
              Icon :
            </label>
            <ImageUpload
              files={selected && category?.icon ? `/${category?.icon}` : file}
              onupdatefiles={setFile}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              required
            />
          </div>
          <div className="col-6">
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
                autoComplete="off"
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
