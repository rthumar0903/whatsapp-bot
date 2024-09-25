const whatsAppConfig = require("../config/whatsapp.config.js");
const token = whatsAppConfig.TOKEN;
// const mytoken = whatsAppConfig.MYTOKEN;

const axios = require("axios");

module.exports = sendLocationMessage = async (
  phonNoId,
  userName,
  phoneNumber
) => {
  axios({
    method: "POST",
    url:
      "https://graph.facebook.com/v13.0/" +
      phonNoId +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      type: "interactive",
      to: phoneNumber,
      interactive: {
        type: "location_request_message",
        body: {
          text: `Hi ${userName}, Thank you for reaching out. Please help us with your location to help us connect you to our nearest pharmacy partner`,
        },
        action: {
          name: "send_location",
        },
      },
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};
