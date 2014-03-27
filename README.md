InternLabs (QUT INB302)
==========

InternLabs connects students with employers and helps create successful internships.


## Installation
1. Install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/)
2. Clone this repo `git clone https://github.com/smilledge/internlabs InternLabs`
3. Install required packages `npm install` (run inside of InternLabs folder)
4. Make sure you have [nodemon](https://github.com/remy/nodemon) installed globally `npm install -g nodemon` (automatically restarts node applications when developing)
5. Copy example config and update if required `cp config/app.json.example config/app.json`
6. Compile LESS / JS and watch for changes `grunt -v --force`
8. Start MongoDB server `mongod`
9. Start node.js server `npm start`


## Notes
 - Backend will be developed using [Express.js](http://expressjs.com/) (Using [Kraken.js](http://krakenjs.com/) as a foundation)
 - [MongoDB](https://www.mongodb.org/) will be used for the database
 - [Mongoose](http://mongoosejs.com/) will be the ODM used 
 - Frontend will be developed using [Angular.js](http://angularjs.org/) and [Bootstrap](http://getbootstrap.com/)
 - [Passport.js](http://passportjs.org/) will be used for user authentication