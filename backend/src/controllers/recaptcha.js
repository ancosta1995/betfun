// Require Dependencies
const axios = require("axios");
const config = require("../config");

// Declare useful variables
const GOOGLE_RECAPTCHA_API = "https://www.google.com/recaptcha/api/siteverify";

// Verify user's recaptcha response token
async function verifyRecaptchaResponse(response) {
  // Skip ReCAPTCHA verification in development environment only if explicitly set
  if (process.env.NODE_ENV === "development" && process.env.SKIP_RECAPTCHA === "true") {
    console.log("Skipping ReCAPTCHA verification in development mode");
    return true;
  }
  
  // Check if response is provided
  if (!response) {
    return false;
  }
  
  return new Promise(async (resolve, reject) => {
    try {
      // Use POST request with proper body instead of query parameters
      const apiResponse = await axios.post(
        GOOGLE_RECAPTCHA_API,
        `secret=${config.authentication.reCaptcha.secretKey}&response=${response}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      // Check if response was valid
      if (apiResponse.data.success) {
        resolve(true);
      } else {
        console.log("ReCAPTCHA verification failed:", apiResponse.data);
        resolve(false);
      }
    } catch (error) {
      console.error("ReCAPTCHA verification error:", error.message);
      reject(error);
    }
  });
}

// Export functions
module.exports = { verifyRecaptchaResponse };
