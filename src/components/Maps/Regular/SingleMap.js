// See and copy pasta available components
import React, { Component } from "react";
import MapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import MapMarker from "./MapMarker.js";
import UserMarker from "./UserMarker.js";
import PopUp from "./PopUp";
const MAPBOX_KEY = process.env.REACT_APP_MAPBOX_TOKEN;

class SingleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospitalArray: [],
      structureArray: [],
      altStructure: [],
      newstructureArray: [],
      viewport: {
        latitude: 48.85341,
        longitude: 2.3488,
        zoom: 10,
        pitch: 45,
        bearing: -17.6
      },
      popupInfo: null
    };
  }

  // update map on window size
  _onViewportChange = viewport => {
    this.setState({ viewport });
  };

  // create markers from data
  renderMapAndMarkers = () => {
    const { structureArray } = this.props;
    let resultArray = structureArray.map((oneItem, index) => {
      return (
        <Marker
          key={`marker-${index}`}
          longitude={oneItem.longitude}
          latitude={oneItem.latitude}
        >
          <MapMarker
            structureArray={this.props.structureArray}
            oneItem={oneItem}
            onClick={() => this.setState({ popupInfo: oneItem })}
          />
        </Marker>
      );
    });

    return resultArray;
  };

  // create  a popup
  renderPopup = () => {
    const { popupInfo } = this.state;
    return (
      popupInfo && (
        <PopUp popupInfo={popupInfo} onCloseClick={() => this.clearPopup()} />
      )
    );
  };

  // destroy a popup
  clearPopup = () => {
    this.setState({ popupInfo: null });
  };

  // set user current location marker if current user location is filled
  renderUserMarker = location => {
    if (location) {
      return (
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <UserMarker />
        </Marker>
      );
    }
  };

  // change viewport to given location
  _goToViewport = ({ longitude, latitude }) => {
    this._onViewportChange({
      longitude,
      latitude,
      zoom: 12,
      pitch: 45,
      bearing: -17.6,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 2500
    });
  };

  // zoom to user location on cdm
  componentDidMount() {
    setTimeout(() => {
      const { userLocation } = this.props;
      this._goToViewport(userLocation);
    }, 2500);
  }

  render() {
    const { viewport } = this.state;
    const { userLocation } = this.props;

    return (
      <MapGL
        {...viewport}
        mapboxApiAccessToken={MAPBOX_KEY}
        mapStyle="mapbox://styles/project3ironhack/cjsk4xibk5rjh1fmqo9k31hym"
        width="100%"
        //height={window.innerHeight - 56}
        height={
          window.innerWidth < 767
            ? window.innerHeight - 400
            : window.innerHeight - 56
        }
        // 56 to substract navbar height of window size so the map is full height
        onViewportChange={this._onViewportChange}
      >
        {this.renderUserMarker(userLocation)}
        {this.renderMapAndMarkers()}
        {this.renderPopup()}
      </MapGL>
    );
  }
}

export default SingleMap;
