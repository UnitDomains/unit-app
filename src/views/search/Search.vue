<template>
    <div>
        <div class="input-search">
            <InputSearch @onClick="onSearchClick"></InputSearch>
        </div>
        <div id="contentContainer" class="search-result">
            <DomainList :domainNameArray="domainNameArray" @onDomainItemClick="onDomainItemClick"></DomainList>
        </div>
    </div>
</template>

<script>


import { setup, getRegistrar, getENS } from 'contracts/api'


import { getDomain, getDomainSuffix, getSupportDomainNamesSuffixArray } from 'contractUtils/domainName.js'

import { getAddressValidation } from 'contractUtils/address.js'



import { ElLoading } from 'element-plus'

import InputSearch from 'components/input/InputSearch.vue'
import DomainList from 'components/domains/DomainList.vue';
export default {
    name: "Search",
    components: {
        InputSearch, DomainList
    },

    data() {
        return {
            searchText: '',
            domainNameArray: [
            ]
        };
    },
    async beforeRouteUpdate(to, from) {
        // 对路由变化做出响应...
        this.searchText = (to.params.searchText)


        await this.getSearchResults(this.searchText)

    },
    async mounted() {
        this.searchText = this.$route.params.searchText

        await this.getSearchResults(this.searchText)
    },
    methods: {
        onSearchClick(searchText) {
        },
        onDomainItemClick(item) {
            this.$router.push({ path: `/name/${item.domainName}/register` })
        },

        async getSearchResults(searchText) {


            if (searchText == null || searchText.length == 0) return

            if (getAddressValidation(searchText)) {
                this.$router.push({ path: `/address/${searchText}` })
                return
            }

            var options = { target: document.querySelector('#contentContainer') }
            const loadingInstance = ElLoading.service(options)

            try {


                this.domainNameArray = []


                searchText = getDomain(searchText)

                await setup()



                var suffixArray = getSupportDomainNamesSuffixArray()
                for (const suffix of suffixArray) {
                    var result = await this.getDomainNameAvailable(searchText + "." + suffix)
                    if (result != null) {
                        console.log(result.expiryTime)
                        this.domainNameArray.push({ domainName: searchText + "." + suffix, expiryTime: result.expiryTime, owned: true })
                    } else {
                        this.domainNameArray.push({ domainName: searchText + "." + suffix, owned: false })
                    }
                }




            } catch (error) {

            }

            // Loading should be closed asynchronously
            loadingInstance.close()


        },
        async getDomainNameAvailable(domainName) {
            var registrar = await getRegistrar()


            var available = await registrar.getAvailable(domainName)


            if (available) {
                //domain name is not registered
                return null
            } else {
                var domainEntry = await registrar.getEntry(domainName)

                return domainEntry
            }
        },

    },
};
</script>
<style scoped>
.input-search {
    text-align: center;
    padding: 20px;
    margin: 0px;
}

.search-result {
    padding-bottom: 10px;
    margin: 0px;
}
</style>



