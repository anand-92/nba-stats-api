const express = require('express');
const app = express();
const fetch = require("node-fetch");

const cors = require("cors");
app.use(cors({
        origin: '*'
}));

app.get("/player/:name/seasonStats", async (req, res) => {
        const requestOptions = {
            method: 'GET',
                headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `8164e6c8-9e68-4c31-929c-1872397034da`  // Replace with your actual API key
                }
        };
        const headers = {'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
        //TODO: limit player info result to 1 (loop through data removing based an anything null)
        let playerInfo = await fetch("https://api.balldontlie.io/v1/players?search="+req.params.name, requestOptions);
        let playerInfoJson = await playerInfo.json();
        console.log(playerInfoJson)
        try {
                let playerID = playerInfoJson.data[0].id;

                const playerSeasonStatsReq = await fetch("https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=" + playerID, requestOptions);
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
