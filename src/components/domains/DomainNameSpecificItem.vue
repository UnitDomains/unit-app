<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import {
  getDomain,
  getDomainSuffix,
  getSuffixByIndex,
  getJointName,
  getDomainIndex,
  getHostDomain,
} from "@/contractUtils/domainName";

import { formatPrice2Eth } from "contractUtils/Price";

import { Contract, utils, BigNumber } from "ethers";

import { calculateDuration, formatDate } from "utils/dates";

import { IServerDomainInfo, IServerPriceInfo } from "@/server/serverType";
import { emptyAddress } from "@/contracts/types";

const { t } = useI18n();

const router = useRouter();

interface Props {
  domainName: IServerDomainInfo;
  priceInfo: IServerPriceInfo;
}

const props = defineProps<Props>();

const owned = computed<boolean>(() => {
  return props.domainName.owner !== emptyAddress;
});

const domainExpiryTime = computed(() => {
  return formatDate(new Date(props.domainName.expires * 1000), false);
});

const less5 = computed<boolean>(() => {
  if (getDomain(props.domainName.name).length <= 5) return true;
  return false;
});

const less10 = computed<boolean>(() => {
  if (getDomain(props.domainName.name).length <= 10) return true;
  return false;
});
const less15 = computed<boolean>(() => {
  if (getDomain(props.domainName.name).length <= 15) return true;
  return false;
});
const hostDomainName = computed<string>(() => {
  return getDomain(props.domainName.name);
});
const domainSuffix = computed(() => {
  return getSuffixByIndex(props.domainName.baseNodeIndex);
});
const RegisterPrice = computed<BigNumber>(() => {
  return getRegisterPrice(props.domainName.name);
});
const RentPrice = computed<BigNumber>(() => {
  return getRentPrice(props.domainName.name);
});

const onRegisterDomainButtonClick = () => {
  router.push({ path: `/name/${props.domainName}/register` });
};

const convertPriceString2Array = (price: string): string[] => {
  if (!price || price.length == 0) return [];
  if (price[0] != "[" || price[price.length - 1] != "]") return [];
  price = price.substring(1, price.length - 1);
  console.log(price);

  return price.split(",");
};
const getRegisterPrice = (name: string) => {
  if (!name || name.length == 0) return null;
  name = getDomain(name);
  if (!props.priceInfo) return null;

  const registerArray: string[] = convertPriceString2Array(props.priceInfo.registerPrice);
  if (registerArray.length == 0) return null;

  var price = "";

  if (name.length >= registerArray.length)
    price = registerArray[registerArray.length - 1].trim();
  else price = registerArray[name.length - 1].trim();

  //let p = BigNumber.from(price.replace(/\s+/g, ""));
  const p = BigNumber.from(price);

  return formatPrice2Eth(p, 2);
};

const getRentPrice = (name: string) => {
  if (!name || name.length == 0) return null;
  name = getDomain(name);
  if (!props.priceInfo) return null;

  const rentArray: string[] = convertPriceString2Array(props.priceInfo.rentPrice);
  if (rentArray.length == 0) return null;

  var price = "";
  if (name.length >= rentArray.length) price = rentArray[rentArray.length - 1].trim();
  else price = rentArray[name.length - 1].trim();

  let p = BigNumber.from(price.replace(/\s+/g, ""));
  const duration = calculateDuration(1);
  return formatPrice2Eth(p.mul(duration), 4);
};
</script>

<template>
  <div class="domain-specific-container">
    <div class="domain-specific-panel" :class="{ domain_panel_owned: owned }">
      <div class="domain-specific-name">
        <span>{{ hostDomainName }}</span>
        <span class="domain-specific-name-suffix">.{{ domainSuffix }}</span>
        <span v-if="owned"> {{ $t("singleName.domain.state.owned") }}</span>
        <span v-else> {{ $t("singleName.domain.state.available") }}</span>
      </div>

      <div class="domain-state" v-if="!owned">
        <div class="domain-state-why-great-title">
          {{ $t("pricer.registrationPriceLabel") }}
        </div>

        <div>
          {{ $t("pricer.totalPriceLabel") }}：{{ RegisterPrice }}ETH+{{ RentPrice }}ETH/{{
            $t("pricer.yearUnit")
          }}
        </div>
      </div>
      <div class="domain-state">
        <div v-if="owned">
          <span style="margin-right: 2em"
            >{{ $t("c.Expiration Date") }} {{ domainExpiryTime }}</span
          >
        </div>
        <div v-else>
          <div class="domain-state-why-great-title">
            {{ $t("singleName.domain.whygreat.title") }}
          </div>
          <div v-if="less5 || less10 || less15">
            <div v-if="less5">
              {{
                $t("singleName.domain.whygreat.less5", {
                  name: hostDomainName,
                })
              }}
            </div>
            <div v-else-if="less10">
              {{
                $t("singleName.domain.whygreat.less10", {
                  name: hostDomainName,
                })
              }}
            </div>
            <div v-else-if="less15">
              {{
                $t("singleName.domain.whygreat.less15", {
                  name: hostDomainName,
                })
              }}
            </div>
          </div>
          <div v-else>
            {{
              $t("singleName.domain.whygreat.unique", {
                name: hostDomainName,
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="domain-specific-operation" v-if="!owned">
      <div class="divider"></div>
      <UnitButton
        :caption="$t('c.register')"
        @onClick="onRegisterDomainButtonClick"
        :enable="true"
        type="primary"
      ></UnitButton>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "DomainNameSpecificItem",
};
</script>
<style scoped>
@import "@/assets/css/document.css";

.domain-specific-container {
  min-height: 50px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin: 1em;
  text-align: right;
}
.domain-specific-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background: linear-gradient(160deg, #d4f7d4 50%, #9bf7be 100%);
  border-radius: 4px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 0em;
  text-align: left;
  cursor: pointer;
}

.domain-specific-panel:hover {
  background: linear-gradient(160deg, #d4f7d4 0%, #9bf7be 50%);
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
}

.domain_panel_owned {
  background: linear-gradient(160deg, #dbdbdb 50%, #b3b3b3 100%);
}

.domain_panel_owned:hover {
  background: linear-gradient(160deg, #dbdbdb 0%, #b3b3b3 50%);
}

.domain-specific-name {
  font: 2em sans-serif;
  margin: 2em;
  cursor: pointer;
}

.domain-specific-name-suffix {
  color: darkblue;
  margin-right: 1em;
}

.domain-state {
  font: 1em sans-serif;
  margin: 1em;
}

.domain-state-why-great-title {
  font: 1.2em sans-serif;
}

.domain-specific-operation {
  margin: 0em;
  padding: 1em;
}
</style>
