import { extensionInstallMessage } from '../content'
import { WalletModule, Helpers, CommonWalletOptions } from '../../../interfaces'

import sparrowIcon from '../wallet-icons/icon-sparrow.png'
import sparrowIcon2x from '../wallet-icons/icon-sparrow@2x.png'

function sparrow(
  options: CommonWalletOptions & { isMobile: boolean }
): WalletModule {
  const { preferred, label, iconSrc, svg } = options

  return {
    name: label || 'Sparrow',
    iconSrc: iconSrc || sparrowIcon,
    iconSrcSet: iconSrc || sparrowIcon2x,
    svg,
    wallet: async (helpers: Helpers) => {
      const {
        getProviderName,
        createModernProviderInterface,
        createLegacyProviderInterface
      } = helpers

      const provider =
        (window as any).ethereum ||
        ((window as any).web3 && (window as any).web3.currentProvider)

      return {
        provider,
        interface:
          provider && getProviderName(provider) === 'Sparrow'
            ? typeof provider.enable === 'function'
              ? createModernProviderInterface(provider)
              : createLegacyProviderInterface(provider)
            : null
      }
    },
    type: 'injected',
    link: 'https://ubiqsmart.com/sparrow',
    installMessage: extensionInstallMessage,
    desktop: true,
    mobile: true,
    preferred
  }
}

export default sparrow
