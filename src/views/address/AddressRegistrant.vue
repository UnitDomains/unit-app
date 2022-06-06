<script setup></script>

<template>
  <div class="address-account-container">
    <div class="register-name-title">
      <div>
        <UnitButton
          :caption="$t('address.filter.registrant')"
          @onClick="onRegisterButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>

        <UnitButton
          :caption="$t('address.filter.controller')"
          @onClick="onControllerButtonClick"
          :enable="true"
        >
        </UnitButton>
      </div>
    </div>

    <AddressList
      :addressData="addressData"
      @onAddressItemClick="onAddressItemClick"
      @onPageClick="onPageClick"
    >
    </AddressList>
  </div>
</template>

<script>
import EthVal from "ethval";
import { setup, getRegistrar, getENS, getReverseRecord } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId, getAccount } from "contracts/web3.js";
import { emptyAddress } from "contracts/utils";

import { calculateDuration } from "utils/dates.js";

import { normalize } from "contracts/utils/eth-ens-namehash";

import moment from "moment";

import createIcon from "@/blockies";

import loading from "components/ui/loading";

import { getRegistrantFromServer } from "server/domain.js";

import AddressList from "components/address/AddressList.vue";

export default {
  name: "AddressRegistrant",
  components: {
    AddressList,
  },
  data() {
    return {
      account: this.$route.params.account,

      addressData: null,
      pageNo: 1,
      pageSize: 10,
    };
  },
  computed: {},

  async mounted() {
    await this.getRecordsFromServer();
  },

  /*
  watch: {
    $route(to, from) {
      this.account = to.params.account;
      console.log(to);
      this.getRecordsFromServer();
    },
  },*/

  async beforeRouteUpdate(to, from, next) {
    this.account = to.params.account;

    // this.getRecordsFromServer()

    next();
  },
  methods: {
    onRegisterButtonClick() {
      this.$router.push({ path: `/address/${this.account}/registrant` });
    },
    onControllerButtonClick() {
      this.$router.push({ path: `/address/${this.account}/controller` });
    },
    onAddressItemClick(name) {
      this.$router.push({ path: `/name/${name}/details` });
    },
    async onPageClick(page) {
      this.pageNo = page;
      this.addressData = await this.getRecordsFromServer();
    },

    async getRecordsFromServer() {
      try {
        await setup();
        var account = this.account;
        console.log(account);
        var networkId = await getNetworkId();

        this.addressData = await getRegistrantFromServer(
          networkId,
          account,
          this.pageNo,
          this.pageSize
        );
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/address.css";

.user-info {
  height: 60px;
  display: inline-flex;
  align-items: center;
  margin: 1em;
}

.user-block {
  display: inline-block;
  background-size: cover;
  width: 42px;
  height: 42px;
  top: 50%;
  margin-right: 10px;
  border-radius: 20%;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  flex-shrink: 0;
}

.user-account {
  font: 1.5em normal sans-serif;
  font-weight: 100;
  text-overflow: ellipsis;
  top: 10%;
  flex-shrink: 0;
}
</style>
