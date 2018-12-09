<template>
<div id="digital-box">
  <div id="toggle-counter"><strong v-on:click="toggleCounter()">&nbsp;</strong></div>
  <div id="counter-toggler-box">
    <span class="reset" v-if="counterActive"><strong v-on:click="resetCounter()">&nbsp;</strong></span>
    <span class="overlay" v-if="counterActive"><strong v-on:click="dynamicEventButton()">&nbsp;</strong></span>
    <span class="start" v-if="counterActive"><strong v-on:click="startCounter()">&nbsp;</strong></span>
  </div>
  
  <div id="counter-box" v-if="counterActive && !isAmbient">
    <div class="counter-box-content" v-html="counterToImages(counterTime)" v-on:click="dynamicEvent()" />
  </div>

<div id="digital-clock-box" v-if="!counterActive || isAmbient">
  <div class="digital-view" v-bind:class="{ambient: isAmbient}">
    <span class="hour" v-for="h in hours">
      <img :src="h">
    </span>
    <span class="mins" v-for="m in mins">
      <img :src="m">
    </span>
    <span class="secs" v-for="s in secs" v-if="!isAmbient">
      <img :src="s">
    </span>
  </div>
</div>
</div>
</template>

<script>
import moment from 'moment';
import momentDurationFormatSetup from "moment-duration-format";

export default {
    name: "digital-clock"

    , data() {
        return {
            // time: Date.now(),
            min: "00",
            sec: "00",
            hour: "00",

            hours: [],
            mins: [],
            secs: [],
            counterActive: false,
            startedAt: false,
            workerValue: 0
        }
    }
    , created(){
        this.updateClock();
    }
    , computed: {
        isAmbient() {
            return this.$store.state.isAmbient;
        },
        time() {
            return this.$parent.time;
        },
        counterTime() {
            if(this.workerValue && this.workerValue != 0) {
                let ret = moment.duration(this.workerValue * 1000).format("h:mm:ss");
                return ret;
            } else {
                return "00";
            }
            
        }
    }
    , beforeDestroy() {
    }
    , watch: {
        isAmbient(o, n) {
            this.clockUpdater();
        },

        time(o,n) {
            this.update();
        }
    }
    , methods: {
        counterToImages(str) {
            var splitted = str.split(":");
            let s = splitted.map(x => this.toImages(x.split("")).map(x => "<img src='" + x + "' />").join("")   )
            return s.join("");
        }
        ,
        
        toggleCounter() {
            this.counterActive = !this.counterActive;
        }
        ,
        startCounter() {
            if(this.worker)
                return false;
            
            this.worker = new Worker("./static/stopwatch.js");
            let t = this;

            this.worker.onmessage = function(ev) {
                let current = ev.data.current, started = ev.data.started;
                let passedSecs = Math.round(((current - started) / 1000));
                t.cSteps = t.workerValue = passedSecs;
            }
            return this.worker;
        },

        dynamicEventButton() {
            if(this.workerValue > 0) {
                this.resetAndClose();
            } else {
                this.startCounter();
            }
        }
        ,
        resetAndClose() {
            this.resetCounter();
            this.counterActive = false;
        }
        ,
        resetCounter() {
            this.workerValue = 0;
            if(this.worker) {
                this.worker.terminate();
                this.worker = false;
            }
        }
        ,
        now() {
            return moment(this.time)
        }
        , padString(str) {
            return ("00" + str).substr(-2,2);
        }
        
        , stringTiNumbers: function(str) {
            let ret = [];
            for (var i = 0; i < str.length; i++) {
                ret.push(str.charAt(i));
            }
            return ret;
        }
        , toImages: function(arr, green, size) {
            return arr.map(x => this.numberToImage(x, green, size) );


        }
        , numberToImage: function(n, green, size) {
            let add = green ? "" : "grey"
            if(this.isAmbient)
                add = "grey"

            if(!size)
                size = 48;
            
            return "./static/img/48/" + n + add + ".gif";
        }
        ,
        clockUpdater() {
            let t = this;
            var date = t.$parent.time

            t.hour = t.padString(date.getHours());
            t.min  = t.padString(date.getMinutes());
            t.sec  = t.padString(date.getSeconds());

            t.hours = t.toImages(t.hour.split(""));
            t.mins  = t.toImages(t.min.split(""), true);
            t.secs  = t.toImages(t.sec.split(""), false);
        }
        , update() {
            this.clockUpdater();
        }
    }
    , created() {

    }
}
</script>

<style lang="scss">

@import '../variables.sass';

#toggle-counter {
    position: absolute;
    top: 170px;
    z-index: 2000;
    right: 47%;
    left: 47%;
    strong {
        width: 30px;
        display: inline-block;
    }
}


#counter-toggler-box {
    position: absolute;
    top: 0;
    z-index: 1001;
    width: 100%;
    top: 233px;
    height: 40px;
    .reset {
        position: absolute;
        left: 0;
        strong {
            display: inline-block;
            width: 100px;
            height: 40px;
        }                      
    }
    .start {
        position: absolute;
        right: 0;
        strong {
            display: inline-block;
            width: 100px;
            height: 40px;
        }
    }
    .overlay {
        position: absolute;
        left: 100px;
        right: 100px;
        strong {
            display: inline-block;
            width: ($digitalImgSize * 4) + ($digitilImgSecsSize * 2) + 10;
            height: 40px;
        }
    }
    .toggle {
        position: absolute;
        width: 100%;
        top: -65px;
        strong {
            display: inline-block;
            width: 30px;
            height: 30px;
        }
    }
}
#counter-box {
    background-color: rgba(0,1000,0, .5);
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 5;
    top: 233px;
    text-align: center;
    .counter-box-content {
        position: absolute;
        top: 0;
        left: 100px;
        background-color: $digitalViewBackgroundColor;
        width: ($digitalImgSize * 4) + ($digitilImgSecsSize * 2) + 10;
    background-color: $digitalViewBackgroundColor;
    border: $digitalViewBorder;
    border-radius: $digitalViewBorderRadius;
    box-shadow: $digitalViewBoxShadow;

        padding: 5px;
    }
    img {
        max-width: $digitalImgSize;
    }
}


#digital-clock-box{
    position: absolute;
    z-index: 5;
    width: 360px;
    top: 233px;
    text-align: center;
}

.digital-view{
    opacity: .7;
    display: inline-block;
    padding: 5px;
    background-color: $digitalViewBackgroundColor;
    border: $digitalViewBorder;
    border-radius: $digitalViewBorderRadius;
    box-shadow: $digitalViewBoxShadow;
    width: ($digitalImgSize * 4) + ($digitilImgSecsSize * 2) + 10;
    &.ambient { 
        width: ($digitalImgSize * 4) + 10;
    }
}

.hour img, .mins img {
    max-width: $digitalImgSize;
}
.secs img {
    max-width: $digitilImgSecsSize;
    z-index: 99;
}

</style>
