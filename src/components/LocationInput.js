import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "throttle-debounce";

import fetchLocations from "../services/location";

class LocationInput extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: []
    };
  }

  componentWillMount() {
    this.onSuggestionsFetchRequested = debounce(
      100,
      this.onSuggestionsFetchRequested
    );
  }

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

  renderSuggestion = suggestion => {
    return (
      <span>
        {suggestion.zipCode} {suggestion.city}
      </span>
    );
  };
  render() {
    const { suggestions, value } = this.state;
    const inputProps = {
      placeholder: "Type the location",
      value,
      onChange: this.onChange
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion.city}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.props.onSuggestionSelected}
        inputProps={inputProps}
      />
    );
  }
}

export default LocationInput;
