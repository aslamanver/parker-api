const express = require("express");
const fs = require("fs");
const moment = require("moment-timezone");
const multer = require("multer");
const database = require("./database");

const app = express();
const upload = multer({ dest: "./uploads" });
const getEuropeTime = () => moment().tz("Europe/London");

const renderProfilePicture = function renderProfilePicture(profilePicture, res) {
  //
  const mimetype = profilePicture.split(";")[0].replace("data:", "");
  const base64 = profilePicture.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  res.writeHead(200, {
    "Content-Type": mimetype,
    "Content-Length": buffer.length,
  });

  return res.end(buffer);
};

app.use((req, res, next) => {
  // TODO: Request params validations for middleware
  if (req.headers["authorization"]) {
    const apiKey = req.headers["authorization"].substring("Bearer ".length);
    // TODO: Encryption
    if (apiKey === "superSecretApiKey") {
      return next();
    }
  }
  // Unauthorized error
  res.sendStatus(401);
});

// Connect to the MongoDB database from Docker
database.connection().then((_) => {
  //
  console.log("Database is connected.");

  app.post("/employees/new", upload.single("profile_picture"), async (req, res) => {
    //
    // TODO: Validation
    try {
      const employee = new database.Employee({
        name: req.body.name,
        email: req.body.email,
        created_at: getEuropeTime(),
        status: "Active",
        profile_picture: database.Employee.profilePictureFromReq(req),
      });

      if (employee.profile_picture) fs.unlinkSync(req.file.path);
      await employee.save();

      res.send({ id: employee.id });
    } catch (err) {
      res.sendStatus(400);
    }
  });

  app.post("/employees/:id", upload.single("profile_picture"), async (req, res) => {
    // TODO: Validation
    const employee = await database.Employee.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
      status: req.body.status,
      modified_at: getEuropeTime(),
      profile_picture: database.Employee.profilePictureFromReq(req),
    }, { new: true });

    employee.profile_picture = undefined;

    res.send(employee);
  });

  app.get("/employees/:id", async (req, res) => {
    //
    try {
      //
      const employee = await database.Employee.findById(req.params.id, { profile_picture: req.query.profile_picture != undefined ? 1 : 0 });

      if (!employee) throw new Error();

      if (req.query.profile_picture != undefined) {
        //
        return renderProfilePicture(employee.profile_picture, res);
      }

      res.send(employee);
      //
    } catch (e) {
      res.sendStatus(404);
    }
  });

  app.get("/employees", async (req, res) => {
    //
    try {
      res.send(await database.Employee.find({}, { profile_picture: 0 }) || []);
    } catch (err) {
      return res.sendStatus(404);
    }
  });

  app.listen(3000, () => {
    console.log("Parker app listening on port 3000");
  });
  //
}).catch((err) => console.log("Database connection error: " + err));
