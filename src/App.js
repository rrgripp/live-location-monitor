import React from "react";
import { find, reject } from "lodash";

import "./App.css";
import { geocodeAddress } from "./services/maps";
import Map from "./components/Map";
import LocationInput from "./components/LocationInput";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      locations: [],
      lastLocation: undefined
    };
  }

  onMarkerClick = location => {
    if (
      window.confirm(`Do you wish to remove ${location.city} from the map?`)
    ) {
      this.setState({
        locations: reject(this.state.locations, location)
      });
    }
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
    const { lastLocation, locations } = this.state;

    return (
      <div className="App">
        <div className="location-monitor-header">
          <h1 className="location-monitor-title">Live Location Monitor</h1>
          <span className="location-monitor-subtitle">
            Search for a location and track it on the map!
          </span>

          <LocationInput onSuggestionSelected={this.onSuggestionSelected} />
        </div>

        <Map
          locations={locations}
          center={lastLocation}
          onMarkerClick={this.onMarkerClick}
        />
      </div>
    );
  }
}

export default App;
