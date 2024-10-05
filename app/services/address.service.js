const { MAP_API_KEY } = require("../config/location.config.js");
const axios = require("axios");

exports.getAddressFromLatLong = async (latitude, longitude) => {
  try {
    const response = axios({
      method: "POST",
      url:
        `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=` +
        MAP_API_KEY,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

exports.getLatLong = async (address) => {
  try {
    const response = axios({
      method: "POST",
      url: `https://geocode.maps.co/search?q=${address}&api_key=` + MAP_API_KEY,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (ex) {
    console.log(ex);
  }
};
