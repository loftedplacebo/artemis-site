export const DEPLOYMENT_PARAMS = {
  token: {
    name: "Artemis",
    symbol: "ARTM3"
  },
  chainlink: {
    sepoliaEthUsdFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    maxPriceFeedAge: "86400"
  },
  presale: {
    presaleTokenCap: "5000000000000000000000000", // 5,000,000 * 1e18
    minimumPurchaseUsd: "25000000", // $25 * 1e6
    batchCaps: [
      "500000000000000000000000",
      "750000000000000000000000",
      "1000000000000000000000000",
      "1000000000000000000000000",
      "1250000000000000000000000",
      "500000000000000000000000"
    ],
    batchPricesUsd: [
      "250000",
      "400000",
      "550000",
      "700000",
      "800000",
      "900000"
    ]
  }
} as const;
