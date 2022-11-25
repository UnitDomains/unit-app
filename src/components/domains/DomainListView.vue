<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { calculateDuration, formatDate } from "utils/dates";

import {
  getDomain,
  getDomainSuffix,
  getSuffixByIndex,
  getJointName,
  getDomainIndex,
  getHostDomain,
} from "@/contractUtils/domainName";

import { IServerDomainInfo, IServerPriceInfo } from "@/server/serverType";
import { emptyAddress } from "@/contracts/types";
interface Props {
  domainName: IServerDomainInfo;
}

const props = defineProps<Props>();

const owned = computed<boolean>(() => {
  return props.domainName.owner !== emptyAddress;
});

const domainExpiryTime = computed(() => {
  return formatDate(new Date(props.domainName.expires * 1000), false);
});

const hostDomainName = computed<string>(() => {
  return getDomain(props.domainName.name);
});
const domainSuffix = computed(() => {
  return getSuffixByIndex(props.domainName.baseNodeIndex);
});
</script>

<template>
  <div class="domain-panel" :class="{ domain_panel_owned: owned }">
    <div class="domain-name">
      <span>{{ hostDomainName }}.{{ domainSuffix }}</span>
    </div>
    <div class="domain-state">
      <div v-if="owned">
        <span style="margin-right: 2em"
          >{{ $t("c.Expiration Date") }} {{ domainExpiryTime }}</span
        >
        {{ $t("singleName.domain.state.owned") }}
      </div>
      <div v-else>{{ $t("singleName.domain.state.available") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DomainListView",
};
</script>
<style scoped>
.domain-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #d4f7d4 50%, #9bf7be 100%);
  border-radius: 4px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
  cursor: pointer;
}

.domain-panel:hover {
  background: linear-gradient(160deg, #d4f7d4 0%, #9bf7be 50%);
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
}

.domain_panel_owned {
  background: linear-gradient(160deg, #dbdbdb 50%, #b3b3b3 100%);
}

.domain_panel_owned:hover {
  background: linear-gradient(160deg, #dbdbdb 0%, #b3b3b3 50%);
}

.domain-name {
  font: 1em sans-serif;
  margin: 1em;
  cursor: pointer;
}

.domain-state {
  font: 1em sans-serif;
  margin: 1em;
}
</style>
