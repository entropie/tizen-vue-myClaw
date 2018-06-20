<template>
  <div id="base">
    <div id="clockBg" v-bind:class="{ambient: isAmbient}"></div>
    <div id="clocks">
      <digital-clock v-if="showDigitalClock" ref="dclock"></digital-clock>
      <analog-clock v-if="showAnalogCLock"   ref="aclock"></analog-clock>
      <heart-rate v-if="showHeartRate"></heart-rate>
      <clock-controls v-if="showClockControls" ref="cclock" :showCircle=showCircle :showDate=showDate :showAckro=showAckro></clock-controls>
    </div>
</div>
</template>

<script>

import DigitalClock from './digital.vue'
import AnalogClock from './analog.vue'
import HeartRate from './heart-rate.vue'
import ClockControls from './clock-controls.vue'
import moment from 'moment';

export default {
    name: "base-clock"
    , data() {
        return {
            showHeartRate: false,
            showAnalogCLock: true,
            showDigitalClock: true,
            showClockControls: true,
            showCircle: true,
            showDate: true,
            showAckro: true,
            time: this.tizenTime(),
            clockInterval: undefined,
            sIndex: 0,
            sets: [
                { showAnalogCLock: true, showDigitalClock: true,  showCircle: true, showDate: true },
                { showAnalogCLock: true, showDigitalClock: true,  showCircle: true, showDate: false },
                { showAnalogCLock: true, showDigitalClock: false, showCircle: true, showDate: true },
                { showAnalogCLock: false, showDigitalClock: true, showCircle: true, showDate: false, showAckro: false},
                { showAnalogCLock: false, showDigitalClock: false, showCircle: true, showDate: false, showAckro: false }
            ]
        }
    }
    , components: {
        DigitalClock, AnalogClock, HeartRate, ClockControls
    }
    , created() {
        this.addListener();
    }
    , mounted() {
        let t = this;

        this.clockInterval = setInterval(() => {
            t.time = t.tizenTime();
            this.$refs.dclock && this.$refs.dclock.update();
            this.$refs.aclock && this.$refs.aclock.update();
            this.$refs.cclock && this.$refs.cclock.update();
        }, 1000);

    }
    , beforeDestroy() {
        if(this.clockInterval) {
            clearInterval(this.clockInterval);
        }
    }
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        }
        ,
        moment: function() {
            return moment(this.time);
        }
    }
    , methods: {
        tizenTime: function() {
            if (typeof tizen === 'undefined') {
                return new Date();
            } else {
                return tizen.time.getCurrentDateTime();
            }
        }
        ,

        changeClock: function() {
            let newInd = this.sIndex += 1;
            let set = this.sets[newInd];
            if(!set) {
                set = this.sets[0];
            }
            this.setSet(set);
        }
        ,
        setList: function() {
            return Object.keys(this.sets);
        }
        ,
        setSet: function(sv) {
            if(!sv) return false;
            this.sIndex = this.sets.indexOf(sv);
            this.showDigitalClock = sv.showDigitalClock;
            this.showAnalogCLock =  sv.showAnalogCLock;
            this.showCircle =       sv.showCircle;
            this.showDate =         sv.showDate;
            this.showAckro =        sv.showAckro;
        }
        ,
        addListener: function() {
            console.log("adding listener");

            let t = this;

            document.addEventListener("timetick", function() {
                t.time = t.tizenTime();
            });

            // countdown would sleep otherwise during device sleep
            if(typeof tizen !== 'undefined') {
                if(tizen.power) {
                    tizen.power.request("CPU", "CPU_AWAKE");
                }
            }

            window.addEventListener("visibilitychange", function() {
                if (!document.hidden) {
                    t.time = t.tizenTime();
                }
            });

            window.addEventListener("ambientmodechanged", function(e) {
                if (e.detail.ambientMode === true) {
                    t.$store.state.isAmbient = true;
                } else {
                    t.$store.state.isAmbient = false;
                }
            });
   
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../variables.sass';

#clockBg {
    position: absolute;
    background: $background;
    border-radius: 50%;
    height: $h;
    width: $w;
    z-index: 1;
    &.ambient {
        background-color: #000;
        background: #000;
    }
}

</style>
