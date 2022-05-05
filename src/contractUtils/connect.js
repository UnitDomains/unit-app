import {
    setup,
    getRegistrar,
    getENS
} from 'contracts/api'

import {
    getBlock,
    getNetworkId,
    getProvider,
    getAccounts
} from 'contracts/web3.js'

export const isSupportedNetwork = networkId => {
    switch (networkId) {
        case 1:
        case 3:
        case 4:
            return true
        case 5:
        case 1337:
            return false
        default:
            return false
    }
}

const ConnectToInjected = async () => {
    let provider = null;
    if (typeof window.ethereum !== 'undefined') {
        provider = window.ethereum;
        try {
            await provider.request({
                method: 'eth_requestAccounts'
            })
        } catch (error) {
            throw new Error("User Rejected");
        }
    } else if (window.web3) {
        provider = window.web3.currentProvider;
    } else {
        throw new Error("No Web3 Provider found");
    }
    return provider;
};



function handleChainChanged(_chainId) {
    console.log("chainChanged")
    // We recommend reloading the page, unless you must do otherwise
    // window.location.reload();
}

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
    console.log("accountsChanged")
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        // Do any other work!
    }
}

export const setWeb3Provider = async provider => {

    if (provider == null) return
    //web3ProviderReactive(provider)

    const accounts = await getAccounts()

    if (provider) {
        provider.removeAllListeners()
        //   accountsReactive(accounts)
    }



    provider.on('chainChanged', async _chainId => {
        console.log("chainChanged")
        const networkId = await getNetworkId()
        if (!isSupportedNetwork(networkId)) {
            //globalErrorReactive('Unsupported Network')
            return
        }
        //networkIdReactive(networkId)
        //networkReactive(await getNetwork())
    })

    provider.on('accountsChanged', async accounts => {
        console.log("accountsChanged")
        //accountsReactive(accounts)
    })

    return provider
}



export const connect = async () => {
    try {



        await setup()


        const provider = await getProvider()

        if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
        }

        if (!provider) throw 'Please install a wallet'

        const networkId = await getNetworkId()

        ethereum.on('chainChanged', handleChainChanged);
        ethereum.on('accountsChanged', handleAccountsChanged);

        if (!isSupportedNetwork(networkId)) {
            //    globalErrorReactive('Unsupported Network')
            return
        }

        //networkIdReactive(await getNetworkId())
        //networkReactive(await getNetwork())

        await setWeb3Provider(provider)

        //  if (accountsReactive ? . [0]) {
        //      reverseRecordReactive(await getReverseRecord(accountsReactive ? . [0]))
        //  }

        //    isReadOnlyReactive(isReadOnly())

        //    setupAnalytics()

        //    isAppReadyReactive(true)

    } catch (e) {
        console.error('setup error: ', e)
    }
}

export const disconnect = async function () {


    const provider = await getProvider()

    console.log(provider)

    // Disconnect wallet connect provider
    if (provider && provider.disconnect) {
        provider.disconnect()
    }

}

export default async reconnect => {
    try {

        const provider = await getProvider()

        if (!provider) throw 'Please install a wallet'

        const networkId = await getNetworkId()

        if (!isSupportedNetwork(networkId)) {
            //    globalErrorReactive('Unsupported Network')
            return
        }

        //networkIdReactive(await getNetworkId())
        //networkReactive(await getNetwork())

        await setWeb3Provider(provider)

        //  if (accountsReactive ? . [0]) {
        //      reverseRecordReactive(await getReverseRecord(accountsReactive ? . [0]))
        //  }

        //    isReadOnlyReactive(isReadOnly())

        //    setupAnalytics()

        //    isAppReadyReactive(true)
    } catch (e) {
        console.error('setup error: ', e)
    }
}