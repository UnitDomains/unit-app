<template>
  <div>
    <DurationFees
      :domainName="domainName"
      :years="years"
      :price="price"
      @onDurationChange="onDurationChange"
    ></DurationFees>
  </div>
</template>

<script>
import EthVal from "ethval";
import { getRegisterPrice, getTotalPrice } from "contractUtils/Price.js";
import { getDomain, getDomainIndex } from "contractUtils/domainName.js";
import { getBlock, getNetworkId, getAccount, getGasPrice } from "contracts/web3.js";
import { calculateDuration, formatDate } from "utils/dates.js";

import InputNumber from "components/input/InputNumber.vue";
import TotalFees from "./TotalFees.vue";
import ChainSvg from "icons/chain.svg";

import loading from "components/ui/loading";
import DurationFees from "./DurationFees.vue";

import { getPriceRegisterFromServer, getPriceRentFromServer } from "server/price.js";

export default {
  name: "RenewDuration",
  components: {
    DurationFees,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      stepNumber: 0,
      chainSvg: ChainSvg,
      price: null,
      years: 1,
    };
  },
  computed: {},

  mounted() {
    this.getPriceFromServer(1);
  },

  methods: {
    getRentDomain() {},
    /**
     * Get price from eth-chains
     * @param {} years
     */
    async getPrice(years) {
      this.$emit("onDurationBeginChange");
      loading.showLoading("#DurationContainer");

      let { gas, rent } = await getRentPrice(this.domainName, years);
      this.rentPrice = rent;
      this.gasPrice = gas;

      // Loading should be closed asynchronously
      loading.hideLoading();

      this.$emit("onDurationChange", years, rent, gas);
    },

    /**
     * Get price from server
     */
    async getPriceFromServer(years) {
      var networkId = await getNetworkId();
      var registerPrice = await getPriceRegisterFromServer(networkId, this.domainName);

      var rentPriceTemp = await getPriceRentFromServer(networkId, this.domainName);

      var duration = calculateDuration(years);

      var r1 = new EthVal(registerPrice ?? 0);
      const rentPrice = new EthVal(rentPriceTemp).mul(duration);

      if (rentPrice) {
        this.price = await getTotalPrice(rentPrice, registerPrice);

        this.$emit("onDurationChange", years, this.price);
      }
    },

    onDurationChange(years) {
      //You can get price from server or eth-chains
      //Get price from eth-chains
      //await this.getPrice(years);

      //Get price from sever
      this.getPriceFromServer(years);
    },
  },
};
</script>

<style scoped>
.register-duration-year-unit-panel {
  height: 1.5em;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.register-duration-year-unit-period {
  margin-left: 3em;
  font: 0.8em sans-serif;
  color: #adbbcd;
}

.register-duration-year-unit-price {
  margin-left: 11em;
  font: 0.8em sans-serif;
  color: #adbbcd;
}
.register-duration-panel {
  display: block;
  margin: 0px;
}

.register-duration-input-panel {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
}

.price-fee {
  margin-left: 1em;
  font: 1.5em sans-serif;
  color: #adbbcd;
}
</style>
