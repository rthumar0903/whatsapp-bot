const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(process.env.PORT, () => {
  console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
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
});

app.post("/webhook", (req, res) => {
  //i want some

  let body_param = req.body;

  // console.log(JSON.stringify(body_param, null, 2));
  console.log("start  = = = = = = ", new Date().toISOString());
  console.log(
    "message = = = = = = ",
    body_param.entry[0].changes[0].value.messages
  );
  console.log("end = = = = = = ", new Date().toISOString());
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
                text: "Select your location",
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
        console.log(body_param.entry[0].changes[0].value.messages[0]);
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).send("hello this is webhook setup");
});

// [
//   {
//     context: {
//       from: "15550988175",
//       id: "wamid.HBgMOTE5Mjc3MjUwNzE2FQIAERgSMEJEOTVDOUM3NEQ4Mjk0RDg0AA==",
//     },
//     from: "919277250716",
//     id: "wamid.HBgMOTE5Mjc3MjUwNzE2FQIAEhggQTkzQzVDRDRDQTZCQ0U1MTNCQzVCNEE1MjBFMjZDNDgA",
//     timestamp: "1727198314",
//     location: { latitude: 23.0122168, longitude: 72.5318272 },
//     type: "location",
//   },
// ]
