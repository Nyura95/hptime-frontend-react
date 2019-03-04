import React from "react";
import axios from "axios";
import { Redirect } from "react-router";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import "./LocationSearchInput.scss";

// do not remove the line below please
/* global google */

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserPosition: {
        latitude: null,
        longitude: null
      },
      addressInputValue: "",
      isLoadingCoordinates: false,
      toMapResults: false
    };

    // binds for events
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
    this.getUserLocationBrowser = this.getUserLocationBrowser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.goToResult = this.goToResult.bind(this);
  }

  // load Google API for autocompletion on mount
  componentDidMount() {
    // monitor form and change result on event
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ["geocode"] }
    );

    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log(value, name);

    this.setState({
      [name]: value
    });
  }

  // update state if any change on form
  handlePlaceChanged() {
    this.setState({
      isLoadingCoordinates: true
    });
    const place = this.autocomplete.getPlace();
    const longitude = place.geometry.viewport.ga.l;
    const latitude = place.geometry.viewport.ma.l;

    this.setState({
      currentUserPosition: {
        latitude: latitude,
        longitude: longitude
      },
      isLoadingCoordinates: false
    });

    // TODO lifting state up top
    this.props.onGeolocation(latitude, longitude);

    // redirect user to map with filtered results
    this.goToResult();
  }

  // get user coords with HTML5 browser feature on click, redirect when filled
  getUserLocationBrowser() {
    const { currentUserPosition, isLoadingCoordinates } = this.state;

    // triggered only if user is not located
    if (!currentUserPosition.latitude) {
      // loading icon
      this.toggleSearchCoordinates(isLoadingCoordinates);

      const location = window.navigator && window.navigator.geolocation;
      if (location) {
        location.getCurrentPosition(
          position => {
            // update state with results
            const { isLoadingCoordinates } = this.state;
            this.toggleSearchCoordinates(isLoadingCoordinates);

            // reverse geocode
            this.reverseGeocode(
              position.coords.latitude,
              position.coords.longitude
            );
            // TODO lifting state up here too
            this.props.onGeolocation(
              position.coords.latitude,
              position.coords.longitude
            );

            // redirect user to map with filtered results
            this.goToResult();
          },
          error => {
            this.setState({
              latitude: "err-latitude",
              longitude: "err-longitude"
            });
            console.log("Cannot find you err..:", error);
          }
        );
      }
    }
  }

  // toggle loading icon
  toggleSearchCoordinates(currentValue) {
    this.setState({ isLoadingCoordinates: !currentValue });
  }

  // convert coordinates to address
  reverseGeocode(latitude, longitude) {
    let params = {
      key: process.env.REACT_APP_GOOGLE_MAPS_JS,
      latlng: `${latitude},${longitude}`
    };

    // do google maps js API query
    return axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?key=${
          params.key
        }&latlng=${params.latlng}`
      )
      .then(response => {
        // get the result into the form so user has a feedbakc
        this.setState({
          addressInputValue: response.data.results[0].formatted_address
        });

        // TODO method call to add an user marker here
      });
    //end
  }

  // redirect to map when address found
  goToResult() {
    // TODO Need UX feedback, Users may need time change the address (may taking them to the map too fast)
    // intermediate button > submit
    this.setState({ toMapResults: true });
  }

  render() {
    // redirect to map when address found
    if (this.state.toMapResults === true) {
      return <Redirect to="/map" />;
    }

    return (
      <div className="input-group">
        <FormControl
          type="text"
          placeholder="Où?"
          onClick={() => {
            this.getUserLocationBrowser();
          }}
          name="addressInputValue"
          value={this.state.addressInputValue}
          onChange={this.handleChange}
          id="autocomplete"
          ref={this.autocompleteInput}
        />

        <div className="input-group-append">
          {this.state.isLoadingCoordinates ? (
            <Button variant="info" onClick={this.goToResult}>
              <i className="fas fa-circle-notch fa-spin" />
            </Button>
          ) : (
            <Button variant="outline-secondary">
              <i className="fas fa-search" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default LocationSearchInput;
