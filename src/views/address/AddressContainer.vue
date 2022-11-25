<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import InputSearch from "components/input/InputSearch.vue";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";

import { getJointName } from "@/contractUtils/domainName";
import { UserAccountStore } from "store";

import createIcon from "@/blockies";

import { showLoading, ILoading } from "@/components/ui/loading";

import { sendHelper } from "../../contractUtils/transaction";

import { IServerDomainInfo } from "@/server/serverType";

import {
  getReverseNameFromServer,
  getReverseRecordDomainsFromServer,
} from "@/server/reverse";

import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";

import { isAddressEqual } from "@/utils/util";

import { waitUntil } from "@/utils/waitUntil";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const routerAccount = ref("");
const accountReverseRecord = ref("");
const reverseRecordDomains = ref<IServerDomainInfo[]>([]);
const selectedItem = ref("");

onBeforeRouteUpdate(async (to) => {
  if (typeof to.params.account === "string")
    routerAccount.value = to.params.account.trim().toLowerCase();
  else routerAccount.value = to.params.account[0].trim().toLowerCase();

  await getReverseInfoFromServer();
});

onMounted(async () => {
  if (typeof route.params.account === "string")
    routerAccount.value = route.params.account.trim().toLowerCase();
  else routerAccount.value = route.params.account[0].trim().toLowerCase();

  await getReverseInfoFromServer();
  /*
  const loading: ILoading = {
    id: ".address-account-container",
    func: async () => {
      await waitUntil(async () => {
        console.log("waitUntil");
        return false;
      }, 600000);
    },
  };
  showLoading(loading);
  */
});

const blockImgURL = computed(() => {
  var imgURL = createIcon({
    seed: routerAccount.value.toLowerCase(),
    size: 8,
    scale: 5,
    color: 0, //'#E1E1E1',
    bgcolor: 0, // '#FFFFFF',
    spotcolor: 0, //'#CFCFCF'
  }).toDataURL();

  return imgURL;
});

const hasValidReverseRecord = computed(() => {
  return accountReverseRecord.value !== "";
});

const noneReverseRecord = computed(() => {
  if (!reverseRecordDomains || reverseRecordDomains.value.length == 0) return true;
  return false;
});

const showReverseRecord = computed(() => {
  return isAddressEqual(UserAccountStore.account, routerAccount.value);
});

const onSearchClick = (searchText: string) => {
  router.push({ path: `/search/${searchText}` });
};

const onAddressItemClick = (name: string) => {
  router.push({ path: `/name/${name}/details` });
};

const getReverseInfoFromServerHelper = async () => {
  await appContractModels.setup();

  //Get data from wallet

  //this.account = await web3Config.getAccount();
  //var networkId = await web3Config.getNetworkId();

  //Get data from store
  const account = UserAccountStore.account;
  const networkId = UserAccountStore.networkId;

  accountReverseRecord.value =
    (await getReverseNameFromServer(networkId, routerAccount.value)) ?? "";

  //Get data from server
  reverseRecordDomains.value =
    (await getReverseRecordDomainsFromServer(networkId, routerAccount.value)) ?? [];
};

const getReverseInfoFromServer = async () => {
  const loading: ILoading = {
    id: ".address-account-container",
    func: async () => {
      await getReverseInfoFromServerHelper();
    },
  };
  showLoading(loading);
};

/**
 *  Get data from eth chains
 */
const getReverseRecordState = async () => {
  try {
    await appContractModels.setup();

    var networkId = await web3Config.getNetworkId();

    if (UserAccountStore.account === routerAccount.value) {
      const reverseRecord = await appContractModels.getReverseRecord();
      if (typeof reverseRecord == undefined) throw new Error("reverseRecord undefined");

      var result = await reverseRecord?.getReverseRecordName(routerAccount.value);

      accountReverseRecord.value = result;

      reverseRecordDomains.value =
        (await getReverseRecordDomainsFromServer(networkId, routerAccount.value)) ?? [];
    }
  } catch (error) {
    console.log(error);
  }
};

const showSetReverseDialog = () => {
  createAlertDialog(t("singleName.record.messages.selectPlaceholder"));
};

const onSetReverseClick = async () => {
  if (!selectedItem.value) {
    showSetReverseDialog();
    return;
  }

  const loading: ILoading = {
    id: ".address-account-container",
    func: async () => {
      await setReverseRecord(selectedItem.value);

      await waitUntil(async () => {
        const a = await getReverseNameFromServer(
          UserAccountStore.networkId,
          routerAccount.value
        );
        console.log(a);
        console.log(accountReverseRecord.value);

        return a != null;
      }, 600000);

      await getReverseInfoFromServer();
    },
  };
  showLoading(loading);
};

const setReverseRecord = async (name: string) => {
  try {
    await appContractModels.setup();
    var ens = await appContractModels.getENS();

    if (typeof ens == undefined) throw new Error("ens undefined");

    var tx = await ens?.claimAndSetReverseRecordName(name);
    await sendHelper(tx);
  } catch (error) {}
};

const deleteReverseRecord = async () => {
  try {
    await appContractModels.setup();
    var ens = await appContractModels.getENS();

    var tx = await ens?.claimAndSetReverseRecordName(emptyAddress);

    await sendHelper(tx);
    await getReverseRecordState();
  } catch (error) {}
};

const getItemValue = (item) => {
  return getJointName(item.name, item.baseNodeIndex);
};

const onDeleteReverseRecordOK = async () => {
  const loading: ILoading = {
    id: ".address-account-container",
    func: async () => {
      await deleteReverseRecord();

      await waitUntil(async () => {
        console.log("waitUntil");

        const a = await getReverseNameFromServer(
          UserAccountStore.networkId,
          routerAccount.value
        );
        console.log(a);
        return a == null;
      }, 600000);

      await getReverseInfoFromServer();
    },
  };
  showLoading(loading);
};

const cancel = (): void => {};

const showDeleteDialog = () => {
  createDialog({
    footerVisible: true,
    cancelVisible: true,
    title: t("singleName.dialog.alert"),
    content:
      t("singleName.record.messages.reverseRecordRemoval") +
      t("singleName.dialog.subTitle") +
      t("singleName.dialog.title"),
    ok: onDeleteReverseRecordOK,
    cancel,
  });
};
</script>

<template>
  <div class="address-container">
    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>

    <div class="address-account-container">
      <div class="user-info">
        <div class="user-block" :style="{ backgroundImage: `url(${blockImgURL})` }"></div>
        <div class="user-account">
          {{ routerAccount }}

          <div v-if="hasValidReverseRecord">
            <span>{{ accountReverseRecord }}</span>
          </div>
        </div>
      </div>

      <div v-if="showReverseRecord">
        <div v-if="noneReverseRecord">
          <div>{{ t("singleName.record.messages.notSet") }}</div>
          <div>
            {{
              t("singleName.record.messages.explanation", {
                name: "example.unit",
                account: routerAccount,
              })
            }}
          </div>

          <div class="message_warning">
            {{ t("singleName.record.messages.noForwardRecordAavilable") }}
          </div>
          <div>{{ t("singleName.record.messages.explanation2") }}</div>
        </div>

        <div v-else>
          <div v-if="hasValidReverseRecord">
            <div>
              {{ t("singleName.record.messages.setTo") }}
              <span class="account-reverse-record">{{ accountReverseRecord }}</span>
            </div>
            <div>
              {{
                t("singleName.record.messages.explanation", {
                  name: accountReverseRecord,
                  account: routerAccount,
                })
              }}
            </div>

            <UnitButton
              :caption="t('singleName.confirm.button.delete')"
              @onClick="showDeleteDialog"
              :enable="true"
              type="primary"
            >
            </UnitButton>
          </div>
          <div v-else>
            <div>{{ t("singleName.record.messages.notSet") }}</div>
            <div>
              {{
                t("singleName.record.messages.explanation", {
                  name: "example.unit",
                  account: routerAccount,
                })
              }}
            </div>
            <select class="select-reverse-record-list" v-model="selectedItem">
              <option
                class="select-reverse-record-option"
                v-for="(item, index) in reverseRecordDomains"
                :key="index"
              >
                {{ getItemValue(item) }}
              </option>
            </select>
            <div>{{ t("singleName.record.messages.explanation2") }}</div>

            <UnitButton
              :caption="t('c.set')"
              @onClick="onSetReverseClick"
              :enable="true"
              type="primary"
            >
            </UnitButton>
          </div>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: "AddressContainer",
};
</script>

<style scoped>
@import "@/assets/css/address.css";

.address-container {
  padding-bottom: 10px;
  margin: 0px;
}

.input-search {
  text-align: center;
  padding: 20px;
  margin: 0px;
}

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

.select-reverse-record {
  width: 40em;

  font-size: 1em;
  padding-left: 20px;
  /*很关键：将默认的select选择框样式清除*/
  appearance: none;
}

.select-reverse-record:hover {
  border: solid 1px #96cffd;
}

.select-reverse-record-list {
  width: 40em;
  font-size: 1em;
  margin: 0.5em;
}

.select-reverse-record-list:hover {
  border: solid 1px #96cffd;
}

.select-reverse-record-option {
}

.select-reverse-record-option:hover {
}

.select-reverse-record-select:focus .option {
}

.message_warning {
  margin: 0.5em;
  color: red;
  font: 1.5em;
}

.account-reverse-record {
  margin-left: 0.5em;
  font-weight: bold;
}
</style>
