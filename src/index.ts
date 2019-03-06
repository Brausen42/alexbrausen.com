import Vue from "vue";
import Page from "./components/Page.vue";

window.onload = function() {
  let master = new Vue({
      el:'#master',
      template:`
      <div>
          <title>Welcome</title>
          <div id="title">
              <h1>AlexBrausen.com</h1>
          </div>
          <div id="welcome" v-on:click="welcome">
              <span>Welcome</span>
              <p>This website is currently in a prototyping phase.\n The experience on a mobile device has not been tested.</p>
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
      `,
      data:{
        isWelcomed : false,
        activeID: null,
        pages: Array<Object>()
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
}
