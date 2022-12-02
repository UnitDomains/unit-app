<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";

import { checkIsDecrypted, truncateUndecryptedName, parseName } from "@/contracts/labels";

import { calculateDuration } from "@/utils/dates";
import { sendHelper } from "@/contractUtils/transaction";
import { getRentPrice, getAccountBalance } from "@/contractUtils/Price";
import {
  getDomain,
  getDomainSuffix,
  getHostDomain,
  getParentDomain,
  getJointName,
} from "@/contractUtils/domainName";

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

import { namehash } from "@/contracts/utils/hash";

import AddSubDomain from "components/name/AddSubDomain.vue";

import { showLoading, ILoading } from "@/components/ui/loading";

import AddressSubdomainsList from "components/address/AddressSubdomainsList.vue";

import Tabs from "components/ui/Tabs.vue";
import { createAlertDialog } from "../ui/dialog/createDialog";

const { t } = useI18n();

const router = useRouter();

interface Props {
  domainName: string;
}

const props = defineProps<Props>();

const available = ref(false);
const domainEntry = ref(null);
const domainResolver = ref(emptyAddress);
const owner = ref(emptyAddress);
const addressData = ref<IServerPage<IServerOwnSubDomainName> | null>(null);
const pageNo = ref(1);
const pageSize = ref(10);

const canAddSubdomain = computed(() => {
  console.log(owner.value);
  console.log(UserAccountStore.account);
  console.log(owner.value == UserAccountStore.account);
  if (available.value) return false;

  if (owner.value === emptyAddress) return false;
  if (UserAccountStore.account === emptyAddress) return false;
  return owner.value == UserAccountStore.account;
});

const isSubdomain = computed(() => {
  return props.domainName?.split(".").length >= 2;
});

onMounted(async () => {
  //  await this.getDomainNameAvailable()
  //  await this.getSubdomains()
  await getSubdomainsFromServer();
});

watch(
  () => props.domainName,
  (newValue, oldValue) => {
    console.log(newValue);
    getSubdomainsFromServer();
  }
);
const parenDomain = computed(() => {
  return getParentDomain(props.domainName);
});
const onTabClick = (index: number) => {
  if (index === 0) {
    //register or parent
    if (isSubdomain.value) router.push({ path: `/name/${parenDomain.value}/details` });
    else router.push({ path: `/name/${props.domainName}/register` });
  } else if (index === 1) {
    //detail
    router.push({ path: `/name/${props.domainName}/details` });
  } else if (index === 2) {
    //subdomain
    router.push({ path: `/name/${props.domainName}/subdomains` });
  }
};
const onPageClick = async (page: number) => {
  pageNo.value = page;
  await getSubdomainsFromServer();
};
const onAddressItemClick = (name: string) => {
  router.push({ path: `/name/${name}/details` });
};

const getSubdomainNameAvailableFromServer = async (
  parentDomain: string,
  subdomain: string
) => {
  var networkId = UserAccountStore.networkId;
  const subNodeLabel = namehash(subdomain + "." + props.domainName);
  const node = namehash(getHostDomain(props.domainName));
  console.log(subNodeLabel);
  console.log(node);
  const ret = await getSubDomainInfoFromServer(networkId, subdomain, subNodeLabel, node);
  if (ret && ret.subNodeLabel === subNodeLabel) return false;
  return true;
};

const onAddSubdomainsButtonClick = async (newContent: string) => {
  const available = await getSubdomainNameAvailableFromServer(
    props.domainName,
    newContent
  );

  if (!available) {
    console.log("a1");
    createAlertDialog(t("singleName.subdomain.alreadyRegistered"));
    return;
  }

  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await appContractModels.setup();
      const ens = appContractModels.getENS();
      const subdomain = appContractModels.getSubdomainRegistrar();
      const tx = await subdomain?.register(props.domainName, newContent);
      await sendHelper(tx);

      var networkId = UserAccountStore.networkId;
      const subNodeLabel = namehash(newContent + "." + props.domainName);

      const node = namehash(getHostDomain(props.domainName));

      await waitUntil(async () => {
        const ret = await getSubDomainInfoFromServer(
          networkId,
          newContent,
          subNodeLabel,
          node
        );
        if (ret && ret.subNodeLabel === subNodeLabel) return true;
        return false;
      }, 600000);

      await getSubdomainsFromServer();
    },
  };
  showLoading(loading);
};
const deleteSubdomain = async (item: IServerOwnSubDomainName) => {
  console.log(item.name);
  console.log(item.subDomain);
  console.log(item.label);
  console.log(item.subNodeLabel);

  const parent = getParentDomain(getJointName(item.name, item.baseNodeIndex));
  const subdomain = getJointName(item.name, item.baseNodeIndex);

  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await appContractModels.setup();

      const subdomainRegistrar = appContractModels.getSubdomainRegistrar();

      const tx = await subdomainRegistrar?.deleteSubdomain(parent, subdomain);
      await sendHelper(tx);

      var networkId = UserAccountStore.networkId;
      const subNodeLabel = item.subNodeLabel;

      const node = namehash(getHostDomain(props.domainName));

      await waitUntil(async () => {
        const ret = await getSubDomainInfoFromServer(
          networkId,
          item.name,
          subNodeLabel,
          node
        );
        if (ret) return false;
        return true;
      }, 600000);

      await getSubdomainsFromServer();
    },
  };
  showLoading(loading);
};
const getSubdomains = async () => {
  const loading: ILoading = {
    id: "#subdomainContainer",
    func: async () => {
      await appContractModels.setup();
      const ens = appContractModels.getENS();

      const subdomains = await ens?.getSubdomains(props.domainName);
      console.log(subdomains);
      // await sendHelper(tx)

      const hasNoSubdomains = subdomains && subdomains.length === 0;

      return true;
    },
  };
  showLoading(loading);
};
const getSubdomainsFromServer = async () => {
  if (!props.domainName || props.domainName.trim().length == 0) return;
  try {
    var networkId = UserAccountStore.networkId;
    var hostDomain = getHostDomain(props.domainName);

    if (hostDomain) {
      var ret: IServerDomainInfo | null = await getDomainInfoFromServer(
        networkId,
        hostDomain
      );
      console.log(ret);

      if (ret) {
        owner.value = ret.owner;
        available.value = false;

        const label = namehash(props.domainName);

        let res: IServerPage<IServerOwnSubDomainName> | null = await getSubdomainsPageFromServer(
          networkId,
          label,
          pageNo.value,
          pageSize.value
        );

        addressData.value = res;
      } else available.value = true;
    } else {
      available.value = true;
      addressData.value = null;
    }
  } catch (err) {
    console.log(err);
  }
};
</script>

<template>
  <div id="ContentContainer" class="detail-panel-container">
    <Tabs
      :domainName="domainName"
      :tabTitle="[
        isSubdomain ? t('singleName.tabs.parentDomain') : t('singleName.tabs.register'),
        t('singleName.tabs.details'),
        t('singleName.tabs.subdomains'),
      ]"
      active="2"
      @onTabClick="onTabClick"
    ></Tabs>

    <div id="subdomainContainer" style="width: 100%" v-if="canAddSubdomain">
      <AddSubDomain @onOkButtonClick="onAddSubdomainsButtonClick"></AddSubDomain>
    </div>

    <div class="detail-panel">
      <AddressSubdomainsList
        :addressData="addressData"
        :canEditSubdomain="canAddSubdomain"
        @onAddressItemClick="onAddressItemClick"
        @onDeleteItemClick="deleteSubdomain"
        @onPageClick="onPageClick"
      >
      </AddressSubdomainsList>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SubdomainName",
};
</script>

<style scoped>
@import "@/assets/css/address.css";
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
</style>
