const Tesseract = require('tesseract.js');
const filename = './img/img2.png';


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