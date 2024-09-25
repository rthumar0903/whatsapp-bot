const User = require("../models/users.model");
const body_parser = require("body-parser");
const axios = require("axios");
const whatsAppConfig = require("../config/whatsapp.config.js");
const token = whatsAppConfig.TOKEN;
const mytoken = whatsAppConfig.MYTOKEN;

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

exports.senMessage = (req, res) => {
  let body_param = req.body;
  console.log(
    "========================",
    body_param.entry[0].changes[0].value?.contacts[0].profile
  );
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;

      if (
        body_param.entry[0].changes[0].value.messages[0].text &&
        body_param.entry[0].changes[0].value.messages[0].text.body &&
        body_param.entry[0].changes[0].value.messages[0].text.body.toLowerCase() ==
          "hi"
      ) {
        axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v13.0/" +
            phon_no_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            type: "interactive",
            to: from,
            interactive: {
              type: "location_request_message",
              body: {
                text: `Select your location`,
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
      }

      if (
        body_param.entry[0].changes[0].value.messages[0].location &&
        body_param.entry[0].changes[0].value.messages[0].location["latitude"] &&
        body_param.entry[0].changes[0].value.messages[0].location["longitude"]
      ) {
        const phone_number =
          body_param.entry[0].changes[0].value.messages[0].from;
        const latitude =
          body_param.entry[0].changes[0].value.messages[0].location.latitude;
        const longitude =
          body_param.entry[0].changes[0].value.messages[0].location.longitude;
        console.log(
          "query values = = = = = = ",
          phone_number,
          latitude,
          longitude
        );
        const user = new User({
          name: "John",
          phone_number: phone_number,
          latitude: latitude,
          longitude: longitude,
        });

        User.create(user, (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the Tutorial.",
            });
          console.log("1 record inserted", data);
        });

        // const sql = `INSERT INTO users (name, phone_number,latitude,longitude) VALUES ('Raj',${phone_number},${latitude},${longitude})`;

        // con.query(sql, function (err, result) {
        //   if (err) throw err;
        //   console.log("1 record inserted", result);
        // });
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
};
