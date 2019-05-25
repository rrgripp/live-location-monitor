import React from "react";
import GoogleMap from "google-map-react";
import { isEmpty } from "lodash";

import pinIcon from "../pin-red.svg";
const GOOGLE_MAPS_API_KEY = "AIzaSyDKHpmikOjilYKRH4fwZ-ePC2_kzBAmVEg";

const mapStyles = {
  width: "100%",
  height: "100%"
};

const mapOptions = maps => ({
  zoomControlOptions: {
    position: maps.ControlPosition.BOTTOM_RIGHT,
    style: maps.ZoomControlStyle.SMALL
  },
  mapTypeControl: false
});

const Marker = ({ location, onMarkerClick }) => (
  <div className="map-pin" onClick={() => onMarkerClick(location)}>
    <img src={pinIcon} alt="Pin" />
  </div>
);

const defaultCenter = { lat: 48, lng: 14 };
const zoomedIn = 10;
const zoomedOut = 5;

const Map = ({ locations, center = defaultCenter, onMarkerClick }) => (
  <GoogleMap
    style={mapStyles}
    options={mapOptions}
    bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
    center={center}
    zoom={isEmpty(locations) ? zoomedOut : zoomedIn}
  >
    {locations.map((location, index) => (
      <Marker
        key={index}
        lat={location.lat}
        lng={location.lng}
        location={location}
        onMarkerClick={onMarkerClick}
      />
    ))}
  </GoogleMap>
);

export default Map;
