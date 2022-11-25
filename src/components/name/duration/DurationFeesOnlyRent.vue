<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import InputNumber from "components/input/InputNumber.vue";
import TotalFeesOnlyRent from "./TotalFeesOnlyRent.vue";
import ChainSvg from "icons/chain.svg";
</script>

<template>
  <div id="DurationContainer" class="register-duration-panel">
    <div class="register-duration-year-unit-panel">
      <div class="register-duration-year-unit-period">
        {{ $t("pricer.registrationPeriodLabel") }}
      </div>

      <div class="register-duration-year-unit-price-space"></div>

      <div class="register-duration-year-unit-price">
        {{ $t("pricer.rentPriceLabel") }}
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

    <TotalFeesOnlyRent :price="price"></TotalFeesOnlyRent>
  </div>
</template>

<script lang="ts">
import { formatPrice2Eth } from "contractUtils/Price";
import { getDomain, getDomainIndex } from "contractUtils/domainName";

import loading from "components/ui/loading";

export default {
  name: "DurationFeesOnlyRent",
  components: {},
  props: {
    domainName: {
      type: String,
      default: "",
    },
    years: {
      type: Number,
      default: 1,
    },
    price: {
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
      if (this.price && this.price.rentPrice)
        return formatPrice2Eth(this.price.rentPrice);
      return "";
    },
    registerPriceEth() {
      if (this.price && this.price.registerPrice)
        return formatPrice2Eth(this.price.registerPrice);
      return "";
    },
  },

  mounted() {},

  methods: {
    onDurationChange(years: number) {
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
  margin-left: 2em;
  font: 0.8em sans-serif;
  color: #adbbcd;
  width: 10em;
}

.register-duration-year-unit-price-space {
  width: 120px;
}

.register-duration-year-unit-price-space-1 {
  width: 20px;
}

.register-duration-year-unit-price {
  margin-left: 20px;
  font: 0.8em sans-serif;
  color: #adbbcd;
  width: 200px;
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
  margin-left: 20px;
  font: 1.5em sans-serif;
  color: #adbbcd;
  width: 200px;
}
.price-fee-space {
  font: 1.5em sans-serif;
  color: #adbbcd;
  width: 1em;
}
</style>
