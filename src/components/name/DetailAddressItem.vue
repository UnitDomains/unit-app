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
        <div class="detail-base-info-left">{{ title }}</div>

        <div class="detail-base-info-middle-1">
          <div>{{ content }}</div>
          <input
            class="custom-input-box"
            :placeholder="$t('search.placeholder')"
            @keyup.enter="onAddressContentChange"
            @input="onAddressContentChange"
            v-model="address"
          />
          <div>{{ newAddress }}</div>
        </div>
      </div>

      <div class="detail-base-info-foot">
        <UnitButton
          :caption="$t('c.cancel')"
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

<script>
import EthVal from "ethval";
import { setup, getRegistrar, getENS } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId } from "contracts/web3.js";
import { calculateDuration } from "utils/dates.js";

import { getRentPrice, getAccountBalance } from "contractUtils/Price.js";
import { getDomain, getDomainSuffix } from "contractUtils/domainName.js";
import moment from "moment";
import { getAddressValidation } from "contractUtils/address.js";

import { emptyAddress } from "contracts/utils";
import NameDetailItem from "components/name/NameDetailItem.vue";

import { resolverFromServer } from "server/domain.js";
import { UserAccountStore } from "store/store.js";

import loading from "components/ui/loading";

import { getAccount } from "../../contracts/web3";

import CopyToClipboard from "components/ui/CopyToClipboard.vue";

export default {
  name: "DetailAddressItem",
  components: {
    CopyToClipboard,
  },
  props: {
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
  },
  computed: {
    addressValidate() {
      if (this.newAddress.length > 0 && this.newAddress != emptyAddress) return true;
      return false;
    },
  },
  data() {
    return {
      editAreaVisible: false,
      newAddress: "",
      address: "",
    };
  },

  async mounted() {},

  methods: {
    onShowEditAreaButtonClick() {
      this.editAreaVisible = true;
    },
    onHideEditAreaButtonClick() {
      this.editAreaVisible = false;
    },
    onOkButtonClick() {
      this.editAreaVisible = false;
      this.$emit("onOkButtonClick", this.newAddress);
    },
    async onAddressContentChange() {
      var p = this.address;

      if (p) {
        if (getAddressValidation(p)) {
          this.newAddress = p;
        } else {
          //   loading.showLoading("#DetailAddressItemContentContainer");
          var networkId = UserAccountStore.networkId;

          /*
        //Get data from eth-chains
        await setup();
        networkId = await getNetworkId();
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
            this.newAddress = a;
          } else this.newAddress = emptyAddress;
          //  loading.hideLoading();
        }
      }
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/detail.css";
@import "~@/assets/css/document.css";

.custom-input-box {
  margin: 10px;
  width: 60em;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;

  border-radius: 5px 0px 0px 5px;
  outline: none;
  padding: 0 15px;
  color: #606266;
  font: 1em sans-serif;
}

.custom-input-box:focus {
  border-color: #409eff;
}
</style>
