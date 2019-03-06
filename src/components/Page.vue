  <template>
    <div>
        <div class="page" v-bind:class=classObject v-bind:style=styleObject>
            <span class="pageTitle">{{ content.title }}</span>
            <span class="closePage" v-on:click=closePage><span>X</span></span>
            <div class="content">
                <div v-if="isType('Games')">
                    <snake></snake>
                </div>
                <div v-if="isType('Music')">
                    <p>Original playlist created on Spotify</p>
                    <iframe src="https://open.spotify.com/embed/user/idominatetm/playlist/74M6nIBY2Vd7sViFY17loQ" class="spotifyPlayer" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                </div>
                <div v-if="isType('Professional')">
                    <iframe class="full" src="resume/resume.html">
                        <p>Your browser does not support iframes.</p>
                    </iframe>
                </div>
                <div v-if="isType('Videos')">
                    <graphic-l-ink
                        v-for="link in links"
                        v-bind:key="link.id"
                        v-bind:content="link"
                    ></graphic-l-ink>
                    <!-- <div class="align-text">

                        <h3>YouTube</h3>
                        <p>The following are some YouTube channels that produce high quality content</p>
                        
                        <div class="half">
                            <a href="https://www.youtube.com/user/Kurzgesagt/featured">
                                <div class="graphic">
                                    <h1>Kurzgesagt</h1>
                                    <p></p>
                                </div>
                            </a>
                        </div>
                        <br/><a href=https://www.youtube.com/channel/UCqYPhGiB9tkShZorfgcL2lA>What I've Learned</a>
                        <br/><a href=https://www.youtube.com/channel/UC4QZ_LsYcvcq7qOsOhpAX4A>Cold Fusion</a>
                        <br/><a href=https://www.youtube.com/channel/UC2C_jShtL725hvbm1arSV9w>C.G.P. Grey</a>
                        
                    </div> -->
                </div>
                <div v-if="isType('')">
                    <h1>???</h1>
                </div>
            </div>
        </div>
        <div class="pageShadow" v-if="!isActive" v-bind:class=classObject v-bind:style=styleObject v-on:click=openPage></div>
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
    * {
        box-sizing: border-box;
    }

    .full {
        width: 100%;
        min-height: 600px;
        height: 90%;
    }
</style>