// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shopName: { type: String, required: true },
    businessCity: {type: String, required: true},
    gst: {type: String},
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
