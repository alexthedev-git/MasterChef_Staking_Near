import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { WalletContext, STAKING_CONTRACT_ID, TOKEN_CONTRACT_ID, MAX_GAS, NFT_CONTRACT_ID } from "../Wallet";

function Balance() {
  const { wallet } = useContext(WalletContext)
  const [vacBalance, setVacBalance] = useState(0)
  const [claimBalance, setClaimBalance] = useState(0)
  const [totalStakedSupply, setTotalStakedSupply] = useState(0)
  const [totalNftSupply, setTotalNftSupply] = useState(0)

  const onClaim = async (wallet) => {
    if(wallet && wallet.isSignedIn()){
      let result;
      result = await wallet.account().functionCall({
        contractId: STAKING_CONTRACT_ID,
        methodName: "claim_reward",
        args: {
        },
        gas: MAX_GAS,
        attachedDeposit: "1",
      });
      updateState(wallet);
    }
  }

  const updateState = async (wallet) => {
    if(wallet && wallet.isSignedIn()){
      let result;
      result = await wallet.account().viewFunction(
        TOKEN_CONTRACT_ID,
        "ft_balance_of",
        {
          account_id: wallet.account().accountId,
        }
      ); 
      setVacBalance(result);
  
      result = await wallet.account().viewFunction(
        STAKING_CONTRACT_ID,
        "get_claim_amount",
        {
          account_id: wallet.account().accountId,
        }
      ); 
      setClaimBalance(result);

      result = await wallet.account().viewFunction(
        STAKING_CONTRACT_ID,
        "get_supply_staking_informations",
        {
        }
      ); 
      setTotalStakedSupply(result);

      result = await wallet.account().viewFunction(
        NFT_CONTRACT_ID,
        "nft_total_supply",
        {
        }
      ); 
      setTotalNftSupply(result);
    }
  }

  useEffect(() => {
    updateState(wallet);
  }, [wallet])

  return (
    <Container fluid className="p-0">
      <div className="m-auto balance-area p-5 pt-4 pb-4 text-center">
        <Row md={4} className="align-center">
          <Col>
            <h1>NFTs Staked: {totalStakedSupply}/{totalNftSupply}</h1>
          </Col>
          <Col>
            <h1>$VAC Balance: {vacBalance}</h1>
          </Col>
          <Col>
            <h1>Claim: {claimBalance}</h1>
          </Col>
          <Col>
            <Button className="" onClick={()=> onClaim(wallet)}><h1>Claim Reward</h1></Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Balance;
