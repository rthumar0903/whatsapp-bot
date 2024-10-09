const whatsAppConfig = require("../config/whatsapp.config.js");
const token = whatsAppConfig.TOKEN;
const phonNoId = whatsAppConfig.PHONE_ID;
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

exports.sendNotServicableMessage = async (text, phonNoId, phoneNumber) => {
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
          body: text,
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
        type: "interactive",
        to: phoneNumber,
        interactive: {
          type: "button",
          body: {
            text: `Hi, We service your location. You can now order medicines and get delivered in 10 minutes. You can also visit our nearest shop to collect your medicines google_map_link. Upload your prescription or connect with agent.\n Agent Details\nAgent Name : ${agentDetails?.name}\nAgent Phone Number : ${agentDetails?.phone_number}`,
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "reply_for_option_1", // Reply message ID
                  title: "Connect with Agent", // Button label
                },
              },
            ],
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

exports.sendOtp = async (otp, phoneNumber) => {
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
          body: `Your verification otp is ${otp}`,
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

exports.getImage = async () => {
  try {
    const URL = `https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=447919264345274&ext=1728406413&hash=ATuQdVWXcUCogy7NZ5g6POdsGoiusbBrBWw3M2ACaO0KKg`;
    axios({
      method: "GET",
      url: URL,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const imageBlob = response.data;
        const imageObjectURL = URL.createObjectURL(imageBlob);
        console.log("img url", imageObjectURL);
        // Set the image URL in the state
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (ex) {
    console.log(ex);
  }
};
