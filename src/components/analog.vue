<template>
<div id="analog-clock">
  <div class="clock"  v-bind:class="{ambient: isAmbient}">

    <div class="numbers">
      <div class="nr" v-for="n in numbers">
        <span>{{ n }}</span>
      </div>
    </div>

    <div class="stepsbox">
      <div class="steps a"></div>
      <div class="steps"></div>  
      <div class="steps"></div>
      <div class="steps a"></div>
      <div class="steps"></div>
      <div class="steps"></div>
    </div>

    <div class="chBg hourBg" v-bind:class="{ isAmbient }" v-bind:style="{transform: 'rotate(' + hourDeg + 'deg)'}"></div>
    <div class="hour" v-bind:class="{ isAmbient }" v-bind:style="{transform: 'rotate(' + hourDeg + 'deg)'}"></div>

    <div class="chBg minBg" v-bind:class="{ isAmbient }" v-bind:style="{transform: 'rotate(' + minsDeg + 'deg)'}"></div>
    <div class="min" v-bind:class="{ isAmbient }" v-bind:style="{transform: 'rotate(' + minsDeg + 'deg)'}"></div>

    <div v-if="!isAmbient" class="chBg secBg" v-bind:style="{transform: 'rotate(' + secsDeg + 'deg)'}"></div>
    <div v-if="!isAmbient" v-bind:style="{transform: 'rotate(' + secsDeg + 'deg)'}" class="sec" ></div>


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
            secsDeg: '0deg',
            clockInterval: undefined,
            numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
            
        }
    }
    , created(){
        this.startClock();
    }
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        }
    }
    , beforeDestroy() {
        if(this.clockInterval) {
            clearInterval(this.clockInterval);
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

                t.minsDeg =t.percentageToDegree( t.numberToPercentage(min, 60) + t.numberToPercentage(sec, 60)/60/24);
                t.hourDeg =t.percentageToDegree( t.numberToPercentage(hour, 24)  + t.numberToPercentage(sec, 60)/24);
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
        , startClock(){
            this.clockInterval = setInterval(this.clockUpdater(this), 1000);  
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
$accentCol: rgba(0, 0, 0, .5);
$shadowColor: rgba(13, 45, 15, .5);


$dOpacity: 1;
$stepColor: rgb(255, 131, 0);
$stepColor1: transparent;

$highlightColor: rgb(116, 188, 45);
$ambientColor: #AAA;
$ambientStepColor: rgb(109, 109, 109);
$ambientShadowColor: #555;

$clockhandSecondColor: rgb(255, 187, 0);
$clockhandSecondColorAmbient: rgb(104, 76, 0);

$numbersColor: #333;

$w: 360px;
$h: 360px;
        
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
    width: $w;
    height: $h;
    border-radius: 50%;
    overflow: hidden;    
    z-index: 10;
    &:before{
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        z-index: 99;
        border-radius: 50%;
        background-color: black;
    }
    .stepsbox {
        position: relative;
        width: $w;
        height: $h;
        border-radius: 50%;
        z-index: 25;
    }
    .numbers {
        position: relative;
        right: -50%;
        z-index: 19;
        .nr {
            position: absolute;
            height: $h/2;
            transform-origin: 0 100%;
            font-size: 18px;
            font-family: monospace;

            color: white;
            padding-top: 30px;
            width: 15px;
            color: $numbersColor;
            /* background-color: red; */
            @each $n in 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25 {
                $amt:360/24*$n - 2;
                &:nth-child(#{$n}){
                    transform: rotate($amt+deg);
                    span{
                        line-height: 1px;
                        display:block;
                        transform:rotate( (-$amt)+deg);
                    }
                }
            }
        }

    }
    .steps{
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -2px;
        height: 100%;
        width: 4px;
        z-index: 20;
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

      .secBg, .minBg, .hourBg {
          z-index: 99;
          position: absolute;
          bottom: 50%;
          left: 50%;
          height: 40%;
          width: 4px;
          margin-left: 4px;
          transform-origin: bottom center;
          border-radius: 3px 3px 0 0;
          background-color: rgba($clockhandSecondColorAmbient, .2);
          
          z-index: 49;
          &.isAmbient {
              opacity: .3;
          }
      }
      .minBg, .hourBg {
          background-color: rgba($highlightColor, .3);
      }



      .secBg {
          height: 47%;
          margin-left: 2px;
      }
      .hourBg {
          height: 24%;
          width: 6px;
          margin-left: 3px;
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
          width: 4px;
          margin-left: -2px;
          background: $accentCol;
          transform-origin: bottom center;
          border-radius: 3px 3px 0 0;
          z-index: 50;

          &.isAmbient {
              background-color: $ambientColor;
              box-shadow: none;
          }

      }
      .hour{
          height: 23%;
          width: 6px;
          margin-left: -3px;
          box-shadow: 0 0 2px 2px $highlightColor;
      }
      .min{
          box-shadow: 0 0 2px 2px $highlightColor;
      }
      .sec{
          height: 46%;
          width: 1px;
          margin-left: 0;
          box-shadow: 0 0 1px 1px $clockhandSecondColor;
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
