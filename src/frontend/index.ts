import Vue from "vue";
import SiteMaster from "./components/SiteMaster.vue";

window.onload = function() {
  let master = new Vue({
      el:'#master',
      template:`
        <SiteMaster></SiteMaster>
      `,
      components: {
          SiteMaster
      }
  });
}
