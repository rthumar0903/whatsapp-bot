const whatsAppConfig = require("../config/whatsapp.config.js");
const token = whatsAppConfig.TOKEN;
// const mytoken = whatsAppConfig.MYTOKEN;

const axios = require("axios");

exports.sendLocationMessage = async (phonNoId, userName, phoneNumber) => {
  try {
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
  } catch (ex) {
    console.log(ex);
  }
};

exports.sendNotServicableMessage = async (phonNoId, phoneNumber) => {
  try {
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
        type: "text",
        to: phoneNumber,
        text: {
          body: `Sorry, \nWe are not present in your area yet. And plan to be there soon. Please download our app for future`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (ex) {
    console.log(ex);
  }
};

exports.sendServicableMessage = async (phonNoId, phoneNumber, agentDetails) => {
  try {
    console.log("phonme", phoneNumber);
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
        type: "text",
        to: phoneNumber,
        text: {
          body: `Hi, We service your location. You can now order medicines and get delivered in 10 minutes. You can also visit our nearest shop to collect your medicines google_map_link. Upload your prescription or connect with agent.\n Agent Details\nAgent Name : ${agentDetails?.name}\nAgent Phone Number : ${agentDetails?.phone_number}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (ex) {
    console.log(ex);
  }
};

exports.getUploadAttachmentUrl = async (imageId) => {
  try {
    const response = await axios({
      method: "GET",
      url:
        "https://graph.facebook.com/v18.0/" +
        imageId +
        "?access_token=" +
        token,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response?.data?.url) return response?.data?.url;
    return null;
  } catch (ex) {
    console.log(ex);
  }
};

exports.sendMessageToAgent = async (
  phonNoId,
  phoneNumber,
  customerName,
  customerNumber,
  address
) => {
  try {
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
        type: "text",
        to: phoneNumber,

        text: {
          body: `Hi. You have a new request.\nCustomer Name : ${customerName}\nCustomer Number:${customerNumber}\nAddress:${address}`,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (ex) {
    console.log(ex);
  }
};

exports.sendAttachmentMessageToAgent = async (
  phonNoId,
  phoneNumber,
  imageId
) => {
  try {
    console.log(
      "88888888888888888888888888888888888888888888888888888",
      phonNoId,
      phoneNumber,
      imageId
    );
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
        type: "image",
        to: phoneNumber,
        image: {
          id: imageId,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (ex) {
    console.log(ex);
  }
};
