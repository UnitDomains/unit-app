<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import {
  getEthRegisterPrice,
  getTotalPrice,
  getEthRentPrice,
  INewDomainPriceValue,
  IRentPriceValue,
} from "@/contractUtils/Price";
import { getDomain, getDomainIndex } from "@/contractUtils/domainName";
import { web3Config } from "@/contracts/web3";
import { calculateDuration, formatDate } from "@/utils/dates";

import InputNumber from "components/input/InputNumber.vue";
import TotalFees from "./TotalFees.vue";
import ChainSvg from "icons/chain.svg";

import { showLoading, hideLoading } from "@/components/ui/loading";
import DurationFeesOnlyRent from "./DurationFeesOnlyRent.vue";

import { getPriceRegisterFromServer, getPriceRentFromServer } from "server/price";
import { BigNumber } from "ethers";

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
});

const stepNumber = ref(0);

const price: INewDomainPriceValue = reactive({
  rentPrice: BigNumber.from(0),
  registerPrice: BigNumber.from(0),
  rentAndRegisterPrices: BigNumber.from(0),
  totalSlow: BigNumber.from(0),
  totalFast: BigNumber.from(0),
  registerGasSlow: BigNumber.from(0),
  registerGasFast: BigNumber.from(0),
  gasPriceToGweiSlow: BigNumber.from(0),
  gasPriceToGweiFast: BigNumber.from(0),
});
const years = ref(1);

onMounted(() => {
  getPriceFromServer(1);
});

//event
const emit = defineEmits<{
  (e: "onDurationBeginChange"): void;
  (e: "onDurationChange", years: number, price: INewDomainPriceValue): void;
}>();

/**
 * Get price from eth-chains
 * @param {} years
 */
const getPrice = async (years: number) => {
  emit("onDurationBeginChange");
  loading.showLoading("#DurationContainer");

  let rentPrice = await getEthRentPrice(props.domainName, years);
  let registerPrice = await getEthRegisterPrice(props.domainName, years);

  if (rentPrice) {
    const priceTemp: INewDomainPriceValue = await getTotalPrice(rentPrice, registerPrice);

    price.rentPrice = priceTemp.rentPrice;
    price.registerPrice = priceTemp.registerPrice;
    price.rentAndRegisterPrices = priceTemp.rentAndRegisterPrices;
    price.totalSlow = priceTemp.totalSlow;
    price.totalFast = priceTemp.totalFast;
    price.registerGasSlow = priceTemp.registerGasSlow;
    price.registerGasFast = priceTemp.registerGasFast;
    price.gasPriceToGweiSlow = priceTemp.gasPriceToGweiSlow;
    price.gasPriceToGweiFast = priceTemp.gasPriceToGweiFast;

    emit("onDurationChange", years, price);
  }

  // Loading should be closed asynchronously
  loading.hideLoading();
};

/**
 * Get price from server
 */
const getPriceFromServer = async (years: number) => {
  const networkId = await web3Config.getNetworkId();
  const registerPrice = await getPriceRegisterFromServer(networkId, props.domainName);

  const rentPriceTemp = await getPriceRentFromServer(networkId, props.domainName);

  const duration = calculateDuration(years);

  const rentPrice = BigNumber.from(rentPriceTemp).mul(duration);

  if (rentPrice) {
    const priceTemp: INewDomainPriceValue = await getTotalPrice(rentPrice, registerPrice);
    price.rentPrice = priceTemp.rentPrice;
    price.registerPrice = priceTemp.registerPrice;
    price.rentAndRegisterPrices = priceTemp.rentAndRegisterPrices;
    price.totalSlow = priceTemp.totalSlow;
    price.totalFast = priceTemp.totalFast;
    price.registerGasSlow = priceTemp.registerGasSlow;
    price.registerGasFast = priceTemp.registerGasFast;
    price.gasPriceToGweiSlow = priceTemp.gasPriceToGweiSlow;
    price.gasPriceToGweiFast = priceTemp.gasPriceToGweiFast;

    console.log(price);

    emit("onDurationChange", years, price);
  }
};

const onDurationChange = (years: number) => {
  //You can get price from server or eth-chains
  //Get price from eth-chains
  //await this.getPrice(years);

  //Get price from sever
  getPriceFromServer(years);
};
</script>

<template>
  <div>
    <DurationFeesOnlyRent
      :domainName="domainName"
      :years="years"
      :price="price"
      @onDurationChange="onDurationChange"
    ></DurationFeesOnlyRent>
  </div>
</template>

<script lang="ts">
export default {
  name: "RenewDuration",
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
