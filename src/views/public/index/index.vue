<template>
  <container>
    <div class="page">
      <p class="page__title">Chic Admin {{ $version }}</p>
      <p class="page__sub-title">优雅的中后台集成方案</p>
      <p class="page__build-time">FINAL BUILD TIME {{ $buildTime }}</p>
    </div>
  </container>
</template>
<script>
export default {

}
</script>

<style lang="scss" scoped>
.page {
  @extend %full;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  .page__title {
    margin: 0px;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: $color-text-main;
  }

  .page__sub-title {
    margin: 0px;
    margin-bottom: 5px;
    color: $color-text-normal;
  }

  .page__build-time {
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    color: $color-text-placehoder;
  }
}</style>
