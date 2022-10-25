<template>
  <div>
    <div class="tld-text-container">
      <div class="tld-text">{{ tldText }}</div>
    </div>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
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
  name: "SearchByTLD",
  components: {
    InputSearch,
  },

  data() {
    return {
      tldText: "",
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

    this.tldText = to.params.tldText.trim().toLowerCase();
  },
  async mounted() {
    this.tldText = this.$route.params.tldText.trim().toLowerCase();
  },
  methods: {
    onSearchClick(searchText) {
      var suffix = getDomainSuffix(searchText);
      if (suffix && suffix.toLowerCase() === this.tldText)
        this.$router.push({ path: `/search/${searchText}` });
      else {
        searchText = getDomain(searchText);
        console.log(searchText);
        this.$router.push({ path: `/search/${searchText}${this.tldText}` });
      }
    },
  },
};
</script>
<style scoped>
@import "~@/assets/css/document.css";

.tld-text-container {
  margin-top: 0;
  width: 100%;

  padding-top: 1em;
}
.tld-text {
  margin: auto;

  width: 400px;
  height: 2em;
  background: linear-gradient(132deg, rgb(8, 0, 255) 0%, rgb(227, 43, 227) 100%);

  border-radius: 20px;
  box-shadow: 5px 5px 5px 0 rgba(157, 158, 158, 0.5);

  padding-top: 0.5em;
  cursor: pointer;
  user-select: none;
  font: 3em sans-serif;
  color: aliceblue;
}
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
