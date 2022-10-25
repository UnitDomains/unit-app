<script setup>
import UserInfoVue from "components/userInfo/UserInfo.vue";
</script>

<template>
  <div class="app-header-container">
    <div class="app-logo" @click="onLogoClick">
      <img style="width: 60px; height: 60px" :src="logoSvg" alt="Logo" />
    </div>

    <div class="horizontal-divider"></div>

    <div class="user-info">
      <UserInfoVue @onClick="onMyNamesClick" />
    </div>
    <div class="toolbar">
      <div>
        <div class="dropdown">
          <button class="dropbtn">{{ currentLanguage }}</button>
          <div class="dropdown-content">
            <div
              class="dropdown-content-item"
              v-for="(item, index) in LANGUAGES"
              :key="index"
              @click="onLanguageItemClick(item)"
            >
              <div>{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <UnitButton
          :caption="$t('c.mynames')"
          @onClick="onMyNamesClick"
          :enable="true"
          type="primary"
        ></UnitButton>
      </div>
    </div>
  </div>
</template>

<script>
const LanguageStore = {
  get: () => {
    return window.localStorage.getItem("activeLanguageValue");
  },
  set: (obj) => {
    window.localStorage.setItem("activeLanguageValue", obj);
  },
};

const LANGUAGES = [
  {
    value: "en",
    label: "English (EN)",
  },
  {
    value: "cn",
    label: "简体中文 (CN)",
  },
  {
    value: "hk",
    label: "繁體中文 (HK)",
  },
  {
    value: "ja",
    label: "日本語 (JA)",
  },
  {
    value: "de",
    label: "Deutsch (DE)",
  },
  {
    value: "es",
    label: "Español (ES)",
  },
  {
    value: "fr",
    label: "Français (FR)",
  },
  {
    value: "ko",
    label: "한국어 (KO)",
  },
  {
    value: "it",
    label: "Italiano (IT)",
  },
  {
    value: "pl",
    label: "Polski (PL)",
  },
  {
    value: "pt-BR",
    label: "Português (BR)",
  },
  {
    value: "ru",
    label: "Pусский (RU)",
  },
  {
    value: "vi",
    label: "Tiếng Việt (VI)",
  },
];

import {
  setupWeb3,
  getWeb3,
  getNetworkId,
  getProvider,
  getAccount,
  getSigner,
} from "contracts/web3";

import { setup, getRegistrar, getENS } from "contracts/api";

import logoSVG from "images/logo.svg";

import { sendHelper } from "../contractUtils/transaction";

export default {
  name: "Header",
  components: {},
  data() {
    return {
      logoSvg: logoSVG,
      activeLanguageValue: "en",
    };
  },
  computed: {
    currentLanguage() {
      return this.getLang(this.activeLanguageValue).label;
    },
  },

  mounted() {
    this.getStoreLanguage();
  },

  methods: {
    getStoreLanguage() {
      let langStore = LanguageStore.get();
      let lang = "en";

      if (langStore) lang = langStore;
      this.activeLanguageValue = lang;
      this.$i18n.locale = lang;
    },

    onLogoClick() {
      this.$router.push({ path: "/" });
    },

    onLanguageItemClick(item) {
      this.activeLanguageValue = item.value;
      LanguageStore.set(item.value);
      this.$i18n.locale = item.value;
    },

    getLang(lang) {
      return LANGUAGES.find((l) => l.value === lang);
    },

    async onMyNamesClick() {
      await setupWeb3();
      var address = await getAccount();

      this.$router.push({ path: `/address/${address}` });
    },
  },
};
</script>

<style scoped>
.app-header-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  
  background-color: #2c3e50;
}

.app-logo {
  height: 60px;
  width: 60px;
}

.user-info {
  margin-left: 20px;
  color: white;
  height: 60px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  height: 60px;
  margin-left: auto;
  color: white;
}

/* 设置下拉按钮的样式 */
.dropbtn {
  background-color: #409eff;
  color: white;
  border: 1px solid #409eff;

  margin: 5px;
  padding: 0.5em 2em 0.5em 2em;

  border-radius: 5px 5px 5px 5px;

  font: 0.8em sans-serif;
  cursor: pointer;
  user-select: none;
}

.dropdown {
  position: relative;
  display: inline-block;
  z-index: 9999;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  z-index: 1;
  user-select: none;
}

.dropdown-content-item {
  color: black;

  text-decoration: none;
  display: block;
  cursor: pointer;
  user-select: none;
}

.dropdown-content-item:hover {
  background-color: #409eff;
  color: white;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #79bbff;
}

.horizontal-divider {
  margin-left: 20px;
  margin-right: 20px;
  width: 4px;
  height: 60px;
  background-color: gray;
}
</style>
