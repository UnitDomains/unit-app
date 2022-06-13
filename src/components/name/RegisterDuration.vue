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

import { getPriceRegisterFromServer, getPriceRentFromServer } from "server/price.js";

import loading from "components/ui/loading";

import DurationFees from "./DurationFees.vue";

export default {
  name: "RegisterDuration",
  components: {
    DurationFees,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
    years: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      stepNumber: 0,
      chainSvg: ChainSvg,
      price: null,
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

      let { gas, rent } = await getRegisterPrice(this.domainName, years);
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
      //this.getPrice(years);

      //Get price from sever
      this.getPriceFromServer(years);
    },
  },
};
</script>

<style scoped></style>
