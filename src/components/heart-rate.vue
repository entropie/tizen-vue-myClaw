<template>
  <div id="heartrate">
    {{ display }}
  </div>
</template>

<script>

export default {
    name: "heart-rate"
    , computed: {
        display() {
            return this.$store.state.hr;
        }
    }
}
</script>

<style type="scss" scoped>
  #heartrate {
      position: absolute;
      top: 60%;
      left: 0;
      width: 100%;
  }
</style>
