use crate::*;

//No need to fix
pub(crate) fn hash_account_id(account_id: &AccountId) -> CryptoHash {
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

// You can define internal functions here you can see here all the functions are declared like "pub(crate)"

impl Contract {
    pub(crate) fn assert_owner(&self) {
        assert_eq!(
            &env::predecessor_account_id(),
            &self.owner_id,
            "Owner's method"
        );
    }

    pub(crate) fn update_claim_amounts(&mut self) {
        let keys_as_vector = self.staking_informations.keys_as_vector();
        let keys_vec = keys_as_vector.to_vec();
        for key in keys_vec.iter() {
            let mut stake_info: StakeInfo = self.staking_informations
                .get(&key)
                .unwrap();
            let now_time = env::block_timestamp() / 1000000;
            stake_info.reward_to_claim = U128::from(u128::from(stake_info.reward_to_claim).checked_add(u128::from(stake_info.stake_weight).checked_mul(10000000000).unwrap().checked_div(u128::from(self.staked_weight)).unwrap().checked_mul(u128::from((now_time - stake_info.claimed_at)/1000)).unwrap()).unwrap());
            stake_info.claimed_at = now_time;
            self.staking_informations
                .insert(&key, &stake_info);
        }
    }

}
