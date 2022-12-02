<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { sendHelper } from "@/contractUtils/transaction";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";
import { namehash } from "@/contracts/utils/hash";

import { useI18n } from "vue-i18n";

import { getDomain, getDomainSuffix, getHostDomain } from "@/contractUtils/domainName";

import { showLoading, ILoading } from "@/components/ui/loading";
import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";
import { UserAccountStore } from "store";
import { waitUntil } from "@/utils/waitUntil";

import {
  getDomainInfoFromServer,
  getSubDomainInfoFromServer,
  getSubdomainsPageFromServer,
} from "@/server/domain";

import {
  IServerDomainInfo,
  IServerPage,
  IServerOwnSubDomainName,
} from "@/server/serverType";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

interface Props {
  item: IServerOwnSubDomainName;
  canEditSubdomain: boolean;
}

const props = defineProps<Props>();

//event
const emit = defineEmits<{
  (e: "onAddressItemClick", name: string): void;
  (e: "onDeleteItemClick", item: IServerOwnSubDomainName): void;
}>();

const name = computed(() => {
  if (!props.item) return "";
  return getJointName(props.item.name, props.item.baseNodeIndex);
});

const onAddressItemClick = () => {
  emit("onAddressItemClick", name.value);
};

const onDeleteReverseRecordOK = async () => {
  emit("onDeleteItemClick", props.item);
};

const cancel = (): void => {};

const showDeleteDialog = () => {
  createDialog({
    footerVisible: true,
    cancelVisible: true,
    title: t("singleName.dialog.alert"),
    content:
      t("singleName.subdomain.removal") +
      t("singleName.dialog.subTitle") +
      t("singleName.dialog.title"),
    ok: onDeleteReverseRecordOK,
    cancel,
  });
};
</script>
<template>
  <div class="address-panel">
    <div class="address-name" @click="onAddressItemClick()">{{ name }}</div>
    <UnitButton
      v-if="canEditSubdomain"
      :caption="t('singleName.confirm.button.delete')"
      @onClick="showDeleteDialog"
      :enable="canEditSubdomain"
      type="primary"
    >
    </UnitButton>
  </div>
</template>

<script lang="ts">
import { getJointName } from "@/contractUtils/domainName";
export default {
  name: "AddressSubdomainItem",
};
</script>
<style scoped>
.address-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #fdfdfd 50%, #f8f8f8 100%);
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}

.address-panel:hover {
  background: linear-gradient(160deg, #fdfdfd 0%, #ebebeb 50%);
}

.address-name {
  font: 1em sans-serif;
  margin: 1em;
  cursor: pointer;
  width: calc(100% - 150px);

  text-align: left;
}
</style>
