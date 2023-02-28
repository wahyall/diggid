import axios from "@/libs/axios";

const useDownloadExcel = ({
  swalMixin = {
    customClass: {
      confirmButton: "btn btn-success btn-sm",
      cancelButton: "btn btn-secondary btn-sm",
    },
    buttonsStyling: false,
  },
  onDownload = () => {},
  onSuccess = () => {},
} = {}) => {
  const mySwal = Swal.mixin(swalMixin);
  return {
    download: (url, method = "GET", data = {}) => {
      window.respon = {};
      return mySwal
        .fire({
          title: "Apakah Anda Yakin?",
          text: "Anda Akan Mendownlaod Report Berformat Excel, Mungkin Membutuhkan Waktu Beberapa Detik!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Download Sekarang!",
          showLoaderOnConfirm: true,
          preConfirm: function (login) {
            return axios({
              url,
              method,
              data,
              responseType: "arraybuffer",
            })
              .then((res) => {
                var headers = res.headers;
                var blob = new Blob([res.data], {
                  type: "application/vnd.ms-excel",
                });

                var link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = headers["content-disposition"]
                  .split('filename="')[1]
                  .split('"')[0];
                link.click();

                window.respon = { status: true, message: "Berhasil Download!" };
              })
              .catch((error) => {
                window.respon = JSON.parse(
                  String.fromCharCode.apply(null, new Uint8Array(error))
                );
              });
          },
        })
        .then(function (result) {
          if (result.isConfirmed) {
            if (window.respon.status) {
              Swal.fire("Berhasil!", "File Berhasil Di Download.", "success");
            } else {
              Swal.fire("Error!", window.respon.message, "error");
            }
          }
        });
    },
  };
};

export default useDownloadExcel;
