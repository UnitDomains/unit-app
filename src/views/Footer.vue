<template>
  <div class="footer-container">
    <div class="footer-panel">
      <div class="footer-name">
        <a target="_blank" href="mailto://unit.domains@gmail.com">Email</a>
      </div>
      <div class="footer-name">
        <a target="_blank" href="https://docs.unit.domains/FAQ.html">{{ $t("c.faq") }}</a>
      </div>
      <div class="footer-name">
        <a target="_blank" href="https://docs.unit.domains">{{ $t("c.help") }}</a>
      </div>
    </div>

    <div class="footer-panel">
      <div class="footer-name">
        <a target="_blank" href="https://github.com/UnitDomains">Github</a>
      </div>
      <div class="footer-name">
        <router-link to="/about">{{ $t("c.about") }}</router-link>
      </div>
      <div class="footer-name">
        <a target="_blank" href="https://docs.unit.domains/TermsofService.html">{{
          $t("c.termsofservice")
        }}</a>
      </div>
    </div>
    <div class="footer-panel">
      <div class="footer-name">© unit.domains All Rights Reserved</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UnitDomainsFooter",
};
</script>
<style scoped>
.footer-panel {
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  margin: 1em;
  cursor: pointer;
}

.footer-name {
  flex: 1;
  margin: auto;
  font: 1em sans-serif;
  color: white;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid rgb(103, 103, 105);
  margin: 0px;
  padding: 0;
}

a {
  text-decoration: none;
}

a:link {
  color: white;
}

a:visited {
  color: white;
}

a:hover {
  color: silver;
}

a:active {
  color: yellow;
}
</style>
