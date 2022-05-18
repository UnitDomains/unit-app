<template>
  <div class="address-container">
    <div class="input-search">
      <InputSearch></InputSearch>
    </div>

    <div class="address-account-container">
      <div class="user-info">
        <div class="user-block" :style="{ backgroundImage: `url(${blockImgURL})` }"></div>
        <div class="user-account">{{ routerAccount }}</div>
      </div>

      <div v-if="showReverseRecord">
        <div v-if="noneReverseRecord">
          <div>{{ $t("singleName.record.messages.notSet") }}</div>
          <div>
            {{
              $t("singleName.record.messages.explanation", {
                name: "example.unit",
                account: routerAccount,
              })
            }}
          </div>

          <div class="message_warning">
            {{ $t("singleName.record.messages.noForwardRecordAavilable") }}
          </div>
          <div>{{ $t("singleName.record.messages.explanation2") }}</div>
        </div>

        <div v-else>
          <div v-if="hasValidReverseRecord">
            <div>
              {{ $t("singleName.record.messages.setTo") }}
              <span class="account-reverse-record">{{ accountReverseRecord }}</span>
            </div>
            <div>
              {{
                $t("singleName.record.messages.explanation", {
                  name: accountReverseRecord,
                  account: routerAccount,
                })
              }}
            </div>

            <UnitButton
              caption="Delete"
              @onClick="onDeleteReverseClick"
              :enable="true"
              type="primary"
            >
            </UnitButton>
          </div>
          <div v-else>
            <div>{{ $t("singleName.record.messages.notSet") }}</div>
            <div>
              {{
                $t("singleName.record.messages.explanation", {
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
            <div>{{ $t("singleName.record.messages.explanation2") }}</div>

            <UnitButton
              :caption="$t('c.set')"
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

<script>
import InputSearch from "components/input/InputSearch.vue";

import EthVal from "ethval";
import { setup, getRegistrar, getENS, getReverseRecord } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId, getAccount } from "contracts/web3.js";
import { emptyAddress } from "contracts/utils";

import { calculateDuration } from "utils/dates.js";

import { normalize } from "contracts/utils/eth-ens-namehash";
import { getJointName } from "contractUtils/domainName.js";

import moment from "moment";

import createIcon from "@/blockies";

import { ElLoading } from "element-plus";

import axios from "http/http";
import BASEURL from "http/api.js";
import { sendHelper } from "../../contractUtils/transaction";

import UnitButton from "components/ui/UnitButton.vue";

export default {
  name: "AddressContainer",
  components: {
    InputSearch,
    UnitButton,
  },
  data() {
    return {
      routerAccount: this.$route.params.account,
      account: "",
      accountReverseRecord: "",
      addressData: null,
      reverseRecordDomains: [],
      selectedItem: "",
      deleteReverseRecordEnable: true,
    };
  },
  computed: {
    blockImgURL() {
      var imgURL = createIcon({
        seed: this.routerAccount.toLowerCase(),
        size: 8,
        scale: 5,
        color: 0, //'#E1E1E1',
        bgcolor: 0, // '#FFFFFF',
        spotcolor: 0, //'#CFCFCF'
      }).toDataURL();

      return imgURL;
    },
    hasValidReverseRecord() {
      return this.accountReverseRecord != "";
    },
    noneReverseRecord() {
      if (this.reverseRecordDomains == null || this.reverseRecordDomains.length == 0)
        return true;
      return false;
    },
    showReverseRecord() {
      return this.account === this.routerAccount;
    },
  },

  async mounted() {
    await this.getReverseRecordState();
  },
  async beforeRouteUpdate(to, from, next) {
    this.routerAccount = to.params.account;

    await this.getReverseRecordState();

    next();
  },

  methods: {
    onAddressItemClick(name) {
      this.$router.push({ path: `/name/${name}/details` });
    },

    async getReverseRecordState() {
      var options = { target: document.querySelector(".address-account-container") };
      const loadingInstance = ElLoading.service(options);

      try {
        await setup();
        this.account = await getAccount();

        if (this.account === this.routerAccount) {
          let reverseRecord = await getReverseRecord();

          var result = await reverseRecord.getReverseRecordName(this.routerAccount);

          this.accountReverseRecord = result;

          //从服务器获得相关域名
          await this.getReverseRecordDomainsFromServer();
        }
      } catch (error) {
        console.log(error);
      }

      // Loading should be closed asynchronously
      loadingInstance.close();
    },
    async setReverseRecord(name) {
      await setup();
      var ens = await getENS();

      var tx = await ens.claimAndSetReverseRecordName(name);
      await sendHelper(tx);
    },

    async deleteReverseRecord() {
      var options = { target: document.querySelector(".address-account-container") };
      const loadingInstance = ElLoading.service(options);
      try {
        this.deleteReverseRecordEnable = false;

        await setup();
        var ens = await getENS();

        var tx = await ens.claimAndSetReverseRecordName(emptyAddress);

        await sendHelper(tx);
        await this.getReverseRecordState();
      } catch (error) {
        this.deleteReverseRecordEnable = true;
      }
      loadingInstance.close();
    },

    async onSetReverseClick() {
      if (this.selectedItem == null || this.selectedItem == "") {
        alert(this.$t("singleName.record.messages.selectPlaceholder"));
        return;
      }

      var options = { target: document.querySelector(".address-account-container") };
      const loadingInstance = ElLoading.service(options);
      var name = this.selectedItem;

      try {
        await this.setReverseRecord(name);

        await this.getReverseRecordState();
      } catch (error) {
        console.log(error);
      }

      // Loading should be closed asynchronously
      loadingInstance.close();
    },
    getItemValue(item) {
      return getJointName(item.name, item.baseNodeIndex);
    },

    async onDeleteReverseClick() {
      var r = confirm(this.$t("singleName.record.messages.reverseRecordRemoval"));
      if (r) {
        var options = { target: document.querySelector(".address-account-container") };
        const loadingInstance = ElLoading.service(options);

        this.deleteReverseRecord();

        // Loading should be closed asynchronously
        loadingInstance.close();
      } else {
      }
    },

    async getReverseRecordDomainsFromServer() {
      try {
        await setup();
        var networkId = await getNetworkId();

        let res = await axios.get(BASEURL.domains + "reverse", {
          params: { networkId: networkId, address: this.routerAccount },
        });

        this.reverseRecordDomains = res.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/address.css";

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
