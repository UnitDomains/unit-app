<template>
  <div class="welcome-container">
    <div class="welcome-title">
      <div class="welcome-title-header">{{ $t("c.appCaption") }}</div>

      <div class="welcome-title-header-sub">{{ $t("c.appSubCaption") }}</div>
    </div>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
      <div class="wel-doc-domain-container">
        <div class="wel-doc-domain-item">
          <a href="/search/tld/.about">.about</a>
        </div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.about">.area</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.beyond">.beyond</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.book">.book</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.cat">.cat</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.cell">.cell</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.dream">.dream</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.dog">.dog</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.east">.east</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.enjoy">.enjoy</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.enter">.enter</a></div>
        <div class="wel-doc-domain-item">
          <a href="/search/tld/.everything">.everything</a>
        </div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.earth">.earth</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.focus">.focus</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.foot">.foot</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.friend">.friend</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.girl">.girl</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.go">.go</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.good">.good</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.boy">.boy</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.happy">.happy</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.high">.high</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.hour">.hour</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.home">.home</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.here">.here</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.image">.image</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.item">.item</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.keep">.keep</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.key">.key</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.local">.local</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.lucky">.lucky</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.main">.main</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.meta">.meta</a></div>
        <div class="wel-doc-domain-item">
          <a href="/search/tld/.metaverse">.metaverse</a>
        </div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.moon">.moon</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.nature">.nature</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.nice">.nice</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.north">.north</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.option">.option</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.owner">.owner</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.person">.person</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.player">.player</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.point">.point</a></div>
        <div class="wel-doc-domain-item">
          <a href="/search/tld/.position">.position</a>
        </div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.power">.power</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.rain">.rain</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.record">.record</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.region">.region</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.right">.right</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.room">.room</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.sea">.sea</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.side">.side</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.spring">.spring</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.station">.station</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.street">.street</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.south">.south</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.time">.time</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.unit">.unit</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.verse">.verse</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.wind">.wind</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.yeah">.yeah</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.west">.west</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.well">.well</a></div>
        <div class="wel-doc-domain-item"><a href="/search/tld/.world">.world</a></div>
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
        <pre>
      <code class="javascript">
import { UnitDomains } from "@unitdomains/unitdomainsjs";
        
if (window && typeof window.ethereum !== "undefined") {
  const unitdomains = await UnitDomains.create(window.ethereum);

  console.log(await unitdomains.addr("hello.cat"));
  console.log(await unitdomains.owner("hello.cat"));
  console.log(await unitdomains.resolver("hello.cat"));
  console.log(await unitdomains.ttl("hello.cat"));
  console.log(await unitdomains.available("hello.cat"));
  console.log(await unitdomains.rentPrice("hello.cat", 1));
  console.log(await unitdomains.registerPrice("hello.cat"));
}
</code>
    </pre>
      </div>
    </div>
  </div>
</template>

<script>
import DomainsSummaryContainer from "components/summary/DomainsSummaryContainer.vue";

import InputSearch from "components/input/InputSearch.vue";

export default {
  name: "Welcome",
  components: {
    InputSearch,
    DomainsSummaryContainer,
  },
  data() {
    return {
      screenWidth: document.body.clientWidth,
      showDialog: false,
    };
  },
  computed: {
    summaryDeckWidth: function () {
      var w = Math.floor((this.screenWidth - 20) / 380) * 380;
      if (w > 380 * 3) w = 380 * 3;
      return w;
    },
    deckWidth: function () {
      return Math.floor((this.screenWidth - 20) / 380) * 380;
    },
  },

  mounted() {
    // 监听窗口大小
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },

  methods: {
    onSearchClick(searchText) {
      this.$router.push({ path: `/search/${searchText}` });
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/document.css";
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
  margin: 1em;
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

.wel-doc-block-1 {
  background: linear-gradient(132deg, rgba(251, 251, 255, 0.2), rgba(215, 223, 252, 0.8));
}

.wel-doc-block-2 {
  background: linear-gradient(132deg, rgba(227, 244, 253, 0.2), rgba(170, 209, 226, 0.8));
}

.wel-doc-block-3 {
  background: linear-gradient(132deg, rgba(219, 249, 109, 0.2), rgba(243, 194, 194, 0.8));
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
  background: linear-gradient(to right, rgba(30, 144, 255, 0.2), rgba(138, 43, 226, 0.4));
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
</style>
