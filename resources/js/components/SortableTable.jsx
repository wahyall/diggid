import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";

// Table
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import axios from "@/libs/axios";

// DnD
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { If } from "react-haiku";

function SortableRow({ row }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging && "bg-light"}`}
    >
      <td className={`py-4 ${isDragging && "opacity-0"}`}>
        <i
          className="las la-braille fs-3 text-dark"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          {...attributes}
          {...listeners}
        ></i>
      </td>
      {row.getVisibleCells().map((cell) => (
        <td
          className={`py-4 ${isDragging && "opacity-0"}`}
          key={`cell.${cell.id}.${cell.row.original.uuid}`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

function StaticRow({ row }) {
  return (
    <>
      <td className="py-4">
        <i className="las la-braille fs-3"></i>
      </td>
      {row.getVisibleCells().map((cell) => (
        <td
          className={`py-4 ${
            cell.column.columnDef.id === "action" && "ms-auto"
          }`}
          key={`cell.${cell.id}.${cell.row.original.uuid}`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </>
  );
}

function SortableTable({ columns, url, id, onSorted, payload }) {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState();
  const { data, isFetching } = useQuery(
    [url],
    () => axios.post(url, { ...payload }).then((res) => res.data),
    {
      placeholderData: [],
    }
  );
  const rowItems = useMemo(() => data?.map(({ uuid }) => uuid), [data]);

  useEffect(() => {
    if (
      isFetching &&
      !document.querySelector("#" + id).querySelector(".blockui-overlay")
    )
      KTApp.block("#" + id);
    else KTApp.unblock("#" + id);
  }, [isFetching]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {})
  );

  const handleDragStart = useCallback((event) => setActiveId(event.active.id));

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      queryClient.setQueryData([url], (old) => {
        const oldIndex = old.findIndex((item) => item.uuid === active.id);
        const newIndex = old.findIndex((item) => item.uuid === over.id);

        const newData = arrayMove(old, oldIndex, newIndex);
        onSorted && onSorted(newData.map(({ uuid }) => uuid));
        return newData;
      });
    }

    setActiveId(null);
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRow = useMemo(() => {
    return table
      .getRowModel()
      .rows.find((row) => row.original.uuid === activeId);
  });

  return (
    <div id={id}>
      <div className="table-responsive">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <table className="table table-rounded table-row-bordered border gy-7 gs-7">
            <thead className="bg-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="fw-bolder fs-6 text-gray-800 border-bottom border-gray-200"
                  key={headerGroup.id}
                >
                  <th style={{ width: "50px" }}></th>
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
            <If isTrue={!!data.length}>
              <tbody>
                <SortableContext
                  items={rowItems}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <SortableRow key={row.original.uuid} row={row} />
                  ))}
                </SortableContext>
                <DragOverlay wrapperElement="tr" className="bg-white d-flex">
                  {activeId && <StaticRow row={selectedRow} />}
                </DragOverlay>
              </tbody>
            </If>
            <If isTrue={!data.length}>
              <tbody>
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    Data tidak ditemukan
                  </td>
                </tr>
              </tbody>
            </If>
          </table>
        </DndContext>
      </div>
    </div>
  );
}

export default memo(SortableTable);
