<script setup></script>
<template>
  <div id="RegisterContainer" class="register-name-panel">
    <div class="domain-name-frame">
      <div class="domain-name-frame-title">{{ domainName }}</div>
      <div class="domain-name-frame-toolbar">
        <UnitButton
          :caption="$t('singleName.tabs.register')"
          @onClick="onNameRegisterButtonClick"
          :enable="true"
          type="primary"
        ></UnitButton>

        <UnitButton
          :caption="$t('singleName.tabs.details')"
          @onClick="onNameDetailsButtonClick"
          :enable="true"
        >
        </UnitButton>

        <UnitButton
          :caption="$t('singleName.tabs.subdomains')"
          @onClick="onNameSubdomainsButtonClick"
          :enable="true"
        ></UnitButton>
      </div>
    </div>

    <div v-if="domainNameAlreadyRegistered == 1">
      <div class="already-registered-title">
        {{ $t("singleName.messages.alreadyregistered") }}
      </div>
    </div>
    <div v-else-if="domainNameAlreadyRegistered == 2" style="width: 100%">
      <div class="register-duration" v-show="registerDurationVisible">
        <RegisterDuration
          :domainName="domainName"
          :years="years"
          @onDurationChange="onDurationChange"
          @onDurationBeginChange="onDurationBeginChange"
        ></RegisterDuration>
      </div>
      <div class="register-line" v-show="registerDurationVisible"></div>
      <div class="register-step-caption">{{ registerCaption }}</div>
      <div class="register-step-panel">
        <div class="register-step-container">
          <div class="register-step-item">
            <Step :type="1" :state="step1State" :percent="circlePercent"></Step>
          </div>
          <div class="register-step-item">
            <Step :type="2" :state="step2State" :percent="circlePercent"></Step>
          </div>
          <div class="register-step-item">
            <Step :type="3" :state="step3State" :percent="circlePercent"></Step>
          </div>
        </div>
      </div>

      <div class="progress-panel" v-show="progressVisible">
        <ProgressBar :value="progressValue"></ProgressBar>
        <ProgressText :stepNumber="stepNumber" :stepState="stepState"></ProgressText>
      </div>
      <div
        v-show="accountBalanceInsufficientVisible"
        class="account-balance-insufficient"
      >
        {{ $t("register.buttons.insufficient") }}
      </div>

      <div class="pending-info-container" v-show="pendingVisible">
        <p class="pending-words" :text="$t('singleName.messages.pending')">
          {{ $t("singleName.messages.pending") }}
        </p>
      </div>

      <div class="operation-panel">
        <UnitButton
          :caption="$t('register.buttons.request')"
          @onClick="onRequestRegistrar"
          :enable="!accountBalanceInsufficientVisible && requestRegistrarButtonEnable"
          v-show="requestRegistrarVisible"
          type="primary"
        ></UnitButton>

        <UnitButton
          :caption="$t('register.buttons.register')"
          @onClick="onRegistrar"
          :enable="!accountBalanceInsufficientVisible && registerButtonEnable"
          type="primary"
          v-show="registrarVisible"
        ></UnitButton>

        <UnitButton
          :caption="$t('register.buttons.setreverserecord')"
          @onClick="onSetReverseRecord"
          type="primary"
          :enable="!accountBalanceInsufficientVisible"
          v-show="reverseVisible"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script>
import EthVal from "ethval";
import { setup, getRegistrar, getENS } from "contracts/api";
import { labelhash } from "contracts/utils/labelhash.js";
import { getBlock, getNetworkId, getAccount } from "contracts/web3.js";
import { calculateDuration } from "utils/dates.js";

import { getRentPrice, getAccountBalance } from "contractUtils/Price.js";
import { getDomain, getDomainSuffix } from "contractUtils/domainName.js";
import { sendHelper } from "contractUtils/transaction.js";
import moment from "moment";

import { getDomainInfoFromServer } from "server/domain.js";
import { UserAccountStore } from "store/store.js";

import Step from "components/step/Step.vue";

import ProgressBar from "components/step/ProgressBar.vue";
import ProgressText from "components/step/ProgressText.vue";
import RegisterDuration from "components/name/RegisterDuration.vue";

import { setupProgressStore } from "contractUtils/ProgressStore.js";

export default {
  name: "RegisterName",
  components: {
    Step,

    ProgressBar,
    ProgressText,
    RegisterDuration,
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
  },
  computed: {
    /**
     * state:
     * 0: not start
     * 1:processing
     * 2: succeed
     */
    step1State() {
      if (this.stepNumber == 0) return 0;
      if (this.stepNumber == 1) return 1;
      return 2;
    },
    step2State() {
      if (this.stepNumber <= 1) return 0;
      if (this.stepNumber == 2) return 1;
      return 2;
    },
    step3State() {
      if (this.stepNumber <= 2) return 0;
      if (this.stepNumber == 3) return 1;
      return 2;
    },
    progressVisible() {
      if (this.stepNumber >= 1) return true;
      return false;
    },
    circlePercent() {
      if (this.stepNumber == 1 && this.progressValue <= 30)
        return (this.progressValue / 30) * 100;
      if (this.stepNumber == 2 && this.progressValue > 30 && this.progressValue <= 70)
        return ((this.progressValue - 30) / 60) * 100;
      return ((this.progressValue - 70) / 30) * 100;
    },

    /**
     * 请求注册可见性
     */
    requestRegistrarVisible() {
      if (this.pendingVisible) return false;

      if (this.accountBalanceInsufficientVisible) return false;
      if (this.stepNumber == 0) return true;
      return false;
    },
    /**
     * 注册可见性
     */
    registrarVisible() {
      if (this.pendingVisible) return false;

      if (this.accountBalanceInsufficientVisible) return false;
      if (this.stepNumber == 3) return true;

      return false;
    },
    reverseVisible() {
      if (this.pendingVisible) return false;
      if (this.stepNumber == 4) return true;

      return false;
    },
    registerCaption() {
      switch (this.stepNumber) {
        case 0:
          return this.$t("register.titles[0]");
        case 1:
        case 2:
        case 3:
          return this.$t("register.titles[1]");

        case 4:
          return this.$t("register.titles[2]");

        default:
          return "";
      }
    },
    registerDurationVisible() {
      return this.stepNumber == 0;
    },
  },
  data() {
    return {
      /**
        step 0:Init 
        step 1: Request to register
        step 2: Wait for 1 minute
        step 3:Complete Registration
        step 4: Succeed
             */
      stepNumber: 0,
      years: 1,

      /**
       * state:
       * 0: not start
       * 1:processing
       * 2: succeed
       */
      stepState: 0,
      progressValue: 0,

      rentPrice: null,
      gasPrice: null,
      accountBalanceInsufficientVisible: false, //'余额不足'信息可见性
      pendingVisible: false, //'正在打包'信息可见性
      requestRegistrarButtonEnable: false, //请求注册按钮
      registerButtonEnable: false, //注册按钮

      domainNameAlreadyRegistered: 0,
      waitOneMinuteId: null,
      commitmentId: null,
      registerId: null,
    };
  },

  async mounted() {
    /**
    You can get info from server or eth-chains
     */

    //from eth-chains
    //  await this.getDomainNameAvailableFromEthChains();

    //from server
    await this.getDomainNameAvailableFromServer();
  },

  methods: {
    onNameRegisterButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/register` });
    },
    onNameDetailsButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/details` });
    },
    onNameSubdomainsButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/subdomains` });
    },

    /**
     * Get data from server
     */
    async getDomainNameAvailableFromServer() {
      var networkId = UserAccountStore.networkId;

      /*
      //Get data from eth-chains
      await setup();
      networkId = await getNetworkId();
      */

      var ret = await getDomainInfoFromServer(networkId, this.domainName);

      if (!ret) {
        this.domainNameAlreadyRegistered = 2;
        await this.initProgressStore();
      } else {
        this.domainNameAlreadyRegistered = 1;
      }
    },

    /**
     * Get data from eth-chains
     */
    async getDomainNameAvailableFromEthChains() {
      await setup();

      var registrar = await getRegistrar();
      let available = await registrar.getAvailable(this.domainName);

      if (available) {
        this.domainNameAlreadyRegistered = 2;
        await this.initProgressStore();
      } else {
        this.domainNameAlreadyRegistered = 1;
      }
    },
    commitmentTimer() {
      this.pendingVisible = true;
      this.progressValue = 15;
      if (!this.commitmentId)
        this.commitmentId = window.setInterval(this.commitmentTimerHelper, 1000);
    },
    async commitmentTimerHelper() {
      await setup();
      var savedStep = this.progressStore.getSavedStep();
      var registrar = await getRegistrar();
      let a = await registrar.checkCommitment(this.domainName, savedStep.secret);

      if (a > 0 && this.commitmentId) {
        window.clearInterval(this.commitmentId);
        this.commitmentId = null;
        this.pendingVisible = false;
        this.setStep(2);
        this.progressStore.setStep(this.stepNumber);
        this.waitOneMinuteTimer();
      }
    },

    waitOneMinuteTimer() {
      if (!this.waitOneMinuteId)
        this.waitOneMinuteId = window.setInterval(this.waitOneMinuteTimerHelper, 1000);
    },

    waitOneMinuteTimerHelper() {
      var savedStep = this.progressStore.getSavedStep();
      if (savedStep) {
        var secondsPassed = 1;
        if (savedStep.secondsPassed) secondsPassed = savedStep.secondsPassed + 1;
        if (secondsPassed > 60) secondsPassed = 60;

        this.progressStore.setSecondsPassed(secondsPassed);
        this.progressValue = 30 + (secondsPassed / 60) * 40;

        if (secondsPassed >= 60 && this.waitOneMinuteId) {
          //wait 60 second(a minute)

          console.log("waitOneMinuteId:" + this.waitOneMinuteId);
          window.clearInterval(this.waitOneMinuteId);
          this.waitOneMinuteId = null;
          this.setStep(3);

          this.registerButtonEnable = true;
        }
      }
    },

    registerTimer() {
      this.pendingVisible = true;
      this.progressValue = 80;
      if (!this.registerId)
        this.registerId = window.setInterval(this.registerTimerHelper, 1000);
    },
    async registerTimerHelper() {
      await setup();
      var savedStep = this.progressStore.getSavedStep();
      var registrar = await getRegistrar();
      let a = await registrar.getAvailable(this.domainName);
      if (!a && this.registerId) {
        window.clearInterval(this.registerId);
        this.registerId = null;
        this.pendingVisible = false;
        this.setStep(4);
        this.progressStore.remove();
      }
    },

    async initProgressStore() {
      var networkId = await getNetworkId();

      this.progressStore = await setupProgressStore(this.domainName, networkId);
      //    this.progressStore.remove()

      var savedStep = this.progressStore.getSavedStep();

      console.log(savedStep);

      this.years = savedStep.years;
      const block = await getBlock();
      var now = moment(block.timestamp * 1000);

      if (
        savedStep.commitmentExpirationDate &&
        moment(savedStep.commitmentExpirationDate).isSameOrBefore(now)
      ) {
        savedStep = this.progressStore.remove();
      }

      this.stepNumber = savedStep.step;

      switch (this.stepNumber) {
        case 1:
          {
            this.commitmentTimer();
          }
          break;
        case 2:
          {
            this.waitOneMinuteTimer();
          }

          break;
        case 3:
          {
            this.registerTimer();
          }
          break;
      }
    },
    setStep(step) {
      if (step < 0) step = 0;
      else if (step >= 4) {
        step = 4;
        this.progressValue = 100;
        this.progressStore.remove();
      } else if (step == 0) {
        this.progressStore.remove();
      }

      this.stepNumber = step;
    },
    incrementStep() {
      this.stepNumber++;
      if (this.stepNumber > 4) this.stepNumber = 4;
    },
    decreaseStep() {
      this.stepNumber--;
      if (this.stepNumber < 0) this.stepNumber = 0;
    },
    onDurationBeginChange() {
      this.requestRegistrarButtonEnable = false;
    },

    async onDurationChange(years, rentPrice, gasPrice) {
      this.rentPrice = rentPrice;
      this.gasPrice = gasPrice;

      var totalFees = new EthVal(rentPrice).add(new EthVal(gasPrice));

      var accountBalance = new EthVal(await getAccountBalance());
      console.log(totalFees.gt(accountBalance));

      if (totalFees.gt(accountBalance)) {
        this.accountBalanceInsufficientVisible = true;
      } else this.accountBalanceInsufficientVisible = false;

      this.progressStore.setYears(years);
      this.requestRegistrarButtonEnable = true;
    },

    /**
     * 请求注册
     */
    async onRequestRegistrar() {
      try {
        this.requestRegistrarButtonEnable = false;
        await setup();

        var registrar = await getRegistrar();

        var savedStep = this.progressStore.getSavedStep();
        var tx = await registrar.commit(this.domainName, savedStep.secret);

        this.pendingVisible = true;
        this.setStep(1);
        this.progressStore.setStep(this.stepNumber);
        this.progressValue = 5;

        await sendHelper(tx);

        const block = await getBlock();
        let commitmentExpirationDate = moment(block.timestamp * 1000).add(
          await registrar.getMaximumCommitmentAge(),
          "second"
        );
        this.progressStore.setCommitmentExpirationDate(commitmentExpirationDate);

        this.progressStore.setStep(this.stepNumber);

        this.commitmentTimer();
        this.requestRegistrarButtonEnable = true;
      } catch (error) {
        if (
          error.message.includes("User denied transaction signature.") || //Metamask
          error.message.includes("User denied transaction signature") || //Cipher
          error.message.includes("Invalid Message Body") || //Toshi/Coinbase
          error.message.includes("cancelled") //Trust
        ) {
          console.log("User denied");
        } else {
          alert("error");
        }
        this.requestRegistrarButtonEnable = true;
        console.log(error);
        this.setStep(0);

        this.pendingVisible = false;
      }
    },

    /**
     * 注册
     */
    async onRegistrar() {
      try {
        this.registerButtonEnable = false;
        var savedStep = this.progressStore.getSavedStep();

        await setup();

        var registrar = await getRegistrar();
        var duration = calculateDuration(savedStep.years);

        var tx = await registrar.register(this.domainName, duration, savedStep.secret);
        this.setStep(3);
        this.progressStore.setStep(3);

        this.progressValue = 90;
        this.pendingVisible = true;
        await sendHelper(tx);
        this.pendingVisible = false;

        this.progressValue = 100;

        this.pendingVisible = false;
        this.setStep(4);
      } catch (error) {
        console.log(error);
        if (
          error.message.includes("User denied transaction signature.") || //Metamask
          error.message.includes("User denied transaction signature") || //Cipher
          error.message.includes("Invalid Message Body") || //Toshi/Coinbase
          error.message.includes("cancelled") //Trust
        ) {
          console.log("User denied");
        }
        console.log(error);
        this.setStep(3);
        this.pendingVisible = false;
        this.registerButtonEnable = true;
      }
    },
    async onSetReverseRecord() {
      var address = await getAccount();

      this.$router.push({ path: `/address/${address}` });
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/name.css";
@import "~@/assets/css/document.css";
.register-name-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background-color: white;
  border-radius: 2px;

  margin: 1em;
}

.register-step-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: top;
  min-height: 50px;
  margin: auto;
}

.register-step-item {
  max-width: 25em;
  height: 100%;
}

.register-duration {
  margin: 1em;
}

.aligncenter {
  clear: both;
  display: block;
  margin: 0px;
  padding: 0px;
}

.register-step-panel {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.register-step-caption {
  margin: auto;
}
.progress-panel {
  width: 100%;
  margin: 10px;
}

.register-line {
  height: 0;
  border-bottom: 1px solid #dcdfe6;
  margin-left: 1em;
  margin-right: 1em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.account-balance-insufficient {
  font: 1em sans-serif;
  color: red;
  margin: auto;
}

.operation-panel {
  margin: 1em;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}

.already-registered-title {
  font: 1em sans-serif;
  margin: auto;
  padding: 1em;
}

.pending-info-container {
  margin: auto;
  width: 100%;
  background-color: bisque;
  white-space: nowrap;
  overflow: hidden;
}

.pending-words {
  position: relative;
  width: fit-content;
  animation: pending-words-move 3s linear infinite;
  padding-left: 50%;
}

.pending-words::after {
  position: absolute;
  right: -100%;
  content: attr(text);
}

@keyframes pending-words-move {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>
