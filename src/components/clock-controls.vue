<template>
  <div id="clock-controls">

    <div class="test">
      <!-- <a href="#" v-on:click="foobar">@</a> -->
      <a href="#" v-on:click="startCounter" v-if="!counting"></a>
      <a href="#" v-on:click="stopCounter" v-if="counting">!</a>
    </div>
    <countdown :time="defaultCountDownTime" id="countdown" v-bind:auto-start="false" ref="countdown">
      <template v-if="counting && !isAmbient" slot-scope="props">{{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}</template>
    </countdown>

  </div>
</template>

<script>

export default {
    name: "clock-controls"
    , data() {
        return {
            showHeartRate: false,
            defaultCountDownTime: 10*60 * 1000,
            counting: false
        }
    }
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        }
        ,
        isCounting: function() {
            return this.$refs.countdown && this.$refs.countdown.counting;
        }
    }
    , created() {
    }
    , methods: {
        foobar() {
            this.$store.state.isAmbient = !this.$store.state.isAmbient;
        }
        ,
        startCounter() {
            this.counting = true;
            this.$refs.countdown.start();
        }
        ,
        stopCounter() {
            this.counting = false;
            this.$refs.countdown.stop();
        }        
    }
}
</script>

<style lang="scss" scoped>
#clock-controls {
    text-align: center;
    position: absolute;
    top: 75%;
    left: 0;
    width: 360px;
    z-index: 99;
}

#countdown {
    font-size: 10px
}

.test {
    a {
        display: inline-block;
        width: 40px;
        height: 40px;
    }
}
</style>
