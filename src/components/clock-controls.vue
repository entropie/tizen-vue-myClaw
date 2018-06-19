<template>
<div class="foo">
  <div id="progress-bar" v-if="showCircle && !isAmbient">
    <radial-progress-bar :diameter=diameter
                         :completed-steps="cSteps"
                         :total-steps="pSteps"
                         timingFunc="linear"
                         stopColor="#00000)"
                         startColor="#6ab551"
                         innerStrokeColor="#000000"
                         :strokeWidth=strokeWidth>
    </radial-progress-bar>
  </div>

  <div id="progress-bar" v-if="showCircle && isAmbient">
    <radial-progress-bar :diameter=diameter
                         :completed-steps="cStepsH"
                         :total-steps="pStepsH"
                         timingFunc="linear"
                         stopColor="rgb(0, 0, 0)"
                         startColor="rgb(155, 155, 155)"
                         innerStrokeColor="#000000"
                         :strokeWidth=strokeWidth>
    </radial-progress-bar>
  </div>

  <div id="clock-date" v-bind:class="{ambient: isAmbient}" v-if="showDate">
    <span>{{ day }} {{ monthDay }}</span>
  </div>

  <div id="clock-controls">

    <span style="display:inline-block;width:40px; height:40px;" v-on:click="$store.state.isAmbient = !$store.state.isAmbient"></span>


    <div class="resetter" v-if="counting || counterForceShow">
      <span v-on:click="stopAndReset"></span>
    </div>
    <div class="ackro">
      <div class="ackrocon" v-if="showAckro">
        <img :src="ackro()" v-on:click="$parent.changeClock()">
      </div>
      <div class="ackrodummy" v-else>
        <span v-on:click="$parent.changeClock()"></span>
      </div>
    </div>
    
    <div class="counter">

      <span class="mbtn" href="#" v-on:click="decrement" v-if="counterForceShow"></span>

      <countdown class="countdown"
                 :time="countDownTime"
                 id="countdown"
                 v-bind:auto-start="false"
                 ref="countdown"
                 v-on:countdownend="done"
                 v-on:countdownprogress="countdownProgress"
                 :interval=interval>
        <template slot-scope="props">
          <span class="mbt" v-on:click="toggleCounter" v-bind:class="{active: counterForceShow}" v-if="(counterForceShow  && !isAmbient) || (counting && !isAmbient)">
            {{ props.hours == "00" ? "" : props.hours + ":"}}{{ props.minutes == "00" ? "" : props.minutes + ":"}}{{ props.seconds }}
          </span>
          <span class="mbtn" v-else v-on:click="counterForceShow = !counterForceShow">
          </span>
        </template>
      </countdown>

      <span class="mbtn" href="#" v-on:click="increment"  v-if="counterForceShow"></span>


    </div>

  </div>
</div>
</template>

<script>

import RadialProgressBar from 'vue-radial-progress'

export default {
    name: "clock-controls",
    props: {
        showCircle: {
            default: true
        }
        , showDate: {
            default: true
        }
        , showAckro: {
            default: true
        }
    }
    , data() {
        return {
            showHeartRate: false,
            countDownTime: 60 * 5 * 1000,
            countDownTimeDefault: 60 * 5 * 1000,
            counting: false,
            interval: 100,
            counterForceShow: false,
            pSteps: 24,
            pStepsH: 24,
            cSteps: 0,
            cStepsH: 0,
            cStep: 0,
            diameter: 360,
            strokeWidth: 5,
            incrementStep: 1 * 30 * 1000
        }
    }
    , components: {
        RadialProgressBar
    }    
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        }
        ,
        isCounting: function() {
            return this.$refs.countdown && this.$refs.countdown.counting;
        }
        ,
        day: function() {
            return this.$parent.moment.format("dd");
        },
        monthDay: function() {
            return this.$parent.moment.format("D");
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
            this.pSteps = this.countDownTime / 1000;

        }
        ,
        increment() {
            this.countDownTime += this.incrementStep;
        }
        ,
        decrement() {
            this.countDownTime -= this.incrementStep;
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
            this.counting = false;
            this.$refs.countdown.init();
            this.countDownTime = this.countDownTimeDefault;
            this.pSteps = 24;
            this.cSteps = 0;
        }
        ,
        done(){
            navigator.vibrate(1000, 200);
            this.resetCounter();
        }
        ,
        countdownProgress(data) {
            let totalSecs = (data.minutes * 60) + Math.round(data.seconds);
            let rsecs = Math.abs(this.pSteps - totalSecs)
            this.cSteps = rsecs;
        }
        ,
        update() {
            let hs = this.$parent.time.getHours();
            if(!this.counting) {
                this.cSteps = hs;
            }
            this.cStepsH = hs;
        }
        
    }
}
</script>

<style lang="scss" scoped>

$dateColor: #54db11;
$dateAmbientColor: #e8e8e8;
$dateBackgroundColor: #515151;
$dateBorderColor: #848484;

#clock-controls, #progress-bar, #clock-date {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 360px;
    height: 360px;
    z-index: 99;
}

#clock-date {
    text-align: left;
    z-index: 1;
    span {
        box-shadow: inset 1px 1px 2px 0px rgba(0,0,0,0.75), 1px 1px 2px 0px #565656;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
        background-color: $dateBackgroundColor;
        display: inline-block;
        margin-top: 168px;
        margin-left: calc(50% + 50px);
        color: $dateColor;
        border-radius: 15%;
        padding: 3px;
        font-size: 14px;
        border: 1px solid $dateBorderColor;
    }
    &.ambient {
        span {
            color: $dateAmbientColor;
        }
    }
}

#progress-bar {
    z-index: 1;
}

#countdown {
    font-size: 14px;
    flex-grow: 0;
}

.ackro {
    position: absolute;
    top: 145px;
    left: 0;
    width: 100%;
    height: 20px;
    text-align: center;
    img {
        z-index: 90;
        max-height: 52px;
    }
    .ackrodummy span {
        display: inline-block;
        height: 40px;
        width: 40px;
    }

}
.resetter {
    top: 145px;
    position: absolute;
    width: 100%;
    z-index: 90;
    span {
        display: inline-block;
        width: 52px;
        height: 52px;
        cursor: pointer;
    }
}
.counter {
    display: flex;
    align-content: center;
    justify-content: center;
    height: 40px;
    position: absolute;
    top: 290px;
    width: 100%;
    .mbtn, span {
        display: inline-block;
        height: 20px;
        color: #777;
        cursor: pointer;
        height: 40px;
        flex-grow: 1;
    }
    .mbt {
    }
    .countdown span {
        width: 60px;
        display: inline-block;
    }
}
</style>
