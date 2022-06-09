<template>
  <div>
    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>

    <div id="contentContainer" class="search-result">
      <DomainNameSpecificList
        :domainNameArray="domainNameSpecificArray"
        :priceInfo="priceInfo"
        @onDomainItemClick="onDomainItemClick"
      ></DomainNameSpecificList>

      <div class="divider" v-show="domainNameSpecificArray.length > 0"></div>
      <DomainList
        :domainNameArray="domainNameSuggestArray"
        @onDomainItemClick="onDomainItemClick"
      ></DomainList>

      <div class="divider" v-show="domainNameSuggestArray.length > 0"></div>
      <DomainList
        :domainNameArray="domainNameNotAvailableArray"
        @onDomainItemClick="onDomainItemClick"
      ></DomainList>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";

import { setup, getRegistrar, getENS } from "contracts/api";
import { getBlock, getNetworkId, getAccount } from "contracts/web3.js";
import {
  getDomain,
  getDomainSuffix,
  getSupportDomainNamesSuffixArray,
  getJointName,
  getDomainIndex,
  getHostDomain,
} from "contractUtils/domainName.js";

import { getAddressValidation } from "contractUtils/address.js";

import axios from "http/http";
import BASEURL from "http/api.js";

import InputSearch from "components/input/InputSearch.vue";
import DomainList from "components/domains/DomainList.vue";
import DomainNameSpecificList from "components/domains/DomainNameSpecificList.vue";

import loading from "components/ui/loading";

export default {
  name: "Search",
  components: {
    InputSearch,
    DomainList,
    DomainNameSpecificList,
  },

  data() {
    return {
      searchText: "",
      domainNameSpecificArray: [],
      domainNameSuggestArray: [],
      domainNameNotAvailableArray: [],
      priceInfo: null,
    };
  },
  async beforeRouteUpdate(to, from) {
    console.log(to);
    // 对路由变化做出响应...
    this.searchText = this.getSearchText(to.params.searchText.trim().toLowerCase());

    //from eth network
    //  await this.getSearchResults(this.searchText);

    //from data server
    if (this.searchText) {
      await this.getSpecificResultFromServer(this.searchText);
      await this.getSuggestResultFromServer(this.searchText);
      await this.getNotAvailableResultFromServer(this.searchText);
    }
  },
  async mounted() {
    this.searchText = this.getSearchText(
      this.$route.params.searchText.trim().toLowerCase()
    );

    //from eth network
    // await this.getSearchResults(this.searchText);

    //from data server

    if (this.searchText) {
      await this.getSpecificResultFromServer(this.searchText);
      await this.getSuggestResultFromServer(this.searchText);
      await this.getNotAvailableResultFromServer(this.searchText);
    }
  },
  methods: {
    onSearchClick(searchText) {},
    onDomainItemClick(item) {
      this.$router.push({ path: `/name/${item.domainName}/register` });
    },

    getSearchText(text) {
      var domain = getHostDomain(text);
      if (!domain) {
        domain = getDomain(text);
      }
      return domain;
    },

    async getSearchResults(searchText) {
      if (!searchText || searchText.length == 0) return;

      if (getAddressValidation(searchText)) {
        this.$router.push({ path: `/address/${searchText}` });
        return;
      }

      loading.showLoading("#contentContainer");

      try {
        this.domainNameArray = [];

        searchText = getDomain(searchText);

        await setup();

        var suffixArray = getSupportDomainNamesSuffixArray();
        for (const suffix of suffixArray) {
          var result = await this.getDomainNameAvailable(searchText + "." + suffix);
          if (result) {
            console.log(result.expiryTime);
            this.domainNameArray.push({
              domainName: searchText + "." + suffix,
              expiryTime: result.expiryTime,
              owned: true,
            });
          } else {
            this.domainNameArray.push({
              domainName: searchText + "." + suffix,
              owned: false,
            });
          }
        }
      } catch (error) {}

      // Loading should be closed asynchronously
      loading.hideLoading();
    },
    async getDomainNameAvailable(domainName) {
      var registrar = await getRegistrar();

      var available = await registrar.getAvailable(domainName);

      if (available) {
        //domain name is not registered
        return null;
      } else {
        var domainEntry = await registrar.getEntry(domainName);

        return domainEntry;
      }
    },
    async getSpecificResultFromServer(searchText) {
      try {
        this.domainNameSpecificArray = [];
        var baseNodeIndex = getDomainIndex(searchText);
        if (baseNodeIndex < 0) return;

        await setup();

        var networkId = await getNetworkId();

        let res = await axios.get(BASEURL.search + "specific", {
          params: {
            networkId: networkId,
            searchText: searchText,
          },
        });

        if (res.data && res.data.length > 0) {
          for (const domainInfo of res.data) {
            this.domainNameSpecificArray.push({
              domainName: getJointName(domainInfo.name, domainInfo.baseNodeIndex),
              expiryTime: domainInfo.expires,
              owned: true,
            });
          }
        } else {
          if (baseNodeIndex >= 0) {
            this.domainNameSpecificArray.push({
              domainName: getHostDomain(searchText),

              owned: false,
            });
          }
        }

        await this.getPriceInfoFromServer(searchText);
      } catch (err) {
        console.log(err);
      }
    },

    async getNotAvailableResultFromServer(searchText) {
      try {
        await setup();

        var networkId = await getNetworkId();

        let res = await axios.get(BASEURL.search + "notavailable", {
          params: {
            networkId: networkId,
            searchText: searchText,
          },
        });

        console.log(res);

        this.domainNameNotAvailableArray = [];
        if (res.data && res.data.length > 0) {
          for (const domainInfo of res.data) {
            this.domainNameNotAvailableArray.push({
              domainName: getJointName(domainInfo.name, domainInfo.baseNodeIndex),
              expiryTime: domainInfo.expires,
              owned: true,
            });
          }
        }
      } catch (err) {
        console.log(err);
      }
    },

    async getSuggestResultFromServer(searchText) {
      loading.showLoading("#contentContainer");
      try {
        await setup();

        var networkId = await getNetworkId();

        let res = await axios.get(BASEURL.search + "suggest", {
          params: {
            networkId: networkId,
            searchText: searchText,
          },
        });

        this.domainNameSuggestArray = [];

        for (const suggestResult of res.data) {
          this.domainNameSuggestArray.push({
            domainName: suggestResult.name,

            owned: false,
          });
        }
      } catch (err) {
        console.log(err);
      }

      loading.hideLoading();
    },
    async getPriceInfoFromServer(searchText) {
      try {
        await setup();

        var networkId = await getNetworkId();

        let res = await axios.get(BASEURL.price + "price", {
          params: {
            networkId: networkId,
          },
        });

        this.priceInfo = res.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style scoped>
@import "~@/assets/css/document.css";
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
