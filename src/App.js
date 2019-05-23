import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "throttle-debounce";
import GoogleMap from "google-map-react";

import "./App.css";
import fetchLocations from "./services/api";
import { tsOptionalType } from "@babel/types";

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
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
      500,
      this.onSuggestionsFetchRequested
    );
  }

  getSuggestionValue = suggestion => suggestion.city;

  renderSuggestion = suggestion => {
    return (
      <span>
        {suggestion.city} ({suggestion.zipCode})
      </span>
    );
  };

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) =>
    fetchLocations(value, data => {
      this.setState({ suggestions: data });
    });

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const { value, suggestions } = this.state;
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
          center={{ lat: 5.6219868, lng: -0.1733074 }}
          zoom={14}
        />
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
