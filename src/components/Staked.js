import { CardContent } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardImg,
  Col,
  Container,
  Row,
  ModalFooter,
  Button,
} from "react-bootstrap";
import CardHeader from "react-bootstrap/esm/CardHeader";
import { WalletContext, NFT_CONTRACT_ID, STAKING_CONTRACT_ID, MAX_GAS, DEPOSIT } from "../Wallet";
function Staked() {
  const { wallet, stakedNftList, fetchStakedNFTs } = useContext(WalletContext)

  const handleUnstake = async(token_id) => {
    const result = await wallet.account().functionCall({
      contractId: STAKING_CONTRACT_ID,
      methodName: "unstake",
      args: {
        token_id: token_id,
      },
      gas: MAX_GAS,
      attachedDeposit: "1",
    });
    fetchStakedNFTs(wallet);
  }

  useEffect(() => {
    fetchStakedNFTs(wallet);
  }, [wallet])

  return (
    <Container fluid className="mt-2">
      <h1>Staked NFT</h1>
      <Row md={5} className="mt-2">
      {
          stakedNftList.map((item, i) => (
            <Col key={i}>
              <Card>
                <CardHeader>{item.metadata.title}</CardHeader>
                <CardContent className="p-1">
                  <CardImg src={item.metadata.media.startsWith("http") ? item.metadata.media : (item.baseUri !== undefined ? `${item.baseUri}/${item.metadata.media}` : item.metadata.media)}></CardImg>
                </CardContent>
                <ModalFooter>
                  <Button className="w-100" onClick={()=>handleUnstake(item.token_id)}>UNSTAKE</Button>
                </ModalFooter>
              </Card>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}

export default Staked;
