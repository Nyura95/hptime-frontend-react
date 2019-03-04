//Main
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
//Components
import Navigation from "./components/Navigation.js";
import IsEmergency from "./components/IsEmergency.js";
import Results from "./components/Results.js";
import MapWrapper from "./components/MapWrapper.js";
import NotFound from "./components/NotFound.js";
//Styling
import "./App.scss";
import "mapbox-gl/dist/mapbox-gl.css";
import Questions from "./components/Questions.js";
import Container from "react-bootstrap/Container.js";
import "mapbox-gl/dist/mapbox-gl.css";
import SignupPage from "./components/SignUpPage.js";
import LoginPage from "./components/LoginPage.js";
import { getLogout } from "./api";

require("dotenv").config();

class App extends Component {
  constructor(props) {
    super(props);
    let userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      // turns the string back into an object if we are logged in
      userInfo = JSON.parse(userInfo);
    }
    this.state = {
      currentUser: userInfo,

      patientGender: "",
      neededSpecialist: "",
      patientAdult: "",
      patientLocation: { latitude: null, longitude: null }
    };
  }
  updateUser(newUser) {
    if (newUser) {
      // save the user info in local storage if we are logging IN
      // turn it into a json string before we save
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } else {
      // delete this info when we are loging out
      localStorage.removeItem("currentUser");
    }
    this.setState({ currentUser: newUser });
  }

  updatePatient(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  updatePatientPosition(latitude, longitude) {
    this.setState({
      patientLocation: { latitude, longitude }
    });
  }

  logoutClick() {
    getLogout()
      .then(response => {
        // console.log("Log Out", response.data);
        // set the currentUser state to empty
        this.updateUser(null);
      })
      .catch(err => err);
  }

  render() {
    const { neededSpecialist, patientAdult } = this.state;

    console.log(this.state.location);

    return (
      <div className="App">
        <Container>
          <header>
            <Navigation
              currentUser={this.state.currentUser}
              logoutClick={() => this.logoutClick()}
            />
          </header>

          <Switch>
            <Route path="/" exact component={IsEmergency} />
            <Route
              path="/map"
              render={() => {
                return (
                  <MapWrapper
                    neededSpecialist={neededSpecialist}
                    patientType={patientAdult}
                  />
                );
              }}
            />
            <Route path="/results" component={Results} />
            <Route
              path="/form"
              render={() => {
                return (
                  <Questions
                    updatePatient={event => this.updatePatient(event)}
                    onGeolocation={(latitude, longitude) =>
                      this.updatePatientPosition(latitude, longitude)
                    }
                  />
                );
              }}
            />
            <Route
              path="/signup"
              render={() => {
                return (
                  <SignupPage
                    currentUser={this.state.currentUser}
                    signupSuccess={user => this.updateUser(user)}
                  />
                );
              }}
            />
            <Route
              path="/login"
              render={() => {
                return (
                  <LoginPage
                    currentUser={this.state.currentUser}
                    loginSuccess={user => this.updateUser(user)}
                  />
                );
              }}
            />

            <Route component={NotFound} />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default App;
