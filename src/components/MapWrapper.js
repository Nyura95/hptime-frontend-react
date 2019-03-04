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
      hospitalArray:[],
      altStructure:[],
      newstructureArray:[]

    };
  }
  componentDidMount() {
    // get data from our Express API (localhost:299)
    getHospitalList().then(response => {
      console.log("Structure list", response.data);
      const { neededSpecialist, patientType } = this.props;
      const hospitalArray = response.data;
      const  newstructureArray = hospitalArray.filter(el =>
      el.availablePoles.some(pole => pole.pathology === neededSpecialist && (pole.patientType === patientType || pole.patientType ==="Universel")))

      console.log({ hospitalArray, newstructureArray })
      this.setState({ hospitalArray, newstructureArray });

    });
    // getAltStructureList().then(response => {
    //   console.log("Aternative Structure list", response.data);
    //   const { neededSpecialist, patientType } = this.props;
    //   const altStructure = response.data;
    //   const  newstructureArray = this.state
    //   newstructureArray = newstructureArray.push(altStructure.filter(el =>
    //   el.availablePoles.some(pole => pole.pathology === neededSpecialist && (pole.patientType === patientType || pole.patientType ==="Universel"))))

    //   console.log({ altStructure, newstructureArray })
    //   this.setState({ altStructure, newstructureArray });

    // });
  }
  render() {
    const {neededSpecialist} = this.props
    console.log(this.props);
    const {structureArray, newstructureArray, open} =this.state;
    
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
                    <table class="table scrolling">
                      <thead class="thead-light">
                        <tr>
                          <th class="title1Col" scope="col">
                            Tri/Pertinence
                          </th>
                          <th class="text-center colDeux" scope="col">
                            Sur RDV
                          </th>
                          <th class="text-center colDeux" scope="col">
                            Temps total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {newstructureArray.map(oneStructure => {
                          return (
                            <tr>
                              <td>
                                <ul class="list-group list-group-flush resultTb FCol">
                                  <li class="list-group-item namePolice">
                                    Nom: {oneStructure.name}
                                  </li>
                                  <li class="list-group-item typePolice">
                                    Type: {oneStructure.type}
                                  </li>
                                </ul>
                              </td>
                              <td class="cel  colDeux">
                                {oneStructure.AppelPrealable ? (
                                  <span class="badge badge-success badge-pill">
                                    Oui
                                  </span>
                                ) : (
                                  <span class="badge badge-danger badge-pill">
                                    Non
                                  </span>
                                )}
                              </td>
                              <td class="cel colDeux">
                                <ul class="list-group list-unstyled resultTb">
                                  <li class="list-list-unstyled">
                                    <span class="badge badge-primary">30</span>
                                  </li>
                                  <li class="list-list-unstyled">min</li>
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
           <SingleMap 
            newstructureArray={newstructureArray} 
           
            />
          </Col>
        
        </Row>
      </section>
    );
  }
}

export default MapWrapper;
