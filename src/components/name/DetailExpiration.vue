<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container" v-if="!durationVisible">
      <div class="detail-base-info-left">{{ $t("c.Expiration Date") }}</div>
      <div class="detail-base-info-middle">{{ domainExpiryTime }}</div>
      <div class="detail-base-info-right">
        <UnitButton
          :caption="$t('c.renew')"
          @onClick="onShowDurationButtonClick"
          :enable="true"
          type="primary"
        >
          {{ $t("c.renew") }}</UnitButton
        >
      </div>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info-left">{{ $t("c.Expiration Date") }}</div>
        <div class="detail-base-info-middle-1">
          <RenewDuration
            :domainName="domainName"
            @onDurationChange="onDurationChange"
            @onDurationBeginChange="onDurationBeginChange"
          ></RenewDuration>
        </div>
      </div>
      <div
        v-show="accountBalanceInsufficientVisible"
        class="account-balance-insufficient"
      >
        {{ $t("register.buttons.insufficient") }}
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="$t('c.cancel')"
          @onClick="onHideDurationButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="$t('c.renew')"
          @onClick="onRenewButtonClick"
          :enable="renewButtonEnable"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script>
import EthVal from "ethval";
import { setup, getRegistrar, getENS } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId } from "contracts/web3.js";
import { calculateDuration, formatDate } from "utils/dates.js";

import { getRentPrice, getAccountBalance } from "contractUtils/Price.js";
import { getDomain, getDomainSuffix } from "contractUtils/domainName.js";
import moment from "moment";
import { getAddressValidation } from "contracts/utils/address.js";

import NameDetailItem from "components/name/NameDetailItem.vue";

import loading from "components/ui/loading";
import { getAccount } from "../../contracts/web3";

import RenewDuration from "components/name/RenewDuration.vue";

export default {
  name: "DetailExpiration",
  components: {
    RenewDuration,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
    expiryTime: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    renewButtonEnable() {
      if (this.accountBalanceInsufficientVisible) return false;
      if (this.totalFees == 0) return false;
      return true;
    },
    domainExpiryTime() {
      return !this.expiryTime ? "" : formatDate(this.expiryTime, false);
    },
  },
  data() {
    return {
      durationVisible: false,
      accountBalanceInsufficientVisible: false,
      durationChangedCompleted: false,
      totalFees: 0,
      years: 0,
    };
  },

  async mounted() {},

  methods: {
    onShowDurationButtonClick() {
      this.durationVisible = true;
    },
    onHideDurationButtonClick() {
      this.durationVisible = false;
    },
    onRenewButtonClick() {
      this.durationVisible = false;
      this.$emit("onOkButtonClick", this.years, this.totalFees);
    },

    onDurationBeginChange() {
      this.durationChangedCompleted = false;
    },

    async onDurationChange(years, price) {
      this.years = years;

      //   this.rentPrice = rentPrice
      //   this.gasPrice = gasPrice

      this.totalFees = price.totalFast;

      var accountBalance = new EthVal(await getAccountBalance());
      console.log(this.totalFees.gt(accountBalance));

      if (this.totalFees.gt(accountBalance)) {
        this.accountBalanceInsufficientVisible = true;
      } else {
        this.accountBalanceInsufficientVisible = false;
      }
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/detail.css";
@import "~@/assets/css/document.css";
</style>
