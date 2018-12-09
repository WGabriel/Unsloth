

const request = require('request');
const express = require('express');
const path = require('path');
const fs=require("fs");
var pictureUploaded = 0;
var slothiness;

var app = express();
app.use(express.static(path.join(__dirname, 'unsloth-dist', 'css')));
app.use(express.static(path.join(__dirname, 'unsloth-dist', 'fonts')));
app.use(express.static(path.join(__dirname, 'unsloth-dist', 'img')));
app.use(express.static(path.join(__dirname, 'unsloth-dist', 'js')));
app.use(express.static(path.join(__dirname, 'unsloth-dist')));



// Replace <Subscription Key> with your valid subscription key.

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false';

// Request parameters.
const params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'emotion'
};




app.post('/evaluateFace', function(req, res) {
    const options = {
        uri: uriBase,
        qs: params,
        body: req,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : '177059b8a0e7408c9f8f291210915e6f'
        }
    };
    request.post(options, (error, response, body) => {
        if (error) {
            console.log('Error: ', error);
            return;
        }
        let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
        if (jsonResponse.includes("error")) {
            pictureUploaded = -1;
        } else {
            pictureUploaded = 1;
        }
        jsonObject = JSON.parse(body);
        if (jsonObject[0]["faceAttributes"]["emotion"]["happiness"] > 0.7) {
            userData ={"slothiness" :{"text":"Awesome", "className":"c-btn--success"},
                "Tasks": {"1":{"prioClass": "c-task--success", "caption": "Case Study schreiben", "type": "Universität", "date": "10.12.2018"},
                    "2":{"prioClass": "c-task--success", "caption": "Einladungsschreiben verschicken", "type": "Winterball", "date": "10.12.2018"},
                    "3": {"prioClass": "c-task--warning", "caption": "Programmieraufgabe", "type": "Praktische Übung", "date": "11.12.2018"},
                    "4": {"prioClass": "c-task--warning", "caption": "Übungsblatt Mathe Tutorium", "type": "Universität", "date": "12.12.2018"},
                    "5": {"prioClass": "c-task--danger", "caption": "Zusammenfassung Intercultural Business Communication", "type": "Universität", "date": "13.12.2018"},
                    "6": {"prioClass": "c-task--danger", "caption": "Fall zur Einkommensteuer", "type": "Universität", "date": "15.12.2018"}}};
        } else if (jsonObject[0]["faceAttributes"]["emotion"]["neutral"] > 0.7){
            userData ={"slothiness" :{"text":"Potential", "className":"c-btn--warning"},
            "Tasks": {
              "1": {"prioClass": "c-task--success", "caption": "Übungsblatt Mathe Tutorium", "type": "Universität", "date": "12.12.2018"},
              "2": {"prioClass": "c-task--success", "caption": "Case Study schreiben", "type": "Universität", "date": "10.12.2018"},
              "3": {"prioClass": "c-task--warning", "caption": "Programmieraufgabe", "type": "Praktische Übung", "date": "11.12.2018"},
              "4": {"prioClass": "c-task--warning", "caption": "Fall zur Einkommensteuer", "type": "Universität", "date": "15.12.2018"},
              "5": {"prioClass": "c-task--danger", "caption": "Einladungsschreiben verschicken", "type": "Winterball", "date": "10.12.2018"},
              "6": {"prioClass": "c-task--danger", "caption": "Zusammenfassung Intercultural Business Communication", "type": "Universität", "date": "13.12.2018"},
              }};
        } else {
          userData ={"slothiness" :{"text":"Danger", "className":"c-btn--danger"},
          "Tasks": {
            "1": {"prioClass": "c-task--success", "caption": "Fall zur Einkommensteuer", "type": "Universität", "date": "15.12.2018"},
            "2": {"prioClass": "c-task--success", "caption": "Einladungsschreiben verschicken", "type": "Winterball", "date": "10.12.2018"},
            "3": {"prioClass": "c-task--warning", "caption": "Programmieraufgabe", "type": "Praktische Übung", "date": "11.12.2018"},
            "4": {"prioClass": "c-task--warning", "caption": "Übungsblatt Mathe Tutorium", "type": "Universität", "date": "12.12.2018"},
            "5": {"prioClass": "c-task--danger", "caption": "Zusammenfassung Intercultural Business Communication", "type": "Universität", "date": "13.12.2018"},
            "6": {"prioClass": "c-task--danger", "caption": "Case Study schreiben", "type": "Universität", "date": "10.12.2018"},
          }};
          }
        console.log(JSON.stringify(jsonObject[0]["faceAttributes"]["emotion"]));
        res.send();
    });
});

app.get('/getUserData', function(req, res){

res.json(userData);
});

app.get('/', function(req,res) {

    if (pictureUploaded > 0) {
        filePath = __dirname + '/unsloth-dist/interface.html';
        res.sendFile(filePath);
    }
    else {
        filePath = __dirname + '/unsloth-dist/start.html';
        res.sendFile(filePath);
    }


});


app.get('/reset', function (req,res) {
    pictureUploaded = 0;
    res.redirect("/");
})



app.listen(process.env.PORT || 1337);
