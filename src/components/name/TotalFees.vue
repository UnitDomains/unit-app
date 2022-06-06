<template>
  <div class="total-fees-panel">
    <div class="total-fees-note">
      {{ $t("pricer.totalDescription", { gasPriceToGweiFast: gasPriceGwei }) }}
    </div>
    <div class="total-fees">
      {{ rentPriceEth }} ETH + {{ gasPriceEth }} ETH gas fee = {{ totalPrice }} ETH
    </div>
  </div>
</template>

<script>
const GWEI = 1000000000;
const COMMIT_GAS_WEI = 42000;
const REGISTER_GAS_WEI = 240000;
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI;
import EthVal from "ethval";

export default {
  name: "TotalFees",
  components: {},
  props: {
    rentPrice: {
      type: Object,
      default: null,
    },
    gasPrice: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      gasPriceToGweiFast: 2,
    };
  },
  computed: {
    rentPriceEth() {
      if (this.rentPrice) return new EthVal(this.rentPrice).toEth().toFixed(4).toString();
      return "";
    },
    gasPriceGwei() {
      if (this.gasPrice) return new EthVal(this.gasPrice).toGwei().toFixed(2).toString();
      return "";
    },
    gasPriceEth() {
      if (this.gasPrice) return new EthVal(this.gasPrice).toEth().toFixed(7).toString();
      return "";
    },

    totalPrice() {
      if (this.rentPrice && this.gasPrice)
        return new EthVal(this.rentPrice)
          .add(new EthVal(this.gasPrice))
          .toEth()
          .toFixed(4)
          .toString();
      return "";
    },
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.total-fees-panel {
  margin-top: 1em;
  text-align: left;
}
.total-fees-note {
  font: 0.8em sans-serif;
  color: #adbbcd;
}
.total-fees {
  margin: 0.2em;
  font: 1.5em sans-serif;
  color: black;
}
</style>
