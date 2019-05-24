import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "throttle-debounce";
import GoogleMap from "google-map-react";

import "./App.css";
import fetchLocations from "./services/benu";
import { geocodeAddress } from "./services/maps";


const GOOGLE_MAPS_API_KEY = "AIzaSyDKHpmikOjilYKRH4fwZ-ePC2_kzBAmVEg";

const mapStyles = {
  width: "100%",
  height: "100%"
};
const AnyReactComponent = ({ text }) => <div className="map-pin">{text}</div>;

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
      locations: []
    };
  }

  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
      500,
      this.onSuggestionsFetchRequested
    );
  }

  getSuggestionValue = suggestion => {
    geocodeAddress(
      `${suggestion.city}, ${suggestion.province}, ${suggestion.zipCode}`,
      ({ lat, lng }) => {
        debugger;
        this.setState({
          locations: [
            ...this.state.locations,
            { lat, lng, city: suggestion.city }
          ]
        });
      }
    );
    debugger;
    return suggestion.city;
  };

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

  onSuggestionsFetchRequested = ({ value }) =>
    fetchLocations(value, data => {
      this.setState({ suggestions: data.filter(value => value.available) });
    });

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const { value, suggestions, locations } = this.state;
    const inputProps = {
      placeholder: "Type the location",
      value,
      onChange: this.onChange
    };

    return (
      <div className="App">
        <GoogleMap
          style={mapStyles}
          options={mapOptions}
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          center={locations.reduce(
            (sum, current) =>
              (sum = {
                lat: sum.lat + current.lat / locations.length,
                lng: sum.lng + current.lng / locations.length
              }),
            { lat: 0, lng: 0 }
          )}
          zoom={10}
        >
          {locations.map((location, index) => (
            <AnyReactComponent
              key={index}
              lat={location.lat}
              lng={location.lng}
              text={location.city}
            />
          ))}
        </GoogleMap>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default App;
