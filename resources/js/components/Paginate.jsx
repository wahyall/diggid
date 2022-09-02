import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import axios from "@/libs/axios";
import { useDebounce, For, If } from "react-haiku";

const perOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
];

function Paginate({ columns, url, id }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [per, setPer] = useState(10);

  const { data, isFetching, refetch } = useQuery(
    [url],
    () =>
      axios
        .post(url, { search: debouncedSearch, page, per })
        .then((res) => res.data),
    {
      placeholderData: { data: [] },
    }
  );

  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    KTApp.unblock("#" + id);
    refetch();
  }, [debouncedSearch, per, page]);

  useEffect(() => {
    if (
      isFetching &&
      !document.querySelector("#" + id).querySelector(".blockui-overlay")
    )
      KTApp.block("#" + id);
    else KTApp.unblock("#" + id);
  }, [isFetching]);

  useEffect(() => {
    if (!document.querySelector("#" + id).querySelector(".blockui-overlay"))
      KTApp.block("#" + id);
  }, [search]);

  const pagination = useMemo(() => {
    let limit = data.last_page <= page + 1 ? 5 : 2;
    return Array.from({ length: data.last_page }, (_, i) => i + 1).filter(
      (i) =>
        i >= (page < 3 ? 3 : page) - limit && i <= (page < 3 ? 3 : page) + limit
    );
  }, [data.current_page]);

  return (
    <div id={id}>
      <div className="d-flex justify-content-between gap-2 flex-wrap mb-4">
        <div className="d-flex gap-4 align-items-center">
          <label htmlFor="limit" className="form-label">
            Tampilkan
          </label>
          <Select
            options={perOptions}
            value={perOptions.filter((opt) => opt.value === per)}
            onChange={(ev) => setPer(ev.value)}
          />
        </div>
        <form>
          <input
            type="search"
            className="form-control"
            placeholder="Cari ..."
            value={search}
            onInput={(ev) => setSearch(ev.target.value)}
          />
        </form>
      </div>
      <div className="table-responsive">
        <table className="table table-rounded table-striped border gy-7 gs-7">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="fw-bolder fs-6 text-gray-800 border-bottom border-gray-200"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    className="py-4"
                    key={header.id}
                    style={{ ...header.column.columnDef.style }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <If isTrue={!!data.data.length}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="py-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </If>
            <If isTrue={!data.data.length}>
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  Data tidak ditemukan
                </td>
              </tr>
            </If>
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mt-2 mt-md-0 flex-wrap gap-2">
        <div className="text-gray-700 fs-7">
          Menampilkan {data.from} sampai {data.to} dari {data.total} hasil
        </div>
        <ul className="pagination">
          <li className="page-item previous disabled">
            <span
              onClick={useCallback(
                () => setPage(data.current_page + 1),
                [data.current_page]
              )}
              className="page-link"
            >
              <i className="previous"></i>
            </span>
          </li>
          <For
            each={pagination}
            render={(item) => (
              <li
                onClick={useCallback(() => setPage(item), [page])}
                className={`page-item ${item === page && "active"}`}
                key={item}
              >
                <span className="page-link cursor-pointer">{item}</span>
              </li>
            )}
          />
          <li className="page-item next">
            <span
              onClick={useCallback(
                () => setPage(data.current_page + 1),
                [data.current_page]
              )}
              className="page-link cursor-pointer"
            >
              <i className="next"></i>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default memo(Paginate);
