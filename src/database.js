const mongoose = require("mongoose");
const fs = require("fs");

class Database {
  //
  constructor() {
    //
    this.employeeSchema = new mongoose.Schema({
      name: String,
      email: String,
      profile_picture: String,
      created_at: Date,
      modified_at: Date,
      status: {
        type: String,
        enum: ["Active", "Deleted"],
        default: "Active",
      },
    });

    this.employeeSchema.options.toJSON = {
      transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    };

    this.employeeSchema.statics.profilePictureFromReq = (req) => {
      if (req.file) {
        return `data:${req.file.mimetype};base64,${fs.readFileSync(req.file.path, { encoding: "base64" })}`;
      } else {
        return undefined;
      }
    };

    this.Employee = mongoose.model("Employee", this.employeeSchema);
  }

  connection() {
    return new Promise((resolve, reject) => {
      mongoose.connect(`mongodb://root:${encodeURIComponent("#some#2022#db#pw#123")}@mongo:27017/admin`).then(() => resolve(this)).catch((err) => reject(err));
    });
  }
}

module.exports = new Database();
