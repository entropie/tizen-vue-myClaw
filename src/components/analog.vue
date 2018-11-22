<template>
<div id="analog-clock">
  <div class="clock"  v-bind:class="{ambient: isAmbient}">
    <div class="numbers" v-bind:class="{nodate: !$parent.showDate}">
      <div class="nr" v-for="n in numbers">
        <span :class="'nr' + n">{{ n }}</span>
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
// https://codepen.io/Paolo-Duzioni/pen/XeXdbm/
export default {
    name: "analog-clock"

    , data() {
        return {
            appTitle: 'Vue Clock',
            hourDeg: '0',
            minsDeg: '0',
            secsDeg: '0',
            numbers: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0]
            
        }
    }
    , created(){
    }
    , computed: {
        isAmbient: function() {
            return this.$store.state.isAmbient;
        },
        time() {
            return this.$parent.time;
        }
    }
    , watch: {
        time(o,n) {
            this.update();
        }
    }
    , beforeDestroy() {
    }
    , methods: {
        clockUpdater() {
            let t = this;
            var date = t.time,
                hour = date.getHours(),
                min = date.getMinutes(),
                sec = date.getSeconds();

            t.minsDeg =t.percentageToDegree( t.numberToPercentage(min, 60) + t.numberToPercentage(sec, 60)/60/24);
            t.hourDeg =t.percentageToDegree( t.numberToPercentage(hour, 24)  + t.numberToPercentage(min, 60)/24);
            t.secsDeg =t.percentageToDegree( t.numberToPercentage(sec, 60) );
        }
        ,
        numberToPercentage(number = 0, max = 60) {
            return (number / max) * 100;
        }
        , percentageToDegree(percentage = 0) {
            return (percentage * 360) / 100;
        }
        , update() {
            this.clockUpdater();
        }
    }
}
</script>


<style lang="scss" scoped>

@import '../variables.sass';
        
*, *::before, *::after{
  box-sizing: border-box;
}

#analog-clock {
  background: $containerBackgroundColor;
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
        background: $analogDotBackground;
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
            font-size: $analogNumbersFontSize;
            font-family: $analogNumbersFontFamily;;
            padding-top: 30px;
            @each $n in 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24 {
                $amt:360/24*$n - 6;
                &:nth-child(#{$n}){
                    transform: rotate($amt+deg);
                    span{
                        border: $analogNumbersBorder;
                        box-shadow: $analogNumbersBoxShadow;
                        text-shadow: $analogNumbersTextShadow;
                        width: 30px;
                        display:block;
                        border-radius: 25%;
                        padding: 3px;
                        transform:rotate( (-$amt)+deg);
                        background-color: $analogNumbersBackgroundColor;
                        color: $analogNumbersColor;
                        &.nr6 {
                            display: none;
                        }
                    }
                }
                &:nth-child(odd) {
                    span {
                        display: none;
                    }
                    
                }
            }
        }

    }
    .nodate {
        .nr6 {
            display: block !important;
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
            border-radius: 1px;
            margin-bottom: 4px;
            z-index: 1000;
        }
          &::before{
              top: 12px;
          }
          &::after{
              bottom: 8px;
          }
          &::before, &::after {
              background: green;
              /*
               * margin-top: 8px;
               * margin-bottom: 8px;
               */
              height: 3px;
              border-radius: 50%
          }
          &:nth-child(1){
              &::before, &::after{
                  background: $analogAncentColorMain;

              }
          }
          &:nth-child(2){ transform: rotate(30deg); }
          &:nth-child(3){ transform: rotate(60deg); }
          &:nth-child(4){ 
              transform: rotate(90deg);
              &::before, &::after{
                  background: $analogAncentColorMain;

              }
          }
          &:nth-child(5){ transform: rotate(120deg); }
          &:nth-child(6){ transform: rotate(150deg); }
          &:nth-last-child(6) {
              &::before, &::after{
                  background: $analogAncentColorMain;

              }
          }

      }
      .display{
          position: absolute;
          top: 6rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 2.6em;
          opacity: .5;
      }

      .secBg, .minBg, .hourBg {
          z-index: 99;
          position: absolute;
          bottom: 50%;
          left: 50%;
          height: 38%;
          width: 4px;
          margin-left: 4px;
          transform-origin: bottom center;
          border-radius: 3px 3px 0 0;
          z-index: 20;
          opacity: .5;
          &.isAmbient {
              opacity: .3;
          }
      }
      .minBg, .hourBg {
      }
      .secBg {
          background-color: $analogNeedleSecondsShadowColor;
          height: $analogNeedleSecLength;
          margin-left: 2px;
      }
      .hourBg {
          height: 24%;
          height: $analogNeedleHourLength;
          width: 6px;
          margin-left: 3px;
          background-color: $analogNeedleShadowColor;
      }
      .minBg {
          background-color: $analogNeedleShadowColor;
          height: $analogNeedleMinLength;
      }
      .hour,
      .min,
      .sec{
          opacity: $analogNeedleOpacity;
          z-index: 10;
          position: absolute;
          bottom: 50%;
          left: 50%;
          width: 4px;
          margin-left: -2px;
          transform-origin: bottom center;
          border-radius: 3px 3px 0 0;
          z-index: 50;
          background-color: $analogNeedleBackgroundColor;
          &.isAmbient {
              background-color: $analogNeedleAmbientColor;
              box-shadow: none;
          }

      }
      .hour{
          height: $analogNeedleHourLength;                    
          width: 6px;
          margin-left: -3px;
          box-shadow: 0 0 2px 2px $analogNeedleColor; 
      }
      .min{
          height: $analogNeedleMinLength;
          box-shadow: 0 0 2px 2px $analogNeedleColor; 
      }
      .sec{
          height: $analogNeedleSecLength;
          width: 1px;
          margin-left: 0;
          box-shadow: 0 0 1px 1px $analogNeedleSecondsColor;
          background-color: $analogNeedleSecondsBackgroundColor;
      }
      &.ambient {
          .steps {
              &:before, &::after{
                  background-color: $analogAncentAmbientColor;

              }
          }
          .numbers .nr span {
              color: $analogNumbersAmbientColor;
              background-color: $analogNumbersAmbientBackgroundColor;

          }
      }
  }

</style>
