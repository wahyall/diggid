import React, { memo, useState } from "react";

import FileUpload from "@/pages/dashboard/components/FileUpload";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import { toast } from "react-toastify";

function Form({ close, selected }) {
  const [file, setFile] = useState([]);
  const queryClient = useQueryClient();
  const { data: payment } = useQuery(
    [`/admin/payment-method/${selected}/edit`],
    () => {
      KTApp.block("#form-payment");
      return axios
        .get(`/admin/payment-method/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-payment"),
      enabled: !!selected,
      cacheTime: 0,
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected
          ? `/admin/payment-method/${selected}/update`
          : "/admin/payment-method/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-payment"),
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/admin/payment-method/paginate"]);
        close();
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    formData.append("logo", file[0].file);

    KTApp.block("#form-payment");
    submit(formData);
  };

  return (
    <form className="card mb-12" id="form-payment" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {payment?.name
              ? `Edit Grup Kategori: ${payment?.name || ""}`
              : "Tambah Grup Kategori"}
          </h3>
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
          <div className="col-2">
            <label htmlFor="name" className="form-label">
              Logo :
            </label>
            <FileUpload
              files={selected && payment?.logo ? `/${payment?.logo}` : file}
              onupdatefiles={setFile}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              required
              acceptedFileTypes={["image/*"]}
            />
          </div>
          <div className="col-6">
            <div className="mb-4">
              <label htmlFor="name" className="form-label">
                Nama :
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nama Metode Pembayaran"
                className="form-control required"
                required
                defaultValue={selected ? payment?.name : ""}
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
