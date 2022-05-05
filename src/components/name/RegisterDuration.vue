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
import { getRegisterPrice } from 'contractUtils/Price.js'
import { getDomain, getDomainIndex } from 'contractUtils/domainName.js'

import InputNumber from 'components/input/InputNumber.vue';
import TotalFees from './TotalFees.vue';
import ChainSvg from 'icons/chain.svg'

import { ElLoading } from 'element-plus'

import DurationFees from './DurationFees.vue'

export default {
    name: "RegisterDuration",
    components: {
        DurationFees
    },
    props: {
        domainName: {
            type: String,
            default: ''
        },
        years: {
            type: Number, default: 1
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


            let { gas, rent } = await getRegisterPrice(this.domainName, years)
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
</style>


