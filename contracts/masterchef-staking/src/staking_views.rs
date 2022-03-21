use crate::*;
extern crate chrono;
// use chrono::prelude::*;
use chrono::{DateTime, Local, NaiveDateTime, Utc};
use std::time::SystemTime;

// we have to define view functions here.
// but maybe I already adjusted and you would add little funtions.

#[near_bindgen]
impl Contract {
    /// views
    pub fn get_supply_staking_informations(&self) -> U64 {
        U64(self.staking_informations.len())
    }

    pub fn get_staking_informations_by_owner_id(
        &self,
        account_id: AccountId
    ) -> StakeInfo {
        let stake_info = self.staking_informations.get(&account_id);
        if (stake_info == None){
            env::panic(b"StakeInfo is not existing for this account");
        }
        stake_info.unwrap()
    }

    pub fn get_claim_amount(&self, account_id: AccountId) -> U128 {
        let stake_info =
            self.get_staking_informations_by_owner_id(account_id);
        let now = env::block_timestamp() / 1000000;
        let claimed = U128::from(u128::from(stake_info.reward_to_claim).checked_add(u128::from(stake_info.stake_weight).checked_mul(10000000000).unwrap().checked_div(u128::from(self.staked_weight)).unwrap().checked_mul(((now - stake_info.claimed_at)/1000).into()).unwrap().checked_mul(10000000000000000).unwrap()).unwrap());

        claimed
    }
}
