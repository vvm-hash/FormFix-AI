const Analysis = require("../models/Analysis");
const uploadAnalysis = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "No videos uploaded",
      });
    }

    const uploadedFiles = files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));

    res.status(200).json({
      message: "Videos uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};
const saveAnalysis = async (req, res) => {
  try {
    const {
      exercise,
      riskScore,
      detectedIssues,
      recommendations,
      videoUrls,
    } = req.body;

    const analysis = await Analysis.create({
      exercise,
      riskScore,
      detectedIssues,
      recommendations,
      videoUrls,
    });

    res.status(201).json({
      message: "Analysis saved successfully",
      analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save analysis",
    });
  }
};
module.exports = {
  uploadAnalysis,
  saveAnalysis,
};