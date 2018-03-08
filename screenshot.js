const Horseman = require('node-horseman');
const horseman = new Horseman();

horseman
    .open('http://duckduckgo.com')
    //.screenshot('./img/img4.png')
    //.includeJs('https://code.jquery.com/jquery-3.3.1.min.js') //adicionar jquery ao brawser virtual
    .pdf('./pdf/teste.pdf', {
        format: 'A4',
        orientation: 'portait',
        margin: '1cm'
    }) //gerar pdf
    .then(() => {
        console.log(`Screenshot successful`)
    })
    .catch ((err) => {
        console.log(`There is an error: ${err}`)
    }).close();

module.exports = horseman;