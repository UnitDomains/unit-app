<template>
  <div id="DurationContainer" class="register-duration-panel">
    <div class="register-duration-year-unit-panel">
      <div class="register-duration-year-unit-period">
        {{ $t("pricer.registrationPeriodLabel") }}
      </div>

      <div class="register-duration-year-unit-price">
        {{ $t("pricer.registrationPriceLabel") }}
      </div>
    </div>
    <div class="register-duration-input-panel">
      <InputNumber
        :enabled="true"
        :value="years"
        @onChange="onDurationChange"
      ></InputNumber>
      <img style="margin-top: 0.6em; margin-left: 0.5em" :src="chainSvg" alt="ChainSvg" />
      <div class="price-fee">{{ rentPriceEth }} ETH</div>
    </div>

    <TotalFees :rentPrice="rentPrice" :gasPrice="gasPrice"></TotalFees>
  </div>
</template>

<script>
import EthVal from "ethval";
import { getRegisterPrice } from "contractUtils/Price.js";
import { getDomain, getDomainIndex } from "contractUtils/domainName.js";

import InputNumber from "components/input/InputNumber.vue";
import TotalFees from "./TotalFees.vue";
import ChainSvg from "icons/chain.svg";

import loading from "components/ui/loading";

export default {
  name: "DurationFees",
  components: {
    InputNumber,
    TotalFees,
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
      stepNumber: 0,
      chainSvg: ChainSvg,
    };
  },
  computed: {
    rentPriceEth() {
      if (this.rentPrice) return new EthVal(this.rentPrice).toEth().toFixed(4).toString();
      return "";
    },
  },

  mounted() {},

  methods: {
    onDurationChange(years) {
      this.$emit("onDurationChange", years);
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
