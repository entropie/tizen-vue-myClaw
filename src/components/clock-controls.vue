<template>
  <div id="clock-controls">

    <div class="resetter" v-if="counting || counterForceShow">
      <span v-on:click="stopAndReset"></span>
    </div>
    <div class="ackro">
      <div class="ackrocon">
        <img :src="ackro()" v-on:click="$parent.changeClock()">
      </div>
    </div>
    
    <div class="counter">

      <span class="mbtn" href="#" v-on:click="decrement"></span>

      <countdown class="countdown" :time="countDownTime" id="countdown" v-bind:auto-start="false" ref="countdown" v-on:countdownend="done" :interval=interval>
        <template slot-scope="props">
          <span class="mbt" v-on:click="toggleCounter" v-bind:class="{active: counterForceShow}" v-if="counterForceShow || (counting && !isAmbient)">
            {{ props.hours == "00" ? "" : props.hours + ":"}}{{ props.minutes == "00" ? "" : props.minutes + ":"}}{{ props.seconds }}
          </span>
          <span class="mbtn" v-else v-on:click="counterForceShow = !counterForceShow">

          </span>
        </template>
      </countdown>

      <span class="mbtn" href="#" v-on:click="increment "></span>


    </div>

  </div>
</template>

<script>

export default {
    name: "clock-controls"
    , data() {
        return {
            showHeartRate: false,
            countDownTime: 60 * 10 * 1000,
            counting: false,
            interval: 100,
            counterForceShow: false
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
    , watch: {
        counterForceShow(o, n) {
            if(this.counterForceShow) {
                document.addEventListener('rotarydetent', this.setRotarySetterFunction);
            } else {
                document.removeEventListener('rotarydetent', this.setRotarySetterFunction);
            }
        }

    }
    , methods: {
        ackro() {
            let add = this.isAmbient ? "bw" : "";
            return "/static/img/ackro" + add  + ".gif";
        }
        , setRotarySetterFunction(ev) {
            ev.detail.direction === 'CW' ? this.increment() : this.decrement()
        }
        , startCounter() {
            this.counting = true;
            this.$refs.countdown.start();
        }
        ,
        increment() {
            this.countDownTime += 1*60 * 1000;
        }
        ,
        decrement() {
            this.countDownTime -= 1*60 * 1000;
        }
        ,
        stopCounter() {
            this.counting = false;
            this.$refs.countdown.pause();
        }
        , stopAndReset() {
            this.stopCounter();
            this.counterForceShow = false;
            let t = this;
            setTimeout(function() {
                t.resetCounter();
            }, 500);
            this.$refs.countdown.init();
        }
        , toggleCounter() {
            if(this.counting) {
                this.stopCounter();
                this.counterForceShow = true;
            } else {
                this.startCounter();
            }
        }
        ,
        resetCounter () {
            this.countdown = false;
            this.$refs.countdown.init();
            this.$refs.countdown.time = this.countDownTime;
        },
        done(){
            navigator.vibrate(1000, 200);
            this.resetCounter();

      }
    }
}
</script>

<style lang="scss" scoped>
#clock-controls {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 360px;
    height: 360px;
    z-index: 99;
}

#countdown {
    font-size: 14px
}

.resetter, .ackro {
    position: absolute;
    top: 20%;
    left: 0;
    width: 100%;
    span {
        display: inline-block;
        width: 33%;
        height: 40px;
        cursor: pointer;
    }
}
.ackro {
    height: 20px;
    img {
        max-height: 24px;
    }
    
}
.counter {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 40px;
    position: absolute;
    bottom: 15%;
    width: 100%;
    .mbtn, span {
        flex-grow: 1;
        display: inline-block;
        height: 20px;
        color: #777;
        cursor: pointer;
    }
    .countdown span {
        width: 100%;
        display: inline-block;
    }
}
</style>
