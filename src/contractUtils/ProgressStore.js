import crypto from 'crypto'



function randomSecret() {
    return '0x' + crypto.randomBytes(32).toString('hex')
}

const Store = {
    get: label => {
        return window.localStorage.getItem('progress') ?
            JSON.parse(window.localStorage.getItem('progress'))[label] :
            null
    },
    set: (label, obj) => {
        let data = {}
        let progress
        if ((progress = window.localStorage.getItem('progress'))) {
            data = JSON.parse(progress)
        }
        data[label] = {
            ...data[label],
            ...obj
        }
        window.localStorage.setItem('progress', JSON.stringify(data))
    },
    remove: label => {
        let data = {}
        let progress
        if ((progress = window.localStorage.getItem('progress'))) {
            data = JSON.parse(progress)
        }
        delete data[label]
        window.localStorage.setItem('progress', JSON.stringify(data))
    }
}

export default class ProgressStore {

    constructor({
        domainName,
        networkId
    }) {

        this.domainName = domainName
        this.networkId = networkId
        this.getSavedStep()
    }

    remove() {
        const label = `${this.networkId}-${this.domainName}`
        Store.remove(label)
        return this.getSavedStep()
    }

    getDefault() {
        let secret = randomSecret()
        let years = 1
        let step = 0
        let commitmentExpirationDate = null //24小时有效期
        let secondsPassed = null
        let savedStep = {
            step,
            secret,
            years,
            commitmentExpirationDate,
            secondsPassed
        }

        return savedStep
    }

    getSavedStep() {
        const label = `${this.networkId}-${this.domainName}`
        let savedStep = Store.get(label)

        if (savedStep == null) {
            Store.set(label, this.getDefault())
        }

        return savedStep
    }

    setYears(years) {
        const label = `${this.networkId}-${this.domainName}`
        let savedStep = Store.get(label)

        if (savedStep != null) {
            savedStep.years = years
            Store.set(label, savedStep)
        }


        return savedStep
    }

    setStep(step) {
        const label = `${this.networkId}-${this.domainName}`
        let savedStep = Store.get(label)

        if (savedStep != null) {
            savedStep.step = step
            Store.set(label, savedStep)
        }


        return savedStep
    }

    setCommitmentExpirationDate(commitmentExpirationDate) {
        const label = `${this.networkId}-${this.domainName}`
        let savedStep = Store.get(label)

        if (savedStep != null) {
            savedStep.commitmentExpirationDate = commitmentExpirationDate
            Store.set(label, savedStep)
        }


        return savedStep
    }



    setSecondsPassed(secondsPassed) {
        const label = `${this.networkId}-${this.domainName}`
        let savedStep = Store.get(label)

        if (savedStep != null) {
            savedStep.secondsPassed = secondsPassed
            Store.set(label, savedStep)
        }

        return savedStep
    }





}

export async function setupProgressStore(domainName, networkId) {

    return new ProgressStore({
        domainName,
        networkId
    })
}