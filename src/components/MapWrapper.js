import React, { Component } from "react";
import axios from "axios";

import SingleMap from "./SingleMap.js";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { getHospitalList, getAltStructureList } from "../api.js";

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
      structureArray: []
    };
  }
  // Allow us to filter data coming fro the back end to render only some kind of hospitals
  componentDidMount() {
    // get data from our backend Express API (localhost:2999)
    axios.all([
      getHospitalList(),
      getAltStructureList()
    ])
    .then(axios.spread((responseHos, responseAlt) => {
      // console.log("Structure list", response.data);
      const { neededSpecialist, patientType } = this.props;
      console.log(neededSpecialist, patientType)
      const hospitalArray = responseHos.data || []
      const altStructure = responseAlt.data || []
      const structureArray = hospitalArray.concat(altStructure) 
      console.log(responseHos.data);
      console.log( structureArray );
      const newstructureArray = structureArray.filter(el => {if (el.availablePoles){
        //filtered is the object that allow us to know if the hospital is or not in the proposition list
        el.filtered = el.availablePoles.some(
          pole =>
            pole.pathology === neededSpecialist &&
            (pole.patientType === patientType ||
              pole.patientType === "Universel")
        );

        return el.filtered;}
      });
      console.log({newstructureArray})

      this.setState({ structureArray, hospitalArray, altStructure, newstructureArray });
  })).catch(()=>{
    alert("Sorry! Something went wrong with the search.");
})
  
  }
  render() {
    const { newstructureArray, open } = this.state;

    return (
      <section className="MapWrapper">
        <Row>
          <Col
            sm={{ span: 12, order: 2 }}
            md={{ span: 4, order: 2 }}
            id="map-filter"
          >
            <div id="accordion">
              <div className="card border-bottom-0">
                <div className="card-header" id="headingOne">
                  <Button
                    className="btn btn-primary btn-lg btn-block"
                    onClick={() => this.setState({ open: !open })}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                  >
                    {/* condition to change the voir map button to voir condition over the propositions list */}
                    {open ? (
                      <p className="clollapsBtnText">VOIR MAP</p>
                    ) : (
                      <p className="clollapsBtnText">VOIR PROPOSITIONS</p>
                    )}
                  </Button>
                </div>
                <Collapse
                  in={this.state.open}
                  className=" dimension"
                  id="example-collapse-text"
                >
                  <div aria-labelledby="headingOne" data-parent="#accordion">
                    {/* ---------------------------------------------------------- */}
                    {/* this table display the structure propostions into the collaps button list */}
                    {/* ---------------------------------------------------------- */}
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
                                    {oneStructure.name}
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

          <Col sm={{ span: 12, order: 2 }} md={{ span: 8, order: 2 }}>
            {/* pass name of results array */}
            <SingleMap
              hospitalArray={this.state.hospitalArray}
              altStructure={this.state.altStructure}
              newstructureArray={this.state.newstructureArray}
              structureArray={this.state.structureArray}
              userLocation={this.props.userLocation}
            />
          </Col>
        </Row>
      </section>
    );
  }
}

export default MapWrapper;
