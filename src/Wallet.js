import * as nearAPI from "near-api-js";
import React, { useCallback, useEffect, useState } from "react";

const { keyStores, connect, WalletConnection } = nearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

export const STAKING_CONTRACT_ID = "staking_test_5.xuguangxia.testnet"
export const TOKEN_CONTRACT_ID = "vac_token_test_4.xuguangxia.testnet"
export const NFT_CONTRACT_ID = "5.anul.testnet"
export const GAS_FOR_NFT_APPROVE = "20000000000000";
export const GAS_FOR_RESOLVE_TRANSFER = "10000000000000";
export const MAX_GAS = "300000000000000";
export const DEPOSIT = "450000000000000000000";

export const WalletContext = React.createContext({
    near: undefined,
    wallet: undefined,
    nftList: [],
    stakedNftList: [],
    fetchNFTs: () => { },
    fetchStakedNFTs: () => { },
})

// connect to NEAR
const WalletProvider = (props) => {
    const [near, setNear] = useState()
    const [wallet, setWallet] = useState()
    const [nftList, setNftList] = useState([])
    const [stakedNftList, setStakedNftList] = useState([])
  
    const config = {
        networkId: "testnet",
        keyStore, // optional if not signing transactions
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };
       
    const connectToNear = useCallback(async () => {
      try {
        const near = await connect(config);
        const wallet = new WalletConnection(near);
        setNear(near);
        setWallet(wallet);
      } catch (error) {
        console.log(error, "error")
      }
    }, [config])
  
    const fetchNFTs = async (wallet) => {
      if(wallet && wallet.isSignedIn()){
        const items = await wallet.account().viewFunction(
          NFT_CONTRACT_ID,
          "nft_tokens_for_owner",
          {
            account_id: wallet.account().accountId,
            from_index: "0",
            limit: 1000
          }
        );
        if (!items || !items.length){
          setNftList([])
          return;
        }
        const contractMetaData = await wallet.account().viewFunction(
          NFT_CONTRACT_ID,
          "nft_metadata",
          {}
        );
        for (let item of items) {
          item.baseUri = contractMetaData.base_uri
        }
        setNftList(items)
      }
    }

    const fetchStakedNFTs = async (wallet) => {
      if(wallet && wallet.isSignedIn()){
        console.log(wallet.account().accountId);
        const stakedItemInfos = await wallet.account().viewFunction(
          STAKING_CONTRACT_ID,
          "get_staking_informations_by_owner_id",
          {
            account_id: wallet.account().accountId,
            from_index: "0",
            limit: 1000
          }
        );

        const items =[];
        for(let stakedItemInfo of stakedItemInfos){
          console.log(stakedItemInfo)
          const item = await wallet.account().viewFunction(
            NFT_CONTRACT_ID,
            "nft_token",
            {
              token_id: stakedItemInfo.token_id
            }
          );
          if(item)
            items.push(item);
        }
        if (!items || !items.length){
          setStakedNftList([])
          return;
        }
        const contractMetaData = await wallet.account().viewFunction(
          NFT_CONTRACT_ID,
          "nft_metadata",
          {}
        );
        for (let item of items) {
          item.baseUri = contractMetaData.base_uri
        }
        setStakedNftList(items)
      }
    }

    useEffect(() => {
    }, [connectToNear])
  
    useEffect(() => {
      connectToNear()
    }, [])
  
    return (
      <WalletContext.Provider
        value={{ near, wallet, nftList, stakedNftList, fetchNFTs, fetchStakedNFTs}}
      >
        {props.children}
      </WalletContext.Provider>
    )
}
  
export default WalletProvider
