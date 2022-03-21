// Welcome to the Mass Key Deletion recipe.

// This tool allows you to
// 1. Delete all your functionCall Access Keys
// 2. Delete all but one specified Full Access Key
// 3. Delete all Full Access Keys and Lock an Account

/// STEP 1 Install near-api-js
// npm init (in directory where you stored this script)
// npm i near-api-js

const nearAPI = require("near-api-js"); // imports near api js

// Standard setup to connect to NEAR While using Node
const { keyStores, connect } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);
let config;

// STEP 2 Choose your configuration.
// set this variable to either "testnet" or "mainnet"
// if you haven't used this before use testnet to experiment so you don't lose real tokens by deleting all your access keys
const configSetting = "testnet";

const GAS_FOR_NFT_APPROVE = "20000000000000";
const GAS_FOR_RESOLVE_TRANSFER = "10000000000000";
const MAX_GAS = "300000000000000";
const DEPOSIT = "450000000000000000000";

// setting configuration based on input
switch (configSetting) {
  case "mainnet":
    config = {
      networkId: "mainnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://wallet.near.org",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    console.log("configuration set to mainnet ");

    break;

  case "testnet":
    config = {
      networkId: "testnet",
      keyStore, // optional if not signing transactions
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    console.log("configuration set to testnet ");
    break;
  default:
    console.log(`please choose a configuration `);
}

const STAKING_CONTRACT_ID = "masterchef_test_1.xuguangxia.testnet";
const TOKEN_A_CONTRACT_ID = "masterchef_test_2.xuguangxia.testnet";
const TOKEN_B_CONTRACT_ID = "masterchef_test_3.xuguangxia.testnet";
const TOKEN_C_CONTRACT_ID = "masterchef_test_4.xuguangxia.testnet";

const Test = async () => {
  //Load Your Account
  const near = await connect(config);

  // STEP 4 enter your mainnet or testnet account name here!
  const account = await near.account("xuguangxia.testnet");

  let result;

  result = await account.viewFunction(
    TOKEN_A_CONTRACT_ID,
    "ft_balance_of",
    {
      account_id: account.accountId,
    }
  ); 
  console.log("Token_A_Balance:", result);

  result = await account.viewFunction(
    TOKEN_B_CONTRACT_ID,
    "ft_balance_of",
    {
      account_id: account.accountId,
    }
  ); 
  console.log("Token_B_Balance:", result);

  result = await account.viewFunction(
    TOKEN_C_CONTRACT_ID,
    "ft_balance_of",
    {
      account_id: account.accountId,
    }
  ); 
  console.log("Token_C_Balance:", result);

  // STAKING
  // result = await account.functionCall({
  //   contractId: TOKEN_A_CONTRACT_ID,
  //   methodName: "ft_transfer_call",
  //   args: {
  //     receiver_id: STAKING_CONTRACT_ID,
  //     amount: "1000000000000000000000000",
  //     msg: JSON.stringify({ staking_status: "Stake to Platform" })
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log("Staking A token");

  // result = await account.functionCall({
  //   contractId: TOKEN_B_CONTRACT_ID,
  //   methodName: "ft_transfer_call",
  //   args: {
  //     receiver_id: STAKING_CONTRACT_ID,
  //     amount: "1000000000000000000000000",
  //     msg: JSON.stringify({ staking_status: "Stake to Platform" })
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log("Staking B token");

  // result = await account.viewFunction(
  //   TOKEN_A_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_A_Balance:", result);

  // result = await account.viewFunction(
  //   TOKEN_B_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_B_Balance:", result);

  // result = await account.viewFunction(
  //   TOKEN_C_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_C_Balance:", result);

  result = await account.viewFunction(
    STAKING_CONTRACT_ID,
    "get_claim_amount",
    {
      account_id: account.accountId,
    }
  ); 
  console.log("ClaimAmount:", result);

  // CLAIMING
  // result = await account.functionCall({
  //   contractId: STAKING_CONTRACT_ID,
  //   methodName: "claim_reward",
  //   args: {
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log("Claimed");

  // UNSTAKING
  // result = await account.functionCall({
  //   contractId: STAKING_CONTRACT_ID,
  //   methodName: "unstake",
  //   args: {
  //     token_type: TOKEN_A_CONTRACT_ID,
  //     amount: "500000000000000000000000"
  //   },
  //   gas: MAX_GAS,
  //   attachedDeposit: "1",
  // });
  // console.log("Unstaked A Token");

  // result = await account.viewFunction(
  //   TOKEN_A_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_A_Balance:", result);

  // result = await account.viewFunction(
  //   TOKEN_B_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_B_Balance:", result);

  // result = await account.viewFunction(
  //   TOKEN_C_CONTRACT_ID,
  //   "ft_balance_of",
  //   {
  //     account_id: account.accountId,
  //   }
  // ); 
  // console.log("Token_C_Balance:", result);
};

Test();
