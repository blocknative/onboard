import { extensionInstallMessage, mobileWalletInstallMessage } from '../content'
import { WalletModule, Helpers, ArkaneOptions } from '../../../interfaces'

import { openLink } from '../../../utilities'

import arkaneIcon from '../wallet-icons/icon-arkane'

function arkane(options: ArkaneOptions): WalletModule {
  const {
    /* Common Wallet Options */
    preferred,
    label = 'Arkane',
    iconSrc,
    svg = arkaneIcon,
    isMobile,
    /* Arkane Wallet Options */
    clientId,
    environment,
    windowMode,
    bearerTokenProvider,
    authenticationOptions,
    skipAuthentication,
    secretType
  } = options

  return {
    name: label,
    iconSrc,
    svg,
    wallet: async (helpers: Helpers) => {
      const { getProviderName, createModernProviderInterface } = helpers

      const { Arkane } = await import('@arkane-network/web3-arkane-provider')

      const provider = await Arkane.createArkaneProviderEngine({
        clientId,
        environment,
        windowMode,
        bearerTokenProvider,
        authenticationOptions,
        skipAuthentication,
        secretType
      })

      return {
        provider,
        interface:
          provider && getProviderName(provider) === 'Arkane'
            ? {
                ...createModernProviderInterface(provider),
                dashboard: () => openLink('https://app.arkane.network/')
              }
            : null
      }
    },
    type: 'injected',
    link: `https://arkane.network/`,
    installMessage: isMobile
      ? mobileWalletInstallMessage
      : extensionInstallMessage,
    desktop: true,
    mobile: true,
    preferred
  }
}

export default arkane
