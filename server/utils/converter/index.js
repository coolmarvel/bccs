const decimalToHex = (number) => {
  return "0x" + number.toString(16);
};

const hexToDecimal = (hex) => {
  return parseInt(hex, 16);
};

function decodeBuffer(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

function unixToDate(unixtime) {
  const date = new Date(unixtime * 1000);
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  const hour = "0" + date.getHours();
  const minute = "0" + date.getMinutes();
  const second = "0" + date.getSeconds();

  return (
    year +
    "-" +
    month.substr(-2) +
    "-" +
    day.substr(-2) +
    " " +
    hour.substr(-2) +
    ":" +
    minute.substr(-2) +
    ":" +
    second.substr(-2)
  );
}

module.exports = {
  unixToDate,
  hexToDecimal,
  decimalToHex,
  decodeBuffer,
};
