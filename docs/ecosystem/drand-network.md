# Drand Network Integration

This documentation explains the integration of the drand randomness beacon network with the OmniDragon ecosystem.

## What is drand?

drand is a distributed randomness beacon that provides publicly verifiable, unpredictable and unbiasable random values at regular intervals. The randomness is generated in a distributed way by a set of nodes and is available for free to anyone.

## Supported Networks

The OmniDragon system currently supports the following drand networks:

1. **League of Entropy Mainnet**
   - Chain Hash: `8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce`
   - Period: 30 seconds
   - Public Key: `868f005eb8e6e4ca0a47c8a77ceaa5309a47978a7c71bc5cce96366b5d7a569937c529eeda66c7293784a9402801af31`

2. **Quicknet**
   - Chain Hash: `52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971`
   - Period: 3 seconds
   - Public Key: `83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a`

3. **EVMnet**
   - Chain Hash: `04f1e9062b8a81f848fded9c12306733282b2727ecced50032187751166ec8c3`
   - Period: 3 seconds
   - Public Key: `07e1d1d335df83fa98462005690372c643340060d205306a9aa8106b6bd0b3820557ec32c2ad488e4d4f6008f89a346f18492092ccc0d594610de2732c8b808f0095685ae3a85ba243747b1b2f426049010f6b73a0cf1d389351d5aaaa1047f6297d3a4f9749b33eb2d904c9d9ebf17224150ddd7abd7567a9bec6c74480ee0b`
   - Blockchain Optimized: Uses BLS-BN254 cryptographic curve which has native support in Ethereum and other EVM chains, resulting in lower gas costs for on-chain verification

## Multi-Source Randomness Aggregation

OmniDragon uses a unique multi-source randomness approach to enhance security and reliability:

### System Architecture

[![](https://mermaid.ink/img/pako:eNqdVmtv4jgU_SuWK8SORLskTihEq5Fa-lAlpjttR_0ww34wyU1ikdiR40zLVPz3vU4KBDpTUbAUfHzPub4Pxc4LDVUENKCdzstUEiKkMAGpp4R0TQo5dAPSnfESur326iPXgs8yKLtrOppiJc2D-FVrnEHxvNKgqdAi53oxVpnS1nwU17-3jG_wbDYs17HjLetc6Qj0hnd-YUeLlwkJG_Po0o6W2YA2YiueK9-ObsNYrpKNM_UUplybrTxTk2cTPoPMpm90BRvHYaV_rmomytaOEgv9UPBQyATNp_2NRXM531gG_dcQ7B8-lp3OVNqxDoV8O28oZTVLNC9SMqX3XEYql1CW5EFVOoRySlcbEDJRlz-mdAI8qYComFxKo1Wx-Gem__7M-iX5ClqoaEr_20jublFxV4lwLsE0xN_yLh-_IBGf79PGE2SNUy4kNmZOHu-v1maQUTN5k9SNNIBzI5QkE74A3c7pxkGPF5onSqK3FVXpOoi_MONPWwHcuO_RV4nuaNh7mibnHYXXTnNLtEe-Z0miIflDvmfX1-j731yKdURjJcsqh9d4XL9DnkAkqSHAw_TTHhuuHLzdbWyre81zIMgxmoem3O6nLeeVkFyGgmfkrCgyEdaR7_BsCa_VT9CWCuRhURrIyz_Fhm0jx8efsbkNvrttoNtALHmDWYPHkwZ6bR83Tr2I9XrF7g5mO9jbxs0TYb08dnawu4OZfTfruppFBnUGsciy4CgeRT74vRJftTkER4yx1_nxk4hMGjjFc1uIqR6kszU5SIjF-6CurcYqN2qof3vvit04TMcO1Hkf1bXVtsuNPBrGQ3A-KB-vijRj0I_j_VvjHqhj--tojyZaRDSIeVZCj-IxkHOLaX3PTWl9z09pgNOI67k9HZYoKrj8rlROg_reo1pVSbp2UhURN3AhOJ4w-XpV41tuL-tKGhq4rlM7ocELfaaBM3JP3IE_8J2hw5jnDAY9ukCW1z9hzqjPRj479YanPlv26K963_7J0D31-95g5HkDZ-i6Xo9CJPCI_dJ8y9SfNMv_AaBxqwM)](https://mermaid.live/edit#pako:eNqdVmtv4jgU_SuWK8SORLskTihEq5Fa-lAlpjttR_0ww34wyU1ikdiR40zLVPz3vU4KBDpTUbAUfHzPub4Pxc4LDVUENKCdzstUEiKkMAGpp4R0TQo5dAPSnfESur326iPXgs8yKLtrOppiJc2D-FVrnEHxvNKgqdAi53oxVpnS1nwU17-3jG_wbDYs17HjLetc6Qj0hnd-YUeLlwkJG_Po0o6W2YA2YiueK9-ObsNYrpKNM_UUplybrTxTk2cTPoPMpm90BRvHYaV_rmomytaOEgv9UPBQyATNp_2NRXM531gG_dcQ7B8-lp3OVNqxDoV8O28oZTVLNC9SMqX3XEYql1CW5EFVOoRySlcbEDJRlz-mdAI8qYComFxKo1Wx-Gem__7M-iX5ClqoaEr_20jublFxV4lwLsE0xN_yLh-_IBGf79PGE2SNUy4kNmZOHu-v1maQUTN5k9SNNIBzI5QkE74A3c7pxkGPF5onSqK3FVXpOoi_MONPWwHcuO_RV4nuaNh7mibnHYXXTnNLtEe-Z0miIflDvmfX1-j731yKdURjJcsqh9d4XL9DnkAkqSHAw_TTHhuuHLzdbWyre81zIMgxmoem3O6nLeeVkFyGgmfkrCgyEdaR7_BsCa_VT9CWCuRhURrIyz_Fhm0jx8efsbkNvrttoNtALHmDWYPHkwZ6bR83Tr2I9XrF7g5mO9jbxs0TYb08dnawu4OZfTfruppFBnUGsciy4CgeRT74vRJftTkER4yx1_nxk4hMGjjFc1uIqR6kszU5SIjF-6CurcYqN2qof3vvit04TMcO1Hkf1bXVtsuNPBrGQ3A-KB-vijRj0I_j_VvjHqhj--tojyZaRDSIeVZCj-IxkHOLaX3PTWl9z09pgNOI67k9HZYoKrj8rlROg_reo1pVSbp2UhURN3AhOJ4w-XpV41tuL-tKGhq4rlM7ocELfaaBM3JP3IE_8J2hw5jnDAY9ukCW1z9hzqjPRj479YanPlv26K963_7J0D31-95g5HkDZ-i6Xo9CJPCI_dJ8y9SfNMv_AaBxqwM)

### OmniDragonVRFConsumer

The `OmniDragonVRFConsumer` contract is the cornerstone of our randomness infrastructure. It:

1. **Aggregates Multiple Sources**: Combines randomness from all supported drand networks plus Chainlink VRF
2. **Weighted Aggregation**: Assigns configurable weights to each source (default is 25% per source)
3. **Fault Tolerance**: Continues to function even if one or more sources are temporarily unavailable
4. **Verifiable**: All randomness is cryptographically verifiable

### Randomness Buffer Design

A key security feature of OmniDragonVRFConsumer is the randomness buffer system:

[![](https://mermaid.ink/img/pako:eNqdVmuPojAU_StNJ8bZRF2h-IBsJplhnGQT3A3rrB923Q8VijZiIaXM6Ez871tAEFAyD5sgnnPu7bm1vekrdAKXQAO2Wq8LBgBlVBggfQWgLdZkS9oGaC9xRNqdMjrHnOKlT6J2IZeUFzAxoy9pjDIMd3mMpEJOt5jvzcAPeEJfeennXPFIduKkUpVknKvuAu4SftLd3SejpPMpIydanySjRAvCBa34eRgko50pDnmxnh88O2vMRaXOtdj6Fl4SPylf8JicEjsxf8rXjEalGZlc6FmIHcpWkh71TwzHbHNihv2jheRLPg6t1oIlY8VxuAaP9xkdxcsMWMDJfMqIAHex5xEOrpU-eMJ-TKIvC5jPAcBkrvxdwHlCAGUB_5UZtWDUGoMKBtUYTTK9Xq-GDk5z9AuKMDd7OXNux9TZvO3dbvRuN3q3G73bF73bH_VuEbyS2sADEyZ4EO7fKMJqLMJqLMJqLMK6WIT10SLMNaZMHpXNG-bNRvNmo3mz0bx50bz5LvPTyeOtlE2JwF15cNxgy0gUfVvyrzfXLpHHeisPfgQi4hNH0IB9KRJlz8l8JsNnKU1ccDw76ayF0q5qil1aVVlVlRVMagKzKjitdVWWPR--_7i1pPyBMuyD3yzkxKWOSHpsWtyvolbwMxZhLGrxybqAbvcmKbCG2GeIdYaYOZKvklJNJptEHUB1QKsDgyqQL65SdWUfU5cAVAe0OjCoAvk_olTLs46pSwCqA1odGFSB_L9UqutkHlOXAFQHtDowuLzWsxROd0CxAeuQdQ6Z59DxgIu9TzIYeNT3jStPH3Yi2aU2xLhCCB3fu8_UFWtDDXfluHRPZGGOTt4dlpSRRemO1xylVKPsT0VZn4oy3x0FO3DFqQsND_sR6cCtbCs4-Q3TO8ACpnegBTTkq4v5JmmVBxkUYvYnCLbQSO8EkAfxal0kiUMXC3JPsWy-2wLlsr8lF5mYCWioo0GaBBqvcAcNpT_sDZE2UocjHal9tS_ZPTSk495YH48VHY2Qjsbj4aEDX9J5-z2JaepIVzQNIU1XUAfKPiICPs3ueel17_AfL07Lhg?type=png)](https://mermaid.live/edit#pako:eNqdVmuPojAU_StNJ8bZRF2h-IBsJplhnGQT3A3rrB923Q8VijZiIaXM6Ez871tAEFAyD5sgnnPu7bm1vekrdAKXQAO2Wq8LBgBlVBggfQWgLdZkS9oGaC9xRNqdMjrHnOKlT6J2IZeUFzAxoy9pjDIMd3mMpEJOt5jvzcAPeEJfeennXPFIduKkUpVknKvuAu4SftLd3SejpPMpIydanySjRAvCBa34eRgko50pDnmxnh88O2vMRaXOtdj6Fl4SPylf8JicEjsxf8rXjEalGZlc6FmIHcpWkh71TwzHbHNihv2jheRLPg6t1oIlY8VxuAaP9xkdxcsMWMDJfMqIAHex5xEOrpU-eMJ-TKIvC5jPAcBkrvxdwHlCAGUB_5UZtWDUGoMKBtUYTTK9Xq-GDk5z9AuKMDd7OXNux9TZvO3dbvRuN3q3G73bF73bH_VuEbyS2sADEyZ4EO7fKMJqLMJqLMJqLMK6WIT10SLMNaZMHpXNG-bNRvNmo3mz0bx50bz5LvPTyeOtlE2JwF15cNxgy0gUfVvyrzfXLpHHeisPfgQi4hNH0IB9KRJlz8l8JsNnKU1ccDw76ayF0q5qil1aVVlVlRVMagKzKjitdVWWPR--_7i1pPyBMuyD3yzkxKWOSHpsWtyvolbwMxZhLGrxybqAbvcmKbCG2GeIdYaYOZKvklJNJptEHUB1QKsDgyqQL65SdWUfU5cAVAe0OjCoAvk_olTLs46pSwCqA1odGFSB_L9UqutkHlOXAFQHtDowuLzWsxROd0CxAeuQdQ6Z59DxgIu9TzIYeNT3jStPH3Yi2aU2xLhCCB3fu8_UFWtDDXfluHRPZGGOTt4dlpSRRemO1xylVKPsT0VZn4oy3x0FO3DFqQsND_sR6cCtbCs4-Q3TO8ACpnegBTTkq4v5JmmVBxkUYvYnCLbQSO8EkAfxal0kiUMXC3JPsWy-2wLlsr8lF5mYCWioo0GaBBqvcAcNpT_sDZE2UocjHal9tS_ZPTSk495YH48VHY2Qjsbj4aEDX9J5-z2JaepIVzQNIU1XUAfKPiICPs3ueel17_AfL07Lhg)

#### How It Works

1. **Buffering**: Each randomness source (EVMnet, Quicknet, League of Entropy, Chainlink) maintains a buffer of the 10 most recent randomness values
   
2. **Unpredictable Selection**: When randomness is requested:
   - The system generates "meta-randomness" using a combination of block information and timestamp
   - This meta-randomness determines which value is selected from each buffer
   - The value selection process cannot be predicted in advance, even by block producers

3. **Aggregation**: After selecting values from each buffer, they are:
   - Combined using a weighted function (25% contribution from each source)
   - Processed through a one-way hash function to create the final randomness value

4. **Enhanced Unpredictability**: This approach provides significantly stronger guarantees than using only the latest randomness values because:
   - Even if an attacker knows all current buffer values, they cannot predict which will be selected
   - The selection mechanism depends on future block data, making front-running difficult
   - Each source has 10 possible values, creating 10^4 = 10,000 possible combinations

### Request and Fulfillment Flow

The following sequence diagram illustrates how randomness is requested and fulfilled:

[![](https://mermaid.ink/img/pako:eNqVlGtvmzAUhv-K5SlKJ9GOSyAJmir1KlVqu63t-mHKFwcOxArY7GCaXpT_PhsSoEsqbbGEwed5j49fx36jkYyBhnQweJsJQrjgKiT1KyFDtYAchiEZzlkJQ6s_-siQs3kG5bDFdSiRQt3z11rjBMXzVqNDBfKc4cuZzCSa8Kek_u0SD_CsOsp1TNulTiXGgB13em5aj8u4gC48vTCtF1aAir-r59I3bdgQ6-1ik0yuogVD9W6dC5Vn12wOmVm-wgq6xFGFT1vPeNmbUWij7wsWcZHq8NjuIsjEsosE9qYE0-nHejCYCdNK-F2BiOCcsxRZ3lCFLo1HvGBCkZOiIKw0XcYjprgU5ExvCLJI7cLfcsENbfpzZKkUj3eXGi-rHHAXvxLKMXiL6gHQZSiJ5OBaXnzeK3E_lFw83ghQ-1Xeh6ofFY-W-3V3kLGXjVDEm897wCcegXHP8NqZw-Njs-KQoHGzVHcalrmAsjzYJDXhQ41puKWu4iZ2KxUQ-QRImiQP2ttluaUapnnW8-ssxreQ3MKKYDsTSVDmRJu2g7r70casHdrbT29N6pdjymiX_rOImV6HRlYSlz19y7r_wXr_yu638CRNEVKj6_ivc_xyvOJqQVbA04V6l6Den832JFWW8CzrbWK7YVYv3-e_p67F31FGxrSOoxZNkcc0TFhWgkX1SciZ-ab10Z_R-uqb0VC_xgyXM6qPpxbpP-AvKXMa1lcBRVmlizZJVbuyObTtKIKo769KKBq6zrhOQsM3-kxDZ-oeuYEf-M7E8byREwQWfdHUyD7ynKntTX1vPJqMfW9t0dd6Xvto4o59exRMPN-x7bHtWhRirs_MTXO917f8-g_9H-Yq)](https://mermaid.live/edit#pako:eNqVlGtvmzAUhv-K5SlKJ9GOSyAJmir1KlVqu63t-mHKFwcOxArY7GCaXpT_PhsSoEsqbbGEwed5j49fx36jkYyBhnQweJsJQrjgKiT1KyFDtYAchiEZzlkJQ6s_-siQs3kG5bDFdSiRQt3z11rjBMXzVqNDBfKc4cuZzCSa8Kek_u0SD_CsOsp1TNulTiXGgB13em5aj8u4gC48vTCtF1aAir-r59I3bdgQ6-1ik0yuogVD9W6dC5Vn12wOmVm-wgq6xFGFT1vPeNmbUWij7wsWcZHq8NjuIsjEsosE9qYE0-nHejCYCdNK-F2BiOCcsxRZ3lCFLo1HvGBCkZOiIKw0XcYjprgU5ExvCLJI7cLfcsENbfpzZKkUj3eXGi-rHHAXvxLKMXiL6gHQZSiJ5OBaXnzeK3E_lFw83ghQ-1Xeh6ofFY-W-3V3kLGXjVDEm897wCcegXHP8NqZw-Njs-KQoHGzVHcalrmAsjzYJDXhQ41puKWu4iZ2KxUQ-QRImiQP2ttluaUapnnW8-ssxreQ3MKKYDsTSVDmRJu2g7r70casHdrbT29N6pdjymiX_rOImV6HRlYSlz19y7r_wXr_yu638CRNEVKj6_ivc_xyvOJqQVbA04V6l6Den832JFWW8CzrbWK7YVYv3-e_p67F31FGxrSOoxZNkcc0TFhWgkX1SciZ-ab10Z_R-uqb0VC_xgyXM6qPpxbpP-AvKXMa1lcBRVmlizZJVbuyObTtKIKo769KKBq6zrhOQsM3-kxDZ-oeuYEf-M7E8byREwQWfdHUyD7ynKntTX1vPJqMfW9t0dd6Xvto4o59exRMPN-x7bHtWhRirs_MTXO917f8-g_9H-Yq)

### Benefits of Multi-Source Randomness

The security advantages of OmniDragon's multi-source approach compared to traditional single-source solutions:

[![](https://mermaid.ink/img/pako:eNqdVUtv4jAQ_iuWK8QFUB48mhxWaqHspWi1BOWwSQ8mMcTCsSPH2UIr_vtOQiFhYbUIWyLDzPfNjGf8-MSRjCl2cav1GQqEmGDaRZWIUFsnNKVtF7WXJKftTlPrE8XIktO8fYKDaSWF9thHxTGH2fbIAVOmWErUbiy5VKX5YVWNS8SCbnWNssxyXqKepYqpqnHPk3I2cJwJWpudl3I2zJoqzc7ymQ7K2T4g9sfFrrh8jxKi9Nk6E53yV7KkvFy-VgWtHUeF-n2sGcsbEQUU2stIxMQazCOjtigiNrVlaHylUH7gZ99qhSIUa0WyBC0mB2NeLA-KEC8UiZlmUhCOnrJMSRIlIT46R8gzAw88c4rmRMQyFTTPkScLFdG3GuWbgV9wQRVZMs707q3pAHW7XUA00ZVqagYLqSGut8s1TdGUMF6oo1sq4oNwkfKPVLCJImsprmY8g5RfKVkXFMkVehFayayZ0Myzghd_Jqg-U9rBz4JFm7_V_WCcECZgP2wa-lp6-h7U-fjz6ViKvEipugqeVcX4BqSzdK7o7Cu6_oWuUVIrGMsUipGynMaXDaoi96AN1vVFVK7nwVwui1w3Wv2PZugdbAhwuWKcu3AWHRidHCq9oe6DbdtfcvedxTpxzWzb5Pk1L4JxM29a84YwbuA12bNTuo5TJnxz2LJBdxLte4n9-4i-dV9lof_HeGXEm3nzRpr_oeEOXisWY3dFeE47GI5ISsr_uLoXQ1y9CyF2QYyJ2pQneg-kjIhfUqbYre5JrGSxTk5Oiiwmmk4YgashPWkV7Nbyci-Exq5l2JUT7H7iLXbNx37v0XFMw-ybtmEPzFEH7wD1aPaswWjojAzDGcF3uO_gjyqu0RuBqj80DNscGI4N7cAUrkypZoe3r3oC938ALkUWmQ)](https://mermaid.live/edit#pako:eNqdVUtv4jAQ_iuWK8QFUB48mhxWaqHspWi1BOWwSQ8mMcTCsSPH2UIr_vtOQiFhYbUIWyLDzPfNjGf8-MSRjCl2cav1GQqEmGDaRZWIUFsnNKVtF7WXJKftTlPrE8XIktO8fYKDaSWF9thHxTGH2fbIAVOmWErUbiy5VKX5YVWNS8SCbnWNssxyXqKepYqpqnHPk3I2cJwJWpudl3I2zJoqzc7ymQ7K2T4g9sfFrrh8jxKi9Nk6E53yV7KkvFy-VgWtHUeF-n2sGcsbEQUU2stIxMQazCOjtigiNrVlaHylUH7gZ99qhSIUa0WyBC0mB2NeLA-KEC8UiZlmUhCOnrJMSRIlIT46R8gzAw88c4rmRMQyFTTPkScLFdG3GuWbgV9wQRVZMs707q3pAHW7XUA00ZVqagYLqSGut8s1TdGUMF6oo1sq4oNwkfKPVLCJImsprmY8g5RfKVkXFMkVehFayayZ0Myzghd_Jqg-U9rBz4JFm7_V_WCcECZgP2wa-lp6-h7U-fjz6ViKvEipugqeVcX4BqSzdK7o7Cu6_oWuUVIrGMsUipGynMaXDaoi96AN1vVFVK7nwVwui1w3Wv2PZugdbAhwuWKcu3AWHRidHCq9oe6DbdtfcvedxTpxzWzb5Pk1L4JxM29a84YwbuA12bNTuo5TJnxz2LJBdxLte4n9-4i-dV9lof_HeGXEm3nzRpr_oeEOXisWY3dFeE47GI5ISsr_uLoXQ1y9CyF2QYyJ2pQneg-kjIhfUqbYre5JrGSxTk5Oiiwmmk4YgashPWkV7Nbyci-Exq5l2JUT7H7iLXbNx37v0XFMw-ybtmEPzFEH7wD1aPaswWjojAzDGcF3uO_gjyqu0RuBqj80DNscGI4N7cAUrkypZoe3r3oC938ALkUWmQ)

Key benefits:
- **Enhanced Security**: No single point of failure in randomness generation
- **Manipulation Resistance**: An attacker would need to compromise multiple independent networks
- **Network Diversity**: Different cryptographic schemes and node operators across networks
- **Blockchain Compatibility**: By including EVMnet, ensures efficient on-chain verification
- **Unpredictable Source Selection**: The buffering and selection mechanism adds another layer of security

## Integration Architecture

The drand integration in OmniDragon follows a multi-layered architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Drand Network  │────▶│ drand-relay-api │────▶│   Integration   │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Applications   │◀────│   Consumers     │◀────│   Verifier      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

Components:
1. **Integration Layer**: Receives randomness from the relay and validates it
2. **Verifier**: Verifies the signatures from drand
3. **Consumers**: Smart contracts that need randomness
4. **Applications**: Higher-level applications using randomness

## Usage in Smart Contracts

### Basic Usage with Single Source

To use drand randomness from a single source in a smart contract:

```solidity
// Import the DragonVRFConsumer
import "../drand/DragonVRFConsumer.sol";

contract MyRandomApp is DragonVRFConsumer {
    // Request ID tracking
    uint256 private requestId;
    
    // Constructor
    constructor(address _vrfIntegrator) DragonVRFConsumer(_vrfIntegrator) {}
    
    // Request randomness
    function getRandomNumber() external {
        requestId = requestRandomness();
    }
    
    // Receive randomness
    function _fulfillRandomness(uint256 _requestId, uint256 _randomness) internal override {
        // Use randomness here
    }
}
```

### Advanced Usage with OmniDragonVRFConsumer

For applications requiring maximum security, use the OmniDragonVRFConsumer:

```solidity
// Import the OmniDragonVRFConsumer interface
import "../drand/interfaces/IOmniDragonVRFConsumer.sol";

contract SecureRandomApp {
    // OmniDragonVRFConsumer reference
    IOmniDragonVRFConsumer public omniConsumer;
    
    // Request tracking
    mapping(uint256 => bool) public pendingRequests;
    uint256 public lastRandomValue;
    
    // Events
    event RandomnessRequested(uint256 requestId);
    event RandomnessReceived(uint256 requestId, uint256 randomValue);
    
    // Constructor
    constructor(address _omniConsumer) {
        omniConsumer = IOmniDragonVRFConsumer(_omniConsumer);
    }
    
    // Request aggregated randomness
    function getSecureRandomNumber() external {
        uint256 requestId = omniConsumer.requestRandomness(address(this));
        pendingRequests[requestId] = true;
        emit RandomnessRequested(requestId);
    }
    
    // Callback function for randomness fulfillment
    function fulfillRandomness(uint256 _requestId, uint256 _randomness) external {
        require(msg.sender == address(omniConsumer), "Only OmniConsumer can fulfill");
        require(pendingRequests[_requestId], "Request not found");
        
        lastRandomValue = _randomness;
        delete pendingRequests[_requestId];
        
        emit RandomnessReceived(_requestId, _randomness);
        
        // Use randomness here
    }
}
```

## Implementation Details

The drand integration uses the following components:

1. `DragonVRFIntegrator.sol` - Receives and distributes randomness from a single drand network
2. `DragonVRFConsumer.sol` - Base contract for consuming randomness from a single source
3. `OmniDragonVRFConsumer.sol` - Advanced consumer that aggregates randomness from multiple sources
4. `drand-relay-verifier` - Service that verifies and relays drand randomness

## Security Considerations

- Randomness is public and known to anyone once published
- There is a small delay between randomness generation and availability
- Consumers must protect against front-running attacks
- Using multiple sources (as OmniDragonVRFConsumer does) significantly enhances security
- Even with multiple sources, randomness should not be used for high-value secret generation without additional safeguards

## Further Reading

- [League of Entropy](https://leagueofentropy.com/)
- [drand Documentation](https://drand.love/docs/)
- [Randomness in Smart Contracts](https://docs.chain.link/docs/chainlink-vrf/) 