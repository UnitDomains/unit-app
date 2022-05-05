<template>
  <div>
    <el-row class="welcome-title">
      <h1>{{ $t('c.appCaption') }}</h1>
    </el-row>

    <div class="input-search">
      <InputSearch @onClick="onSearchClick"></InputSearch>
    </div>
  </div>
</template>

<script>




import InputSearch from 'components/input/InputSearch.vue'

export default {
  name: "Welcome",
  components: {
    InputSearch
  },
  data() {
    return {




      screenWidth: document.body.clientWidth // 屏幕宽度
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





  }
};
</script>

<style scoped>
.welcome-title {
  clear: both;
  display: block;

  padding: 4em;
}

.input-search {
  text-align: center;
  padding: 4em;

}
</style>


