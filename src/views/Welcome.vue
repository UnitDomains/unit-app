<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent } from "vue";

import { useI18n } from "vue-i18n";

import DomainsSummaryContainer from "components/summary/DomainsSummaryContainer.vue";
import InputSearch from "components/input/InputSearch.vue";

import Banner0Image from "images/banner0.png";
import Banner1Image from "images/banner1.png";
import Banner2Image from "images/banner2.png";
import Banner3Image from "images/banner3.png";
import Banner4Image from "images/banner4.png";
import Banner5Image from "images/banner5.png";

import Avatar0Image from "images/avatar0.svg";
import Avatar1Image from "images/avatar1.svg";
import Avatar2Image from "images/avatar2.svg";
import Avatar3Image from "images/avatar3.svg";
import Avatar4Image from "images/avatar4.svg";
import Avatar5Image from "images/avatar5.svg";

import { getSupportDomainNamesSuffixArray } from "@/contractUtils/domainName";

const router = useRouter();

const screenWidth = ref(document.body.clientWidth);

const showDialog = ref(false);

const summaryDeckWidth = computed(() => {
  var w = Math.floor((screenWidth.value - 20) / 380) * 380;
  if (w > 380 * 3) w = 380 * 3;
  return w;
});
const deckWidth = computed(() => {
  return Math.floor((screenWidth.value - 20) / 380) * 380;
});

const allTLDs = computed(() => {
  return getSupportDomainNamesSuffixArray();
});

onMounted(() => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = document.body.clientWidth;
    })();
  };
});

const onTLDClick = (item: string) => {
  router.push({ path: `/search/tld/.${item}` });
};

const onSearchClick = (searchText: string) => {
  router.push({ path: `/search/${searchText}` });
};
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-title">
      <div class="welcome-title-header">{{ $t("c.appCaption") }}</div>

      <div class="welcome-title-header-sub">{{ $t("c.appSubCaption") }}</div>
    </div>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
      <div class="wel-doc-domain-container wel-doc-domain-container-width">
        <div
          class="wel-doc-domain-item"
          v-for="(item, index) in allTLDs"
          :key="index"
          @click="onTLDClick(item)"
        >
          .{{ item }}
        </div>
      </div>
    </div>

    <div class="wel-doc-block-banner-1">
      <div class="wel-doc-block-banner-1-title">
        <div>{{ $t("home.welcome.slogan.title0") }}</div>
      </div>
      <div class="wel-doc-block-banner-1-text">
        <div>{{ $t("home.welcome.slogan.content0") }}</div>
      </div>
      <div class="wel-doc-block-banner-web3-name-frame">
        <div class="wel-doc-block-banner-web3-name-container">
          <div class="wel-doc-block-banner-web3-name-text">alice.girl</div>
        </div>
        <div class="wel-doc-block-banner-web3-name-container">
          <div class="wel-doc-block-banner-web3-name-text">bob.boy</div>
        </div>
        <div class="wel-doc-block-banner-web3-name-container">
          <div class="wel-doc-block-banner-web3-name-text">cindy.region</div>
        </div>
      </div>
    </div>

    <div class="wel-doc-block-banner-2">
      <div class="wel-doc-block-banner-1-title">
        <div>{{ $t("home.welcome.slogan.title1") }}</div>
      </div>
      <div class="wel-doc-block-banner-1-text">
        <div>{{ $t("home.welcome.slogan.content1") }}</div>
      </div>
      <div class="wel-doc-block-banner-images-container">
        <img class="wel-doc-block-banner-image" :src="Banner0Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Banner1Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Banner2Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Banner3Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Banner4Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Banner5Image" alt="" />
      </div>
    </div>

    <div class="wel-doc-block-banner-3">
      <div class="wel-doc-block-banner-1-title">
        <div>{{ $t("home.welcome.slogan.title2") }}</div>
      </div>
      <div class="wel-doc-block-banner-1-text">
        <div>{{ $t("home.welcome.slogan.content2") }}</div>
      </div>
      <div class="wel-doc-block-banner-images-container">
        <img class="wel-doc-block-banner-image" :src="Avatar0Image" alt="" />

        <img class="wel-doc-block-banner-image" :src="Avatar1Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Avatar2Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Avatar3Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Avatar4Image" alt="" />
        <img class="wel-doc-block-banner-image" :src="Avatar5Image" alt="" />
      </div>
    </div>

    <div class="wel-doc-block-1">
      <div class="circle circle-bg-1">
        <div class="circle-title">{{ $t("home.welcome.statistics") }}</div>
      </div>
      <div class="box">
        <div><DomainsSummaryContainer></DomainsSummaryContainer></div>
      </div>
    </div>

    <div class="wel-doc-block-2">
      <div class="circle circle-bg-2">
        <div class="circle-title">{{ $t("home.welcome.features.title") }}</div>
      </div>
      <div class="box">
        <div class="domains-attr-container">
          <div class="domains-attr-item">
            {{ $t("home.welcome.features.f0") }}
          </div>
          <div class="domains-attr-item">
            <img src="" />
            {{ $t("home.welcome.features.f1") }}

            <a
              href="https://docs.unit.domains/SupportDomains.html"
              class="domains-attr-item-href"
            >
              {{ $t("home.welcome.more") }}</a
            >
          </div>
          <div class="domains-attr-item">{{ $t("home.welcome.features.f2") }}</div>
          <div class="domains-attr-item">
            {{ $t("home.welcome.features.f3") }}

            <a
              href="https://docs.unit.domains/domains/Opensea.html"
              class="domains-attr-item-href"
            >
              {{ $t("home.welcome.more") }}</a
            >
          </div>
          <div class="domains-attr-item">{{ $t("home.welcome.features.f4") }}</div>
          <div class="domains-attr-item">{{ $t("home.welcome.features.f5") }}</div>
        </div>
      </div>
    </div>

    <div class="wel-doc-block-3">
      <div class="circle circle-bg-3">
        <div class="circle-title">{{ $t("home.welcome.dapp") }}</div>
      </div>
      <div class="box">
        <div class="code">
          <div class="code-line">
            <span class="code-key">import</span>
            <span class="code-Brace">{</span> UnitDomains
            <span class="code-Brace">}</span>
            <span class="code-key">from</span>
            <span class="code-String">"@unitdomains/unitdomainsjs"</span>;
          </div>
          <div class="code-line">
            <span class="code-key">if</span> <span class="code-Brace">(</span>window
            <span class="code-Operator">&&</span>
            <span class="code-key">typeof</span> window.ethereum
            <span class="code-Operator">!==</span>
            "undefined"<span class="code-Brace">)</span>
            <span class="code-Brace">{</span>
          </div>
          <div class="code-line code-indent">
            <span class="code-key">const</span>
            <span class="code-Identifier">unitdomains</span>
            <span class="code-Operator">=</span>
            <span class="code-key">await</span> UnitDomains.create<span class="code-Brace"
              >(</span
            >window.ethereum<span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.addr<span class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.owner<span class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.resolver<span
              class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.ttl<span class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.available<span
              class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.rentPrice<span
              class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span>, 1<span class="code-Brace"
              >)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line code-indent">
            console.log<span class="code-Brace">(</span
            ><span class="code-key">await</span>
            <span class="code-Identifier">unitdomains</span>.registerPrice<span
              class="code-Brace"
              >(</span
            ><span class="code-String">"hello.cat"</span><span class="code-Brace">)</span
            ><span class="code-Brace">)</span>;
          </div>
          <div class="code-line"><span class="code-Brace">}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Welcome",
};
</script>

<style scoped>
@import "@/assets/css/document.css";
.welcome-container {
}

.welcome-title {
  clear: both;
  display: block;

  padding-top: 4em;
}

.welcome-title-header {
  font: 4em sans-serif;
  margin-top: 2em;
}

.welcome-title-header-sub {
  font: 1.5em sans-serif;
  margin-top: 1em;
}

.input-search {
  text-align: center;
  padding: 4em;
  padding-bottom: 10em;
}

.wel-doc-domain-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  margin-top: 4em;
  cursor: pointer;
}

.wel-doc-domain-item {
  align-items: center;
  width: 6em;
  background: linear-gradient(
    to right,
    rgba(183, 183, 183, 0.1),
    rgba(250, 250, 250, 0.1)
  );
  border-radius: 1px;
  box-shadow: 1px 1px 1px 0 rgba(157, 158, 158, 0.5);
  margin: 0.2em;
  padding: 0.2em;
  cursor: pointer;
  user-select: none;
}

.wel-doc-domain-item:hover {
  background: linear-gradient(
    to bottom right,
    rgba(250, 250, 250, 0.4),
    rgba(183, 183, 183, 0.4)
  );
}

.wel-doc-domain-item a {
  text-decoration: none;
}

.wel-doc-domain-item a:link {
  color: black;
}

.wel-doc-domain-item a:visited {
  color: black;
}

.wel-doc-domain-item a:hover {
  color: black;
}

.wel-doc-domain-item a:active {
  color: black;
}

.wel-doc-block-banner-1 {
  height: 100%;
  padding: 6em;
  background: linear-gradient(132deg, rgb(0, 103, 154) 0%, rgb(0, 173, 239) 100%);
}

.wel-doc-block-banner-1-title {
  font: 3em sans-serif;
  color: white;
}

.wel-doc-block-banner-images-container {
  padding-top: 4em;
}
.wel-doc-block-banner-image {
  width: 200px;
  height: 200px;
  padding: 10px;
}

.wel-doc-block-banner-web3-name-frame {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  margin: 1em;
  cursor: pointer;
}
.wel-doc-block-banner-web3-name-container {
  width: 300px;
  height: 100px;

  margin: 1em;
  margin-top: 4em;

  background: linear-gradient(132deg, rgb(204, 0, 255) 0%, rgb(138, 43, 226) 100%);

  border-radius: 20px;
  box-shadow: 5px 5px 5px 0 rgba(157, 158, 158, 0.5);

  cursor: pointer;
  user-select: none;
}

.wel-doc-block-banner-web3-name-text {
  font: 2em sans-serif;
  color: white;
  padding: 1em;
}
.wel-doc-block-banner-2 {
  padding: 6em;
  background: linear-gradient(132deg, rgb(30, 144, 255) 0%, rgb(138, 43, 226) 100%);
}

.wel-doc-block-banner-2-title {
  font: 3em sans-serif;
  color: antiquewhite;
}

.wel-doc-block-banner-3 {
  padding: 6em;
  background: linear-gradient(132deg, rgb(207, 69, 32) 0%, rgb(71, 55, 40) 100%);
}

.wel-doc-block-banner-3-title {
  font: 3em sans-serif;
  color: aqua;
}

.wel-doc-block-banner-1-text {
  margin-top: 2em;
  font: 2em sans-serif;
  color: white;
}
.wel-doc-block-1 {
  background: linear-gradient(132deg, rgba(251, 251, 255, 0.2), rgba(215, 223, 252, 0.8));
}

.wel-doc-block-2 {
  background: linear-gradient(132deg, rgba(227, 244, 253, 0.2), rgba(170, 209, 226, 0.8));
}

.wel-doc-block-3 {
  background: linear-gradient(132deg, rgb(65, 80, 95) 0%, rgb(36, 37, 38) 100%);
}

.circle {
  width: 100%;
  height: 100px;
  border-radius: 0 0 50% 50%;
  margin-left: -0%;
  z-index: 0;
}

.circle-bg-1 {
  background: -webkit-linear-gradient(
    left,
    rgba(30, 206, 194, 0.2),
    rgba(26, 209, 122, 0.4)
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    rgba(30, 206, 194, 0.2),
    rgba(26, 209, 122, 0.4)
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    rgba(30, 206, 194, 0.2),
    rgba(26, 209, 122, 0.4)
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, rgba(30, 206, 194, 0.2), rgba(26, 209, 122, 0.4));
}

.circle-bg-2 {
  background: -webkit-linear-gradient(
    left,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, rgba(30, 144, 255, 0.2), rgba(138, 43, 226, 0.4));
}

.circle-bg-3 {
  background: -webkit-linear-gradient(
    left,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    rgba(30, 144, 255, 0.2),
    rgba(138, 43, 226, 0.4)
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(132deg, rgb(221, 221, 221) 0%, rgb(110, 136, 161) 100%);
}

.circle-title {
  padding: 1em;
  font: 2em sans-serif;
  color: black;
}
.box {
  position: relative;
  margin: -50px 0px 0px;
  border-radius: 0px;
  padding: 0px;

  z-index: 0;
}

.box pre {
  padding-top: 4em;
  padding-left: 40%;
  height: 20em;
  text-align: left;
}
.domains-attr-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  padding: 5em;
}
.domains-attr-item {
  display: block;
  padding: 1em;
  width: 400px;
  min-height: 4em;
  margin: 1em;

  background: #ffffff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
  border-radius: 10px;

  justify-content: center;
  align-items: center;

  font: 2em sans-serif;
}

.domains-attr-item-href {
  padding: 5px;
  display: block;
  font: 0.8em sans-serif;
  text-decoration: none;
}

.code {
  margin-top: 4em;
  padding: 2em;
  text-align: left;
  color: white;
}
.code-line {
  margin-left: 40%;
  padding: 0.5em;
}
.code-indent {
  padding-left: 2em;
}
.code-key {
  color: #c678dd;
  margin-right: 0.1em;
}

.code-Comment {
  color: #0058544d;
}

.code-Identifier {
  color: #e06c75;
  margin-left: 0.5em;
}

.code-Number {
  color: #00ff81ae;
}

.code-String {
  color: #d19a66;
}

.code-Brace {
  color: #e06c75;
  margin-left: 0.1em;
  margin-right: 0.1em;
}

.code-Operator {
  color: #c678dd;
  margin-left: 0.5em;
  margin-right: 0.5em;
}
</style>
