<script setup>
import UnitButton from "components/ui/UnitButton.vue";
</script>

<template>
  <div id="ContentContainer" class="detail-panel-container">
    <div class="domain-name-frame">
      <div class="domain-name-frame-title">{{ domainName }}</div>
      <div class="domain-name-frame-toolbar">
        <UnitButton
          :caption="$t('singleName.tabs.register')"
          @onClick="onNameRegisterButtonClick"
          v-if="!isSubdomain"
          :enable="true"
        ></UnitButton>

        <UnitButton
          :caption="$t('singleName.tabs.details')"
          @onClick="onNameDetailsButtonClick"
          :enable="true"
        >
        </UnitButton>

        <UnitButton
          :caption="$t('singleName.tabs.subdomains')"
          @onClick="onNameSubdomainsButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
      </div>
    </div>

    <div style="width: 100%" v-if="isOwner">
      <AddSubDomain @onOkButtonClick="onAddSubdomainsButtonClick"></AddSubDomain>
    </div>

    <div class="detail-panel">
      <AddressList
        :addressData="addressData"
        @onAddressItemClick="onAddressItemClick"
        @onPageClick="onPageClick"
      >
      </AddressList>
    </div>
  </div>
</template>

<script>
import EthVal from "ethval";
import { setup, getRegistrar, getENS, getSubdomainRegistrar } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId } from "contracts/web3.js";

import {
  checkIsDecrypted,
  truncateUndecryptedName,
  parseName,
} from "contracts/labels.js";

import { calculateDuration } from "utils/dates.js";
import { sendHelper } from "contractUtils/transaction.js";
import { getRentPrice, getAccountBalance } from "contractUtils/Price.js";
import { getDomain, getDomainSuffix } from "contractUtils/domainName.js";
import moment from "moment";
import { getAccount } from "../../contracts/web3";

import AddSubDomain from "components/name/AddSubDomain.vue";

import { ElLoading } from "element-plus";

import AddressList from "components/address/AddressList.vue";

import axios from "http/http";
import BASEURL from "http/api.js";
import { namehash } from "@ethersproject/hash";

export default {
  name: "Subdomains",
  components: {
    AddSubDomain,
    AddressList,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
  },
  computed: {
    //账户是否是域名的拥有者
    isOwner() {
      if (this.owner != null) return this.owner == this.account;
      return true;
    },

    isSubdomain() {
      return this.domainName?.split(".").length - 1 > 1;
    },
  },
  data() {
    return {
      available: false,
      domainEntry: null,
      domainResolver: "",
      owner: "",
      addressData: null,
      pageNo: 1,
      pageSize: 10,
    };
  },

  async mounted() {
    //  await this.getDomainNameAvailable()
    //  await this.getSubdomains()
    await this.getSubdomainsFromServer();
  },

  methods: {
    onNameRegisterButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/register` });
    },
    onNameDetailsButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/details` });
    },
    onNameSubdomainsButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/subdomains` });
    },
    async onPageClick(page) {
      this.pageNo = page;
      await this.getRecordsFromServer();
    },
    onAddressItemClick(name) {
      this.$router.push({ path: `/name/${name}/details` });
    },

    async getDomainNameAvailable() {
      var options = { target: document.querySelector("#subdomainContainer") };
      const loadingInstance = ElLoading.service(options);

      await setup();

      var registrar = await getRegistrar();
      this.available = await registrar.getAvailable(this.domainName);
      this.account = await getAccount();

      if (this.available) {
        //domain name is not registered
        this.domainEntry = null;
      } else {
        this.domainEntry = await registrar.getEntry(this.domainName);
        console.log(this.domainEntry);

        var ens = await getENS();
        this.domainResolver = await ens.getResolver(this.domainName);
        this.owner = await ens.getOwner(this.domainName);
      }

      // Loading should be closed asynchronously
      loadingInstance.close();
    },

    async onAddSubdomainsButtonClick(newContent) {
      var options = { target: document.querySelector("#subdomainContainer") };
      const loadingInstance = ElLoading.service(options);
      try {
        await setup();

        var ens = await getENS();
        var subdomain = await getSubdomainRegistrar();

        const tx = await subdomain.register(this.domainName, newContent);
        await sendHelper(tx);

        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        loadingInstance.close();
      }
    },
    async deleteSubdomain(subdomain) {
      var options = { target: document.querySelector("#subdomainContainer") };
      const loadingInstance = ElLoading.service(options);
      try {
        await setup();
        await setupSubdomainRegistrar();

        var ens = await getENS();
        var subdomainRegistrar = await getSubdomainRegistrar();

        const tx = await subdomainRegistrar.deleteSubdomain(this.domainName, subdomain);
        await sendHelper(tx);

        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        loadingInstance.close();
      }
    },
    async getSubdomains() {
      var options = { target: document.querySelector("#subdomainContainer") };
      const loadingInstance = ElLoading.service(options);
      try {
        await setup();

        var ens = await getENS();

        const subdomains = await ens.getSubdomains(this.domainName);
        console.log(subdomains);
        // await sendHelper(tx)

        const hasNoSubdomains = subdomains && subdomains.length === 0;

        return true;
      } catch (error) {
        console.log(error);
        return false;
      } finally {
        loadingInstance.close();
      }
    },
    async getSubdomainsFromServer() {
      try {
        const label = namehash(this.domainName);

        var networkId = await getNetworkId();
        let res = await axios.get(BASEURL.domains + "subdomains", {
          params: {
            networkId: networkId,
            label: label,
            pageNo: self.pageNo,
            pageSize: self.pageSize,
          },
        });

        this.addressData = res.data;
        console.log(res.data);
      } catch (err) {}
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/name.css";
@import "~@/assets/css/address.css";
@import "~@/assets/css/detail.css";
@import "~@/assets/css/document.css";
</style>
