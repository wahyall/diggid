import React, { memo, useState, useEffect, useCallback, useMemo } from "react";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";

import FileUpload from "@/pages/dashboard/components/FileUpload";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import "ckeditor5-custom-build/build/ckeditor";

import { toast } from "react-toastify";

function Form({ close, selected, csrfToken }) {
  const [thumbnail, setThumbnail] = useState([]);
  const [sneakPeek, setSneakPeek] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [editor, setEditor] = useState(null);

  const queryClient = useQueryClient();
  const { data: course } = useQuery(
    [`/admin/course/${selected}/edit`],
    () => {
      KTApp.block("#form-course");
      return axios
        .get(`/admin/course/${selected}/edit`)
        .then((res) => res.data);
    },
    {
      enabled: !!selected,
      cacheTime: 0,
      onSettled: () => KTApp.unblock("#form-course"),
      onSuccess: (data) => {
        setThumbnail([{ source: asset(data.thumbnail) }]);
        if (data?.categories) {
          setSelectedCategories(
            data.categories.map((category) => ({
              label: category.name,
              value: category.uuid,
            }))
          );
        }
      },
    }
  );
  const { data: categories } = useQuery(
    ["/admin/category/group/show", "admin"],
    () =>
      axios.get("/admin/category/group/show").then((res) => {
        return res.data.map((group) => ({
          label: group.name,
          options: group.categories.map((sub) => ({
            label: sub.name,
            value: sub.uuid,
          })),
        }));
      }),
    {
      cacheTime: 0,
      placeholderData: [],
    }
  );

  const uploadedSneakPeek = useMemo(
    () => course?.sneak_peeks?.map((img) => ({ source: img })),
    [course]
  );

  const { mutate: submit } = useMutation(
    (data) =>
      axios.post(
        selected ? `/admin/course/${selected}/update` : "/admin/course/store",
        data
      ),
    {
      onSettled: () => KTApp.unblock("#form-course"),
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSuccess: ({ data }) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["/admin/course/paginate"]);
        close();
      },
    }
  );

  const onEditorReady = useCallback((ckeditor) => setEditor(ckeditor), []);

  const onSubmit = (ev, published = true) => {
    ev && ev.preventDefault();

    const formData = new FormData(
      ev ? ev.target : document.getElementById("form-course")
    );
    formData.append("published", published ? 1 : 0);
    formData.append("thumbnail", thumbnail[0].file);
    formData.append("description", editor.getData());
    deletedImages.forEach((image) =>
      formData.append("deleted_images[]", image)
    );
    sneakPeek.forEach((img) => formData.append("sneak_peeks[]", img.file));

    KTApp.block("#form-course");
    submit(formData);
  };

  const editorConfig = {
    simpleUpload: {
      uploadUrl: `${import.meta.env.VITE_URL}/api/admin/course/upload-image`,
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
    <form className="card mb-12" id="form-course" onSubmit={onSubmit}>
      <div className="card-header">
        <div className="card-title w-100">
          <h3>
            {course?.uuid ? `Edit Kursus: ${course?.name}` : "Buat Kursus Baru"}
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
          <div className="col-4">
            <label htmlFor="name" className="form-label required">
              Thumbnail :
            </label>
            <FileUpload
              files={thumbnail}
              onupdatefiles={setThumbnail}
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
            <div className="mb-10">
              <label htmlFor="name" className="form-label required">
                Caption :
              </label>
              <input
                type="text"
                name="caption"
                id="caption"
                placeholder="Caption"
                className="form-control required"
                required
                defaultValue={course?.caption}
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
                    {(!!course?.price || !selected) && (
                      <CurrencyInput
                        name="price"
                        id="price"
                        mask="999.999"
                        placeholder="000.000"
                        className="form-control"
                        groupSeparator="."
                        decimalSeparator=","
                        required
                        defaultValue={course?.price}
                        autoComplete="off"
                        allowDecimals={false}
                        allowNegativeValue={false}
                      />
                    )}
                    <span className="input-group-text">,00</span>
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
                    htmlFor="category_uuid"
                    className="form-label required"
                  >
                    Kategori :
                  </label>
                  <Select
                    name="category_uuids[]"
                    isMulti={true}
                    options={categories}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                    hideSelectedOptions={false}
                    isOptionSelected={(option, value) =>
                      value.find((v) => v.value === option.value)
                    }
                  />
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
                    <span className="input-group-text">jam</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-10">
              <label className="form-label mb-3">Tingkatan :</label>
              <div className="d-flex gap-10 align-items-center">
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="level"
                    value="1"
                    id="level-pemula"
                    defaultChecked={course?.level == 1}
                  />
                  <label className="form-check-label" htmlFor="level-pemula">
                    Pemula
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="level"
                    value="2"
                    id="level-mengengah"
                    defaultChecked={course?.level == 2}
                  />
                  <label className="form-check-label" htmlFor="level-mengengah">
                    Menengah
                  </label>
                </div>
                <div className="form-check form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="level"
                    value="3"
                    id="level-mahir"
                    defaultChecked={course?.level == 3}
                  />
                  <label className="form-check-label" htmlFor="level-mahir">
                    Mahir
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 mb-10">
            <label htmlFor="description" className="form-label required">
              Deskripsi :
            </label>
            <CKEditor
              editor={ClassicEditor} // Berasal dari CKEditor Custom Build
              config={editorConfig}
              data={course?.description}
              onReady={onEditorReady}
            />
          </div>
          <div className="col-12 multiple">
            <label htmlFor="description" className="form-label">
              Sneak Peek :
            </label>
            <FileUpload
              files={
                selected && course?.sneak_peeks?.length
                  ? uploadedSneakPeek
                  : sneakPeek
              }
              onupdatefiles={setSneakPeek}
              allowMultiple={true}
              labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
              acceptedFileTypes={["image/*"]}
            />
          </div>
          <div className="col-12 d-flex gap-4 justify-content-end">
            <button
              type="button"
              className="btn btn-dark btn-sm mt-8 d-block"
              onClick={() => onSubmit(null, false)}
            >
              Simpan sebagai Draft
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm mt-8 d-block"
            >
              <i className="las la-save"></i>
              Simpan dan Publish
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(Form);
