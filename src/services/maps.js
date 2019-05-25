import Geocode from "react-geocode";

const GOOGLE_GEOCODE_API_KEY = "AIzaSyDKHpmikOjilYKRH4fwZ-ePC2_kzBAmVEg";

Geocode.setApiKey(GOOGLE_GEOCODE_API_KEY);

export const geocodeAddress = (address, callback) => {
  Geocode.fromAddress(address).then(
    response => {
      callback(response.results[0].geometry.location);
    },
    error => {
      console.error(error);
    }
  );
};
