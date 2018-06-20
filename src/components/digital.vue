<template>
<div id="digital-clock-box">
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
</template>

<script>
import moment from 'moment';

export default {
    name: "digital-clock"

    , data() {
        return {
            time: Date.now(),
            min: "00",
            sec: "00",
            hour: "00",

            hours: [],
            mins: [],
            secs: []            
        }
    }
    , created(){
        this.updateClock();
    }
    , computed: {
        isAmbient() {
            return this.$store.state.isAmbient;
        }
    }
    , beforeDestroy() {
    }
    , watch: {
        isAmbient(o, n) {
            this.clockUpdater();
        }
    }
    , methods: {
        now() {
            console.log(moment(this.$parent.time));
            return moment(this.$parent.time)
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


#digital-clock-box{
    position: absolute;
    z-index: 5;
    width: 360px;
    top: 233px;
    text-align: center;
}

.digital-view{
    opacity: .7;
    background-color: red;
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
