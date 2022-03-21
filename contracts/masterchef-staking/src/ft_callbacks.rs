use crate::*;

/// callbacks from FT Contracts
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct StakingArgs {
    pub staking_status: String,
}

trait FungibleTokenReceiver {
    fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128>;
}

#[near_bindgen]
impl FungibleTokenReceiver for Contract {
    fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128> {
        let StakingArgs {
            staking_status,
        } = near_sdk::serde_json::from_str(&msg).expect("Invalid PurchaseArgs");

        let ft_token_id = env::predecessor_account_id();
        assert!(amount.0 > 0, "Amount must be greater than 0");

        if (ft_token_id == self.token_a_contract_id) || (ft_token_id == self.token_b_contract_id) {
            self.update_claim_amounts();

            let mut a_plus = U128(0);
            let mut b_plus = U128(0);
            let mut weight_plus = U128(0);

            if ft_token_id == self.token_a_contract_id {
                a_plus = amount;
                weight_plus = U128::from(u128::from(a_plus).checked_mul(6).unwrap().checked_div(10).unwrap());
            } else if ft_token_id == self.token_b_contract_id {
                b_plus = amount;
                weight_plus = U128::from(u128::from(b_plus).checked_mul(4).unwrap().checked_div(10).unwrap());
            }
            self.staked_weight = U128::from(u128::from(self.staked_weight).checked_add(u128::from(weight_plus)).unwrap());
            let stake_info : Option<StakeInfo> = self.staking_informations.get(&sender_id);
            if (stake_info == None){
                self.staking_informations.insert(
                    &sender_id,
                    &StakeInfo {
                        owner_id: sender_id.clone(),
                        token_a_amount: a_plus,
                        token_b_amount: b_plus,
                        stake_weight: weight_plus,
                        reward_to_claim: U128(0),
                        created_at: env::block_timestamp() / 1000000,
                        claimed_at: env::block_timestamp() / 1000000,
                    },
                );
            } else {
                let mut info = stake_info.unwrap();
                info.token_a_amount = U128::from(u128::from(info.token_a_amount).checked_add(u128::from(a_plus)).unwrap());
                info.token_b_amount = U128::from(u128::from(info.token_b_amount).checked_add(u128::from(b_plus)).unwrap());
                info.stake_weight = U128::from(u128::from(info.stake_weight).checked_add(u128::from(weight_plus)).unwrap());
                info.claimed_at = env::block_timestamp() / 1000000;

                self.staking_informations.insert(
                    &sender_id,
                    &info
                );
            }
        }
        PromiseOrValue::Value(U128(0))
    }
}
