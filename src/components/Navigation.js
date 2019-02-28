import React, { Component } from "react";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import LocationSearchInput from "./LocationSearchInput.js";

class Navigation extends Component {
  render() {
    return (
      <Container>
        <Navbar bg="light" variant="light" expand="sm" fixed="top">
          <LinkContainer to="/">
            <Navbar.Brand>MedDirect</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/form">
                <Nav.Link>Form Component</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/map">
                <Nav.Link>Map Component</Nav.Link>
              </LinkContainer>
            </Nav>
            <Form inline>
              <LocationSearchInput />
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    );
  }
}

export default Navigation;
