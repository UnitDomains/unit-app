<template>
  <div class="domain-specific-container">
    <div class="domain-specific-panel" :class="{ domain_panel_owned: owned }">
      <div class="domain-specific-name">
        <span>{{ hostDomainName }}</span>
        <span class="domain-specific-name-suffix">.{{ domainSuffix }}</span>
        <span v-if="owned"> {{ $t("singleName.domain.state.owned") }}</span>
        <span v-else> {{ $t("singleName.domain.state.available") }}</span>
      </div>

      <div class="domain-state">
        <div class="domain-state-why-great-title">
          {{ $t("pricer.registrationPriceLabel") }}
        </div>
        <div>205ETH</div>
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

<script>
import {
  getDomain,
  getDomainSuffix,
  getSupportDomainNamesSuffixArray,
  getJointName,
  getDomainIndex,
  getHostDomain,
} from "contractUtils/domainName.js";

import { calculateDuration, formatDate } from "utils/dates.js";
import UnitButton from "components/ui/UnitButton.vue";

export default {
  name: "DomainNameSpecificItem",
  components: {
    UnitButton,
  },
  computed: {
    domainExpiryTime() {
      return this.expiryTime == null
        ? ""
        : formatDate(new Date(this.expiryTime * 1000), false);
    },
    less5() {
      if (getDomain(this.domainName).length <= 5) return true;
      return false;
    },
    less10() {
      if (getDomain(this.domainName).length <= 10) return true;
      return false;
    },
    less15() {
      if (getDomain(this.domainName).length <= 15) return true;
      return false;
    },
    hostDomainName() {
      return getDomain(this.domainName);
    },
    domainSuffix() {
      return getDomainSuffix(this.domainName);
    },
  },
  data() {
    return {
      searchText: "value",
    };
  },
  props: {
    domainName: {
      type: String,
      default: "",
    },
    owned: {
      type: Boolean,
      default: false,
    },
    expiryTime: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    onRegisterDomainButtonClick() {
      this.$router.push({ path: `/name/${this.domainName}/register` });
    },
  },
};
</script>
<style scoped>
@import "~@/assets/css/document.css";

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