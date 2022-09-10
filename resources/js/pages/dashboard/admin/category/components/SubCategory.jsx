import React, { memo, useCallback, useEffect } from "react";
import axios from "@/libs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { For } from "react-haiku";
import ImageUpload from "@/components/ImageUpload";
import { useForm, useFieldArray, Controller } from "react-hook-form";

function SubCategory({ selected, close }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub",
    shouldUnregister: true,
  });

  const { data: category } = useQuery(
    [`/api/category/${selected}/detail`],
    () => {
      KTApp.block("#form-subcategory");
      return axios
        .get(`/api/category/${selected}/detail`)
        .then((res) => res.data);
    },
    {
      onSettled: () => KTApp.unblock("#form-subcategory"),
      onSuccess: (data) => {
        data.subs.forEach((sub) => {
          append(sub);
        });
      },
      cacheTime: 0,
      placeholderData: [],
      enabled: !!selected,
    }
  );

  const { mutate: submit } = useMutation(
    (data) => axios.post(`/api/category/${selected}/sub/store`, data),
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

  const onSubmit = (data) => {
    KTApp.block("#form-subcategory");
    const formData = new FormData();
    data.sub.forEach((item) => {
      formData.append("names[]", item.name);
      formData.append("icons[]", item.icon[0].file);
    });
    submit(formData);
  };

  return (
    <form
      className="card mb-12"
      id="form-subcategory"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="card-header">
        <div className="card-title w-100">
          <h3>Sub Kategori: {category?.name}</h3>
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
        <For
          each={fields}
          render={(field, index) => (
            <div className="row mb-8" key={field.uuid}>
              <div className="col-2">
                <label htmlFor="name" className="form-label">
                  Icon :
                </label>
                <Controller
                  control={control}
                  name={`sub.${index}.icon`}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <ImageUpload
                        files={value ? `/${value}` : []}
                        onupdatefiles={onChange}
                        allowMultiple={false}
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        required
                        key={`sub.${field.id}.icon`}
                      />
                    );
                  }}
                />
              </div>
              <div className="col-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Nama :
                  </label>
                  <input
                    type="text"
                    name={`${index}.name`}
                    id="name"
                    placeholder="Nama Kategori"
                    className="form-control required"
                    required
                    autoComplete="off"
                    {...register(`sub.${index}.name`)}
                    key={`sub.${field.id}.name`}
                  />
                </div>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-sm btn-icon btn-light-danger mt-10"
                  onClick={() => remove(index)}
                >
                  <i className="las la-times-circle fs-2"></i>
                </button>
              </div>
            </div>
          )}
        />
        <div className="row">
          <div className="col-12">
            <button
              type="button"
              className="btn btn-light-success btn-sm mt-8"
              onClick={() => append({ name: "", icon: "", uuid: Date.now() })}
            >
              <i className="las la-plus fs-3"></i>
              Tambah
            </button>
          </div>
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-sm ms-auto mt-8 d-block"
            >
              <i className="las la-save fs-3"></i>
              Simpan
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default memo(SubCategory);
