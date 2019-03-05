import React, { Component } from "react";
import "./PopUp.css";
import { Popup } from "react-map-gl";

class PopUp extends Component {
  render() {
    const { popupInfo } = this.props;

    return (
      <Popup
        className="PopUp"
        // info passed
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        // functionality
        closeOnClick={false}
        anchor="top"
        onClose={this.props.onCloseClick}
      >
        {/* <p>
          <b> {popupInfo.name}</b>
          <br />
          <a href="tel:+33{popupInfo.phoneNumber}">
            {popupInfo.phoneNumber}
          </a>
        </p> */}

        <div className="card">
          <div className="card-body">
            <p className="card-text small">
              {" "}
              <b>{popupInfo.name}</b>
            </p>
            <p className="card-text small">
              <a href="tel:+33{popupInfo.phoneNumber}">
                {popupInfo.phoneNumber}
              </a>
            </p>
            <p className="card-text small">
              {popupInfo.streetNumber} {popupInfo.roadType}{" "}
              {popupInfo.streetName}
              <br />
              {popupInfo.zipCode} {popupInfo.city}
            </p>
            <a
              href="http://maps.google.com/?q=<{popupInfo.latitude}>,<{popupInfo.longitude}>"
              className="card-link small"
            >
              Route Me
            </a>
            <a href={popupInfo.urlToPlan} className="card-link small">
              Access Plan
            </a>
          </div>
        </div>
      </Popup>
    );
  }
}

export default PopUp;
