const whatsAppConfig = require("../config/whatsapp.config.js");
const { cloudinary } = require("../config/cloudinary.config");
const token = whatsAppConfig.TOKEN;
const phonNoId = whatsAppConfig.PHONE_ID;
// const mytoken = whatsAppConfig.MYTOKEN;
const fs = require("fs");
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

// exports.getImage = async () => {
//   try {
//     const URL = `https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=1206148197308460&ext=1728491571&hash=ATv4stRKzExrOzC-El5jhnehMfrGKZ8NTVIU1vnLv5P34Q`;
//     axios({
//       method: "GET",
//       url: URL,

//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         Authorization: `Bearer ${token}`,
//       },
//       responseType: "stream", // Stream the image
//     })
//       .then(function (response) {
//         // const imageBlob = response.data;
//         // console.log(imageBlob);
//         response.data.pipe(fs.createWriteStream("image.jpg"));
//         // const imageObjectURL = URL.createObjectURL(imageBlob);
//         // console.log("img url", imageObjectURL);
//         // Set the image URL in the state
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   } catch (ex) {
//     console.log(ex);
//   }
// };
const getImageUrl = async (imageId) => {
  try {
    const URL = "https://graph.facebook.com/v18.0/" + imageId;
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.status === 200) return response?.data;
  } catch (ex) {
    console.log(ex);
  }
};
exports.getImage = async (imageId, res) => {
  try {
    const urlRes = await getImageUrl(imageId);
    const URL = urlRes?.url;
    const mediaMimeType = "image/jpeg";
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": mediaMimeType,
      },
      responseType: "arraybuffer", // This is important for binary data
    });

    if (mediaMimeType.startsWith("image/")) {
      const filename = "temp";
      file_extension = filename + "." + mediaMimeType.split("/")[1];
      typeoffile = mediaMimeType.split("/")[0];

      somedata = Buffer.from(response.data, "binary");
      await fs.writeFileSync(
        file_extension,
        Buffer.from(response.data, "binary")
      );
      // res.status(200).send();
      console.log(`Media saved to ${file_extension} successfully.`);

      const base64String = somedata.toString("base64");

      cloudinary.uploader.upload(
        `data:image/jpeg;base64,${base64String}`, // Adjust MIME type if needed
        { folder: "assets" }, // Optional: upload to a specific folder
        function (error, result) {
          if (error) {
            res.status(500);
          } else {
            return res(null, result?.url);
            // console.log("Upload Result:", result);
          }
        }
      );
    }
  } catch (ex) {
    console.log(ex);
  }
};
