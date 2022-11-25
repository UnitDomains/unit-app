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

import { web3Config, IGasPrice } from "@/contracts/web3";

import { calculateDuration, formatDate } from "@/utils/dates";

import { getPriceRegisterFromServer, getPriceRentFromServer } from "@/server/price";

import { showLoading, ILoading } from "@/components/ui/loading";

import { BigNumber } from "ethers";

import DurationFees from "./DurationFees.vue";

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
  years: {
    type: Number,
    default: 1,
  },
});

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
  //this.getPrice(years);

  //Get price from sever
  getPriceFromServer(years);
};
</script>

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

<script lang="ts">
export default {
  name: "RegisterDuration",
};
</script>

<style scoped></style>
