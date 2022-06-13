<script setup></script>

<template>
  <div id="ContentContainer" class="detail-panel-container">
    <Tabs
      :domainName="domainName"
      :tabTitle="[
        $t('singleName.tabs.register'),
        $t('singleName.tabs.details'),
        $t('singleName.tabs.subdomains'),
      ]"
      active="2"
      @onTabClick="onTabClick"
    ></Tabs>

    <div id="subdomainContainer" style="width: 100%" v-if="canAddSubdomain">
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
import { getDomain, getDomainSuffix, getHostDomain } from "contractUtils/domainName.js";
import moment from "moment";
import { getAccount } from "../../contracts/web3";

import { UserAccountStore } from "store/store.js";

import { getDomainInfoFromServer, getSubDomainInfoFromServer } from "server/domain.js";

import AddSubDomain from "components/name/AddSubDomain.vue";

import loading from "components/ui/loading";

import AddressList from "components/address/AddressList.vue";

import Tabs from "components/ui/Tabs.vue";

import axios from "http/http";
import BASEURL from "http/api.js";
import { namehash } from "contracts/utils/namehash.js";

export default {
  name: "Subdomains",
  components: {
    Tabs,
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
    canAddSubdomain() {
      console.log(this.available);
      if (this.available) return false;
      if (this.owner) return this.owner == this.account;
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
    onTabClick(index) {
      if (index === 0) {
        //register
        this.$router.push({ path: `/name/${this.domainName}/register` });
      } else if (index === 1) {
        //detail
        this.$router.push({ path: `/name/${this.domainName}/details` });
      } else if (index === 2) {
        //subdomain
        this.$router.push({ path: `/name/${this.domainName}/subdomains` });
      }
    },
    async onPageClick(page) {
      this.pageNo = page;
      await this.getRecordsFromServer();
    },
    onAddressItemClick(name) {
      this.$router.push({ path: `/name/${name}/details` });
    },

    async getDomainNameAvailable() {
      loading.showLoading("#subdomainContainer");

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
      loading.hideLoading();
    },

    async onAddSubdomainsButtonClick(newContent) {
      loading.showLoading("#subdomainContainer");
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
        loading.hideLoading();
      }
    },
    async deleteSubdomain(subdomain) {
      loading.showLoading("#subdomainContainer");
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
        loading.hideLoading();
      }
    },
    async getSubdomains() {
      loading.showLoading("#subdomainContainer");
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
        loading.hideLoading();
      }
    },
    async getSubdomainsFromServer() {
      try {
        const label = namehash(this.domainName);

        //        var networkId = await getNetworkId();

        var networkId = UserAccountStore.networkId;
        var hostDomain = getHostDomain(this.domainName);
        console.log(hostDomain);
        if (hostDomain) {
          var ret = await getDomainInfoFromServer(networkId, hostDomain);

          if (ret) {
            this.available = false;
          } else this.available = true;
        } else {
          this.available = true;
        }
        this.addressData = null;

        if (!this.available) {
          let res = await getSubDomainInfoFromServer(
            networkId,
            label,
            self.pageNo,
            self.pageSize
          );

          this.addressData = res;
        }
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
