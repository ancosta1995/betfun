/**
 * Build versioning system to ensure latest
 * client version. Used to mitigate browser
 * caching issues.
 *
 * Author: Leevi Halme <leevi@bountyscripts.com> (https://leevihal.me)
 */

// Require Dependencies
const fs = require("fs");

console.log("Incrementing build number...");

// Check if src/metadata.json exists, if not use the root one
const metadataPath = fs.existsSync("src/metadata.json") ? "src/metadata.json" : "metadata.json";

// Read the metadata file
fs.readFile(metadataPath, (error, content) => {
  // If error, throw it
  if (error) throw error;

  // Read and parse metadata from file contents
  const metadata = JSON.parse(content);

  // Get fields from parsed data
  const version = metadata.build;
  const appName = version.split("@")[0];
  const buildNumber = version.split("@")[1];
  const newBuildNumber = parseInt(buildNumber) + 1;

  // Increment build number
  const newBuildId = appName + "@" + newBuildNumber;

  // Apply changes
  metadata.build = newBuildId;

  // Re-write the file to both locations
  fs.writeFile(metadataPath, JSON.stringify(metadata), error => {
    // If error, throw it
    if (error) throw error;
    console.log("Current build id: " + newBuildId);
    
    // Also create/update src/metadata.json if it doesn't exist
    if (metadataPath === "metadata.json") {
      fs.mkdirSync("src", { recursive: true });
      fs.writeFile("src/metadata.json", JSON.stringify(metadata), () => {});
    }
  });
});
