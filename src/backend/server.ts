import * as express from "express";
import { resolve } from "path";
import * as request from "request-promise-native";
import { Options } from "request";
import * as crypto from "crypto";

const IS_DEV = process.env.NODE_ENV === 'development'
if (IS_DEV) {
    console.log('Running in development mode.')
}

const base64Client = process.env['SPOTIFY_CLIENT'] ? Buffer.from(process.env['SPOTIFY_CLIENT'] as string).toString("base64") : "";
const port = process.env['LISTEN_PORT'] || 8080;
let apiToken: string;
let upcoming = {
    id: "74M6nIBY2Vd7sViFY17loQ",
    data: {},
    digest: ""
}
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

async function getSpotifyAccessToken(override?: boolean) : Promise<string> {
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
        console.log(error.message);
    });
    return apiToken || "";
}

async function getSpotifyPlaylist(id: string) {
    let playlist: { [key: string]: any } = {};
    let tracks: any[] = [];
    let playlistTrackOptions: request.OptionsWithUrl = {
        url: `${playlistApiBaseUrl}${id}`,
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

    async function requestPlaylist(url?: string): Promise<void> {
        if (url){
            playlistTrackOptions.url = url;
        }

        try {
            const res = await request.get(playlistTrackOptions);
            playlist.name = res.name || playlist.name;
            playlist.description = res.description || playlist.description;
            playlist.link = res?.external_urls?.spotify || playlist.link
            playlist.followers = res?.followers?.total || playlist.followers
            playlist.imageUrl = res.images ? res.images[0].url || playlist.imageUrl : playlist.imageUrl || "";
    
            await parseTracks(res.tracks || res);
            playlist.tracks = tracks;
        } catch (err) {
            if (err.statusCode === 401) {
                if (await getSpotifyAccessToken(true)){
                    await requestPlaylist(playlistTrackOptions.url as string);
                    return;
                }
            }
            console.log(err.message);
        }
    }

    await requestPlaylist();
    return playlist;
}

async function updatePlaylist() {
    const updated_data = await getSpotifyPlaylist(upcoming.id);
    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(updated_data));
    const new_digest = hash.digest("hex");
    if (new_digest !== upcoming.digest) {
        upcoming.data = updated_data;
        upcoming.digest = new_digest;
    }
}

async function startServer() {
    updatePlaylist();
    setInterval(() => {
        updatePlaylist();
    }, 1000 * 60 * 60 * 24);

    const app = express();

    app.get("/api/pages/default", function(_request, response) {
        response.json(default_pages);
    });

    app.get("/api/youtube", function(_request, response) {
        response.json(links);
    });

    app.get('/api/spotify/upcoming', async function (_request, response) {
        response.json(upcoming.data);
    });

    app.get('/api/gift-ideas', async function (_request, response) {
        response.json([
            {
                title: 'Mug Warmer',
                url: 'https://www.amazon.com/dp/B08HK468TG/ref=cm_sw_r_cp_apa_fabt1_odcSFbSQV5RYE?tag=alliwantforch-20'
            },
            {
                title: '"Hey Dude" Shoes',
                url: 'https://www.heydudeshoesusa.com/products/wally-sox-2?color=brown&variant=31219018924099',
                comments: 'I like pretty much all the colors, and size 10 should work'
            },
            {
                title: 'Bonsai Tree Starter Kit',
                url: 'https://www.amazon.com/dp/B07DRQ3382/ref=cm_gf_aAN_d_p0_qd0_B4osp0DJdTVdzInMwdfh?tag=alliwantforch-20'
            },
            {
                title: 'Telescope',
                url: 'https://www.amazon.com/dp/B081RJ8DW1/ref=cm_gf_aAN_d_p0_qd5_nbostmEHlSbB4gXCPI5S?tag=alliwantforch-20'
            },
            {
                title: 'Beanie',
                url: 'https://www.amazon.com/OZERO-Winter-Beanie-Fleece-Stocking/dp/B07H32RQSK/ref=sr_1_16?dchild=1&keywords=hats&qid=1605983491&sr=8-16&th=1&psc=1&tag=alliwantforch-20'
            },
            {
                title: 'Hats',
                url: 'https://www.hats.com/mens/textured-wool-baseball'
            },
            {
                title: 'Room Light',
                url: 'https://www.amazon.com/dp/B084DCF429/ref=cm_gf_aAN_d_p0_qd9_uYCcInWfSw6oQyKM32dr?th=1&tag=alliwantforch-20'
            }
        ]);
    });

    /* serves all the static files */
    app.get(/^(.+)$/, async function(req, res){ 
        if (IS_DEV) {
            const redirectHost = `http://${req.headers.host?.split(':')[0]}:8085`
            if (!/\./.test(req.params[0])) {
                res.send(await request.get(redirectHost))
                return
            }
            res.redirect(`${redirectHost}${req.params[0]}`)
            return
        }
        if (!/\./.test(req.params[0])) {
            res.sendFile('index.html', { root: resolve('./dist/build')});
            return
        }
        res.sendFile( `${__dirname}/build/${req.params[0]}`); 
    });
    
    app.listen(port, function () {
        console.log(`AlexBrausen.com is now being served on port ${port}`);
    });
}

startServer();