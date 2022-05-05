import {
    reactive
} from 'vue'

const store = {
    state: reactive({
        transactionHistory: []
    }),

    setTransaction(newValue) {
        this.state.transactionHistory = newValue
    },

    clearTransaction() {
        this.state.transactionHistory = []
    }
}

async function addTransaction({
    txHash,
    txState
}) {


    const newTransaction = {
        txHash,
        txState,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
        __typename: 'Transaction'
    }


    const index = store.state.transactionHistory.findIndex(
        trx => trx.txHash === txHash
    )
    const newTransactionHistory = [...store.state.transactionHistory]
    if (index >= 0) {
        newTransactionHistory[index] = {
            ...newTransactionHistory[index],
            txState,
            updatedAt: newTransaction.updatedAt
        }
    } else {
        newTransactionHistory.push(newTransaction)
    }

    const data = {
        transactionHistory: newTransactionHistory
    }
    store.setTransaction(data)

    return data
}

export async function sendHelper(txObj) {

    let txState = 'Pending'
    //   await addTransaction({
    //       txHash: txObj.hash,
    //       txState
    //   })

    const receipt = await txObj.wait()
    const txHash = receipt.transactionHash
    //   txState = 'Confirmed'
    //   await addTransaction({
    //       txHash,
    //      txState
    //  })

    return txHash
}



export async function sendHelperArray(arrayOfTxObj) {
    const promises = arrayOfTxObj.map(txObj => sendHelper(txObj))
    const values = await Promise.all(promises)
    return values
}