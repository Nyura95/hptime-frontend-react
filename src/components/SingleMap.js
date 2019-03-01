// See and copy pasta available components
import React, { Component } from "react";
import "./SingleMap.scss";
import MapGL, { Marker } from "react-map-gl";
import MapMarker from "./MapMarker";
import { getStructureList } from "../api.js";
import { Popup } from "react-map-gl";
import PopUp from "./PopUp";

class SingleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 48.85341,
        longitude: 2.3488,
        zoom: 9.5,
        pitch: 45,
        bearing: -17.6
      },
      popupInfo: null,
      structureArray:[],
      newstructureArray:[]

    };
    this._onViewportChange = this._onViewportChange.bind(this);
  }

  componentDidMount() {
    // get data from our Express API (localhost:299)
    getStructureList().then(response => {
      console.log("Structure list", response.data);
      const { neededSpecialist, patientType } = this.props;
      const structureArray = response.data;
      const newstructureArray = structureArray.filter(el =>
        el.availablePoles.some(pole => pole.pathology === neededSpecialist && pole.patientType === patientType))

      console.log({ structureArray, newstructureArray })
      this.setState({ structureArray, newstructureArray });

    });
  }

  // update map on window size
  _onViewportChange(viewport) {
    this.setState({ viewport });
  }

  _renderCityMarker = (place, index) => {
    return (
      <Marker
        key={`marker-${index}`}
        longitude={this.state.longitude}
        latitude={this.state.latitude}
      >
        {/* <MapMarker onClick={() => this.setState({ popupInfo: city })} /> */}
      </Marker>
    );
  };

  _renderPopUp = (place, index) => {
    return (
      this.state.popupInfo && (
        <PopUp
          key={`PopUp-${index}`}
          longitude={this.state.longitude}
          latitude={this.state.latitude}
        />
      )
    );
  };

  render() {
    const {neededSpecialist} = this.props
    console.log(this.props);
    
    const {structureArray} =this.state;
    const { viewport } = this.state;
    
    
    return (
      <MapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoicHJvamVjdDNpcm9uaGFjayIsImEiOiJjanNpdzA4aXcxemloNDRueDBkaXlkZDh0In0.bbNCzs-0njORLSHu9bXeDQ"
        mapStyle="mapbox://styles/project3ironhack/cjsk4xibk5rjh1fmqo9k31hym"
        width="100%"
        height={window.innerHeight - 56}
        onViewportChange={this._onViewportChange}
      >
        {/* MapMarker Below */}
        <Marker latitude={48.858372} longitude={2.294481}>
          <MapMarker
            size={20}
            //onClick={() => this.setState({popupInfo: city})}
          />
        </Marker>

        {/* PopUp Below */}
        <PopUp />
      </MapGL>
    );
  }
}

export default SingleMap;
