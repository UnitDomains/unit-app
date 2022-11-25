<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useI18n } from "vue-i18n";
import { BigNumber } from "ethers";
import { appContractModels } from "@/contracts/setup";
import { IEnsEntry } from "@/contracts/types";
import { web3Config } from "@/contracts/web3";
import { emptyAddress } from "@/contracts/utils";

import {
  registrantTransfer,
  setController,
  controllerTransfer,
  renew,
  setResolver,
  setDomainTextRecord,
  setETHAddress,
} from "@/contracts/contractHelper";

import {
  getDomain,
  getDomainSuffix,
  getHostDomain,
  getParentDomain,
} from "contractUtils/domainName";
import moment from "moment";

import { sendHelper } from "contractUtils/transaction";

import { showLoading, ILoading } from "@/components/ui/loading";

import { getSubDomainInfoFromServer } from "@/server/domain";
import DetailAddressItem from "components/name/DetailAddressItem.vue";
import DetailContentItem from "components/name/DetailContentItem.vue";

import Tabs from "components/ui/Tabs.vue";

import { namehash } from "contracts/utils/hash";

import { UserAccountStore } from "@/store";

const { t } = useI18n();

const router = useRouter();

interface Props {
  domainName: string;
}

const props = defineProps<Props>();

const available = ref(false);
const domainEntry = reactive<IEnsEntry>({
  currentBlockDate: new Date(0),
  registrant: "",
  transferEndDate: new Date(0),
  gracePeriodEndDate: new Date(0),
  isNewRegistrar: false,
  available: false,
  expiryTime: new Date(0),
});
const domainResolver = ref("");
const owner = ref("");

const ethAddress = ref("");
const textRecordEmail = ref("");
const textRecordURL = ref("");
const textRecordAvatar = ref("");
const textRecordDescription = ref("");
const textRecordNotice = ref("");
const textRecordKeywords = ref("");
const textRecordDiscord = ref("");
const textRecordReddit = ref("");
const textRecordGithub = ref("");
const textRecordTwitter = ref("");
const textRecordTelegram = ref("");

//是否是注册账户
const isRegistrant = computed(() => {
  if (domainEntry) return !available.value && domainEntry.registrant === account.value;
  return false;
});

//域名是否过期，不过返回false，过期返回true
const isExpired = computed(() => {
  return false;
});

//账户是否是域名的拥有者
const isOwner = computed(() => {
  if (owner) return owner.value == UserAccountStore.account;
  return false;
});

const enableRegistrantEdit = computed(() => {
  return isRegistrant.value && !isExpired.value;
});

const enableControllerEdit = computed(() => {
  return (isRegistrant.value || isOwner.value) && !isExpired.value;
});

const enableResolverEdit = computed(() => {
  return isOwner.value && !isExpired.value;
});

const parent = computed(() => {
  return props.domainName.substring(props.domainName.indexOf(".") + 1);
});

const registrant = computed(() => {
  if (domainEntry) return domainEntry.registrant;
  return "";
});

const expiryTime = computed(() => {
  if (domainEntry) return domainEntry.expiryTime;
  return "";
});

onMounted(async () => {
  await init();
});

const parenDomain = computed(() => {
  return getParentDomain(props.domainName);
});

const onTabClick = (index: number) => {
  if (index === 0) {
    //parent
    router.push({ path: `/name/${parenDomain.value}/details` });
  } else if (index === 1) {
    //detail
    router.push({ path: `/name/${props.domainName}/details` });
  } else if (index === 2) {
    //subdomain
    router.push({ path: `/name/${props.domainName}/subdomains` });
  }
};

//注册人转让
const onRegistrantButtonClick = async (newAddress: string) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await registrantTransfer(props.domainName, newAddress);
    },
  };
  showLoading(loading);
};

const onControllerSetButtonClick = async (newAddress: string) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await setController(props.domainName, newAddress);
    },
  };
  showLoading(loading);
};

const onControllerTransferButtonClick = async (newAddress: string) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await controllerTransfer(props.domainName, newAddress);
    },
  };
  showLoading(loading);
};

const onRenewButtonClick = async (years: number, totalFees: BigNumber) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await renew(props.domainName, years, totalFees);
    },
  };
  showLoading(loading);
};

const onResolverButtonClick = async (address: string) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await setResolver(props.domainName, address);
    },
  };
  showLoading(loading);
};
const setTextRecord = async (newContent: string, key: string) => {
  try {
    const loading: ILoading = {
      id: "#ContentContainer",
      func: async () => {
        await setDomainTextRecord(props.domainName, newContent, key);
      },
    };
    showLoading(loading);
    return true;
  } catch {
    return false;
  }
};
const onETHAddressButtonClick = async (newAddress: string) => {
  const loading: ILoading = {
    id: "#ContentContainer",
    func: async () => {
      await setETHAddress(props.domainName, newAddress);
    },
  };
  showLoading(loading);
  ethAddress.value = newAddress;
};

const onContentButtonClick = async (newContent: string) => {};

const onEmailButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "email");

  if (ret) {
    textRecordEmail.value = newContent;
  }
};

const onURLButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "url");
  if (ret) {
    textRecordURL.value = newContent;
  }
};

const onAvatarButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "avatar");
  if (ret) {
    textRecordAvatar.value = newContent;
  }
};

const onDescriptionButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "description");
  if (ret) {
    textRecordDescription.value = newContent;
  }
};

const onNoticeButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "notice");
  if (ret) {
    textRecordNotice.value = newContent;
  }
};

const onKeywordsButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "keywords");
  if (ret) {
    textRecordKeywords.value = newContent;
  }
};

const onComDiscordButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "com.discord");
  if (ret) {
    textRecordDiscord.value = newContent;
  }
};

const onComRedditButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "com.reddit");
  if (ret) {
    textRecordReddit.value = newContent;
  }
};

const onComGithubButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "com.github");
  if (ret) {
    textRecordGithub.value = newContent;
  }
};

const onComTwitterButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "com.twitter");
  if (ret) {
    textRecordTwitter.value = newContent;
  }
};

const onOrgTelegramButtonClick = async (newContent: string) => {
  let ret = await setTextRecord(newContent, "org.telegram");
  if (ret) {
    textRecordTelegram.value = newContent;
  }
};

const init = async () => {
  //You can get data from server or eth-chains

  /**
     //Get data from eth-chains.
      this.initDomain();
     */

  //Get data from server
  //this.initSubdomain();
  await initSubdomainFromServer();
};

const initSubdomainFromServer = async () => {
  await appContractModels.setup();

  var networkId = await web3Config.getNetworkId();

  const subNodeLabel = namehash(props.domainName);

  const node = namehash(getHostDomain(props.domainName));
  console.log(node);
  var ret = await getSubDomainInfoFromServer(
    networkId,
    props.domainName,
    subNodeLabel,
    node
  );
  console.log(ret);
  if (!ret) {
    domainEntry.value = null;
    available.value = true;
  } else {
    available.value = false;
    domainEntry.value = {
      registrant: ret.owner,
      expiryTime: ret.expires * 1000,
    };

    domainResolver.value = ret.resolver;
    owner.value = ret.controller;
    ethAddress.value = ret.ethAddress;

    var record = JSON.parse(ret.record);
    if (record) {
      textRecordEmail.value = record["email"];
      textRecordURL.value = record["url"];
      textRecordAvatar.value = record["avatar"];
      textRecordDescription.value = record["description"];
      textRecordNotice.value = record["notice"];
      textRecordKeywords.value = record["keywords"];
      textRecordDiscord.value = record["com.discord"];
      textRecordReddit.value = record["com.reddit"];
      textRecordGithub.value = record["com.github"];
      textRecordTwitter.value = record["com.twitter"];
      textRecordTelegram.value = record["org.telegram"];
    }
  }
};

const initSubdomain = async () => {
  await appContractModels.setup();

  var registrar = await appContractModels.getRegistrar();

  var ens = await appContractModels.getENS();

  domainResolver.value = await ens?.getResolver(props.domainName);
  owner.value = await ens?.getOwner(props.domainName);
  console.log(owner);

  ethAddress.value = await ens?.getAddress(props.domainName); //await ens.getAddr(this.domainName, 60)
  textRecordEmail.value = await ens?.getText(props.domainName, "email");
  textRecordURL.value = await ens?.getText(props.domainName, "url");
  textRecordAvatar.value = await ens?.getText(props.domainName, "avatar");
  textRecordDescription.value = await ens?.getText(props.domainName, "description");
  textRecordNotice.value = await ens?.getText(props.domainName, "notice");
  textRecordKeywords.value = await ens?.getText(props.domainName, "keywords");
  textRecordDiscord.value = await ens?.getText(props.domainName, "com.discord");
  textRecordReddit.value = await ens?.getText(props.domainName, "com.reddit");
  textRecordGithub.value = await ens?.getText(props.domainName, "com.github");
  textRecordTwitter.value = await ens?.getText(props.domainName, "com.twitter");
  textRecordTelegram.value = await ens?.getText(props.domainName, "org.telegram");
};
</script>
<template>
  <div id="ContentContainer" class="detail-panel-container">
    <Tabs
      :domainName="domainName"
      :tabTitle="[
        t('singleName.tabs.parentDomain'),
        t('singleName.tabs.details'),
        t('singleName.tabs.subdomains'),
      ]"
      active="1"
      @onTabClick="onTabClick"
    ></Tabs>

    <div style="width: 100%">
      <div class="detail-panel">
        <div class="detail-base-info-container">
          <div class="detail-base-info-left">{{ t("c.parent") }}</div>
          <div class="detail-base-info-middle">
            <router-link :to="{ path: `/name/${parent}/details` }">
              {{ parent }}</router-link
            >
          </div>
          <div class="detail-base-info-right"></div>
        </div>

        <div class="divider"></div>

        <DetailAddressItem
          :title="t('c.Resolver')"
          :content="domainResolver"
          :buttonCaption="t('c.set')"
          :enable="enableResolverEdit"
          @onOkButtonClick="onResolverButtonClick"
        ></DetailAddressItem>

        <div class="details-records-panel">
          <div class="details-records-caption">{{ t("singleName.record.title") }}</div>

          <div class="detail-base-info-container">
            <div class="details-records-left">{{ t("c.addresses") }}</div>
            <div class="details-records-right">
              <DetailAddressItem
                title="ETH"
                :content="ethAddress"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onETHAddressButtonClick"
              >
              </DetailAddressItem>
            </div>
          </div>

          <div class="divider"></div>

          <!--

                <div class="detail-base-info-container">
                    <div class="details-records-left">{{ t('c.Content') }}</div>
                    <div class="details-records-right">
                        <div class="detail-base-info-container">
                            <div class="detail-base-info-left"></div>
                            <div class="detail-base-info-middle">0xasdfasdfasdwererqerqwerqwer</div>
                            <div class="detail-base-info-right">
                                <UnitButton
                                    :caption="t('c.set')"
                                    @onClick="onContentButtonClick"
                                    :enable="enableResolverEdit"
                                >{{ t('c.set') }}</UnitButton>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>
                -->

          <div class="detail-base-info-container">
            <div class="details-records-left">{{ t("c.textrecord") }}</div>

            <div class="details-records-right">
              <DetailContentItem
                title="Email"
                :content="textRecordEmail"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onEmailButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="URL"
                :content="textRecordURL"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onURLButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="Avatar"
                :content="textRecordAvatar"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onAvatarButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="Description"
                :content="textRecordDescription"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onDescriptionButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="Notice"
                :content="textRecordNotice"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onNoticeButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="Keywords"
                :content="textRecordKeywords"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onKeywordsButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="com.discord"
                :content="textRecordDiscord"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onComDiscordButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="com.github"
                :content="textRecordGithub"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onComGithubButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="com.reddit"
                :content="textRecordReddit"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onComRedditButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="com.twitter"
                :content="textRecordTwitter"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onComTwitterButtonClick"
              ></DetailContentItem>

              <DetailContentItem
                title="org.telegram"
                :content="textRecordTelegram"
                :buttonCaption="t('c.set')"
                :enable="enableResolverEdit"
                @onOkButtonClick="onOrgTelegramButtonClick"
              ></DetailContentItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "SubdomainNameDetails",
};
</script>

<style scoped>
@import "@/assets/css/detail.css";
@import "@/assets/css/document.css";
</style>
