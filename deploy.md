near create-account staking_test_5.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 10

near create-account vac_token_test_4.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 10

near deploy --accountId staking_test_5.xuguangxia.testnet --wasmFile out/vexedapes_staking.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet"}'

near deploy --accountId vac_token_test_4.xuguangxia.testnet --wasmFile out/vac.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet"}'