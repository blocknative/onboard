import { CommonWalletOptions, Helpers, WalletModule } from '../../../interfaces'
import { extensionInstallMessage, mobileWalletInstallMessage } from '../content'
import { binanceChainWalletLogo } from '../wallet-icons/icon-binance-chain-wallet'

function binanceChainWallet(
  options: CommonWalletOptions & { isMobile: boolean }
): WalletModule {
  const { preferred, label, iconSrc, svg, isMobile } = options

  return {
    name: label || 'Binance Chain Wallet',
    iconSrc: iconSrc || binanceChainWalletLogo,
    iconSrcSet: iconSrc || binanceChainWalletLogo,
    svg: svg || binanceChainWalletLogo,
    wallet: async (helpers: Helpers) => {
      const { createModernProviderInterface } = helpers

      // Ref: https://binance-wallet.gitbook.io/binance-chain-extension-wallet
      const provider = (window as any).BinanceChain

      return {
        provider,
        interface: provider && createModernProviderInterface(provider)
      }
    },
    type: 'injected',
    link: 'https://docs.binance.org/smart-chain/wallet/binance.html#download-link',
    installMessage: isMobile
      ? mobileWalletInstallMessage
      : extensionInstallMessage,
    desktop: true,
    mobile: false,
    preferred
  }
}

export default binanceChainWallet
