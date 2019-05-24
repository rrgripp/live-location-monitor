import Geocode from "react-geocode";

const GOOGLE_GEOCODE_API_KEY = "AIzaSyDKHpmikOjilYKRH4fwZ-ePC2_kzBAmVEg";

Geocode.setApiKey(GOOGLE_GEOCODE_API_KEY);

export const geocodeAddress = (address, callback) => {
  debugger;
  Geocode.fromAddress(address).then(
    response => {
      debugger;
      callback(response.results[0].geometry.location);
    },
    error => {
      console.error(error);
    }
  );
};
