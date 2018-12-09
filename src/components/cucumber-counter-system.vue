<template>
<div class="ccs" id="ccc" v-if="!$store.state.isAmbient">
  <transition name="fade">
    <div id="cucumber-overlay" v-if="cucumberOverlay" transition="expand">
      <div class="increment">
        <strong v-on:click="increment">+</strong>
      </div>
      <div class="counter-text">
        <strong v-on:click="toggleOverlay()">{{ displayCount }}</strong>
      </div>

      <div class="reset">
        <strong v-on:click="reset">x</strong>
      </div>
    </div>
  </transition>
  <img class="cucumber" :src="cucumberImage" v-on:click="toggleOverlay()">
</div>
</template>


<script>

export default {
    name: "cucumber-counter-system"
    , props: {
        cucumberCounter: {
            default: false
        }
    }
    , data() {
        return {
            cucumberImage: "./static/img/cucumber.png",
            cucumberOverlay: false,
            storageItemIdent: "cca",
            displayCount: 0,
        }
    }
    , created() {
        this.cucumberOverlay = false;

        this.displayCount = this.cc();
        if(isNaN(this.displayCount)) {
            this.setCounter(0);
        }
    }
    , watch: {
        count(o, n) {
            console.log("change", o, n);
        },
        cucumberCounter(o, n) {
            console.log("cc-a", o, n);
        },
    }
    , computed: {
        count: function() {
            return this.cc();
        }
    }
    , methods: {
        closeTimer: function(func, timr) {
            setTimeout(function() {
                func.call();
            }, timr||3000);
                       
        }
        ,
        setCounter: function(n) {
            let sc = localStorage.setItem(this.storageItemIdent, n);
            this.displayCount = n;
            console.log("setC", n);
            return 
        }
        ,
        cc: function() {
            let cc = parseInt(localStorage.getItem( this.storageItemIdent ));
            return cc;
        }
        ,
        toggleOverlay: function() {
            this.cucumberOverlay = !this.cucumberOverlay
            return this.cucumberOverlay;
        }
        ,
        closeOverlay: function() {
            this.cucumberOverlay = false;
            return this.cucumberOverlay;
        }
        ,
        increment: function() {
            console.log("increment");
            this.setCounter(this.cc()+1);
            let t = this;
            this.closeTimer(function(){ t.closeOverlay()});

        }
        ,
        reset: function() {
            console.log("r");
            this.setCounter(this.cc()-1);
        },
        // cucumberCounter: function() {
        //     return this.cc();
        // }
    }

}
</script>


<style lang="scss" scoped>

@import '../variables.sass';


.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#cucumber-overlay {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 100%;
    z-index: 1999;

    .counter-text {
        position: absolute;
        top: 150px;
        font-size: 48px;
        width: 100%;
        height: 60px;
        strong {
            background-color: rgba(0, 200, 0, .4);
            border-radius: 5px;
            padding: 10px;
        }
    }

    .increment {
        height: calc(50% - 50px);
        padding-top: 20px;
        line-height: 100px;
        strong {
            background-color: rgba(0, 200, 0, .4);
            padding: 20px;
            border-radius: 10px;
        }

    }

    .reset {
        position: absolute;
        bottom: 15px;
        height: 40px;
        width: 100%;
        strong {
            background-color: rgba(200, 0, 0, .4);
            border-radius: 10px;
            padding: 20px;
        }
    }
}


#ccc {
    background-color: red;
    img.cucumber {
        position: absolute;
        top: calc(50% - 10px);
        right: 80px;
        z-index: 1999;
        max-width: 30px;
        transform: rotate(120deg);
        cursor: pointer;
        opacity: .5;
    }
    
}

</style>
