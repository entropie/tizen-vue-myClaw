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
            time: this.tizenTime()
        }
    }
    , components: {
        DigitalClock, AnalogClock, HeartRate, ClockControls
    }
    , created() {
        this.addListener();
        // setInterval(() => {
        //     this.$store.state.isAmbient = true;
        // }, 5000);
    }
    , methods: {
        tizenTime: function() {
            if (typeof tizen === 'undefined') {
                return new Date();
            } else {
                return tizen.time.getCurrentDateTime();
                // return new Date();
            }
        }
        ,

        addListener: function() {
            console.log("adding listener");


            let t = this;

            setInterval(() => {
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

