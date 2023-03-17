import _ from "lodash";

export const removeEmpty = (obj) => {
  return Object.entries(obj)
    .filter(([k, v]) => !_.isEmpty(v))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
};

export const ucword = (text) => {
  return text.toLowerCase().replace(/\b[a-z]/g, (letter) => {
    return letter.toUpperCase();
  });
};

export const filesize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const result = (size / Math.pow(1024, i)).toFixed(2) * 1;
  return result + " " + ["B", "kB", "MB", "GB", "TB"][i];
};

export const monthID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agutus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const getMonth = (month) => {
  return [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agutus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ][month];
};

export const getDayName = (number) => {
  return ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    number
  ];
};

export const getDaysInMonthUTC = (month, year) => {
  const date = new Date(Date.UTC(year, month - 1, 1));
  const days = [];

  while (date.getUTCMonth() === month - 1) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return days;
};

export const getDaysInWeekUTC = (month, year) => {
  const date = new Date(Date.UTC(year, month - 1, 1));
  const days = [];

  while (date.getUTCMonth() === month - 1) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return days;
};

export const getVideoCover = (file) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = file;

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
};

export const getVideoCoverFromArray = (array) => {
  const data = [];

  (async () => {
    for (let i = 0; i < array.length; i++) {
      const cover = await getVideoCover(array[i]);
      data.push({ link: array[i], path: cover });
    }
  })();

  return data;
};

export const textToImage = (text, { height, width }, { x, y }) => {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  let ctx = canvas.getContext("2d");
  ctx.fillText(text, x, y);

  return canvas.toDataURL();
};

export const ccFormat = (value) => {
  let v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  let matches = v.match(/\d{4,16}/g);
  let match = (matches && matches[0]) || "";
  let parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  } else {
    return value;
  }
};

export const formatCurrency = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
};

export const snackCaseToString = (text) => {
  return text
    .split("_")
    .map((v) => ucword(v))
    .join(" ");
};

export const camelCaseToString = (text) => {
  if (text) {
    const result = text.replace(/([A-Z])/g, " $1");
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  }
  return "";
};

export const pagination = (options) => {
  return {
    total: options.total,
    rowsPerPageOptions: options.perPageOptions,
    count: options.total,
    page: options.page - 1,
    rowsPerPage: options.perPage,
    onPageChange: (event, pg) => {
      options.setPage(pg);
    },
    onRowsPerPageChange: (event) => {
      options.setPerPage(+event.target.value);
    },
    showFirstButton: true,
    showLastButton: true,
  };
};

export const types = [
  "OWNER",
  "ADMIN",
  "PM",
  "PCC",
  "PC",
  "QCC",
  "QC",
  "SUP",
  "SPV",
  "MANDOR",
  "STAFF",
  "WORKER",
];

export const workerWebTypes = [
  "OWNER",
  "ADMIN",
  "PM",
  "PCC",
  "QCC",
  "SUP",
];

export const workerMobileTypes = [
  "PC",
  "QC",
  "SPV",
  "MANDOR",
  "STAFF",
  "WORKER",
];

export const typesLabel = (type) => {
  const role = {
    OWNER: "Owner",
    ADMIN: "Admin",
    PM: "Project Manager",
    PCC: "Project Control Coordinator",
    PC: "Project Control",
    QS: "Quantity Surveyor ",
    QCC: "Quality Control Coordinator",
    QC: "Quality Control",
    SUP: "Superintendent Coordinator",
    SPV: "Supervisor",
    MANDOR: "Mandor",
    STAFF: "Staff",
    WORKER: "Pekerja",
  };
  return role[type] || role["WORKER"];
};

export const projectStatus = {
  DRAFT: "Draft",
  PROGRESS: "Progress",
  CANCELLED: "Batal",
  PENDING: "Tunda",
  DONE: "Selesi",
  REVIEW: "Pratinjau",
};

export const komStatus = {
  PLAN: "Plan",
  CANCEL: "Batal",
  DONE: "Selesai",
};

export const komStatusColor = (status) => {
  return (
    {
      PLAN: "info",
      CANCEL: "error",
      DONE: "success",
    }[status] || "default"
  );
};

export const komStatusLabel = (status) => {
  return komStatus[status] || "Plan";
};
