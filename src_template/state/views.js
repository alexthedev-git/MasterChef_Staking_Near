import { marketId, stakingContractId, nftContractId } from "../state/near";

const BAD_OWNER_ID = [];
const DELIMETER = "||";

// api-helper config
const domain = "https://helper.nearapi.org";
const batchPath = domain + "/v1/batch/";
const headers = new Headers({
  "max-age": "300",
});

const ADD_SALE = "__ADD_SALE";

export const getMarketStoragePaid =
  (account) =>
  async ({ update, getState }) => {
    if (!account) return;
    const { contractAccount } = getState();

    update("views", {
      marketStoragePaid: await contractAccount.viewFunction(
        marketId,
        "storage_paid",
        { account_id: account.accountId }
      ),
    });
  };

export const loadItems =
  (account) =>
  async ({ update, getState }) => {
    const { contractAccount } = getState();

    /// user tokens
    let tokens = [];
    if (account) {
      const { accountId } = account;
      tokens = await contractAccount.viewFunction(
        nftContractId,
        "nft_tokens_for_owner",
        {
          account_id: account.accountId,
          from_index: "0",
          limit: 50,
        }
      );
    }
    let allTokens = [];

    update("views", { tokens, allTokens });
    return { tokens, allTokens };
  };

export const getClaimAmount =
  (account) =>
  async ({ update, getState }) => {
    const { contractAccount } = getState();

    /// user tokens
    let claimAmount = 0;
    if (account) {
      const { accountId } = account;
      claimAmount = await contractAccount.viewFunction(
        stakingContractId,
        "get_claim_amount",
        {
          account_id: account.accountId,
        }
      );
    }
    update("views", { claimAmount });
    return { claimAmount };
  };

export const getStakingInformation =
  (account) =>
  async ({ update, getState }) => {
    const { contractAccount } = getState();

    /// user tokens
    let tokenInfo = {};
    if (account) {
      const { accountId } = account;
      console.log("account,", account);
      console.log("stakingContractId", stakingContractId);
      tokenInfo = await contractAccount.viewFunction(
        stakingContractId,
        "get_staking_informations_by_owner_id",
        {
          account_id: account.accountId,
          from_index: "0",
          limit: 100,
        }
      );
    }
    console.log("tokeninf", tokenInfo);
    update("views", { tokenInfo });
    return { tokenInfo };
  };

export const getSupplyStakingInformations =
  (account) =>
  async ({ update, getState }) => {
    const { contractAccount } = getState();

    /// user tokens
    let supplyInfo = {};
    if (account) {
      const { accountId } = account;
      console.log("get_supply_staking_informations_account,", account);
      console.log(
        "get_supply_staking_informations_stakingContractId",
        stakingContractId
      );
      supplyInfo = await contractAccount.viewFunction(
        stakingContractId,
        "get_supply_staking_informations",
        {}
      );
    }
    console.log("supplyInfo", supplyInfo);
    update("views", { supplyInfo });
    return { supplyInfo };
  };
