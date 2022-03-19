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

function Unstaked() {
  const { wallet, nftList, fetchNFTs } = useContext(WalletContext)

  const handleStake = async(token_id) => {
    const result = await wallet.account().functionCall({
      contractId: NFT_CONTRACT_ID,
      methodName: "nft_approve",
      args: {
        token_id: token_id,
        account_id: STAKING_CONTRACT_ID,
        msg: JSON.stringify({ staking_status: "Stake to Platform" })
      },
      gas: MAX_GAS,
      attachedDeposit: DEPOSIT,
    });
    fetchNFTs(wallet);
  }

  useEffect(() => {
    fetchNFTs(wallet);
  }, [wallet])

  return (
    <Container fluid className="mt-2 mb-4">
      <h1>Unstaked NFT</h1>
      <Row md={5} className="mt-2">
        {
          nftList.map((item, i) => (
            <Col key={i}>
              <Card>
                <CardHeader>{item.metadata.title}</CardHeader>
                <CardContent className="p-1">
                  <CardImg src={item.metadata.media.startsWith("http") ? item.metadata.media : (item.baseUri !== undefined ? `${item.baseUri}/${item.metadata.media}` : item.metadata.media)}></CardImg>
                </CardContent>
                <ModalFooter>
                  <Button className="w-100" onClick={()=>handleStake(item.token_id)}>STAKE</Button>
                </ModalFooter>
              </Card>
            </Col>
          ))
        }
      </Row>
    </Container>
  );
}

export default Unstaked;
