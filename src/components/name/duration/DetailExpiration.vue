<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import RenewDuration from "components/name/duration/RenewDuration.vue";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";
import { calculateDuration, formatDate } from "@/utils/dates";

import {
  getRentPrice,
  getAccountBalance,
  INewDomainPriceValue,
} from "@/contractUtils/Price";

import { BigNumber } from "ethers";

const { t } = useI18n();

const router = useRouter();

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
  expiryTime: {
    type: Date,
    default: 0,
  },
});

const durationVisible = ref(false);
const accountBalanceInsufficientVisible = ref(false);
const durationChangedCompleted = ref(false);
const totalFees = ref<BigNumber>(BigNumber.from(0));
const renewYears = ref(0);

//event
const emit = defineEmits<{
  (e: "onOkButtonClick", years: number, totalFees: BigNumber): void;
}>();

const renewButtonEnable = computed<boolean>(() => {
  if (accountBalanceInsufficientVisible.value) return false;

  const _totalFees = BigNumber.from(totalFees.value);
  if (_totalFees.isZero()) return false;
  return true;
});

const domainExpiryTime = computed<string>(() => {
  return !props.expiryTime ? "" : formatDate(props.expiryTime, false);
});

const onShowDurationButtonClick = () => {
  durationVisible.value = true;
};
const onHideDurationButtonClick = () => {
  durationVisible.value = false;
};
const onRenewButtonClick = () => {
  durationVisible.value = false;
  const _totalFees = BigNumber.from(totalFees.value);
  emit("onOkButtonClick", renewYears.value, _totalFees);
};

const onDurationBeginChange = () => {
  durationChangedCompleted.value = false;
};

const onDurationChange = async (years: number, price: INewDomainPriceValue) => {
  renewYears.value = years;

  //   this.rentPrice = rentPrice
  //   this.gasPrice = gasPrice

  totalFees.value = price.totalFast;

  var accountBalance: BigNumber = await getAccountBalance();
  const _totalFees = BigNumber.from(totalFees.value);

  if (_totalFees.gt(accountBalance)) {
    accountBalanceInsufficientVisible.value = true;
  } else {
    accountBalanceInsufficientVisible.value = false;
  }
};
</script>

<template>
  <div id="ContentContainer">
    <div class="detail-base-info-container" v-if="!durationVisible">
      <div class="detail-base-info-left">{{ $t("c.Expiration Date") }}</div>
      <div class="detail-base-info-middle">{{ domainExpiryTime }}</div>
      <div class="detail-base-info-right">
        <UnitButton
          :caption="$t('c.renew')"
          @onClick="onShowDurationButtonClick"
          :enable="true"
          type="primary"
        >
          {{ $t("c.renew") }}</UnitButton
        >
      </div>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info-left-sub">{{ $t("c.Expiration Date") }}</div>
        <div class="detail-base-info-middle-1">
          <div>{{ domainExpiryTime }}</div>
          <div style="margin-top: 2em">
            <RenewDuration
              :domainName="domainName"
              @onDurationChange="onDurationChange"
              @onDurationBeginChange="onDurationBeginChange"
            ></RenewDuration>
          </div>
        </div>
      </div>
      <div
        v-show="accountBalanceInsufficientVisible"
        class="account-balance-insufficient"
      >
        {{ $t("register.buttons.insufficient") }}
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="$t('c.cancel')"
          @onClick="onHideDurationButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="$t('c.renew')"
          @onClick="onRenewButtonClick"
          :enable="renewButtonEnable"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DetailExpiration",
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
</style>
