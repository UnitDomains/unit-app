<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";
</script>

<template>
  <div>
    <h1>管理</h1>
    <div class="manager-panel">
      <UnitButton
        caption="Withdraw"
        @onClick="onWithdrawClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>

    <div class="manager-panel">
      <UnitButton
        caption="GetPrice"
        @onClick="onGetPrice"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
    <div class="manager-panel">
      <input
        class="manager-input-box"
        placeholder="The correct format is:cat"
        v-model="tldText"
      />
      <UnitButton
        caption="Add TLD"
        @onClick="onAddTLDClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
    <div class="manager-panel">
      <input
        class="manager-input-box"
        placeholder="The correct format is:1000,100,10,1,0"
        v-model="registerPrices"
      />
      <UnitButton
        caption="Change Register Price"
        @onClick="onChangeRegisterPriceClick"
        :enable="true"
        type="primary"
      >
      </UnitButton>
    </div>
    <div class="manager-panel">
      <input
        class="manager-input-box"
        placeholder="The correct format is:1,1,0.1,0.01,0.001"
        v-model="rentPrices"
      />
      <UnitButton
        caption="Change Rent Price"
        @onClick="onChangeRentPriceClick"
        :enable="true"
        type="primary"
      >
      </UnitButton>
    </div>
    <div class="manager-panel">
      <input
        class="manager-input-box"
        placeholder="The correct format is:https://metadata.unit.domains/"
        v-model="baseURI"
      />
      <UnitButton
        caption="Set Base URI"
        @onClick="onSetBaseURIClick"
        :enable="true"
        type="primary"
      >
      </UnitButton>
    </div>
  </div>
</template>

<script lang="ts">
import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";

import { calculateDuration } from "utils/dates";



import { getETHPriceFromMarket } from "server/market";

import {
  getAllRentPrices,
  getAllRegisterPrices,
  setRegisterPrices,
  setRentPrices,
} from "contractUtils/Price";

import createIcon from "@/blockies";

import { sendHelper } from "../../contractUtils/transaction";

export default {
  name: "ManagerContainer",
  components: {},
  data() {
    return {
      tldText: "",
      registerPrices: "",
      rentPrices: "",
      baseURI: "",
    };
  },
  computed: {},

  async mounted() {},

  methods: {
    async onWithdrawClick() {
      try {
        var address = await getAccount();
        console.log(address);

        await setup();

        var registrar = await getRegistrar();

        const tx = await registrar.withdraw();
        await sendHelper(tx);
      } catch (error) {
        console.log(error);
      }
    },
    async onSetPrice() {
      try {
        var address = await getAccount();
        console.log(address);

        await setup();

        var registrar = await getRegistrar();

        const tx = await registrar.withdraw();
        await sendHelper(tx);
      } catch (error) {
        console.log(error);
      }
    },
    async onAddTLDClick() {
      try {
        var address = await getAccount();

        await setup();

        var registrar = await getRegistrar();
        await registrar.addTLD(this.tldText);
      } catch (error) {
        console.log(error);
      }
    },
    async onChangeRegisterPriceClick() {
      try {
        var address = await getAccount();
        console.log(address);

        await setup();

        await setRegisterPrices(this.registerPrices);

        //  await sendHelper(tx)
      } catch (error) {
        console.log(error);
      }
    },
    async onChangeRentPriceClick() {
      try {
        var address = await getAccount();
        console.log(address);

        await setup();

        await setRentPrices(this.rentPrices);
      } catch (error) {
        console.log(error);
      }
    },
    async onSetBaseURIClick() {
      try {
        var address = await getAccount();
        console.log(address);

        await setup();

        var registrar = await getRegistrar();

        const tx = await registrar.setBaseURI(this.baseURI);
        await sendHelper(tx);
      } catch (error) {
        console.log(error);
      }
    },
    async onGetPrice() {
      let res = await getETHPriceFromMarket();
      console.log(res);
    },
  },
};
</script>

<style scoped>
.manager-panel {
  margin: 1em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #dde1f4 50%, #ebebeb 100%);
  border-radius: 4px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 1em;
}

.manager-input-box {
  width: 120em;
  margin: 1em;
  margin-right: auto;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 5px 0px 0px 5px;
  outline: none;
  padding: 0 15px;
  color: #606266;
  font: 1em sans-serif;
}
</style>
