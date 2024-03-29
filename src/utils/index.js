import _ from "lodash";
import moment from "moment";

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

export const listYear = (value = 2022) => {
  const year = moment().year();
  const years = [];
  for (let i = value; i <= year; i++) {
    years.push(i);
  }

  return years;
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
      options.setPage(pg + 1);
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

export const workerWebTypes = ["OWNER", "ADMIN", "PM", "PCC", "QCC", "SUP"];

export const workerMobileTypes = [
  "PC",
  "QC",
  "SPV",
  "MANDOR",
  "STAFF",
  "WORKER",
];

export const boqTypes = ["PIPING", "CIVIL", "ELECTRICAL"];

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
  // DRAFT: "DRAFT",
  // PENDING: "PENDING",
  // DONE: "COMPLETE",
  // CANCELLED: "CANCEL",
  WAP: "WAP",
  SPK: "SPK",
  KOM: "KOM",
  SITE_KOM: "SITE-KOM",
  PROGRESS: "IN PROGRESS",
  RFD: "RFD",
  POP: "POP",
  DONE: "MAC/COMPLETE",
  CLOSE: "CLOSE",
  CANCELLED: "CANCEL",
};

export const projectLabel = (status) => {
  return projectStatus[status] || "Draft";
};

export const komStatus = {
  PLAN: "Plan",
  CANCEL: "Batal",
  DONE: "Selesai",
};

export const overtimeStatus = {
  PENDING: "Menuggu",
  REJECT: "Ditolak",
  CONFIRM: "Setuju",
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

export const overtimeStatusLabel = (status) => {
  return overtimeStatus[status] || "Menuggu";
};

export const settingCode = {
  START_TIME: "START_TIME",
  CLOSE_TIME: "CLOSE_TIME",
  OVERTIME_PRICE_PER_MINUTE: "OVERTIME_PRICE_PER_MINUTE",
  LATETIME_PRICE_PER_MINUTE: "LATETIME_PRICE_PER_MINUTE",
};

export const toHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${padToTwoDigits(hours)} Jam ${padToTwoDigits(minutes)} Menit`;
};

function padToTwoDigits(num) {
  return num.toString().padStart(2, "0");
}
