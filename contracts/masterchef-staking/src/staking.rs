use crate::*;
use near_sdk::promise_result_as_success;
extern crate chrono;
// use chrono::prelude::*;
use chrono::{DateTime, Local, NaiveDateTime, Utc};
use std::time::SystemTime;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, PartialEq)]
#[serde(crate = "near_sdk::serde")]
pub struct StakeInfo {
    pub owner_id: AccountId,
    pub token_a_amount: U128,
    pub token_b_amount: U128,
    pub stake_weight: U128,
    pub reward_to_claim: U128,
    pub created_at: u64,
    pub claimed_at: u64,
}

#[near_bindgen]
impl Contract {

    #[payable]
    pub fn claim_reward(
        &mut self,
    ) {
        assert_one_yocto();
        let account_id = env::predecessor_account_id();
        let claim_amount = self.get_claim_amount(account_id.clone());

        ext_contract::ft_transfer(
            account_id.clone(),
            claim_amount,
            None,
            &self.token_c_contract_id,
            1,
            GAS_FOR_FT_TRANSFER,
        );

        let mut stake_info = self.staking_informations.get(&account_id).unwrap();
        stake_info.reward_to_claim = U128(0);
        stake_info.claimed_at = env::block_timestamp() / 1000000;
        self.staking_informations.insert(
            &account_id,
            &stake_info
        );
    }

    #[payable]
    pub fn unstake(
        &mut self,
        token_type: AccountId,
        amount: U128
    ) {
        assert_one_yocto();
        let account_id = env::predecessor_account_id();

        let info = self.staking_informations.get(&account_id);
        if (info == None){
            env::panic(b"StakeInfo is not existing for this account");
        }
        let mut stake_info = info.unwrap();

        if (token_type == self.token_a_contract_id){
            assert!(amount.0 <= u128::from(stake_info.token_a_amount), "Amount must be smaller than staked amount");
        } else if (token_type == self.token_b_contract_id){
            assert!(amount.0 <= u128::from(stake_info.token_b_amount), "Amount must be smaller than staked amount");
        }

        self.claim_reward();

        ext_contract::ft_transfer(
            account_id.clone(),
            amount,
            None,
            &token_type,
            1,
            GAS_FOR_FT_TRANSFER,
        );

        if (token_type == self.token_a_contract_id){
            stake_info.token_a_amount = U128::from(u128::from(stake_info.token_a_amount).checked_sub(u128::from(amount)).unwrap());
            stake_info.stake_weight = U128::from(u128::from(stake_info.stake_weight).checked_sub(u128::from(amount).checked_mul(6).unwrap().checked_div(10).unwrap()).unwrap());
            self.staked_weight = U128::from(u128::from(self.staked_weight).checked_sub(u128::from(amount).checked_mul(6).unwrap().checked_div(10).unwrap()).unwrap());
        } else if (token_type == self.token_b_contract_id){
            stake_info.token_b_amount = U128::from(u128::from(stake_info.token_b_amount).checked_sub(u128::from(amount)).unwrap());
            stake_info.stake_weight = U128::from(u128::from(stake_info.stake_weight).checked_sub(u128::from(amount).checked_mul(4).unwrap().checked_div(10).unwrap()).unwrap());
            self.staked_weight = U128::from(u128::from(self.staked_weight).checked_sub(u128::from(amount).checked_mul(4).unwrap().checked_div(10).unwrap()).unwrap());
        }
        self.staking_informations.insert(
            &account_id,
            &stake_info
        );
    }
}
