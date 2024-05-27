const express = require('express');
const app = express();
const fetch = require("node-fetch");

const cors = require("cors");
app.use(cors({
        origin: 'https://remoteaccess--startling-kelpie-5c183f.netlify.app/'
}));

app.get("/player/:name/seasonStats", async (req, res) => {
        const requestOptions = {
            method: 'GET',
        };
        const headers = {'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
        //TODO: limit player info result to 1 (loop through data removing based an anything null)
        let playerInfo = await fetch("https://balldontlie.io/api/v1/players?search="+req.params.name, requestOptions);
        let playerInfoJson = await playerInfo.json();
        try {
                let playerID = playerInfoJson.data[0].id;

                const playerSeasonStatsReq = await fetch("https://balldontlie.io/api/v1/season_averages?season=2022&player_ids[]=" + playerID, requestOptions);
                const playerSeasonStats = await playerSeasonStatsReq.json();
                //console.log(JSON.stringify(playerSeasonStats).substring(0,JSON.stringify(playerSeasonStats).indexOf('}')+1))
                //console.log('\n\n\n')
                let indexHelperInfo = JSON.stringify(playerInfoJson.data[0]);
                let indexHelperStats = JSON.stringify(playerSeasonStats.data[0]);

                res.write("{\"" + "data" + "\": [" + indexHelperInfo.substring(0, indexHelperInfo.length - 1) + ", " + indexHelperStats.substring(1) + "]}");
        }
        catch (error) {
                res.write("{\"" + "data" + "\": [{" +"\"first_name\": \"No Player Found\"" + "}]}");
        }
        const response = {
                statusCode: 200,
                headers:headers,
                body: res.end(),
        };
        return response;
});

app.listen(8081, function () {
    console.log("Example app listening at http://127.0.0.1:8081");
});
