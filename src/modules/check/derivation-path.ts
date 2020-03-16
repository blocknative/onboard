import { WalletCheckModal, StateAndHelpers } from '../../interfaces'
import { usbIcon } from './icons'

interface DerivationPaths {
  [key: string]: Array<{ path?: string; label: string }>
}

const derivationPaths: DerivationPaths = {
  Ledger: [
    { path: `m/44'/60'/0'`, label: 'Ethereum' },
    { path: `m/44'/60'`, label: 'Ethereum Ledger Live' }
  ],
  Trezor: [{ path: `m/44'/60'/0'/0`, label: 'Ethereum' }]
}

const styles = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const baseStyles = `
  background: inherit;
  font-size: 0.889em;
  font-family: inherit;
  border-width: 1px;
  border-style: solid;
  border-color: inherit;
  border-radius: 40px;
  margin-top: 0.5rem;
  padding: 0.55em 1.4em;
  cursor: pointer;
  color: inherit;
  font-family: inherit;
  transition: background 150ms ease-in-out;
  line-height: 1.15;
`

const buttonStyles = `
  cursor: pointer;
`

const selectedStyles = `
  border: 1px solid #4a90e2;
`

const errorStyles = `
  border: 1px solid #e2504a;
`

const errorMsgStyles = `
  font-size: 0.889em;
  font-family: inherit;
  color: #e2504a;
`

const customInputHtmlString = (error?: string) => {
  return `
    <input 
      id="custom-derivation-input" 
      style="${baseStyles + selectedStyles + (error ? errorStyles : '')}" 
      type="text" 
      placeholder="custom derivation path" 
      onchange="window.handleCustomInput(this.value)" />
    `
}

function derivationPath(options: {
  heading: string
  description: string
  icon: string
}) {
  const { heading, description, icon } = options

  let state = {
    completed: false,
    showCustomInput: false,
    dPath: '',
    loading: false,
    error: ''
  }

  function derivationSelectHtmlString(walletName: string) {
    return `
      <div id="derivation-select" style="${styles}">
        ${derivationPaths[walletName]
          .map((derivation: { path?: string; label: string }) => {
            const { path, label } = derivation
            return `
              <button style="${baseStyles +
                buttonStyles +
                (state.dPath === path
                  ? selectedStyles
                  : '')}" onclick="window.handleDerivationClick(this)" data-path="${path}">
                ${label} - ${path}
              </button>
            `
          })
          .join(' ')}
        ${
          state.showCustomInput
            ? customInputHtmlString(state.error)
            : `<button style="${baseStyles +
                buttonStyles}" onclick="window.handleDerivationClick(this)" data-path="custom">Custom Path</button>`
        }
        ${
          state.loading
            ? `<div class="bn-onboard-custom bn-onboard-loading" style="margin-top: 1rem">
                <div class="bn-onboard-loading-first"></div>
                <div class="bn-onboard-loading-second"></div>
                <div class="bn-onboard-loading-third"</div>
              </div>`
            : state.error
            ? `<span style="${errorMsgStyles}">${state.error}</span>`
            : ''
        }
      </div>
    `
  }

  function resetState() {
    state.completed = false
    state.showCustomInput = false
    state.dPath = ''
    state.loading = false
    state.error = ''
  }

  function checkModule(
    stateAndHelpers: StateAndHelpers
  ): WalletCheckModal | undefined {
    const { wallet } = stateAndHelpers

    if (wallet && wallet.type === 'hardware' && !state.completed) {
      const handleCustomInput = () => {
        const input = <HTMLInputElement>(
          document.getElementById('custom-derivation-input')
        )

        state.dPath = input && input.value
        state.error = ''
      }

      const handleDerivationClick = (button: any) => {
        const selectedPath = button.dataset.path

        if (selectedPath === 'custom') {
          state.showCustomInput = true
          state.dPath = ''
          setTimeout(() => {
            const input = document.getElementById('custom-derivation-input')
            input && input.focus()
          }, 100)
        } else {
          state.error = ''
          state.showCustomInput = false
          state.dPath = selectedPath
        }
      }

      const deleteWindowProperties = () => {
        delete (window as any).handleCustomInput
        delete (window as any).handleDerivationSelect
      }
      ;(window as any).handleCustomInput = handleCustomInput
      ;(window as any).handleDerivationClick = handleDerivationClick

      return {
        heading: heading || 'Hardware Wallet Connect',
        description:
          description ||
          `Please select a derivation path to connect your ${wallet.name} accounts, or select custom to input a custom path:`,
        eventCode: 'derivationPath',
        html: derivationSelectHtmlString(wallet.name),
        button: {
          text: 'Connect',
          onclick: async () => {
            state.loading = true
            const path = state.dPath || derivationPaths[wallet.name][0].path
            const validPath = await wallet.provider.setPath(
              path,
              state.showCustomInput
            )

            if (!validPath) {
              state.error = `${path} is not a valid derivation path`
              state.loading = false
              return
            }

            state.error = ''

            wallet.connect &&
              wallet.connect().then(() => {
                // @TODO add path to local store

                deleteWindowProperties()
                state.loading = false
                state.completed = true
              })
          }
        },

        icon: icon || usbIcon
      }
    }
  }

  checkModule.reset = resetState

  return checkModule
}

export default derivationPath