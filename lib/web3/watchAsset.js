import { ARTEMIS_CONTRACTS } from './artemisContracts';

export const ARTEMIS_TOKEN_WATCH_ASSET = {
  type: 'ERC20',
  options: {
    address: ARTEMIS_CONTRACTS.token,
    symbol: 'ARMN',
    decimals: 18,
    image: 'https://artemismoon.io/favicon.ico',
  },
};

export async function watchArtemisToken(connector) {
  const injectedProvider =
    typeof window !== 'undefined' && window.ethereum ? window.ethereum : null;
  const connectorProvider = connector?.getProvider ? await connector.getProvider() : null;
  const provider = connectorProvider?.request ? connectorProvider : injectedProvider;

  if (!provider?.request) {
    throw new Error('This wallet does not expose token import support.');
  }

  return provider.request({
    method: 'wallet_watchAsset',
    params: ARTEMIS_TOKEN_WATCH_ASSET,
  });
}
