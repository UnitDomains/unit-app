<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { formatPrice2Eth } from "@/contractUtils/Price";

const gasPriceToGweiFast = ref(2);

const props = defineProps({
  price: {
    type: Object,
    default: null,
  },
});

const registerPriceEth = computed(() => {
  if (props.price && props.price.registerPrice)
    return formatPrice2Eth(props.price.registerPrice);

  return "0";
});

const rentPriceEth = computed(() => {
  if (props.price && props.price.rentPrice) return formatPrice2Eth(props.price.rentPrice);

  return "0";
});
const gasPriceGwei = computed(() => {
  if (props.price) return formatPrice2Eth(props.price.gasPriceToGweiFast);

  return "0";
});
const gasPriceEth = computed(() => {
  if (props.price) return formatPrice2Eth(props.price.registerGasFast);
  return "0";
});

const totalPrice = computed(() => {
  if (props.price) return formatPrice2Eth(props.price.totalFast);
  return "0";
});
</script>

<template>
  <div class="total-fees-panel">
    <div class="total-fees-note">
      {{ $t("pricer.totalDescription", { gasPriceToGweiFast: gasPriceGwei }) }}
    </div>
    <div class="total-fees">
      {{ registerPriceEth }} ETH + {{ rentPriceEth }} ETH + {{ gasPriceEth }} ETH
      <span class="gas-fee">gas fee</span> = {{ totalPrice }} ETH
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "TotalFees",
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
.gas-fee {
  color: #adbbcd;
  font: 0.8em sans-serif;
}
</style>
