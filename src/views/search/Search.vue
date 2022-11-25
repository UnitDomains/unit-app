<script setup lang="ts">
import { reactive, computed, ref, onMounted, onBeforeUpdate } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { showLoading, ILoading } from "@/components/ui/loading";

import ItemView from "icons/ItemView.svg";
import ListView from "icons/ListView.svg";

import SelectedItemView from "icons/SelectedItemView.svg";
import SelectedListView from "icons/SelectedListView.svg";

import InputSearch from "components/input/InputSearch.vue";
import DomainList from "components/domains/DomainList.vue";
import DomainNameSpecificList from "components/domains/DomainNameSpecificList.vue";

import { getCurrentInstance } from "vue";

import { appContractModels } from "contracts/setup";
import { web3Config } from "contracts/web3";
import {
  getDomain,
  getDomainSuffix,
  getSupportDomainNamesSuffixArray,
  getJointName,
  getDomainIndex,
  getHostDomain,
  getSuffixByIndex,
} from "contractUtils/domainName";

import { getAddressValidation, getSearchTermType } from "contracts/utils/address";

import { BigNumber } from "ethers";

import {
  IServerDomainInfo,
  IServerSubdomainInfo,
  IServerPriceInfo,
  IServerSuggestResult,
} from "@/server/serverType";

import {
  getSpecificSearchResultFromServer,
  getNotAvailableSearchResultFromServer,
  getSuggestSearchResultFromServer,
} from "@/server/search";

import { getPriceInfoFromServer } from "@/server/price";

import { processError } from "utils/processError";

import axios from "http/http";
import BASEURL from "http/api";
import { emptyAddress } from "@/contracts/types";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const searchText = ref("");

const domainNameSpecificArray = ref<IServerDomainInfo[]>([]);
const domainNameSuggestArray = ref<IServerDomainInfo[]>([]);
const domainNameNotAvailableArray = ref<IServerDomainInfo[]>([]);

const priceInfo: IServerPriceInfo = reactive({
  pkId: "", //pk_id,
  networkId: 0, //network_id
  registerPrice: "", //register_price
  rentPrice: "", //rent_price
  paymentType: 0, //payment_type
});
const viewType = ref(1);

const init = async () => {
  //from eth network
  //  await this.getSearchResults(this.searchText);

  //from data server

  console.log(searchText.value);

  var s = getSearchTermType(searchText.value);

  if (s && s.type === "Address") {
    router.push({ path: `/address/${searchText.value}` });
  } else if (s && s.type === "Supported") {
    await getSpecificResultFromServer(searchText.value);
  } else if (s && s.type === "SingleName") {
    // await this.getSpecificResultFromServer(this.searchText);
    await getSuggestResultFromServer(searchText.value);
    await getNotAvailableResultFromServer(searchText.value);
  }
};

onBeforeRouteUpdate((to) => {
  if (typeof to.params.searchText === "string")
    searchText.value = to.params.searchText.trim().toLowerCase();
  else searchText.value = to.params.searchText[0].trim().toLowerCase();
  init();
});

onMounted(() => {
  if (typeof route.params.searchText === "string")
    searchText.value = route.params.searchText.trim().toLowerCase();
  else searchText.value = route.params.searchText[0].trim().toLowerCase();
  init();
});

const ChangeViewType = (_viewType: number) => {
  if (viewType.value == _viewType) return;

  viewType.value = _viewType;
};

const onSearchClick = (searchText: string) => {
  router.push({ path: `/search/${searchText}` });
};
const onDomainItemClick = (item: IServerDomainInfo) => {
  router.push({
    path: `/name/${item.name}.${getSuffixByIndex(item.baseNodeIndex)}/register`,
  });
};

const getSpecificResultFromServerHelper = async (searchText: string) => {
  try {
    domainNameSpecificArray.value = [];

    var baseNodeIndex = getDomainIndex(searchText);

    if (baseNodeIndex < 0) return;

    var networkId = await web3Config.getNetworkId();

    let res: Array<IServerDomainInfo> | null = await getSpecificSearchResultFromServer(
      networkId,
      searchText
    );

    console.log(res);

    if (res && res?.length > 0) {
      for (const domainInfo of res) {
        const v = {
          domainName: getJointName(domainInfo.name, domainInfo.baseNodeIndex),
          expiryTime: domainInfo.expires,
          owned: true,
        };

        console.log(domainInfo);
        domainNameSpecificArray.value.push(domainInfo);
      }
    } else {
      console.log(searchText);
      if (baseNodeIndex >= 0) {
        const v: IServerDomainInfo = {
          pkId: "",
          networkId: networkId, //network_id
          label: "", //label
          name: getDomain(searchText), //name
          baseNodeIndex: baseNodeIndex, //base_node_index
          owner: emptyAddress, //owner
          controller: "", //controller
          resolver: "", //resolver
          ethAddress: "", //eth_address
          contentHash: "", //content_hash
          record: "", //record
          expires: 0, //expires
          timestamp: new Date(0), //timestamp
          opTime: new Date(0), //op_time
        };
        domainNameSpecificArray.value.push(v);
      }
    }

    const priceInfoServer = await getPriceInfoFromServer(networkId);
    priceInfo.networkId = priceInfoServer?.networkId ?? 0;
    priceInfo.paymentType = priceInfoServer?.networkId ?? 0;
    priceInfo.registerPrice = priceInfoServer?.registerPrice ?? "";
    priceInfo.rentPrice = priceInfoServer?.rentPrice ?? "";
  } catch (err) {
    console.log(err);
  }
};

const getSpecificResultFromServer = async (searchText: string) => {
  const loading: ILoading = {
    id: "#contentContainer",
    func: async () => {
      await getSpecificResultFromServerHelper(searchText);
    },
  };
  showLoading(loading);
};

const getNotAvailableResultFromServerHelper = async (searchText: string) => {
  try {
    var networkId = await web3Config.getNetworkId();

    let res: Array<IServerDomainInfo> | null = await getNotAvailableSearchResultFromServer(
      networkId,
      searchText
    );

    console.log(res);

    domainNameNotAvailableArray.value = [];
    if (res && res.length > 0) {
      for (const domainInfo of res) {
        domainNameNotAvailableArray.value.push(domainInfo);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const getNotAvailableResultFromServer = async (searchText: string) => {
  const loading: ILoading = {
    id: "#contentContainer",
    func: async () => {
      await getNotAvailableResultFromServerHelper(searchText);
    },
  };
  showLoading(loading);
};

const getSuggestResultFromServerHelper = async (searchText: string) => {
  try {
    var networkId = await web3Config.getNetworkId();

    let res: Array<IServerSuggestResult> | null = await getSuggestSearchResultFromServer(
      networkId,
      searchText
    );

    domainNameSuggestArray.value = [];
    if (res && res.length > 0) {
      for (const suggestResult of res) {
        const v: IServerDomainInfo = {
          pkId: "",
          networkId: networkId, //network_id
          label: "", //label
          name: getDomain(suggestResult.name), //name
          baseNodeIndex: suggestResult.baseNodeIndex, //base_node_index
          owner: emptyAddress, //owner
          controller: "", //controller
          resolver: "", //resolver
          ethAddress: "", //eth_address
          contentHash: "", //content_hash
          record: "", //record
          expires: 0, //expires
          timestamp: new Date(0), //timestamp
          opTime: new Date(0), //op_time
        };

        domainNameSuggestArray.value.push(v);
      }
    }
  } catch (err) {
    console.log(err);
    processError(err, router);
  }
};

const getSuggestResultFromServer = async (searchText: string) => {
  const loading: ILoading = {
    id: "#contentContainer",
    func: async () => {
      await getSuggestResultFromServerHelper(searchText);
    },
  };
  showLoading(loading);
};
</script>

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
            :src="ListView"
            alt="listViewSvg"
            v-on:click="ChangeViewType(0)"
          />
          <img
            v-show="viewType == 0"
            :src="SelectedListView"
            alt="selectedListView"
            v-on:click="ChangeViewType(0)"
          />

          <img
            v-show="viewType != 1"
            :src="ItemView"
            alt="itemViewSvg"
            v-on:click="ChangeViewType(1)"
          />
          <img
            v-show="viewType == 1"
            :src="SelectedItemView"
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

<script lang="ts">
export default {
  name: "Search",
};
</script>
<style scoped>
@import "@/assets/css/document.css";
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
