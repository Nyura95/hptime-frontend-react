import React, { Component } from "react";
import "./MapWrapper.css";
import SingleMap from "./SingleMap.js";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import structuresAlternatives from "../structuresAlternatives.json";
import { getHospitalList } from "../api.js";

class MapWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newstructureArray: structuresAlternatives.slice(0, 5),
      open: true,
      structureArray: []
    };
  }
  componentDidMount() {
    // get data from our backend Express API (localhost:2999)
    getHospitalList().then(response => {
      console.log("Structure list", response.data);
      const { neededSpecialist, patientType } = this.props;
      const structureArray = response.data;
      const newstructureArray = structureArray.filter(el =>
        el.availablePoles.some(
          pole =>
            pole.pathology === neededSpecialist &&
            (pole.patientType === patientType ||
              pole.patientType === "Universel")
        )
      );

      //console.log({ structureArray, newstructureArray });
      this.setState({ structureArray, newstructureArray });
    });
  }
  render() {
    const { newstructureArray, open } = this.state;

    return (
      <section className="MapWrapper">
        <Row>
          <Col
            sm={{ span: 12, order: 2 }}
            md={{ span: 3, order: 1 }}
            id="map-filter"
          >
            <div id="accordion">
              <div className="card border-bottom-0">
                <div className="card-header" id="headingOne">
                  <h5 className="mb-0">
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      onClick={() => this.setState({ open: !open })}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                    >
                      {open ? (
                        <p className="clollapsBtnText">VOIR MAP</p>
                      ) : (
                        <p className="clollapsBtnText">VOIR PROPOSITIONS</p>
                      )}
                    </button>
                  </h5>
                </div>
                <Collapse
                  in={this.state.open}
                  className="collapse show dimension"
                >
                  <div aria-labelledby="headingOne" data-parent="#accordion">
                    <table className="table scrolling">
                      <thead className="thead-light">
                        <tr>
                          <th className="title1Col" scope="col">
                            Tri/Pertinence
                          </th>
                          <th className="text-center colDeux" scope="col">
                            Sur RDV
                          </th>
                          <th className="text-center colDeux" scope="col">
                            Temps total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newstructureArray.map((oneStructure, index) => {
                          return (
                            <tr key={index}>
                              <td>
                                <ul className="list-group list-group-flush resultTb FCol">
                                  <li className="list-group-item namePolice">
                                    Nom: {oneStructure.name}
                                  </li>
                                  <li className="list-group-item typePolice">
                                    Type: {oneStructure.type}
                                  </li>
                                </ul>
                              </td>
                              <td className="cel  colDeux">
                                {oneStructure.AppelPrealable ? (
                                  <span className="badge badge-success badge-pill">
                                    Oui
                                  </span>
                                ) : (
                                  <span className="badge badge-danger badge-pill">
                                    Non
                                  </span>
                                )}
                              </td>
                              <td className="cel colDeux">
                                <ul className="list-group list-unstyled resultTb">
                                  <li className="list-list-unstyled">
                                    <span className="badge badge-primary">
                                      30
                                    </span>
                                  </li>
                                  <li className="list-list-unstyled">min</li>
                                </ul>
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
          </Col>

          <Col sm={{ span: 12, order: 2 }} md={{ span: 9, order: 2 }}>
            <SingleMap />
          </Col>
        </Row>
      </section>
    );
  }
}

export default MapWrapper;
