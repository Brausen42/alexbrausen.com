<template>
    <div>
        <title v-text="title"></title>
        <div id="siteHeader">
            <h1>AlexBrausen.com</h1>
        </div>
        <div id="welcome" v-on:click="welcome">
            <span>Welcome</span>
            <p>This website is currently in a prototyping phase.<br/> The experience on a mobile device has not been tested.</p>
        </div>
        <page
            v-for="page in pages"
            v-bind:key="page.id"
            v-bind:isWelcomed="isWelcomed"
            v-bind:activeID="activeID"
            v-bind:content="page"
            v-on:set-active="activeID = $event"
        ></page>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Page from "./Page.vue"

interface PageObject {
    id: number,
    title: string
}

export default Vue.extend({
    data() {
        return {
            isWelcomed : false,
            activeID: null as null|number,
            pages: Array<PageObject>()
        }
    },
    computed:{
        title: function() : string {
            return this.activeID != null ? this.pages[this.activeID].title : "Welcome";
        }
    },
    created(){
        let ii = 0;
        for (let page of ["Games","Music","Professional","Videos"]) {
            let _title = page;
            let _id = ii;
            this.pages.push(
            {
                id: _id,
                title: _title,
            }
            );
            ii++;
        }
    },
    methods: {
        welcome: function(){
            let welcomeView : any = document.getElementById('welcome');
            if ((welcomeView != null) && (welcomeView.style != null)) {
                welcomeView.style.width = 0;
                welcomeView.style.height = 0;
                welcomeView.style.opacity = 0;
                welcomeView.style.fontSize = '0em';
            }
            this.isWelcomed = true;
        }
    },
    components: {
        Page
    }
});
</script>

<style lang="scss">
@import '../style';

* {
  font-family: 'Poiret One', cursive;
  box-sizing: border-box;
}

body {
  background-color: $backColor;
}

div {
  padding: 10px;
}

// class styling

.transitions {
  transition: all 1.5s ease-out;
}

.hidden {
  visibility: hidden;
  opacity: 0.0;
}

// id styling

#siteHeader {
  color:$accentColor;
}

#welcome {
  @include gradient-radial($foreColor,$accentColor);
  @include center();
  transition: all 2s;
  height:$circleSize;
  width:$circleSize;
  border-radius: 50%;
  text-align: center;
  span {
    @include center();
    font-size: 500%;
  }
  p {
    position: absolute;
    top: $circleSize;
    color: $foreColor;
  }
  &:hover {
    cursor: pointer;
    @include glow(30px,white);
  }
}
</style>