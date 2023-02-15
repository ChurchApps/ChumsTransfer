import React from "react"
import { Row, Col, Container } from "react-bootstrap";
import { UserHelper } from "../appBase/helpers";

export const Header: React.FC = () => {

  const getHeaderLink = () => {
    if (!UserHelper.user) return <a href="/login" className="link">Login</a>
    else return UserHelper.user.firstName + " " + UserHelper.user.lastName;
  }

  return (<>
    <div id="navbar" className="fixed-top">
      <Container>
        <Row>
          <div className="col-6 col-lg-2-5"><a className="navbar-brand" href="/"><img src="/images/logo.png" alt="logo" /></a></div>
          <Col className="d-none d-xl-block" xl={7}>

          </Col>
          <div className="col-6 col-lg-2-5 text-right" id="navRight">
            {getHeaderLink()}
            <a href="https://chums.org/" className="btn btn-success btn-sm">Go to ChuMS</a>
          </div>
        </Row>
      </Container>
    </div>
    <div id="navSpacer"></div>
  </>)
}
