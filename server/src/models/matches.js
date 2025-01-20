const LostPetReport = require("./LostPetReport");
const FoundPetReport = require("./FoundPetReport");

const calculateConfidence = (lostReport, foundReport) => {
  let score = 0;
  const totalCriteria = 6; // Total number of matching criteria

  if (lostReport.petGender === foundReport.petGender) score++;
  if (lostReport.petBreed === foundReport.petBreed) score++;
  if (lostReport.petColor === foundReport.petColor) score++;
  if (lostReport.petType === foundReport.petType) score++;
  if (lostReport.bodySize === foundReport.bodySize) score++;
  if (lostReport.location === foundReport.location) score++;

  return (score / totalCriteria) * 100; // Confidence as a percentage
};

const findMatches = async () => {
  try {
    const lostReports = await LostPetReport.find();
    const foundReports = await FoundPetReport.find();

    const matches = [];

    lostReports.forEach((lostReport) => {
      foundReports.forEach((foundReport) => {
        const confidence = calculateConfidence(lostReport, foundReport);

        if (confidence >= 80) {
          matches.push({
            lostPetName: lostReport.petName,
            lostPetPhoto: lostReport.photo, // Add photo for the lost pet
            foundPetGender: foundReport.petGender,
            foundPetBreed: foundReport.petBreed,
            foundPetColor: foundReport.petColor,
            foundPetLocation: foundReport.location,
            foundPetDescription: foundReport.description,
            foundPetPhoto: foundReport.photo, // Add photo for the found pet
            confidence,
            lostReportId: lostReport._id,
            foundReportId: foundReport._id,
          });
        }
      });
    });

    return matches;
  } catch (error) {
    console.error("Error finding matches:", error);
    throw error;
  }
};

module.exports = { findMatches };
