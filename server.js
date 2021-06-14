const express = require("express");
const cors = require("cors");
const axios = require("axios");

const server = express()
require('dotenv').config();
server.use(cors());
server.use(express.json());

const mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/digimon',{ useNewUrlParser: true, useUnifiedTopology: true });
 

const PORT = process.env.PORT;


class Digimon{
    constructor(data){
        this.name = data.name,
        this.img= data.img,
        this.level= data.level
    }
}

const digimonSchema = new mongoose.Schema({
    name:String,
    img:String,
    level:String
})


const digimonModel = mongoose.model('digimon', digimonSchema)


server.get('/digimon', digimonHandler);
server.post('/addFavDijimon', addFavDijimonHandler);
server.get('/getFavDigimon', getFavDigimonHandler);
server.delete('/deletedigimon', deleteDigimonHandler);
server.put('/updateDigimon', updateDigimonHandler);


function digimonHandler(req, res) {

    // const name = req.query.name;
    // const img = req.query.img;
    // const level= req.query.level

    const url = `https://digimon-api.vercel.app/api/digimon`;

    axios.get(url).then(results=>{
        const digimonArr = results.data.map(digimon=>{
            return new Digimon(digimon);
        })

        res.send(digimonArr);
    })
    
}

function addFavDijimonHandler(req, res) {

    const{name, img, level}= req.body;

    const newDigimon = new digimonModel({
        name:name,
        img:img,
        leve:level

    })

    newDigimon.save();
    
}

function getFavDigimonHandler(req, res) {
    digimonModel.fing({}, (error, data)=>{
        res.send(data);
    })

    
}

function deleteDigimonHandler(req, res) {

    const id = req.params.id;

    digimonModel.remove({_id:id}, (error, dataFav)=>{
        digimonModel.find({}, (error, data)=>{
            res.send(data)
        })
    })
    
}

function updateDigimonHandler(req, res) {
    const name = req.query.name;
    const img = req.query.img;
    const level = req.query.level;

    const id = req.params.id;

    digimonModel.findOne({_id:id}, (error, data1)=>{
        data1.name= name;
        data1.img=img;
        data1.level=level;
        data1.save().then(()=>{
        digimonModel.find({}, (error, data)=>{
            res.send(data);
        })

        })
    })
    
}