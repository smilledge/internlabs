InternLabs (QUT INB302)
==========

InternLabs connects students with employers and helps create successful internships.


## Installation
1. Install [Node.js](http://nodejs.org/), [MongoDB](https://www.mongodb.org/), [Redis](http://redis.io/) and [Elasticsearch](http://www.elasticsearch.org/)
2. Clone this repo `git clone https://github.com/smilledge/internlabs InternLabs`
3. Install required packages `npm install` (run inside of InternLabs folder)
4. Make sure you have [nodemon](https://github.com/remy/nodemon) installed globally `npm install -g nodemon` (automatically restarts node applications when developing)
5. Copy example config and update if required `cp config/app.json.example config/app.json`
6. Compile LESS / JS and watch for changes `grunt -v --force`
8. Start MongoDB server `mongod`
9. Start Redis server `redis-server`
10. Start elasticsearch server
11. (Optional) Seed mongo / elasticsearch with some sample data `scripts/seed`
12. Start node.js server `npm start` or `nodemon index.js`



## Notes
 - Backend will be developed using [Express.js](http://expressjs.com/) (Using [Kraken.js](http://krakenjs.com/) as a foundation)
 - [MongoDB](https://www.mongodb.org/) will be used for the database
 - [Redis](http://redis.io/) will be used as a session store
 - Frontend will be developed using [Angular.js](http://angularjs.org/) and [Bootstrap](http://getbootstrap.com/)
 - [Passport.js](http://passportjs.org/) will be used for user authentication 
 - [Elasticsearch](http://www.elasticsearch.org/) will be used for searching