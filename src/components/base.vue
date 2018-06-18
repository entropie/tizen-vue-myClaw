<template>
<div id="clocks">
  <digital-clock v-if="showDigitalClock"></digital-clock>
  <analog-clock v-if="showAnalogCLock"></analog-clock>
  <heart-rate v-if="showHeartRate"></heart-rate>
  <clock-controls v-if="showClockControls"></clock-controls>
</div>
</template>

<script>

import DigitalClock from './digital.vue'
import AnalogClock from './analog.vue'
import HeartRate from './heart-rate.vue'
import ClockControls from './clock-controls.vue'

export default {
    name: "base-clock"
    , data() {
        return {
            showHeartRate: false,
            showAnalogCLock: true,
            showDigitalClock: true,
            showClockControls: true,
            time: this.tizenTime(),
            clockInterval: undefined,
            sIndex: 0,
            sets: [
                { showAnalogCLock: true, showDigitalClock: true },
                { showAnalogCLock: true, showDigitalClock: false },
                { showAnalogCLock: false, showDigitalClock: true }
            ]
        }
    }
    , components: {
        DigitalClock, AnalogClock, HeartRate, ClockControls
    }
    , created() {
        this.addListener();
        //this.setSet(this.sets[this.sIndex])
    }
    , beforeDestroy() {
        if(this.clockInterval) {
            clearInterval(this.clockInterval);
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
        }
        ,
        addListener: function() {
            console.log("adding listener");


            let t = this;

            this.clockInterval = setInterval(() => {
                t.time = t.tizenTime();
            }, 1000);

            document.addEventListener("timetick", function() {
                t.time = t.tizenTime();
            });
            
            document.addEventListener("visibilitychange", function() {
                if (!document.hidden) {
                    if (isAmbientMode === true) {
                        t.$store.state.isAmbient = true;
                    } else {
                        t.$store.state.isAmbient = false;
                    }
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

