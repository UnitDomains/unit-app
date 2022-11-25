<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import { BigNumber } from "ethers";

import * as Price from "@/contractUtils/Price";

import Step from "components/step/Step.vue";

import ProgressBar from "components/step/ProgressBar.vue";
import ProgressText from "components/step/ProgressText.vue";
import RegisterDuration from "components/name/duration/RegisterDuration.vue";
import Tabs from "components/ui/Tabs.vue";
import Empty from "components/ui/Empty.vue";

import { ProgressStore } from "@/contractUtils/ProgressStore";

import { appContractModels } from "@/contracts/setup";

import { web3Config } from "@/contracts/web3";
import { calculateDuration } from "@/utils/dates";

import { getAccountBalance } from "@/contractUtils/Price";

import { sendHelper } from "@/contractUtils/transaction";
import moment from "moment";

import { getDomainInfoFromServer } from "@/server/domain";
import { UserAccountStore } from "store";

import { setupProgressStore, IProgressStoreData } from "@/contractUtils/ProgressStore";

import { RegisterProcessState } from "@/utils/registerType";

import { createDialog, createAlertDialog } from "@/components/ui/dialog/createDialog";

const { t } = useI18n();

const router = useRouter();

enum DomainNameRegisteredState {
  Unknown = 0,
  Registered = 1,
  Unregistered = 2,
}

interface RegisterNameState {
  /**
        step 0:Init
        step 1: Request to register
        step 2: Wait for 1 minute
        step 3:Complete Registration
        step 4: Succeed
  */
  stepNumber: RegisterProcessState;

  years: number;

  /**
   * state:
   * 0: not start
   * 1:processing
   * 2: succeed
   */
  stepState: number;

  progressValue: number;

  price: Price.INewDomainPriceValue;

  accountBalanceInsufficientVisible: boolean; //'余额不足'信息可见性
  pendingVisible: boolean; //'正在打包'信息可见性
  requestRegistrarButtonEnable: boolean; //请求注册按钮
  registerButtonEnable: boolean; //注册按钮

  domainNameAlreadyRegistered: DomainNameRegisteredState;

  waitOneMinuteId: number;

  commitmentId: number;

  registerId: number;

  loadingVisible: boolean;
}

const state: RegisterNameState = reactive({
  stepNumber: RegisterProcessState.NotStart,
  years: 0,
  stepState: 0,
  progressValue: 0,
  price: {
    rentPrice: BigNumber.from(0),
    registerPrice: BigNumber.from(0),
    rentAndRegisterPrices: BigNumber.from(0),
    totalSlow: BigNumber.from(0),
    totalFast: BigNumber.from(0),
    registerGasSlow: BigNumber.from(0),
    registerGasFast: BigNumber.from(0),
    gasPriceToGweiSlow: BigNumber.from(0),
    gasPriceToGweiFast: BigNumber.from(0),
  },

  accountBalanceInsufficientVisible: false, //'余额不足'信息可见性
  pendingVisible: false, //'正在打包'信息可见性
  requestRegistrarButtonEnable: false, //请求注册按钮
  registerButtonEnable: false, //注册按钮

  domainNameAlreadyRegistered: DomainNameRegisteredState.Unknown,

  waitOneMinuteId: 0,

  commitmentId: 0,

  registerId: 0,

  loadingVisible: false,
});

const MoveNextStep = () => {
  if (state.stepNumber == RegisterProcessState.NotStart)
    state.stepNumber = RegisterProcessState.Step1;
  else if (state.stepNumber == RegisterProcessState.Step1)
    state.stepNumber = RegisterProcessState.Step2;
  else if (state.stepNumber == RegisterProcessState.Step2)
    state.stepNumber = RegisterProcessState.Step3Begin;
  else if (state.stepNumber == RegisterProcessState.Step3Begin)
    state.stepNumber = RegisterProcessState.Step3Pending;
  else if (state.stepNumber == RegisterProcessState.Step3Pending)
    state.stepNumber = RegisterProcessState.End;
  else state.stepNumber = RegisterProcessState.End;
};

const MovePrevStep = () => {
  if (state.stepNumber == RegisterProcessState.Step3Pending)
    state.stepNumber = RegisterProcessState.Step3Begin;
  else state.stepNumber = RegisterProcessState.NotStart;
};

let progressStore: ProgressStore;

function setStep(step: RegisterProcessState) {
  if (step < RegisterProcessState.NotStart) step = RegisterProcessState.NotStart;
  else if (step >= RegisterProcessState.End) {
    step = RegisterProcessState.End;
    state.progressValue = 100;
    progressStore.remove();
  } else if (step == RegisterProcessState.NotStart) {
    progressStore.remove();
  }

  state.stepNumber = step;

  progressStore.setStep(state.stepNumber);
}

const props = defineProps({
  domainName: {
    type: String,
    default: "",
  },
});

/**
 * state:
 * 0: not start
 * 1:processing
 * 2: succeed
 */
const step1State = computed<number>(() => {
  if (state.stepNumber == 0) return 0;
  if (state.stepNumber == 1) return 1;
  return 2;
});

const step2State = computed<number>(() => {
  if (state.stepNumber <= 1) return 0;
  if (state.stepNumber == 2) return 1;
  return 2;
});

const step3State = computed<number>(() => {
  if (state.stepNumber <= 2) return 0;
  if (state.stepNumber == 3) return 1;
  return 2;
});
const progressVisible = computed<boolean>(() => {
  if (state.stepNumber >= 1) return true;
  return false;
});

const circlePercent = computed<number>(() => {
  if (state.stepNumber == 1 && state.progressValue <= 30)
    return (state.progressValue / 30) * 100;
  if (state.stepNumber == 2 && state.progressValue > 30 && state.progressValue <= 70)
    return ((state.progressValue - 30) / 40) * 100;
  return ((state.progressValue - 70) / 30) * 100;
});

const buttonRequestRegistrarVisible = computed<boolean>(() => {
  if (state.pendingVisible) return false;

  if (state.accountBalanceInsufficientVisible) return false;
  if (state.stepNumber == RegisterProcessState.NotStart) return true;
  return false;
});

const buttonRegistrarVisible = computed<boolean>(() => {
  if (state.pendingVisible) return false;

  if (state.accountBalanceInsufficientVisible) return false;
  if (state.stepNumber == RegisterProcessState.Step3Begin) return true;

  return false;
});

const reverseButtonVisible = computed<boolean>(() => {
  if (state.pendingVisible) return false;
  if (state.stepNumber == RegisterProcessState.End) return true;

  return false;
});

const registerCaption = computed<string>(() => {
  switch (state.stepNumber) {
    case RegisterProcessState.NotStart:
      return t("register.titles[0]");
    case RegisterProcessState.Step1:
    case RegisterProcessState.Step2:
      return t("register.titles[1]");
    case RegisterProcessState.Step3Begin:
    case RegisterProcessState.Step3Pending:
      return t("register.titles[2]");

    case RegisterProcessState.End:
      return t("register.titles[3]");

    default:
      return "";
  }
});

const registerDurationVisible = computed<boolean>(() => {
  return state.stepNumber == RegisterProcessState.NotStart;
});

onMounted(async () => {
  /**
    You can get info from server or eth-chains
     */

  //from eth-chains
  //  await this.getDomainNameAvailableFromEthChains();

  //from server
  await getDomainNameAvailableFromServer();
});

const onTabClick = (index: number): void => {
  if (index === 0) {
    //register
    router.push({ path: `/name/${props.domainName}/register` });
  } else if (index === 1) {
    //detail
    router.push({ path: `/name/${props.domainName}/details` });
  } else if (index === 2) {
    //subdomain
    router.push({ path: `/name/${props.domainName}/subdomains` });
  }
};

const onDurationBeginChange = () => {
  state.requestRegistrarButtonEnable = false;
};

const commitmentTimer = () => {
  state.pendingVisible = true;
  state.progressValue = 15;
  if (!state.commitmentId)
    state.commitmentId = window.setInterval(commitmentTimerHelper, 1000);
};

const waitOneMinuteTimer = () => {
  if (!state.waitOneMinuteId)
    state.waitOneMinuteId = window.setInterval(waitOneMinuteTimerHelper, 1000);
};

const waitOneMinuteTimerHelper = () => {
  var savedStep = progressStore.getValue();
  if (savedStep) {
    var secondsPassed = 1;
    if (savedStep.secondsPassed) secondsPassed = savedStep.secondsPassed + 1;
    if (secondsPassed > 60) secondsPassed = 60;

    progressStore.setSecondsPassed(secondsPassed);
    state.progressValue = 30 + (secondsPassed / 60) * 40;

    if (secondsPassed >= 60 && state.waitOneMinuteId) {
      //wait 60 second(a minute)

      console.log("waitOneMinuteId:" + state.waitOneMinuteId);
      window.clearInterval(state.waitOneMinuteId);
      state.waitOneMinuteId = 0;
      setStep(RegisterProcessState.Step3Begin);

      state.registerButtonEnable = true;
    }
  }
};

/**
 * Get data from server
 */
const getDomainNameAvailableFromServer = async () => {
  state.loadingVisible = true;
  var networkId = UserAccountStore.networkId;

  /*
      //Get data from eth-chains
      await setup();
      networkId = await web3Config.getNetworkId();
      */

  var ret = await getDomainInfoFromServer(networkId, props.domainName);
  console.log(ret);

  if (!ret) {
    await appContractModels.setup();

    state.domainNameAlreadyRegistered = DomainNameRegisteredState.Unregistered;
    await initProgressStore();
  } else {
    state.domainNameAlreadyRegistered = DomainNameRegisteredState.Registered;
  }
  state.loadingVisible = false;
};

/**
 * Get data from eth-chains
 */
const getDomainNameAvailableFromEthChains = async () => {
  await appContractModels.setup();

  var registrar = await appContractModels.getRegistrar();
  if (typeof registrar == undefined) throw new Error("registrar undefined");

  let available = await registrar?.getAvailable(props.domainName);

  if (available) {
    state.domainNameAlreadyRegistered = DomainNameRegisteredState.Unregistered;
    await initProgressStore();
  } else {
    state.domainNameAlreadyRegistered = DomainNameRegisteredState.Registered;
  }
};

const commitmentTimerHelper = async () => {
  await appContractModels.setup();
  var savedStep = progressStore.getValue();
  var registrar = await appContractModels.getRegistrar();
  if (typeof registrar == undefined) throw new Error("registrar undefined");

  let a = await registrar?.checkCommitment(props.domainName, savedStep.secret);

  if (a > 0 && state.commitmentId) {
    window.clearInterval(state.commitmentId);
    state.commitmentId = 0;
    state.pendingVisible = false;
    setStep(2);
    progressStore.setStep(state.stepNumber);
    waitOneMinuteTimer();
  }
};

const registerTimer = () => {
  state.pendingVisible = true;
  state.progressValue = 80;

  if (!state.registerId) state.registerId = window.setInterval(registerTimerHelper, 1000);
};

const registerTimerHelper = async () => {
  await appContractModels.setup();
  var registrar = await appContractModels.getRegistrar();
  let a = await registrar?.getAvailable(props.domainName);
  if (!a && state.registerId) {
    window.clearInterval(state.registerId);

    state.registerId = 0;
    state.pendingVisible = false;
    state.domainNameAlreadyRegistered = DomainNameRegisteredState.Registered;

    setStep(RegisterProcessState.End);

    progressStore?.remove();
  }
};

const initProgressStore = async () => {
  var networkId = await web3Config.getNetworkId();
  var account = await web3Config.getAccount();

  progressStore = await setupProgressStore(props.domainName, account, networkId);
  //progressStore.remove();

  var savedStep = progressStore?.getValue();

  console.log(savedStep);

  state.years = savedStep.years;
  const block = await web3Config.getBlock();
  var now = moment(block.timestamp * 1000);

  if (
    savedStep.commitmentExpirationDate &&
    moment(savedStep.commitmentExpirationDate).isSameOrBefore(now)
  ) {
    savedStep = progressStore.remove();
  }

  if (savedStep) {
    state.stepNumber = savedStep.step;

    switch (state.stepNumber) {
      case RegisterProcessState.Step1:
        {
          commitmentTimer();
        }
        break;
      case RegisterProcessState.Step2:
        {
          waitOneMinuteTimer();
        }

        break;
      case RegisterProcessState.Step3Begin:
        {
          state.progressValue = 70;
          state.registerButtonEnable = true;
        }
        break;
      case RegisterProcessState.Step3Pending:
        {
          registerTimer();
        }
        break;
      case RegisterProcessState.End:
        {
          state.progressValue = 100;
        }
        break;
    }
  }
};

const onDurationChange = async (years: number, price: Price.INewDomainPriceValue) => {
  state.price = price;

  var totalFees = price.totalFast;

  var accountBalance = await getAccountBalance();
  console.log(totalFees.gt(accountBalance));

  if (totalFees.gt(accountBalance)) {
    state.accountBalanceInsufficientVisible = true;
  } else state.accountBalanceInsufficientVisible = false;

  progressStore.setYears(years);
  state.requestRegistrarButtonEnable = true;
};

/**
 * Responds when the user presses the "Request Registration" button
 */
const onRequestRegistrar = async () => {
  try {
    state.requestRegistrarButtonEnable = false;

    await appContractModels.setup();

    const registrar = await appContractModels.getRegistrar();
    if (typeof registrar == undefined) throw new Error("registrar undefined");

    const savedStep: IProgressStoreData = progressStore.getValue();

    const tx = await registrar?.commit(props.domainName, savedStep.secret);

    state.pendingVisible = true;
    setStep(RegisterProcessState.Step1);

    state.progressValue = 5;

    await sendHelper(tx);

    const block = await web3Config.getBlock();
    let commitmentExpirationDate = moment(block.timestamp * 1000).add(
      await registrar?.getMaximumCommitmentAge(),
      "second"
    );
    console.log(commitmentExpirationDate);
    progressStore.setCommitmentExpirationDate(commitmentExpirationDate.toString());

    progressStore.setStep(state.stepNumber);

    console.log(progressStore);

    commitmentTimer();
    state.requestRegistrarButtonEnable = true;
  } catch (error: any) {
    console.log(error);
    if (
      error.message.includes("User denied transaction signature.") || //Metamask
      error.message.includes("User denied transaction signature") || //Cipher
      error.message.includes("Invalid Message Body") || //Toshi/Coinbase
      error.message.includes("cancelled") || //Trust
      error.message.includes("user rejected transaction")
    ) {
      console.log("User denied");
    } else {
      alert("error");
    }
    state.requestRegistrarButtonEnable = true;
    console.log(error);
    setStep(RegisterProcessState.NotStart);

    state.pendingVisible = false;
  }
};

/**
 *
 */
const onRegistrar = async () => {
  try {
    state.registerButtonEnable = false;
    const savedStep: IProgressStoreData = progressStore.getValue();

    await appContractModels.setup();

    var registrar = await appContractModels.getRegistrar();
    if (typeof registrar == undefined) throw new Error("registrar undefined");

    var duration = calculateDuration(savedStep.years);

    var tx = await registrar?.register(props.domainName, duration, savedStep.secret);
    setStep(RegisterProcessState.Step3Pending);
    progressStore.setStep(RegisterProcessState.Step3Pending);

    state.progressValue = 90;
    state.pendingVisible = true;
    await sendHelper(tx);
    state.pendingVisible = false;

    state.progressValue = 100;

    state.pendingVisible = false;
    setStep(RegisterProcessState.End);
  } catch (error: any) {
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
    setStep(RegisterProcessState.Step3Begin);
    state.pendingVisible = false;
    state.registerButtonEnable = true;
  }
};

const onSetReverseRecord = async () => {
  var address = await web3Config.getAccount();

  router.push({ path: `/address/${address}` });
};

const ok = (): boolean => {
  console.log("register ok-1");
  return true;
};
const cancel = (): boolean => {
  console.log("register cancel-1");
  return true;
};

const showDialog = () => {
  createAlertDialog("asdf");
};
</script>

<template>
  <div id="RegisterContainer" class="register-name-panel">
    <Tabs
      :domainName="domainName"
      :tabTitle="[
        t('singleName.tabs.register'),
        t('singleName.tabs.details'),
        t('singleName.tabs.subdomains'),
      ]"
      active="0"
      @onTabClick="onTabClick"
    ></Tabs>

    <div v-if="state.domainNameAlreadyRegistered == DomainNameRegisteredState.Registered">
      <div class="already-registered-title">
        {{ t("singleName.messages.alreadyregistered") }}
      </div>
    </div>
    <div
      v-else-if="
        state.domainNameAlreadyRegistered == DomainNameRegisteredState.Unregistered
      "
      style="width: 100%"
    >
      <div class="register-duration" v-show="registerDurationVisible">
        <RegisterDuration
          :domainName="domainName"
          :years="state.years"
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
        <ProgressBar :value="state.progressValue"></ProgressBar>
        <ProgressText
          :stepNumber="state.stepNumber"
          :stepState="state.stepState"
        ></ProgressText>
      </div>
      <div
        v-show="state.accountBalanceInsufficientVisible"
        class="account-balance-insufficient"
      >
        {{ t("register.buttons.insufficient") }}
      </div>

      <div class="pending-info-container" v-show="state.pendingVisible">
        <p class="pending-words" :text="$t('singleName.messages.pending')">
          {{ t("singleName.messages.pending") }}
        </p>
      </div>

      <div class="operation-panel">
        <UnitButton
          :caption="t('register.buttons.request')"
          @onClick="onRequestRegistrar"
          :enable="
            !state.accountBalanceInsufficientVisible && state.requestRegistrarButtonEnable
          "
          v-show="buttonRequestRegistrarVisible"
          type="primary"
        ></UnitButton>

        <UnitButton
          :caption="t('register.buttons.register')"
          @onClick="onRegistrar"
          :enable="!state.accountBalanceInsufficientVisible && state.registerButtonEnable"
          type="primary"
          v-show="buttonRegistrarVisible"
        ></UnitButton>

        <UnitButton
          :caption="t('register.buttons.setreverserecord')"
          @onClick="onSetReverseRecord"
          type="primary"
          :enable="!state.accountBalanceInsufficientVisible"
          v-show="reverseButtonVisible"
        ></UnitButton>
      </div>
    </div>
    <Empty v-if="state.loadingVisible"></Empty>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "RegisterName",

  methods: {},
});
</script>

<style scoped>
@import "@/assets/css/document.css";
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
