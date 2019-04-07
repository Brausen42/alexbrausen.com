  <template>
    <div>
        <div v-bind:id=pageId class="page" v-bind:class=classObject v-bind:style=styleObject>
            <span class="pageTitle">{{ content.title }}</span>
            <span class="closePage pageContent" v-bind:style=pageContentStyle v-on:click=closePage><span>X</span></span>
            <div class="pageContent transitions" v-bind:style=pageContentStyle>
                <div v-if="isType('Games')">
                    <snake></snake>
                </div>
                <div v-if="isType('Music')">
                    <a href="https://open.spotify.com/embed/user/idominatetm/playlist/74M6nIBY2Vd7sViFY17loQ">Upcoming: Original playlist created on Spotify</a>
                </div>
                <div v-if="isType('Professional')">
                    <p>This is a personal website, mainly used as a way to experiment with different technologies and make something hopefully interesting.</p>

                    <h2>Stack</h2>

                    <p>The current stack consists of a Vue.js frontend built using Typescript and SCSS, which is then webpacked and put alongside the HTML. This has some links out to other websites I've made in the past using simple HTML, CSS, and pureJS. All these files are layered on an alpine NGINX Docker image so they can be served to requesters.</p>

                    <h2>Depoloyment</h2>
                    <p>I'm currently deploying this site through Digital Ocean and it's Kubernetes support. The Kubernetes cluster deploys the Stack above into pods and uses a LoadBalancer, Ingress control and the cert-manager project to securely run the site in a way that is easy to do continuous integration and deployment (CI/CD) by updating the docker image and deployment spec.</p>

                    <h2>Future</h2>
                    <p>There's a lot that I would hope to do with this site. Here's a list of potential improvements in a roughly priority-based order:</p>
                    <ul>
                        <li>Transition the linked sites to be natively in the site</li>
                        <li>Use the Spotify REST api to display the Spotify playlist in a more elegant fashion than an iframe. This would be done in such a way that could be extended to interact with the playlist in an interesting way (like specific songs, suggest songs, strip out songs by genre, etc.)</li>
                        <li>Overall, include more content on the site so it's less of a tech demo</li>
                    </ul>
                    <a href="resume/resume.html">Here's a site that contains a slightly outdated resume</a>
                </div>
                <div v-if="isType('Videos')">
                    <graphic-l-ink
                        v-for="link in links"
                        v-bind:key="link.id"
                        v-bind:content="link"
                    ></graphic-l-ink>
                </div>
                <div v-if="isType('')">
                    <h1>???</h1>
                </div>
            </div>
        </div>
        <div class="pageShadow transitions" v-if="!isActive" v-bind:class=classObject v-bind:style=styleObject v-on:click=openPage></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Snake from "./Snake.vue";
import GraphicLInk from "./GraphicLInk.vue";

enum Type {
    Games = "Games",
    Music = "Music",
    Professional = "Professional",
    Videos = "Videos",
    Undefined = ""
}

enum Form {
    Bubble,
    Open
}

export default Vue.extend({
    props: ['content','isWelcomed','activeID'],
    data(){
        return {
            pageContentOpacity: 0.0,
            show: false,
            form: Form.Bubble,
            type: Type.Undefined,
            links: [
                {
                    id: 0, title:"Kurzgesagt",
                    description:"Insightful animated teachings about a variety of topics that are always approached from a scientific perspectic",
                    link:"https://www.youtube.com/user/Kurzgesagt/featured",
                    background: "https://kurzgesagt.org/wp-content/themes/kurzgesagt/library/images/svg/about-header.svg"
                },
                                {
                    id: 1, title:"What I've Learned",
                    description:"Well researched deep dives into health related self improvement subjects",
                    link:"https://www.youtube.com/channel/UCqYPhGiB9tkShZorfgcL2lA",
                    background:"https://c10.patreonusercontent.com/3/eyJ3IjoyMDB9/patreon-media/p/campaign/493308/059664acb97743c5b96a6eefc87b8be1/1?token-time=2145916800&token-hash=ApQAlXl5QiLZbjbQ-RKZjLXTyfvXQ4vcuBsJ3wkCqhI%3D"
                },
                                {
                    id: 2, title:"Cold Fusion",
                    description:"Technology focused overviews of cool breakthroughs, and the history of big tech companies",
                    link:"https://www.youtube.com/channel/UC4QZ_LsYcvcq7qOsOhpAX4A",
                    background:"https://yt3.ggpht.com/a-/AAuE7mBoaXsxIDEQkaAomqKD5g6C8MbA0fcupdXmKA=s288-mo-c-c0xffffffff-rj-k-no"
                },
                                {
                    id: 3, title:"C.G.P. Grey",
                    description:"Logical approaches to a mosh-posh of interesting concepts",
                    link:"https://www.youtube.com/channel/UC2C_jShtL725hvbm1arSV9w",
                    background:"https://yt3.ggpht.com/a-/AAuE7mCZH_J-Vsd5-_-05hR8Ch4SfbgrbqkbaWvfpQ=s288-mo-c-c0xffffffff-rj-k-no"
                }
            ]
        }
    },
    computed:{
        classObject:function(){
            return {
                hidden:this.hidden,
                open:this.form == Form.Open,
                bubble:this.form == Form.Bubble,
                transitions:true
            }
        },
        styleObject(): Object {
            if (this.isActive) {
                return {
                    top:'10px',
                    left:'10px'
                }
            }
            else {
                return {
                    top:'calc(50% + ' + ((175 * Math.sin(this.content.id*(Math.PI/2))) - 100).toFixed(2) + 'px)',
                    left:'calc(50% + ' + ((175 * Math.cos(this.content.id*(Math.PI/2))) - 100).toFixed(2) + 'px)'
                }
            }
        },
        pageContentStyle(): Object {
            return {
                opacity: this.pageContentOpacity
            }
        },
        isActive() : boolean {
            return this.form == Form.Open;
        },
        hidden() : boolean {
            if (this.isWelcomed){
                if(this.activeID == null){
                    return false;
                }
                return this.content.id != this.activeID;
            }
            return true;
        },
        pageId(): string {
            let self = this;
            setTimeout(function() { // pageId needs to propogate before this can be added
                let pageEl = document.getElementById(self.pageId);
                if (pageEl != null) {
                    pageEl.addEventListener("transitionend", function() {
                        if (self.isActive) {
                            self.pageContentOpacity = 1.0;
                        } else {
                            self.pageContentOpacity = 0.0;
                        }
                    });
                }
            }, 100);
                
            return this.content.title + "Page"
        }
    },
    methods:{
        openPage:function(){
            this.form = Form.Open;
            this.$emit('set-active', this.content.id);
        },
        closePage:function(){
            this.form = Form.Bubble;
            this.$emit('set-active', null);
        },
        isType(type : string) : boolean {
            return type == this.type;
        }
    },
    created(){
        // set Type
        switch (this.content.title) {
            case "Games":
                this.type = Type.Games;
                break;
            case "Music":
                this.type = Type.Music;
                break;
            case "Professional":
                this.type = Type.Professional;
                break;
            case "Videos":
                this.type = Type.Videos;
                break;
            default:
                this.type = Type.Undefined;
                break;
        }
    },
    components: {
        Snake,
        GraphicLInk
    }
});
</script>

<style lang="scss">
@import '../../style';

* {
    box-sizing: border-box;
}


.pageShadow {
  position: absolute;
  &:hover {
    cursor: pointer;
    @include glow(30px,white);
  }
}

.page {
  * {
    color:$backColor;
  }
  > div {
    background-color: $foreColor;
  }
  position: absolute;
  background-color: $foreColor;
  color:$backColor;
}

.open {
  width:calc(100% - 20px);
  min-height: 95%;
  height:auto;
  border-radius:10px;
  .pageTitle {
    font-size: 30px;
  }
}

.bubble {
  height:$bubbleSize;
  width:$bubbleSize;
  border-radius: 50%;
  .pageTitle {
    font-size: 40px;
    @include center();
  }
  .pageContent {
    display: none;
  }
}

.closePage {
  transition: all 1s;
  height:$closeSize;
  width:$closeSize;
  position: absolute;
  background-color: lightgray;
  border-radius: 50%;
  top: 10px;
  right: 10px;
  > span {
    color: red;
    font-size: 20px;
    font-weight: 100;
    @include center();
  }
  &:hover {
    @include glow(25px,$accentColor);
    cursor: pointer;
    span {
      font-weight: 1000;
    }
  }
}
</style>