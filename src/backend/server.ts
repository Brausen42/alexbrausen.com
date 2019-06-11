import * as express from "express";
import { resolve } from "path";
import * as request from "request-promise-native";
import { Options } from "request";

const base64Client = process.env['SPOTIFY_CLIENT'] ? Buffer.from(process.env['SPOTIFY_CLIENT'] as string).toString("base64") : "";
const port = process.env['LISTEN_PORT'] || 8080;
let apiToken: string;
let playlist: { [key: string]: any } = {};
const playlistId = "74M6nIBY2Vd7sViFY17loQ";
const playlistApiBaseUrl = "https://api.spotify.com/v1/playlists/";

const default_pages = ["Games", "Music", "Professional", "Videos"];

const links = [
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

let getSpotifyAccessToken = async (override?: boolean) : Promise<string> => {
    if (apiToken && !override) {
        return apiToken;
    }
    let options: Options = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            "Authorization": `Basic ${base64Client}`,
            "Accept": "application/json"
        },
        form: {
            "grant_type": "client_credentials"
        }
    }
    await request.post(options).then((res: any) => {
        let body = JSON.parse(res);
        apiToken = body.access_token;
    }).catch((error: any) => {
        console.log(error);
    });
    return apiToken || "";
}

let app = express();
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: resolve('./dist/')});
});

app.get("/api/pages/default", function(_request, response) {
    response.json(default_pages);
});

app.get("/api/youtube", function(_request, response) {
    response.json(links);
});

app.get('/api/spotify/upcoming', async function (_request, response) {
    let tracks: any[] = [];
    let playlistTrackOptions: request.OptionsWithUrl = {
        url: `${playlistApiBaseUrl}${playlistId}`,
        auth: {
            bearer: await getSpotifyAccessToken()
        },
        json: true
    }

    async function parseTracks(tracksObj: any) {
        tracksObj.items.forEach((item: any) => {
            let artists: any[] = [];
            item.track.artists.forEach((artist: any) => {
                artists.push(artist.name);
            })
            tracks.push({name: item.track.name, artists: artists, popularity: item.track.popularity})
        });
        if(tracksObj.next){
            await requestPlaylist(tracksObj.next);
        }
    }

    async function requestPlaylist(url?: string): Promise<any> {
        if (url){
            playlistTrackOptions.url = url;
        }

        await request.get(playlistTrackOptions).then(async (res: any) => {
            playlist.name = res.name || playlist.name;
            playlist.description = res.description || playlist.description;
            playlist.imageUrl = res.images ? res.images[0].url || playlist.imageUrl : playlist.imageUrl || "";
    
            await parseTracks(res.tracks || res);
            playlist.tracks = tracks;
        }).catch(async (err) => {
            if (err.statusCode === 401) {
                if (await getSpotifyAccessToken(true)){
                    return await requestPlaylist(playlistTrackOptions.url as string);
                }
            }
            console.log(err);
            playlist.error = err.message;
        });
    }

    await requestPlaylist();
    response.json(playlist);
  });

 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){ 
    console.log('static file request : ' + req.params[0]);
    res.sendFile( __dirname + req.params[0]); 
});
 
app.listen(port, function () {
  console.log(`AlexBrausen.com is now being served on port ${port}`);
});