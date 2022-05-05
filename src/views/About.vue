<template>
  <div class="document-body">
    <h1>{{ $t('c.about') }}</h1>
    <p>{{ $t('home.website.about.p0') }}</p>
    <p>{{ $t('home.website.about.p1') }}</p>
    <p>{{ $t('home.website.about.p2') }}</p>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
@import './../assets/css/document.css';
</style>
