import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "throttle-debounce";
import GoogleMap from "google-map-react";
import { find, isEmpty, reject } from "lodash";

import "./App.css";
import pinIcon from "./pin-red.svg";
import fetchLocations from "./services/benu";
import { geocodeAddress } from "./services/maps";

const GOOGLE_MAPS_API_KEY = "AIzaSyDKHpmikOjilYKRH4fwZ-ePC2_kzBAmVEg";

const mapStyles = {
  width: "100%",
  height: "100%"
};
const Marker = ({ location, onMarkerClick }) => {
  return (
    <div className="map-pin" onClick={() => onMarkerClick(location)}>
      <img src={pinIcon} alt="Pin" />
    </div>
  );
};

const mapOptions = maps => ({
  zoomControlOptions: {
    position: maps.ControlPosition.BOTTOM_RIGHT,
    style: maps.ZoomControlStyle.SMALL
  },
  mapTypeControl: false
});
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      locations: [],
      lastLocation: undefined
    };
  }

  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
      100,
      this.onSuggestionsFetchRequested
    );
  }

  renderSuggestion = suggestion => {
    return (
      <span>
        {suggestion.zipCode} {suggestion.city}
      </span>
    );
  };

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  onMarkerClick = location => {
    debugger;
    if (
      window.confirm(
        "Do you wish to remove " + location.city + " from the map?"
      )
    ) {
      this.setState({
        locations: reject(this.state.locations, location)
      });
    }
  };

  onSuggestionsFetchRequested = ({ value }) =>
    fetchLocations(value, data => {
      this.setState({ suggestions: data.filter(value => value.available) });
    });

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  onSuggestionSelected = (event, data) => {
    const { suggestion } = data;
    const { locations } = this.state;
    geocodeAddress(
      `${suggestion.city}, ${suggestion.province}, ${suggestion.zipCode}`,
      ({ lat, lng }) => {
        const locationSelected = { lat, lng, city: suggestion.city };
        this.setState({ lastLocation: locationSelected });
        if (!find(locations, { lat, lng, city: suggestion.city })) {
          this.setState({
            locations: [...locations, locationSelected]
          });
        }
      }
    );
  };

  render() {
    const { value, suggestions, lastLocation, locations } = this.state;
    const inputProps = {
      placeholder: "Type the location",
      value,
      onChange: this.onChange
    };

    return (
      <div className="App">
        <div className="location-monitor-header">
          <h1 className="location-monitor-title">Live Location Monitor</h1>
          <span className="location-monitor-subtitle">
            Search for a location and track it on the map!
          </span>

          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={suggestion => suggestion.city}
            renderSuggestion={this.renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            inputProps={inputProps}
          />
        </div>

        <GoogleMap
          style={mapStyles}
          options={mapOptions}
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          center={lastLocation || { lat: 48, lng: 14 }}
          zoom={isEmpty(locations) ? 5 : 10}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              lat={location.lat}
              lng={location.lng}
              location={location}
              onMarkerClick={this.onMarkerClick}
            />
          ))}
        </GoogleMap>
      </div>
    );
  }
}

export default App;
