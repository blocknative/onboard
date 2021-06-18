import { mobileWalletInstallMessage } from '../content'
import { WalletModule, Helpers, CommonWalletOptions } from '../../../interfaces'

import tpIcon from '../wallet-icons/icon-tp.png'
import tpIcon2x from '../wallet-icons/icon-tp@2x.png'

function tp(options: CommonWalletOptions): WalletModule {
  const { preferred, label, iconSrc, svg } = options

  return {
    name: label || 'tp',
    iconSrc: iconSrc || tpIcon,
    iconSrcSet: iconSrc || tpIcon2x,
    svg,
    wallet: async (helpers: Helpers) => {
      const { getProviderName, createModernProviderInterface } = helpers

      const provider =
        (window as any).ethereum ||
        ((window as any).web3 && (window as any).web3.currentProvider)

      return {
        provider,
        interface:
          (getProviderName(provider) === 'tp' &&
            createModernProviderInterface(provider)) ||
          null
      }
    },
    type: 'injected',
    link: 'https://tokenpocket.jp',
    installMessage: mobileWalletInstallMessage,
    mobile: true,
    preferred
  }
}

export default tp
