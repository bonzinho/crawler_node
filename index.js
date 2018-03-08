'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const mongoose = require('mongoose');
const Horseman = require('node-horseman');

server.connection({
    port: 3000
});

const db = mongoose.connect('mongodb://localhost/crawler').connection;
const horseman = new Horseman();
const Movies = require('./movies');


/*db.on('error', (err) => {
    console.log(`Mongoose Error = ${err}`);
});
*/

server.route({
   method: 'GET',
   path: '/',
    handler: (req, res) => {
       res('Hello from hapi.js');
    }
});

server.route({
    method: 'GET',
    path: '/movies',
    handler: (req, reply) => {
        console.time();

        Movies.find({}, (err, results) => {
         if(!err && results.length){
             console.timeEnd(); // verificar performance
             return reply({
                 data: results,
                 count: results.length,
             });
         }

            if(results.length && !err){
             console.time();
                return  horseman
                    .open('http://www.listchallenges.com/disney-movies')
                    .evaluate(function(){ //captura os dados dentro da pagina solicitada
                        var $;
                        $ = window.$ || window.JQuery; //atualizar o jquery par apoder usar

                        var movies = [];

                        $('.item-name').each(function(index, el){
                            console.log(el);
                            var name = $(el).text().trim();
                            var year = name.match(/\(([^)]+)\)/);
                            if(!year){
                                return
                            }

                            year = year[1];
                            name = name.replace(/\s*\(.*?\)\s*/g, '');

                            movies.push({
                                name: name,
                                year: year,
                            });
                        });
                        return movies;
                    })
                    .then(function(res){
                        Movies.insertMany(res)
                            .then((movies) => {
                                console.log(`Ok`);
                                console.timeEnd(); // verificar performance
                                return reply(res);
                            })
                            .catch((err) => {
                                console.log(`Can not insert: ${err}`);
                                reply({
                                    'error': 'MongoDB'
                                });
                            });
                    })
                    .catch(function(err){
                        return `Erro ${err}`;
                    }).close();
            }
        });
    }
});

server.start((err) => {
    if(err){
        throw err;
    }
    console.log(`Your hapi server has been ignite at : ${server.info.uri}`)
});