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

      <div
        class="view-type-toolbar-container"
        v-if="domainNameSuggestArray.length > 0 || domainNameNotAvailableArray.length > 0"
      >
        <div class="view-type-toolbar">
          <img
            v-show="viewType != 0"
            :src="listViewSvg"
            alt="listViewSvg"
            v-on:click="ChangeViewType(0)"
          />
          <img
            v-show="viewType == 0"
            :src="selectedListView"
            alt="selectedListView"
            v-on:click="ChangeViewType(0)"
          />

          <img
            v-show="viewType != 1"
            :src="itemViewSvg"
            alt="itemViewSvg"
            v-on:click="ChangeViewType(1)"
          />
          <img
            v-show="viewType == 1"
            :src="selectedItemView"
            alt="selectedItemView"
            v-on:click="ChangeViewType(1)"
          />
        </div>
      </div>

      <div class="divider" v-show="domainNameSuggestArray.length > 0"></div>
      <DomainList
        :viewType="viewType"
        :domainNameArray="domainNameSuggestArray"
        @onDomainItemClick="onDomainItemClick"
      ></DomainList>

      <div class="divider" v-show="domainNameNotAvailableArray.length > 0"></div>
      <DomainList
        :viewType="viewType"
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

import { getAddressValidation, getSearchTermType } from "contracts/utils/address.js";

import { processError } from "utils/processError.js";

import axios from "http/http";
import BASEURL from "http/api.js";

import InputSearch from "components/input/InputSearch.vue";
import DomainList from "components/domains/DomainList.vue";
import DomainNameSpecificList from "components/domains/DomainNameSpecificList.vue";

import loading from "components/ui/loading";

import ItemView from "icons/ItemView.svg";
import ListView from "icons/ListView.svg";

import SelectedItemView from "icons/SelectedItemView.svg";
import SelectedListView from "icons/SelectedListView.svg";

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
      viewType: 1,
      itemViewSvg: ItemView,
      listViewSvg: ListView,
      selectedItemView: SelectedItemView,
      selectedListView: SelectedListView,
    };
  },
  async beforeRouteUpdate(to, from) {
    //from eth network
    //  await this.getSearchResults(this.searchText);

    //from data server
    console.log(to);

    this.searchText = this.getSearchText(to.params.searchText.trim().toLowerCase());
    console.log(this.searchText);

    this.domainNameSpecificArray = [];
    this.domainNameSuggestArray = [];
    this.domainNameNotAvailableArray = [];

    var s = getSearchTermType(this.searchText);
    if (s === "address") {
      this.$router.push({ path: `/address/${this.searchText}` });
    } else if (s === "supported") {
      console.log("supported");
      await this.getSpecificResultFromServer(this.searchText);
    } else if (s === "search") {
      console.log("search");
      // await this.getSpecificResultFromServer(this.searchText);

      await this.getSuggestResultFromServer(this.searchText);
      await this.getNotAvailableResultFromServer(this.searchText);
    }
  },
  async mounted() {
    this.searchText = this.getSearchText(
      this.$route.params.searchText.trim().toLowerCase()
    );
    //from eth network
    //  await this.getSearchResults(this.searchText);

    //from data server

    var s = getSearchTermType(this.searchText);
    if (s === "address") {
      this.$router.push({ path: `/address/${this.searchText}` });
    } else if (s === "supported") {
      await this.getSpecificResultFromServer(this.searchText);
    } else if (s === "search") {
      console.log("search 1");
      // await this.getSpecificResultFromServer(this.searchText);
      await this.getSuggestResultFromServer(this.searchText);
      await this.getNotAvailableResultFromServer(this.searchText);
    }
  },
  methods: {
    ChangeViewType(viewType) {
      if (viewType == this.viewType) return;
      console.log(viewType);
      this.viewType = viewType;
    },
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
      //   loading.showLoading("#contentContainer");
      try {
        this.domainNameSpecificArray = [];

        var baseNodeIndex = getDomainIndex(searchText);

        if (baseNodeIndex < 0) return;

        // await setup();

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
      //   loading.hideLoading();
    },

    async getNotAvailableResultFromServer(searchText) {
      loading.showLoading("#contentContainer");
      try {
        //await setup();

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
      loading.hideLoading();
    },

    async getSuggestResultFromServer(searchText) {
      loading.showLoading("#contentContainer");
      try {
        //await setup();

        var networkId = await getNetworkId();
        console.log(networkId);

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
        processError(err, this.$router);
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
.view-type-toolbar-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0em;
}
.view-type-toolbar {
  margin-right: 1em;
}
</style>
