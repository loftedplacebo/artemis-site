# Artemis Moon

Artemis Moon is a mission-agnostic lunar token for the Artemis era. The token symbol is `ARMN`, the primary domain is `artemismoon.io`, and the ERC-20 token metadata is:

```text
name: Artemis Moon
symbol: ARMN
```

The project was previously developed around a more mission-specific Artemis III narrative. It has been repositioned around the broader return-to-the-Moon story so the brand can survive future NASA schedule and mission-architecture changes. Artemis Moon is an independent community token inspired by lunar exploration; it is not affiliated with, endorsed by, sponsored by, or officially connected to NASA, the Artemis programme, or any government space agency.

## App

```bash
npm install
npm run dev
npm run build
```

Open `http://localhost:3000` to view the site locally.

## Contracts

```bash
cd contracts
npm install
npm test
npm run compile
```

Key Solidity artifacts:

- `ArtemisMoonToken`: fixed-supply ERC-20 minted once to the treasury.
- `ArtemisMoonPresaleV2`: ETH, USDT, and USDC presale with Chainlink ETH/USD pricing.
- `ArtemisMoonTeamLock`: immutable team allocation lock.

The tokenomics and presale mechanics are intended to remain unchanged by the rebrand: 10,000,000 total ARMN supply, 18 decimals, 5,000,000 ARMN presale allocation, existing staged batch pricing, and the existing team unlock policy.

## Mainnet Contracts

- ARMN token: `0x238758537aFEe539618E989E709C5A3CdAA5E085`
- Presale contract: `0x522d50D62ad5cE05D3F7791e02B7E99D44364368`
- Team lock: `0x889BCF67483178243e2F0c326E5DdC3F8C0C5F6f`
- Treasury wallet: `0x5086015C34CA9b716aa74Bba93FD3C9f0d5eb658`

The team lock is funded with 500,000 ARMN and cannot release before 1 January 2029 at 00:00 UTC. The presale contract is funded with 5,000,000 ARMN. Sale and claims remain controlled by the contract owner and should be enabled only when the public presale is ready.
