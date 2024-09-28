const User = require("../models/users.model");
const whatsAppConfig = require("../config/whatsapp.config.js");
const mytoken = whatsAppConfig.MYTOKEN;
const {
  sendLocationMessage,
  sendNotServicableMessage,
  sendServicableMessage,
  getUploadAttachmentUrl,
  sendMessageToAgent,
  sendAttachmentMessageToAgent,
} = require("../services/meta.services.js");
const { findMinShopDistance } = require("../services/distance.service.js");
const userRoles = require("../constants/role.constants.js");
const {
  insertRecord,
  checkRecordExists,
  updateRecord,
} = require("../models/utils/sqlFunction");
const { findCustomerAgent, insertOrder } = require("../models/order.model.js");
const { insertFile } = require("../models/file.model.js");
const MIN_DIST = whatsAppConfig.MIN_DIST;

const { getAddressFromLatLong } = require("../services/address.service.js");
const { json } = require("body-parser");
exports.webHookSetUp = (req, res) => {
  res.status(200).send("hello this is webhook setup");
};

exports.getMessage = (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.send(challange, 200);
    } else {
      res.status(403);
    }
  }
};

exports.senMessage = async (req, res) => {
  let body_param = req.body;
  if (body_param) {
    // if (body_param.object) {
    console.log("body = = =", body_param.entry[0]);
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      console.log(
        "message = = = = ",
        JSON.stringify(body_param.entry[0].changes)
      );
      if (
        body_param.entry[0].changes[0].value.messages[0].text &&
        body_param.entry[0].changes[0].value.messages[0].text.body &&
        body_param.entry[0].changes[0].value.messages[0].text.body.toLowerCase() ==
          "hi"
      ) {
        const userName =
          body_param.entry[0].changes[0].value?.contacts[0]?.profile?.name;
        const phoneNumberId =
          body_param.entry[0].changes[0].value.metadata.phone_number_id;
        const phoneNumber =
          body_param.entry[0].changes[0].value.messages[0].from;

        const user = new User({
          name: userName,
          phone_number: phoneNumber,
          role: userRoles.userRole.customer,
        });
        const userExist = await checkRecordExists(
          "users",
          "phone_number",
          phoneNumber
        );
        if (userExist === null)
          User.create(user, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Tutorial.",
              });
            console.log("name and phone number inserted in Hi message", data);
          });

        await sendLocationMessage(phoneNumberId, userName, phoneNumber);
      }

      if (
        body_param.entry[0].changes[0].value.messages[0].location &&
        body_param.entry[0].changes[0].value.messages[0].location["latitude"] &&
        body_param.entry[0].changes[0].value.messages[0].location["longitude"]
      ) {
        const phoneNumber =
          body_param.entry[0].changes[0].value.messages[0].from;
        const latitude =
          body_param.entry[0].changes[0].value.messages[0].location.latitude;
        const longitude =
          body_param.entry[0].changes[0].value.messages[0].location.longitude;
        const phoneNumberId =
          body_param.entry[0].changes[0].value.metadata.phone_number_id;

        User.findByPhoneNumber(phoneNumber, async (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          const customer = await checkRecordExists(
            "customers",
            "user_id",
            data?.id
          );
          // let shop_dist = null;
          // let shop_id = null;
          findMinShopDistance(latitude, longitude, async (err, result) => {
            if (err) {
              console.error("Error:", err.message);
            } else {
              const shop_dist = result?.minDist || null;
              const shop_id = result?.shopId || null;
              const address = await getAddressFromLatLong(latitude, longitude);
              // console.log("addr - - - ", data?.data?.display_name);
              if (customer === null) {
                const customerAdd = {
                  user_id: data?.id,
                  latitude,
                  longitude,
                  shop_dist,
                  shop_id,
                  address: address?.data?.display_name,
                };
                insertRecord("customers", customerAdd);
              } else {
                const customerUpdate = {
                  latitude,
                  longitude,
                  shop_dist,
                  shop_id,
                  address: address?.data?.display_name,
                };
                updateRecord("customers", customerUpdate, "id", customer?.id);
              }
              if (shop_dist > MIN_DIST) {
                await sendNotServicableMessage(phoneNumberId, phoneNumber);
              } else {
                console.log("shop dist = = = ", shop_dist);
                await sendServicableMessage(phoneNumberId, phoneNumber);
              }
            }
          });
        });
      }
      if (
        body_param.entry[0].changes[0].value.messages[0].image &&
        body_param.entry[0].changes[0].value.messages[0].image["id"]
      ) {
        const phoneNumber =
          body_param.entry[0].changes[0].value.messages[0].from;
        const phoneNumberId =
          body_param.entry[0].changes[0].value.metadata.phone_number_id;
        const imageId =
          body_param.entry[0].changes[0].value.messages[0].image["id"];
        await findCustomerAgent(phoneNumber, async (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          const customerId = data?.[0]?.id;
          const agentId = data?.[0]?.agent_id;
          const customerAddress = data?.[0]?.address;
          const customerName = data?.[0]?.name;
          const order = {
            customer_id: customerId,
            agent_id: agentId,
            status: "accept",
          };
          await insertOrder(order, async (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Tutorial.",
              });
            const file = {
              order_id: data?.id,
              created_at: new Date(),
              media_id: imageId,
            };
            await insertFile(file, async (err, data) => {
              if (err)
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the Tutorial.",
                });
            });
          });

          const agent = await checkRecordExists("agent", "id", agentId);
          const agentUser = await checkRecordExists(
            "users",
            "id",
            agent?.user_id
          );
          await sendMessageToAgent(
            phoneNumberId,
            agentUser?.phone_number,
            customerName,
            phoneNumber,
            customerAddress
          );
          await sendAttachmentMessageToAgent(
            phoneNumberId,
            agentUser?.phone_number,
            imageId
          );
        });
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
};
