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
import EthVal from "ethval";

export default {
  name: "TotalFees",
  components: {},
  props: {
    price: {
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
      if (this.price && this.price.rentAndRegisterPrices)
        return new EthVal(this.price.rentAndRegisterPrices).toEth().toFixed(4).toString();
      return "0";
    },
    gasPriceGwei() {
      //   console.log(new EthVal(this.gasPrice).toEth().toFixed(4).toString());
      if (this.price)
        return new EthVal(this.price.gasPriceToGweiFast).toGwei().toFixed(2).toString();
      return "0";
    },
    gasPriceEth() {
      if (this.price)
        return new EthVal(this.price.registerGasFast).toEth().toFixed(6).toString();
      return "0";
    },

    totalPrice() {
      if (this.price)
        return new EthVal(this.price.totalFast).toEth().toFixed(6).toString();
      return "0";
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
