import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import logo from "../img/logo.png";
import { WalletContext, STAKING_CONTRACT_ID } from "../Wallet";
import * as buffer from "buffer"
  ; window.Buffer = buffer.Buffer

function NavBar() {
  const { wallet } = useContext(WalletContext)

  const signIn = () => {
    wallet.requestSignIn(STAKING_CONTRACT_ID);
  };

  const signOut = () => {
    wallet.signOut();
    window.location = "/"
  };

  const onWallet = () => {
    if(wallet.isSignedIn()){
      signOut();      
    } else {
      signIn();
    }
  }

  return (
    <Container fluid className="p-4">
      <Row md={2}>
        <Col>
          <div className="d-flex gap-3">
            <Image src={logo} height={45} width={200} className="ms-2" />
          </div>
        </Col>
        {(wallet && wallet.isSignedIn())?
        <Col>
          <div className="d-flex">
            <Button className="ms-auto" onClick={onWallet} size="lg">{wallet.account().accountId}</Button>
          </div>
        </Col> : <></>}
      </Row>
      {(wallet && wallet.isSignedIn())?
        <></> :
        <Row>
          <div className="blank-area">
            <Button className="center-button" onClick={onWallet}>Connect Wallet</Button>
          </div>
        </Row>}
    </Container>
  );
}

export default NavBar;
