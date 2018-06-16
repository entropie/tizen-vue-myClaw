<template>
<div id="digital-clock-box">
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
    , watch: {
        isAmbient(o, n) {
            this.clockUpdater(this)();
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
            
            return "/static/img/48/" + n + add + ".gif";
        }
        ,
        clockUpdater(that) {
            let u = function() {
                let t = that;
                var date = t.$parent.time

                t.hour = t.padString(date.getHours());
                t.min  = t.padString(date.getMinutes());
                t.sec  = t.padString(date.getSeconds());

                t.hours = t.toImages(t.hour.split(""));
                t.mins  = t.toImages(t.min.split(""), true);
                t.secs  = t.toImages(t.sec.split(""), false);
            }
            return u;
        }
        , updateClock(){
            setInterval(this.clockUpdater(this), 1000);  
        }
    }
    , created() {
        let t = this;
        this.updateClock();

    }
}
</script>

<style type="sass" scoped>

#digital-clock-box {
    position: absolute;
    z-index: 5;
    width: 360px;
    top: 55%;
    text-align: center;
}

.secs img {
    max-width: 32px
}

</style>
