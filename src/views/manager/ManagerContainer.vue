<script  setup>



import UnitButton from 'components/ui/UnitButton.vue'

</script>

<template>
    <div>
        <h1>管理</h1>
        <div>
            <UnitButton caption="Withdraw" @onClick="onWithdrawClick" :enable="true" type="primary"></UnitButton>
        </div>
    </div>
</template>

<script>




import EthVal from 'ethval'
import { setup, getRegistrar, getENS, getReverseRecord } from 'contracts/api'
import { labelhash } from 'contracts/utils/labelhash.js'
import { getBlock, getNetworkId, getAccount } from 'contracts/web3.js'
import { emptyAddress } from 'contracts/utils'

import { calculateDuration } from 'utils/dates.js'

import { normalize } from 'contracts/utils/eth-ens-namehash'






import createIcon from '@/blockies'





import { sendHelper } from '../../contractUtils/transaction'




export default {
    name: "ManagerContainer",
    components: {

    },
    data() {
        return {



        };
    },
    computed: {




    },

    async mounted() {





    },


    methods: {


        async onWithdrawClick() {
            var address = await getAccount()
            console.log(address)

            await setup()

            var registrar = await getRegistrar()

            const tx = await registrar.withdraw()
            await sendHelper(tx)

        },
        async onSetPrice() {
            var address = await getAccount()
            console.log(address)

            await setup()

            var registrar = await getRegistrar()

            const tx = await registrar.withdraw()
            await sendHelper(tx)

        }


    }
};
</script>

<style scoped>
</style>