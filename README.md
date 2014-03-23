InternLabs
==========

InternLabs connects students with employers and helps create successful internships.


## Installation
1. Install Node.js and MongoDB
2. Clone this repo `git clone https://github.com/smilledge/internlabs InternLabs`
3. Install required packages `npm install` (run inside or InternLabs folder)
4. Make sure you have nodemon installed `npm install -g nodemon` (automatically restarts node applications when developing)
5. Copy example config and update if required `cp config/app.json.example config/app.json`
6. Compile LESS / JS and watch for changes `grunt -v --force`
8. Start MongoDB server `mongod`
9. Start node.js server `npm start`


## Notes
 - Backend will be developed using Express.js (Using Kraken.js as a foundation)
 - MongoDB will be used for the database
 - Mongoose will be the ODM used (http://mongoosejs.com/)
 - Frontend will be developed using Angular.js and Bootstrap
 - Passport.js will be used for user authentication (http://passportjs.org/)