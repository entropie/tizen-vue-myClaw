<template>

<div class="clock-controls-box">
  <div id="stopwatch">{{ workerValue }}</div>


  <div id="progress-bar" v-if="showCircle && !isAmbient">
    <radial-progress-bar :diameter=diameter
                         :completed-steps="cSteps"
                         :total-steps="pSteps"
                         timingFunc="linear"
                         stopColor="darkgreen"
                         startColor="green"
                         innerStrokeColor="transparent"
                         :animateSpeed=1000
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
                         :animateSpeed=1000
                         :strokeWidth=strokeWidth>
    </radial-progress-bar>
  </div>

  <div id="clock-date" v-bind:class="{ambient: isAmbient}" v-if="showDate">
    <span>{{ day }} {{ monthDay }}</span>
  </div>


  <div class="resetter" v-if="counting || counterForceShow">
    <span v-on:click="stopAndReset"></span>
  </div>

  <div class="setter">
    <span v-on:click="$parent.changeClock()"></span>
  </div>
  
  <div class="ackro">
    <div class="ackrocon" v-if="showAckro">
      <img :src="ackro()">
    </div>
  </div>



  <div id="clock-controls">
    <span style="display:inline-block;width:40px; height:40px;" v-on:click="$store.state.isAmbient = !$store.state.isAmbient"></span>
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
          <span class="mbt" v-on:click="toggleCounter" v-bind:class="{active: counterForceShow}" v-if="(counterForceShow  && !isAmbient) && !counting"> 
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
            pStepsDefault: 24,
            pSteps: 24,
            pStepsH: 24,
            cSteps: 0,
            cStepsH: 0,
            cStep: 0,
            diameter: 354,
            strokeWidth: 5,
            incrementStep: 1 * 30 * 1000,
            workerValue: 0,
            alarm: false
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
        },
        time: function() {
            return this.$parent.time;
        }
    }
    , created() {
    }
    , watch: {
        counterForceShow(o, n) {
            // if(this.counterForceShow) {
            //     document.addEventListener('rotarydetent', this.setRotarySetterFunction);
            // } else {
            //     document.removeEventListener('rotarydetent', this.setRotarySetterFunction);
            // }
        },
        time(o,n) {
            this.update();
        }
    }
    , methods: {
        ackro() {
            let add = this.isAmbient ? "bw" : "";
            return "./static/img/ackro" + add  + ".gif";
        }
        , setRotarySetterFunction(ev) {
            ev.detail.direction === 'CW' ? this.increment() : this.decrement()
        }
        , createAlarm() {
            if(typeof tizen !== 'undefined') {

                // var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/default',
                //                                               null, 'image/jpg', null);
                // var notificationDict = {
                //     content: 'This is a simple notification\'s content.',
                //     actions: {
                //         vibration: true,
                //         appId: tizen.application.getCurrentApplication().appInfo.id,
                //         appControl: appControl
                //     },
                // };

                // var notification = new tizen.UserNotification('SIMPLE', 'Simple notification\'s title',
                //                                               notificationDict);
                
                // this.alarm = new tizen.AlarmRelative(this.countDownTime / 1000 - 5);
                // tizen.alarm.add(this.alarm, tizen.application.getCurrentApplication().appInfo.id);
            }

        }
        // , createNotification() {
        //     var notification,
        //         notificationDict;
        //     try {
        //         notificationDict = {
        //             content: "Bzt bZt!",
        //             iconPath: this.ackro()
        //         };
        //         notification = new tizen.StatusNotification("SIMPLE", "Notification Manager", notificationDict);
        //         tizen.notification.post(notification);
        //     } catch (err) {
        //         console.log(err.name + ": " + err.message);
        //     }
        // }
        , startCounter() {
            this.counting = true;
            this.$refs.countdown.start();
            this.pSteps = this.countDownTime / 1000;
            this.createWorker();
        }
        , createWorker() {
            this.terminateWorker();

            if (typeof tizen !== 'undefined') {
                tizen.power.request("CPU", "CPU_AWAKE");
            }

            this.worker = new Worker("./static/stopwatch.js");
            let t = this;

            this.worker.onmessage = function(ev) {
                let current = ev.data.current, started = ev.data.started;
                let passedSecs = Math.round(((current - started) / 1000));
                let maxSecs = t.countDownTime /1000;
                t.cSteps = t.workerValue = passedSecs;

                if(passedSecs >= maxSecs) {
                    t.stopAndReset();
                    t.$parent.vibrate();
                };
            }
            // this.alarm = this.createAlarm();
            return this.worker;
        }
        , terminateWorker() {
            if(this.worker) {
                this.worker.terminate();
            }
        }
        ,
        increment() {
            this.countDownTime += this.incrementStep;
        }
        ,
        decrement() {
            this.countDownTime -= this.incrementStep;
            if(this.countDownTime <= 0) {
                this.countDownTime = this.incrementStep;
            }
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
            this.pSteps = this.pStepsDefault;
            this.cSteps = 0;
            this.terminateWorker();
        }
        ,
        done(){
        }
        ,
        countdownProgress(data) {
            let totalSecs = (data.minutes * 60) + Math.round(data.seconds);
            let rsecs = Math.abs(this.pSteps - totalSecs)
            if(this.worker) {
                this.worker.postMessage(rsecs);
            }
            // this.cSteps = rsecs;
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

@import '../variables.sass';

#clock-controls, #progress-bar, #clock-date {
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    width: $w;
    height: $w;
    z-index: 99;
}

#stopwatch {
    position: absolute;
    top: 0;
    left: 0;
    width: $w;
    height: 30px;
    z-index: 99;
    display: none;
}

#clock-date {
    text-align: left;
    z-index: 1;
    span {
        box-shadow: $dateBoxShadow;
        text-shadow: $dateTextShadow;
        background-color: $dateBackgroundColor;
        display: inline-block;
        margin-top: 170px;
        margin-left: calc(50% + 107px);
        color: $dateColor;
        border-radius: 15%;
        padding: 3px;
        font-size: $dateFontSize;
        font-family: monospace;
    }
    &.ambient {
        span {
            color: $dateAmbientColor;
            background-color: $dateAmbientBackgroundColor;
        }
    }
}

#progress-bar {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

#countdown {
    font-size: 14px;
    flex-grow: 0;
}

@mixin sPos() {
    position: absolute;
    top: calc(50% - 25px);
    right: calc(50% - 100px);
}

.ackro {
    @include sPos();
    width: 100%;
    height: 20px;
    text-align: center;
    z-index: 20;
    img {
        z-index: 90;
        max-height: 42px;
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
    z-index: 1000;
    span {
        display: inline-block;
        width: 52px;
        height: 52px;
        cursor: pointer;
    }
}
.setter {
    top: 65px;
    position: absolute;
    @include sPos();
    width: 100%;
    z-index: 1000;
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
    top: 280px;
    width: 100%;
    .mbtn, span {
        display: inline-block;
        height: 20px;
        cursor: pointer;
        height: 40px;
        flex-grow: 1;
    }
    .mbt {
    }
    .countdown span {
        width: 60px;
        display: inline-block;
        color: $countdownColor;
        text-shadow: $countdownTextShadow;
    }
}
</style>
