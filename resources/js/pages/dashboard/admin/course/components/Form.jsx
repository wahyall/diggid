import React, { memo, useState, useEffect } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import ImageUpload from "@/components/ImageUpload";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5-custom-build/build/ckeditor";
import { useMemo } from "react";
import { useCallback } from "react";

function Form({ close, selected, csrfToken }) {
  const [file, setFile] = useState([]);
  const [editor, setEditor] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const queryClient = useQueryClient();
  const { data: course } = useQuery(
    [`/api/course/${selected}/edit`],
    () => {
      KTApp.block("#form-course");
      return axios.get(`/api/course/${selected}/edit`).then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-course"),
      enabled: !!selected,
      cacheTime: 0,
    }
  );
  const { data: categories } = useQuery(
    ["/api/category/show", "admin"],
    () =>
      axios.get("/api/category/show").then((res) => {
        return res.data.map((category) => ({
          label: category.name,
          options: category.subs.map((sub) => ({
            label: sub.name,
            value: sub.id,
          })),
        }));
      }),
    {
      cacheTime: 0,
      placeholderData: [],
    }
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/api/course/${selected}/update` : "/api/course/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-subcategory"),
      onError: (error) => {
        toastr.error(error.response.data.message);
      },
      onSuccess: ({ data }) => {
        toastr.success(data.message);
        queryClient.invalidateQueries(["/api/course/paginate"]);
        close();
      },
    }
  );

  const onEditorReady = useCallback((ckeditor) => setEditor(ckeditor), []);
  const onEditorChange = useCallback(
    (ev, ckeditor) => {
      let urls = Array.from(
        new DOMParser()
          .parseFromString(ckeditor.getData(), "text/html")
          .querySelectorAll("img")
      ).map((img) => img.getAttribute("src"));
      urls = [...new Set([...urls])];

      setUploadedImages((prev) => [...new Set([...urls, ...prev])]);
    },
    [editor]
  );

  const onSubmit = (ev) => {
    ev.preventDefault();

    const formData = new FormData(ev.target);
    formData.append("thumbnail", file[0].file);
    formData.append("description", editor.getData());

    const images = Array.from(
      new DOMParser()
        .parseFromString(editor.getData(), "text/html")
        .querySelectorAll("img")
    ).map((img) => img.getAttribute("src"));
    uploadedImages
      .filter((img) => !images.includes(img))
      .forEach((img) => formData.append("unused_images[]", img));

    KTApp.block("#form-course");
    submit(formData);
  };

  const editorConfig = useMemo(
    () => ({
      simpleUpload: {
        uploadUrl: `${import.meta.env.VITE_URL}/api/course/upload-image`,
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN": csrfToken,
        },
      },
    }),
    []
  );

  return (
    <form className="card mb-12" id="form-course" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {selected ? `Edit Kursus: ${course?.name}` : "Buat Kursus Baru"}
          </h3>
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
          <div className="col-4">
            <label htmlFor="name" className="form-label required">
              Thumbnail :
            </label>
            <ImageUpload
              files={
                selected && course?.thumbnail ? `/${course?.thumbnail}` : file
              }
              onupdatefiles={setFile}
              allowMultiple={false}
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
              acceptedFileTypes={["image/*"]}
              required
            />
          </div>
          <div className="col-8">
            <div className="mb-10">
              <label htmlFor="name" className="form-label required">
                Nama :
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Nama Kursus"
                className="form-control required"
                required
                defaultValue={course?.name}
                autoComplete="off"
              />
            </div>
            <div className="mb-6">
              <div className="row">
                <div className="col-9">
                  <label htmlFor="price" className="form-label required">
                    Harga :
                  </label>
                  <div className="input-group mb-5">
                    <span className="input-group-text">Rp.</span>
                    <CurrencyInput
                      name="price"
                      id="price"
                      mask="999.999"
                      placeholder="0.000.000"
                      className="form-control"
                      groupSeparator="."
                      decimalSeparator=","
                      required
                      defaultValue={course?.price}
                      autoComplete="off"
                      allowDecimals={false}
                      allowNegativeValue={false}
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>
                <div className="col-3">
                  <label htmlFor="discount" className="form-label">
                    Diskon :
                  </label>
                  <div className="input-group">
                    <CurrencyInput
                      name="discount"
                      id="discount"
                      mask="999.999"
                      placeholder="00,0"
                      className="form-control"
                      groupSeparator="."
                      decimalSeparator=","
                      autoComplete="off"
                      allowNegativeValue={false}
                      transformRawValue={(ev) =>
                        parseFloat(ev) > 100 ? "100" : ev
                      }
                    />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-10">
              <div className="row">
                <div className="col-8">
                  <label
                    htmlFor="sub_category_id"
                    className="form-label required"
                  >
                    Kategori :
                  </label>
                  <Select name="sub_category_id" options={categories} />
                </div>
                <div className="col-4">
                  <label htmlFor="finish_estimation" className="form-label">
                    Estimasi Selesai :
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="finish_estimation"
                      id="finish_estimation"
                      placeholder="0"
                      className="form-control required"
                      defaultValue={course?.finish_estimation}
                      autoComplete="off"
                    />
                    <span className="input-group-text">hari</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label required">
              Deskripsi
            </label>
            <CKEditor
              editor={ClassicEditor} // Berasal dari CKEditor Custom Build
              config={editorConfig}
              data={course?.description}
              onReady={onEditorReady}
              onChange={onEditorChange}
            />
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
