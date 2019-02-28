//Main
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
//Components
import Navigation from "./components/Navigation.js";
import IsEmergency from "./components/IsEmergency.js";
import SpeedDial from "./components/SpeedDial.js";
import Results from "./components/Results.js";
import MapWrapper from "./components/MapWrapper.js";
import NotFound from "./components/NotFound.js";
//Css/styling
import "./App.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Questions from "./components/Questions.js";
import Container from "react-bootstrap/Container.js";
import "mapbox-gl/dist/mapbox-gl.css";

require("dotenv").config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientGender: "",
      neededSpecialist: "",
      patientAdult: true,
      patientLocalization: ""
    };
  }

  updatePatient(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    // console.log(event.target);
  }
  render() {
    return (
      <div className="App">
        <Container>
          <header>
            <Navigation />
          </header>

          <Switch>
            <Route path="/" exact component={IsEmergency} />
            <Route path="/map" component={MapWrapper} />
            <Route path="/results" component={Results} />
            <Route
              path="/form"
              render={() => {
                return (
                  <Questions
                    updatePatient={event => this.updatePatient(event)}
                  />
                );
              }}
            />

            <Route path="/404" component={NotFound} />
          </Switch>

          <footer className="fixed-bottom">
            <SpeedDial />
          </footer>
        </Container>
      </div>
    );
  }
}

export default App;
