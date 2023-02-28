import React, { useState, useEffect, useMemo } from "react";

import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import useDownloadExcel from "@/hooks/useDownloadExcel";

import ReactApexChart from "react-apexcharts";
import Select from "react-select";
const filterOptions = [
  { value: "01", label: "Januari" },
  { value: "02", label: "Februari" },
  { value: "03", label: "Maret" },
  { value: "04", label: "April" },
  { value: "05", label: "Mei" },
  { value: "06", label: "Juni" },
  { value: "07", label: "Juli" },
  { value: "08", label: "Agustus" },
  { value: "09", label: "September" },
  { value: "10", label: "Oktober" },
  { value: "11", label: "November" },
  { value: "12", label: "Desember" },
];

export default function Index() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data = { courses: [], profit: [], timestamps: [] }, refetch } =
    useQuery(
      ["dashboard", "admin"],
      () => {
        KTApp.block("#dashboard");
        return axios
          .post("/admin/dashboard", { month })
          .then((res) => res.data);
      },
      {
        onSuccess: () => {
          KTApp.unblock("#dashboard");
        },
      }
    );

  const chartCourseOptions = useMemo(() => {
    var height = 300;
    var labelColor = "#A1A5B7";
    var borderColor = "#E4E6EF";
    var baseColor = "#28BB5E";
    var lightColor = "#28BB5E";

    return {
      chart: {
        fontFamily: "inherit",
        type: "area",
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        type: "numeric",
        categories: data.timestamps,
        crosshairs: {
          position: "front",
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: "12px",
          },
        },
        labels: {
          formatter: function (val) {
            const months = [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ];
            const date = new Date(val).getDate();
            const month = months[new Date(val).getMonth()];
            const year = new Date(val).getFullYear();
            return `${date} ${month} ${year}`;
          },
        },
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
          formatter: function (val) {
            // return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return val.toFixed(0);
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (val, series) {
            if (series.seriesIndex === 0) return `${val} kelas`;
            else
              return (
                "Rp " +
                Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(data.profit[series.dataPointIndex])
              );
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColor: baseColor,
        strokeWidth: 3,
      },
    };
  }, [data]);

  const chartProfitOptions = useMemo(() => {
    var height = 300;
    var labelColor = "#A1A5B7";
    var borderColor = "#E4E6EF";
    var baseColor = "#28BB5E";
    var lightColor = "#28BB5E";

    return {
      chart: {
        fontFamily: "inherit",
        type: "area",
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      stroke: {
        curve: "smooth",
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        type: "numeric",
        categories: data.timestamps,
        crosshairs: {
          position: "front",
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: "12px",
          },
        },
        labels: {
          formatter: function (val) {
            const months = [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ];
            const date = new Date(val).getDate();
            const month = months[new Date(val).getMonth()];
            const year = new Date(val).getFullYear();
            return `${date} ${month} ${year}`;
          },
        },
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
          formatter: function (val) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        hover: {
          filter: {
            type: "none",
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: function (val, series) {
            return (
              "Rp " +
              Intl.NumberFormat("id-ID", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(data.profit[series.dataPointIndex])
            );
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColor: baseColor,
        strokeWidth: 3,
      },
    };
  }, [data]);

  const chartCourseSeries = useMemo(() => {
    return [
      {
        name: "Kelas Terbeli",
        data: data.courses,
      },
    ];
  }, [data]);

  const chartProfitSeries = useMemo(() => {
    return [
      {
        name: "Pendapatan Penjualan",
        data: data.profit,
      },
    ];
  }, [data]);

  useEffect(() => {
    refetch();
  }, [month]);

  const { download: downloadExcel } = useDownloadExcel();

  return (
    <section>
      <div className="card" id="dashboard">
        <div className="card-header">
          <div className="card-title w-100 justify-content-between">
            <h1>Dashboard</h1>
            <div className="d-flex gap-4">
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() =>
                  downloadExcel("/admin/dashboard/laporan", "POST", { month })
                }
              >
                <i className="fa fa-file-excel"></i>
                Cetak Laporan
              </button>
              <Select
                options={filterOptions}
                defaultValue={filterOptions[month - 1]}
                isSearchable={false}
                className="fs-6"
                onChange={(e) => setMonth(e.value)}
              />
            </div>
          </div>
        </div>
        <div className="card-body">
          <h6>Kelas yang Terbeli</h6>
          <ReactApexChart
            options={chartCourseOptions}
            series={chartCourseSeries}
            type="area"
            height={300}
          />
        </div>
        <div className="card-body">
          <h6>Pendapatan Penjualan</h6>
          <ReactApexChart
            options={chartProfitOptions}
            series={chartProfitSeries}
            type="area"
            height={300}
          />
        </div>
      </div>
    </section>
  );
}
