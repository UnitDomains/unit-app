<template>
    <div>
        <DurationFees
            :domainName="domainName"
            :years="years"
            :rentPrice="rentPrice"
            :gasPrice="gasPrice"
            @onDurationChange="onDurationChange"
        ></DurationFees>
    </div>
</template>

<script>
import EthVal from 'ethval'
import { getRentPrice } from 'contractUtils/Price.js'
import { getDomain, getDomainIndex } from 'contractUtils/domainName.js'

import InputNumber from 'components/input/InputNumber.vue';
import TotalFees from './TotalFees.vue';
import ChainSvg from 'icons/chain.svg'

import { ElLoading } from 'element-plus'
import DurationFees from './DurationFees.vue'
export default {
    name: "RenewDuration",
    components: {
        DurationFees
    },
    props: {
        domainName: {
            type: String,
            default: ''
        }

    },
    data() {
        return {
            stepNumber: 0,
            chainSvg: ChainSvg,
            rentPrice: null,
            gasPrice: null,


        };
    },
    computed: {

    },

    mounted() {

        this.getPrice(1)

    },

    methods: {

        getRentDomain() {

        },
        /**
         * 得到租金费用
         * @param {} years 
         */
        async getPrice(years) {
            this.$emit("onDurationBeginChange")
            var options = { target: document.querySelector('#DurationContainer') }
            const loadingInstance = ElLoading.service(options)



            let { gas, rent } = await getRentPrice(this.domainName, years)
            this.rentPrice = rent
            this.gasPrice = gas


            // Loading should be closed asynchronously
            loadingInstance.close()






            this.$emit("onDurationChange", years, rent, gas)

        },


        onDurationChange(years) {
            this.getPrice(years)


        },







    }
};
</script>

<style scoped>
.register-duration-year-unit-panel {
    height: 1.5em;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.register-duration-year-unit-period {
    margin-left: 3em;
    font: 0.8em sans-serif;
    color: #adbbcd;
}

.register-duration-year-unit-price {
    margin-left: 11em;
    font: 0.8em sans-serif;
    color: #adbbcd;
}
.register-duration-panel {
    display: block;
    margin: 0px;
}

.register-duration-input-panel {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: flex-start;
}

.price-fee {
    margin-left: 1em;
    font: 1.5em sans-serif;
    color: #adbbcd;
}
</style>


