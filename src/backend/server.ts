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