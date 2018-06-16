<template>
<div id="analog-clock">
  <div class="clock"  v-bind:class="{ambient: isAmbient}">
    <div class="steps a"></div>
    <div class="steps"></div>  
    <div class="steps"></div>
    <div class="steps a"></div>
    <div class="steps"></div>
    <div class="steps"></div>
    <div class="hour" v-bind:style="{transform: 'rotate(' + hourDeg + 'deg)'}"></div>
    <div class="min" v-bind:style="{transform: 'rotate(' + minsDeg + 'deg)'}"></div>
    <div v-if="!isAmbient" class="sec" v-bind:style="{transform: 'rotate(' + secsDeg + 'deg)'}"></div>
  </div>
</div>
</template>


<script>
import moment from 'moment';

// https://codepen.io/Paolo-Duzioni/pen/XeXdbm/
export default {
    name: "analog-clock"

    , data() {
        return {
            appTitle: 'Vue Clock',
            hour: '--',
            hourDeg: '0deg',
            mins: '--',
            minsDeg: '0deg',
            secs: '--',
            secsDeg: '0deg'
        }
    }
    , created(){
        this.updateClock();
    }
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        }
    }
    , methods: {
        now() {
            return moment(this.$parent.time)
        }
        ,
        clockUpdater(that) {
            let u = function() {
                let t = that;
                var date = t.$parent.time,
                    hour = date.getHours(),
                    min = date.getMinutes(),
                    sec = date.getSeconds();

               t.hourDeg =t.percentageToDegree( t.numberToPercentage(hour, 24) );
               t.minsDeg =t.percentageToDegree( t.numberToPercentage(min, 60) );
               t.secsDeg =t.percentageToDegree( t.numberToPercentage(sec, 60) );
            }
            return u;
        }
        ,
        numberToPercentage(number = 0, max = 60) {
            return (number / max) * 100;
        }
        , percentageToDegree(percentage = 0) {
            return (percentage * 360) / 100;
        }
        , updateClock(){
            setInterval(this.clockUpdater(this), 1000);  
        }
    }
}
</script>


<style lang="scss" scoped>

$font-display: 'Libre Barcode 39 Text', cursive;
$font-text: 'Asap', sans-serif;

$foobar: rgb(1,1,1);
$white: #fff;
$black: #000;
$background: transparent;
$clock-col: rgb(200, 200, 200);
$accent-col: rgb(222, 222, 222);;
$dOpacity: .6;
$stepColor: rgb(255, 131, 0);
$stepColor1: transparent;
$ambientStepColor: rgb(109, 109, 109);

*, *::before, *::after{
  box-sizing: border-box;
}

#analog-clock {
  color: $foobar;
  background: $background;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock{
    position: relative;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    &:before{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        transform: translate(-50%, -50%);
        z-index: 99;
        border-radius: 50%;
        background-color: black;
    }
    .steps{
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -2px;
        height: 100%;
        width: 4px;
        &:before, &::after{
            content: '';
            position: absolute;
            left: 2px;
            width: 1px;
            height: 10px;
            background: $stepColor1;
            border-radius: 1px;
            opacity: $dOpacity;
        }
          &::before{
              top: .5rem;
          }
          &::after{
              bottom: .5rem;
          }
          &:nth-child(1){
              &::before, &::after{
                  background: $stepColor;
              }
          }
          &:nth-child(2){ transform: rotate(30deg); }
          &:nth-child(3){ transform: rotate(60deg); }
          &:nth-child(4){ 
              transform: rotate(90deg);
              &::before, &::after{
                  background: $stepColor;
              }
          }
          &:nth-child(5){ transform: rotate(120deg); }
          &:nth-child(6){ transform: rotate(150deg); }

      }
      .display{
          position: absolute;
          top: 6rem;
          left: 50%;
          transform: translateX(-50%);
          font-family: $font-display;
          font-size: 2.6em;
          opacity: .5;
      }
      .hour,
      .min,
      .sec{
          opacity: $dOpacity;
          z-index: 10;
          position: absolute;
          bottom: 50%;
          left: 50%;
          height: 40%;
          width: 3px;
          margin-left: -1.5px;
          background: $accent-col;
          transform-origin: bottom center;
          border-radius: 3px 3px 0 0;
      }
      .sec {
          width: 1px;
          margin-left: 0px
      }
      .hour{
          height: 23%;
      }
      .sec{
          height: 46%;
          background: $clock-col;
      }
      &.ambient {
          .a {
              &:before, &::after{
                  background-color: $ambientStepColor;

              }
          }
      }
  }

</style>
