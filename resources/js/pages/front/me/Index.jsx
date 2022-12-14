import React, { memo, useState } from "react";

import FileUpload from "../components/FileUpload";

import { useMutation } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { toast } from "react-toastify";

const Index = ({ auth: { user } }) => {
  const [file, setFile] = useState([]);

  const { mutate: submit, isLoading } = useMutation(
    (data) => axios.post("/me", data).then((res) => res.data),
    {
      onSuccess: (data) => {
        toast.success(data.message);
        window.location.reload();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message);
      },
    }
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    formData.append("photo", file[0].file);

    submit(formData);
  };

  return (
    <section className="py-4 px-8 mt-4">
      <article className="prose max-w-none">
        <h1>Profil Saya</h1>

        <form onSubmit={onSubmit} className="max-w-xl">
          <div className="mb-8">
            <label className="label">Foto Profil</label>
            <div className="w-48 mt-4">
              <FileUpload
                files={user?.photo ? `/${user?.photo}` : file}
                onupdatefiles={setFile}
                allowMultiple={false}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                acceptedFileTypes={["image/*"]}
                imageCropAspectRatio="1:1"
                imageResizeTargetWidth={200}
                imageResizeTargetHeight={200}
                stylePanelLayout="compact circle"
                styleButtonRemoveItemPosition="center bottom"
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="label">Nama</label>
            <input
              type="text"
              className="input input-bordered w-full cursor-text"
              autoComplete="off"
              name="name"
              placeholder="Nama"
              defaultValue={user?.name}
            />
          </div>
          <div className="mb-8">
            <label className="label">Email</label>
            <input
              type="text"
              className="input input-bordered w-full cursor-text"
              autoComplete="off"
              placeholder="Email"
              defaultValue={user?.email}
              disabled
            />
          </div>
          <div>
            <label className="label">Biografi</label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Biografi"
              name="bio"
              rows={5}
            >
              {user?.bio}
            </textarea>
          </div>
          <div className="mb-8">
            <label className="label">Alamat</label>
            <input
              type="text"
              className="input input-bordered w-full cursor-text"
              autoComplete="off"
              name="address"
              placeholder="Alamat"
              defaultValue={user?.address}
            />
          </div>
          <button
            type="submit"
            className={`btn btn-lg btn-primary w-full ${
              isLoading && "loading"
            }`}
            disabled={isLoading}
            data-ripplet
          >
            Simpan Profil
          </button>
        </form>
      </article>
    </section>
  );
};

export default memo(Index);
