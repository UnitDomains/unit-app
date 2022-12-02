<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import InputNumber from "components/input/InputNumber.vue";
import TotalFeesOnlyRent from "./TotalFeesOnlyRent.vue";
import ChainSvg from "icons/chain.svg";

import {
  getEthRegisterPrice,
  getTotalPrice,
  getEthRentPrice,
  INewDomainPriceValue,
  IRentPriceValue,
} from "@/contractUtils/Price";

import { formatPrice2Eth } from "@/contractUtils/Price";

const { t } = useI18n();

interface Props {
  domainName: string;
  years: number;
  price: INewDomainPriceValue | null;
}

const props = withDefaults(defineProps<Props>(), {
  domainName: "",
  years: 1,
  price: null,
});

const rentPriceEth = computed(() => {
  if (props.price && props.price.rentPrice) return formatPrice2Eth(props.price.rentPrice);
  return "";
});
const registerPriceEth = computed(() => {
  if (props.price && props.price.registerPrice)
    return formatPrice2Eth(props.price.registerPrice);
  return "";
});

const emit = defineEmits<{
  (e: "onDurationChange", years: number): void;
}>();

const onDurationChange = (years: number) => {
  emit("onDurationChange", years);
};
</script>

<template>
  <div id="DurationContainer" class="register-duration-panel">
    <div class="register-duration-year-unit-panel">
      <div class="register-duration-year-unit-period">
        {{ t("pricer.registrationPeriodLabel") }}
      </div>

      <div class="register-duration-year-unit-price-space"></div>

      <div class="register-duration-year-unit-price">
        {{ t("pricer.rentPriceLabel") }}
      </div>
    </div>
    <div class="register-duration-input-panel">
      <InputNumber
        :enabled="true"
        :value="years"
        @onChange="onDurationChange"
      ></InputNumber>
      <img style="margin-top: 0.6em; margin-left: 0.5em" :src="ChainSvg" alt="ChainSvg" />

      <div class="price-fee">{{ rentPriceEth }} ETH</div>
    </div>

    <TotalFeesOnlyRent :price="price"></TotalFeesOnlyRent>
  </div>
</template>

<script lang="ts">
export default {
  name: "DurationFeesOnlyRent",
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
