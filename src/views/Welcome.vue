<template>
  <div class="welcome-container">
    <div class="welcome-title">
      <h1>{{ $t("c.appCaption") }}</h1>
    </div>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
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
      //this.$router.push({ path: `/search/${searchText}` })
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

  padding: 4em;
}

.input-search {
  text-align: center;
  padding: 4em;
  padding-bottom: 10em;
}

.wel-doc-block-1 {
  background: linear-gradient(132deg, rgba(251, 251, 255, 0.2), rgba(215, 223, 252, 0.8));
}

.wel-doc-block-2 {
  background: linear-gradient(132deg, rgba(227, 244, 253, 0.2), rgba(170, 209, 226, 0.8));
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
