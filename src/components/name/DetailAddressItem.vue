<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { emptyAddress } from "@/contracts/utils";

import { getAddressValidation } from "contracts/utils/address";

import { resolverFromServer } from "server/domain";
import { UserAccountStore } from "store";

import CopyToClipboard from "components/ui/CopyToClipboard.vue";

const { t } = useI18n();

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  buttonCaption: {
    type: String,
    default: "",
  },
  enable: {
    type: Boolean,
    default: false,
  },
});

const editAreaVisible = ref(false);
const newAddress = ref(emptyAddress);
const address = ref("");

const addressValidate = computed(() => {
  if (newAddress.value.length > 0 && newAddress.value != emptyAddress) return true;
  return false;
});

//event
const emit = defineEmits<{
  (e: "onOkButtonClick", newAddress: string): void;
}>();

const onShowEditAreaButtonClick = () => {
  editAreaVisible.value = true;
};

const onHideEditAreaButtonClick = () => {
  editAreaVisible.value = false;
};

const onOkButtonClick = () => {
  editAreaVisible.value = false;
  emit("onOkButtonClick", newAddress.value);
};

const onAddressContentChange = async () => {
  var p = address.value;

  if (p) {
    if (getAddressValidation(p)) {
      newAddress.value = p;
    } else {
      var networkId = UserAccountStore.networkId;

      /*
        //Get data from eth-chains
        await setup();
        networkId = await web3Config.getNetworkId();
        */
      var a = "";
      var ret = await resolverFromServer(networkId, p);
      if (ret) {
        a = ret;
      }

      //Get data from server

      /*

          //You can get data from eth-chains

          await setup();
          var ens = await getENS();
          var a = await ens.getAddress(p);
          */

      if (getAddressValidation(a)) {
        newAddress.value = a;
      } else newAddress.value = emptyAddress;
    }
  }
};
</script>

<template>
  <div id="DetailAddressItemContentContainer">
    <div class="detail-base-info-container" v-if="!editAreaVisible">
      <div class="detail-base-info-left">{{ title }}</div>
      <div class="detail-base-info-middle">
        {{ content }}
        <CopyToClipboard :value="content" />
      </div>
      <div class="detail-base-info-right">
        <UnitButton
          :caption="buttonCaption"
          @onClick="onShowEditAreaButtonClick"
          :enable="enable"
          type="primary"
        ></UnitButton>
      </div>
    </div>
    <div v-else class="detail-collapse-container">
      <div class="detail-base-info-container">
        <div class="detail-base-info-left-sub">{{ title }}</div>

        <div class="detail-base-info-middle-1">
          <div>{{ content }}</div>
          <div style="margin-top: 1em">
            <input
              class="custom-input-box"
              :placeholder="t('search.placeholder')"
              @keyup.enter="onAddressContentChange"
              @input="onAddressContentChange"
              v-model="address"
            />

            <div>{{ newAddress }}</div>
          </div>
        </div>
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="t('c.cancel')"
          @onClick="onHideEditAreaButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>
        <UnitButton
          :caption="buttonCaption"
          @onClick="onOkButtonClick"
          :enable="addressValidate"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DetailAddressItem",
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";

.custom-input-box {
  margin: 10px;
  margin-left: 0;

  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  min-width: 30em;
  border-radius: 5px 0px 0px 5px;
  outline: none;

  color: #606266;
  font: 1em sans-serif;
}

.custom-input-box:focus {
  border-color: #409eff;
}
</style>
