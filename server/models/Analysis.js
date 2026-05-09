const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    exercise: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    detectedIssues: [
      {
        name: String,
        severity: String,
        description: String,
      },
    ],

    recommendations: [String],

    videoUrls: [String],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Analysis",
  analysisSchema
);