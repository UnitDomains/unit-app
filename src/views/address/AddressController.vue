<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";

import createIcon from "@/blockies";

import { showLoading, ILoading } from "@/components/ui/loading";
import { IServerPage, IServerDomainInfo } from "@/server/serverType";
import { getControllerFromServer } from "@/server/domain";
import { processError } from "utils/processError";

import AddressList from "components/address/AddressList.vue";
import { UserAccountStore } from "@/store";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const account = ref("");

const addressData = ref<IServerPage<IServerDomainInfo> | null>(null);
const pageNo = ref(1);
const pageSize = ref(10);

onBeforeRouteUpdate(async (to) => {
  if (typeof to.params.account === "string")
    account.value = to.params.account.trim().toLowerCase();
  else account.value = to.params.account[0].trim().toLowerCase();
  await getRecordsFromServer();
});

onMounted(async () => {
  if (typeof route.params.account === "string")
    account.value = route.params.account.trim().toLowerCase();
  else account.value = route.params.account[0].trim().toLowerCase();

  await getRecordsFromServer();
});

const onRegisterButtonClick = () => {
  router.push({ path: `/address/${account.value}/registrant` });
};

const onControllerButtonClick = () => {
  router.push({ path: `/address/${account.value}/controller` });
};

const onAddressItemClick = (name: string) => {
  router.push({ path: `/name/${name}/details` });
};

const onPageClick = async (page: number) => {
  pageNo.value = page;
  await getRecordsFromServer();
};

const getRecordsFromServer = async () => {
  try {
    await appContractModels.setup();

    var networkId = UserAccountStore.networkId;

    addressData.value = await getControllerFromServer(
      networkId,
      account.value,
      pageNo.value,
      pageSize.value
    );
  } catch (err) {
    processError(err, router);
  }
};
</script>

<template>
  <div class="address-account-container">
    <div class="register-name-title">
      <div>
        <UnitButton
          :caption="$t('address.filter.registrant')"
          @onClick="onRegisterButtonClick"
          :enable="true"
        >
        </UnitButton>

        <UnitButton
          :caption="$t('address.filter.controller')"
          @onClick="onControllerButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
      </div>
    </div>

    <AddressList
      :addressData="addressData"
      @onAddressItemClick="onAddressItemClick"
      @onPageClick="onPageClick"
    >
    </AddressList>
  </div>
</template>

<script lang="ts">
export default {
  name: "AddressController",
};
</script>

<style scoped>
@import "@/assets/css/address.css";

.user-info {
  height: 60px;
  display: inline-flex;
  align-items: center;
  margin: 1em;
}

.user-block {
  display: inline-block;
  background-size: cover;
  width: 42px;
  height: 42px;
  top: 50%;
  margin-right: 10px;
  border-radius: 20%;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  flex-shrink: 0;
}

.user-account {
  font: 1.5em normal sans-serif;
  font-weight: 100;
  text-overflow: ellipsis;
  top: 10%;
  flex-shrink: 0;
}
</style>
