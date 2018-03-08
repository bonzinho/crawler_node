const request = require('request');
const fs = require('fs'); //file string
const Tesseract = require('tesseract.js');
const filename = './img/img3.png';


//LER IMAGENS ONLINE ATRAVES DE HTTP

let createImg = fs.createWriteStream(filename);

request('http://image.ibb.co/nmFOL7/img.png')
    .pipe(createImg)
    .on('close', () => {
        console.log('IMG CREATED');
        Tesseract
            .recognize(filename)
            .progress( (progress) => {
                console.log(`Progress => ${progress}`)
            })
            .then((result) => {
                console.log(result);
                console.log(result.text);
            })
            .catch((err) => {
                console.log(`There is an error: ${err}`);
            });
    });