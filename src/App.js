import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "throttle-debounce";

import "./App.css";
import fetchLocations from "./services/api";

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
  };

  getSuggestionValue = suggestion => suggestion.city;

  renderSuggestion = suggestion => {
    return (
      <div className="result">
        <div>
          {suggestion.city} ({suggestion.zipCode})
        </div>
      </div>
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
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.onSuggestionSelected}
        inputProps={inputProps}
      />
    );
  }
}

export default App;
