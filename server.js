const express = require('express');
const path = require('path');
const fs = require('fs');
const req = require('express/lib/request');
const res = require('express/lib/response');
const { json } = require('express/lib/response');

const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname + '/index.html'))
})

app.get('/nezelodo', (req, res) =>{
    fs.readFile('adatok.csv', (err, data)=>{
        if(err){
            res.status(500).send('Hiba a fájl megnyitásakor!')
        }
        else{
            var content = data.toString().trim();
            var records = content.split('\n');

            var str = '<table border="1"><thead><tr><th>Név</th><th>Osztály</th><th>Lakcím</th><th>Kor</th></tr></thead><tbody>'
            var i = 0

            records.forEach(record =>{                
                var datas = record.split(';')
                datas.forEach(data =>{
                    str += '<td>' + data + '</td>'
                })
                str += '</tr>'
            });
            str+= '</tbody></table>'
            res.status(200).send(str);
        }
    })
})

app.post('/senddata', (req, res)=>{
    /*
    var name = req.body.name
    var osztaly = req.body.osztaly
    var lakcim = req.body.lakcim
    var kor = req.body.kor
    */

    var adatok = [];
    var adat = {
        "name" : req.body.name,
        "osztaly" : req.body.osztaly,
        "lakcim" : req.body.lakcim,
        "kor" : req.body.kor
    }

    adatok.push(adat);

    fs.readFile('adatok.json', (err, data)=>{
        if(err)
        {
            res.status(500).send('Hiba a fájl olvasása közben')
        }
        else
        {           
            adatok = JSON.parse(data);

            var adat =  {
                "name" : req.body.name,
                "osztaly" : req.body.osztaly,
                "lakcim" : req.body.lakcim,
                "kor" : req.body.kor
            }

            adatok.push(adat);

            fs.appendFile('adatok.json', json.stringify(adatok), (err)=>{
                if(err){
                    res.status(500).send('Hiba a fájl mentése közben')
                } else{
                    res.status(200).send('Adatok elmentve')
                }
            })
        }
    })

/*
    fs.appendFile('adatok.csv', `${name};${osztaly};${lakcim};${kor}\n`, (err)=>{
        if(err){
            res.status(500).send('Hiba a fájl mentése közben')
        } else{
            res.status(200).send('Adatok elmentve')
        }
    })
    */
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});