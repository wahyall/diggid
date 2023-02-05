import React, { useState, useEffect, useMemo } from "react";

import axios from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";

import ReactApexChart from "react-apexcharts";
import Select from "react-select";
const filterOptions = [
  { value: "week", label: "Minggu Ini" },
  { value: "month", label: "Bulan Ini" },
  { value: "year", label: "Tahun Ini" },
];

export default function Index() {
  const [filter, setFilter] = useState("week");

  const { data = { courses: [], profit: [], timestamps: [] }, refetch } =
    useQuery(
      ["dashboard", "admin"],
      () => {
        KTApp.block("#dashboard");
        return axios
          .post("/admin/dashboard", { filter })
          .then((res) => res.data);
      },
      {
        onSuccess: () => {
          KTApp.unblock("#dashboard");
        },
      }
    );

  const chartOptions = useMemo(() => {
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
            if (filter === "year") {
              const month = months[new Date(val).getMonth()];
              const year = new Date(val).getFullYear();
              return `${month} ${year}`;
            } else {
              const date = new Date(val).getDate();
              const month = months[new Date(val).getMonth()];
              const year = new Date(val).getFullYear();
              return `${date} ${month} ${year}`;
            }
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

  const chartSeries = useMemo(() => {
    return [
      {
        name: "Kelas Terbeli",
        data: data.courses,
      },
      {
        name: "Pendapatan",
        data: data.courses,
      },
    ];
  }, [data]);

  useEffect(() => {
    refetch();
  }, [filter]);

  return (
    <section>
      <div className="card" id="dashboard">
        <div className="card-header">
          <div className="card-title w-100 justify-content-between">
            <h1>Dashboard</h1>
            <Select
              options={filterOptions}
              defaultValue={filterOptions[0]}
              isSearchable={false}
              className="fs-6"
              onChange={(e) => setFilter(e.value)}
            />
          </div>
        </div>
        <div className="card-body">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={300}
          />
        </div>
      </div>
    </section>
  );
}
