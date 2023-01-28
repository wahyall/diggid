import React, { memo } from "react";

import { Show, For } from "react-haiku";

import { useQuery } from "@tanstack/react-query";
import axios from "@/libs/axios";
import { asset, currency } from "@/libs/utils";

const Detail = memo(({ selected, close }) => {
  const { data: transaction = { courses: [] } } = useQuery(
    ["admin", "transaction", selected],
    () => axios.get(`/admin/transaction/${selected}`).then((res) => res.data)
  );

  return (
    <section className="card mb-12">
      <div className="card-header">
        <div className="card-title w-100">
          <div>
            <div className="fs-6">{transaction.date}</div>
            <h3>Transaksi oleh User: {transaction.user?.name}</h3>
          </div>
          <div className="d-flex ms-auto gap-4">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={close}
            >
              <i className="las la-file-pdf"></i>
              Report
            </button>
            <button
              type="button"
              className="btn btn-light-danger btn-sm"
              onClick={close}
            >
              <i className="las la-times-circle"></i>
              Kembali
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="row">
              <div className="col-3">
                <img
                  src={transaction.user?.photo_url}
                  alt={transaction.user?.name}
                  className="img-fluid"
                />
              </div>
              <div className="col-9">
                <h6 className="mb-4">User</h6>
                <h1 className="fw-boldest mb-0">{transaction.user?.name}</h1>
                <div className="fs-4">{transaction.user?.email}</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="mb-4">
              <span className="me-4">Pembayaran</span>
              <Show>
                <Show.When isTrue={transaction.status === "pending"}>
                  <span className="badge badge-warning">
                    {transaction.status}
                  </span>
                </Show.When>
                <Show.When isTrue={transaction.status === "success"}>
                  <span className="badge badge-success">
                    {transaction.status}
                  </span>
                </Show.When>
                <Show.When isTrue={transaction.status === "failed"}>
                  <span className="badge badge-danger">
                    {transaction.status}
                  </span>
                </Show.When>
              </Show>
            </h6>
            <h1 className="fw-boldest">{currency(transaction.amount)}</h1>
          </div>
          <div className="col-md-4">
            <h6 className="mb-4">Metode Pembayaran</h6>
            <img
              src={asset(transaction.payment_method?.logo)}
              alt={transaction.payment_method?.name}
              className="img-fluid"
            />
          </div>
        </div>
        <div className="mt-12">
          <h6 className="mb-4">Kelas yang dibeli:</h6>
          <div className="table-responsive">
            <table className="table table-rounded gy-7 gs-7">
              <thead>
                <tr className="fw-bolder fs-6 text-gray-800 border-bottom border-gray-200">
                  <th className="py-4" style={{ width: "25px" }}>
                    #
                  </th>
                  <th className="py-4">Kelas</th>
                  <th className="py-4 text-end" style={{ width: "200px" }}>
                    Harga
                  </th>
                </tr>
              </thead>
              <tbody>
                <For
                  each={transaction.courses}
                  render={({ course }, i) => (
                    <tr>
                      <td className="py-4">{i + 1}</td>
                      <td className="py-4">
                        <div className="d-flex">
                          <img
                            src={asset(course.thumbnail)}
                            alt={course.name}
                            className="img-thumbnail"
                            style={{
                              objectFit: "cover",
                              width: "160px",
                              height: "90px",
                            }}
                          />
                          <div>
                            <span className="text-gray-800 fs-4 ms-4">
                              {course.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-end">
                        {currency(course.price)}
                      </td>
                    </tr>
                  )}
                />
                <tr>
                  <td colSpan={2}>
                    <h3 className="fw-bolder text-end">Total</h3>
                  </td>
                  <td>
                    <h3 className="fw-bolder text-end">
                      {currency(transaction.amount)}
                    </h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Detail;
