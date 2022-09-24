import React, { memo, useState } from "react";

import FileUpload from "@/components/FileUpload";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";

function Form({ close, selected }) {
  const [file, setFile] = useState([]);
  const queryClient = useQueryClient();
  const { data: category } = useQuery(
    [`/api/category/group/${selected}/edit`],
    () => {
      KTApp.block("#form-category");
      return axios
        .get(`/api/category/group/${selected}/edit`)
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
        selected
          ? `/api/category/group/${selected}/update`
          : "/api/category/group/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-subcategory"),
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/api/category/group/paginate"]);
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
          <h3>
            {category?.name
              ? `Edit Grup Kategori: ${category?.name || ""}`
              : "Tambah Grup Kategori"}
          </h3>
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
          <div className="col-2">
            <label htmlFor="name" className="form-label">
              Icon :
            </label>
            <FileUpload
              files={selected && category?.icon ? `/${category?.icon}` : file}
              onupdatefiles={setFile}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              required
              acceptedFileTypes={["image/*"]}
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
                placeholder="Nama Grup"
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
