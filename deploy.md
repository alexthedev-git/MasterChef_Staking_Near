near create-account masterchef_test_1.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 6

near create-account masterchef_test_2.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 6

near create-account masterchef_test_3.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 6

near create-account masterchef_test_4.xuguangxia.testnet --masterAccount xuguangxia.testnet --initialBalance 6

near deploy --accountId masterchef_test_1.xuguangxia.testnet --wasmFile out/masterchef.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet"}'

near deploy --accountId masterchef_test_2.xuguangxia.testnet --wasmFile out/token.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet", "token_name":"token_a", "token_symbol":"token_a", "account_name":"xuguangxia.testnet", "account_amount":"5000000000000000000000000000000"}'

near deploy --accountId masterchef_test_3.xuguangxia.testnet --wasmFile out/token.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet", "token_name":"token_b", "token_symbol":"token_b", "account_name":"xuguangxia.testnet", "account_amount":"5000000000000000000000000000000"}'

near deploy --accountId masterchef_test_4.xuguangxia.testnet --wasmFile out/token.wasm --initFunction new --initArgs '{"owner_id": "xuguangxia.testnet", "token_name":"token_c", "token_symbol":"token_c", "account_name":"masterchef_test_1.xuguangxia.testnet", "account_amount":"5000000000000000000000000000000"}'