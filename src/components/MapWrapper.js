import React, { Component } from "react";
import axios from "axios";
import SingleMap from "./SingleMap.js";
import FilterBar from "./FilterBar.js";
import "./MapWrapper.scss";
import { Link } from "react-router-dom";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Swal from "sweetalert2";
import { Redirect } from "react-router";
import StructureDetail from "./StructureDetail";
import {
  // getHospitalList,
  // getAltStructureList,
  //  getStructureDetails,
  getHospitalsbyLocation,
  getAtlStructuresbyLocation,
  getDistanceDuration,
  errorHandler
} from "../api.js";
import SpeedDial from "./SpeedDial.js";

function waitingTimeAccordingToHour(el) {
  let hourOfDay = new Date().getHours();
  let waitingTimePerHour = {
    1: 45,
    2: 40,
    3: 35,
    4: 30,
    5: 25,
    6: 20,
    7: 30,
    8: 40,
    9: 40,
    10: 45,
    11: 45,
    12: 35,
    13: 35,
    14: 30,
    15: 25,
    16: 30,
    17: 40,
    18: 45,
    19: 50,
    20: 60,
    21: 50,
    22: 50,
    23: 50
  };
  if (el.isHospital) {
    return waitingTimePerHour[hourOfDay] + 30;
  }
  return waitingTimePerHour[hourOfDay];
}
class MapWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      //hospitalArray renders all the hospital from the backend
      hospitalArray: [],
      //Will render all the alternative structure from the backend
      altStructure: [],
      // newstructureArray render all the filtered hospitals from the firltering process
      newstructureArray: [],
      // structureArray renders all hospitals and alt structures in existance (full array)
      structureArray: [],
      redirect: false,
      oneStructureDetail: null,
      isStructureOpen: true,
      openingHours: ""
    };
  }
  // Allow us to filter data coming fro the back end to render only some kind of hospitals
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  componentDidMount() {
    this.updateStructure();
    let { oneStructureDetail } = this.state;
    // if (oneStructureDetail) {
    //   // use the ID in path params to get the details from the backend API
    //   getStructureDetails(oneStructureDetail._id).then(response => {
    //     // ALWAYS console.log() response.data to see what the API gave you
    //     console.log("Structure details", response.data);
    //     // save the JSON data from the API into the state
    //     const structureItem = response.data;

    //     let d = new Date();
    //     let n = d.getDay();
    //     console.log(n);
    //     console.log(structureItem.sunday);
    //     let times = "";
    //     if (
    //       structureItem.monday ||
    //       structureItem.tuesday ||
    //       structureItem.wednesday ||
    //       structureItem.thursday ||
    //       structureItem.friday ||
    //       structureItem.saturday ||
    //       structureItem.sunday
    //     ) {
    //       switch (n) {
    //         case 1:
    //           times = structureItem.monday;
    //           break;
    //         case 2:
    //           times = structureItem.tuesday;
    //           break;
    //         case 3:
    //           times = structureItem.wednesday;
    //           break;
    //         case 4:
    //           times = structureItem.thursday;
    //           break;
    //         case 5:
    //           times = structureItem.friday;
    //           break;
    //         case 6:
    //           times = structureItem.saturday;
    //           break;
    //         case 7:
    //           times = structureItem.sunday;
    //           break;
    //         default:
    //           console.log("Sorry, we did not find time");
    //       }
    //       if (times === "") {
    //         times = "fermé";
    //       }
    //     } else {
    //       times = "Ouvert 24h/24 - 7j/7";
    //     }
    //     console.log(times);

    //     this.setState({ structureItem, times });
    //   });
    // }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.neededSpecialist !== this.props.neededSpecialist) {
      this.updateStructure();
    }
  }

  updateStructure() {
    const userLocation = this.props.userLocation;

    // get data from our backend Express API (localhost:2999)
    if (userLocation) {
      axios
        .all([
          getHospitalsbyLocation(userLocation.latitude, userLocation.longitude),
          getAtlStructuresbyLocation(
            userLocation.latitude,
            userLocation.longitude
          )
        ])
        .then(
          axios.spread((responseHos, responseAlt) => {
            const { neededSpecialist, patientType } = this.props;
            // console.log(neededSpecialist, patientType, "Structure list", response.data);
            const hospitalArray = responseHos.data || [];
            const altStructure = responseAlt.data || [];
            let i = 0;
            for (i = 0; i <= 10; i++) {
              altStructure[i].filtered = true;
            }
            const tenFirstaltStructure = altStructure.slice(0, 10);
            // console.log(altStructure);
            // console.log(newstructureArray);

            const filteredHospiatls = hospitalArray.filter(el => {
              el.isHospital = true;
              if (el.availablePoles) {
                //filtered is the object that allow us to know if the hospital is or not in the proposition list
                el.filtered = el.availablePoles.some(
                  pole =>
                    pole.pathology === neededSpecialist &&
                    (pole.patientType === patientType ||
                      pole.patientType === "Universel")
                );

                return el.filtered;
              }
              return "";
            });

            const newstructureArray = tenFirstaltStructure
              .concat(filteredHospiatls)
              .slice(0, 20);

            const noDurationList = newstructureArray.filter(oneStructure => {
              return !oneStructure.duration;
            });
            const mapboxArray = noDurationList.map(el =>
              getDistanceDuration(
                userLocation.longitude,
                userLocation.latitude,
                el.longitude,
                el.latitude
              ).then(response => {
                el.duration = Math.round(
                  response.data.durations[0][0] / 60 +
                    waitingTimeAccordingToHour(el)
                );
              })
            );
            axios
              .all(mapboxArray)
              .then(() => {
                newstructureArray.sort(function(a, b) {
                  return a.duration - b.duration;
                });
                console.log(newstructureArray);
                this.setState({ newstructureArray });
                //    this.setState({ oneStructureDetail: newstructureArray[0] });
              })
              .catch(errorHandler);

            const structureArray = hospitalArray.concat(altStructure);
            // console.log(structureArray);

            this.setState({
              structureArray,
              hospitalArray,
              altStructure,
              newstructureArray
            });
          })
        )
        .catch(() => {
          Swal.fire({
            position: "center",
            type: "info",
            title:
              "Merci de remplir le questionnaire pour afficher des résultats pertinents.",
            showConfirmButton: true,
            timer: 4500
          });
          this.setState({ isSubmitSuccessful: true });
        });
    }
  }
  showStructureDetail = oneStructureDetail => {
    // https://www.freecodecamp.org/forum/t/react-why-onclick-property-function-triggers-without-click/114180
    console.log(oneStructureDetail);
    this.setState({ oneStructureDetail });
  };

  emptyOneStructure = () => {
    this.setState({ oneStructureDetail: null });
  };

  render() {
    console.log(this.state);
    const {
      newstructureArray,
      open,
      redirect,
      oneStructureDetail
    } = this.state;
    return redirect ? (
      // returning the <Redirect /> ONLY works inside RENDER
      <Redirect to="/" />
    ) : (
      <Row className="no-gutters">
        {/* list of relevant results with a toggle button */}
        <Col
          sm={{ span: 12, order: 2 }}
          md={{ span: 4, order: 2 }}
          id="map-filter"
        >
          {!oneStructureDetail ? (
            <div id="accordion">
              <div className="card border-bottom-0">
                <div className="card-header border-bottom-0" id="headingOne">
                  {open ? (
                    <Button
                      variant="primary"
                      size="lg"
                      block
                      className="d-md-none"
                      onClick={() => this.setState({ open: !open })}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                    >
                      <p className="clollapsBtnText">Carte seulement</p>
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="lg"
                      block
                      className="d-md-none"
                      onClick={() => this.setState({ open: !open })}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                    >
                      <p className="clollapsBtnText">Carte et propositions</p>
                    </Button>
                  )}
                </div>
                <FilterBar
                  updatePatient={event => this.props.updatePatient(event)}
                />
                <Collapse
                  in={this.state.open}
                  className="dimension"
                  id="example-collapse-text"
                >
                  {/* this table display the structure propostions into the collaps button list */}
                  <div aria-labelledby="headingOne" data-parent="#accordion">
                    <table className="table table-sm table-fixed">
                      <thead>
                        <tr>
                          <th className="font-weight-normal w-50">
                            Pertinence
                          </th>
                          <th className="text-center font-weight-normal">
                            <span>
                              Distance
                              <i className="fas fa-walking fa-sm ml-2" />
                            </span>
                          </th>
                          <th className="text-center font-weight-normal">
                            Details
                            <i className="fas fa-info fa-xs mb-1 ml-2" />
                          </th>
                        </tr>
                      </thead>
                      <tbody id="filtered-results">
                        {newstructureArray.map((oneStructure, index) => {
                          return (
                            <tr
                              key={index}
                              className="border border-black border-bottom"
                            >
                              <td>
                                {/* icon and name and number */}
                                <ul className="list-group list-group-flush">
                                  <li className="list-group-item border-0">
                                    <div className="row d-flex align-items-center">
                                      <div className="col-lg-2">
                                        {!oneStructure.shortname ? (
                                          <span className="fa-stack fa-2x small">
                                            <i className="fas fa-square fa-stack-2x text-danger" />
                                            <i className="fas fa-stack-1x text-structure text-white">
                                              H
                                            </i>
                                          </span>
                                        ) : (
                                          <span className="fa-stack fa-2x small mr-2">
                                            <i className="fas fa-circle fa-stack-2x text-primary" />
                                            <i className="fas fa-stack-1x text-white text-structure">
                                              C
                                            </i>
                                          </span>
                                        )}
                                      </div>
                                      <div className="col-lg-9">
                                        <span className="text-muted">
                                          {oneStructure.name} <br />
                                          <a
                                            href="tel:+33{popupInfo.phoneNumber}"
                                            className="small text-muted"
                                          >
                                            {oneStructure.phoneNumber}
                                          </a>
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </td>
                              {/* ETA by walking */}
                              <td className="text-center align-middle">
                                <ul className="list-group list-unstyled">
                                  <li>
                                    <span className="badge badge-light">
                                      {oneStructure.duration} min
                                    </span>
                                  </li>
                                </ul>
                              </td>
                              {/* See details link */}
                              <td className="text-center align-middle">
                                <Link
                                  to="#0"
                                  onClick={this.showStructureDetail.bind(
                                    this,
                                    oneStructure
                                  )}
                                  className="text-muted"
                                >
                                  voir
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Collapse>
              </div>
            </div>
          ) : (
            <>
              <div id="accordion">
                <div className="card border-bottom-0">
                  <div
                    className="card-header border-bottom-0"
                    id="headingOne"
                  />
                </div>
              </div>
              <StructureDetail
                structureItem={this.state.oneStructureDetail}
                emptyOneStructure={this.emptyOneStructure}
              />
            </>
          )}
        </Col>

        {/* map container receiving data and user location as props */}
        <Col sm={{ span: 12, order: 2 }} md={{ span: 8, order: 2 }}>
          <SingleMap
            hospitalArray={this.state.hospitalArray}
            altStructure={this.state.altStructure}
            newstructureArray={this.state.newstructureArray}
            structureArray={this.state.structureArray}
            userLocation={this.props.userLocation}
          />
        </Col>
        <SpeedDial />
      </Row>
    );
  }
}

export default MapWrapper;
