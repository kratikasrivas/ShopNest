const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
    public_id: String,
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);