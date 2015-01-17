// Twitter config
var Twit = require('twit');
var watson = require('./watson');

var dataFromTwitterUS;
var dataFromTwitterPerState;

var twitter_consumer_key    =  process.env.KEY;
var twitter_consumer_secret =  process.env.SECRET;
var twitter_access_token    =  process.env.TOKEN;
var twitter_access_token_secret = process.env.TOKEN_SECRET;


module.exports.twitterData = function(req, res) {
  var T = new Twit({
          consumer_key:         twitter_consumer_key
        , consumer_secret:      twitter_consumer_secret
        , access_token:         twitter_access_token
        , access_token_secret:  twitter_access_token_secret
  });
  
  // create a profile request with the text and the htpps options and call it
    // `req.body.subject` is the subject that was entered by the end user
    // TODO: to have the end user enter the date
    var analyzeState = function () {
      dataFromTwitterPerState = '';
      console.log('analyzeState')
      T.get('search/tweets', { q: ''+req.body.subject+' since:2014-01-01', 
                               count: 5000, geocode: req.body.geo, lang: 'en' },
                               function(err, data, response) {
        for(var i = 0; i < data.statuses.length; i++) {
          // accumulate the data (each tweet as a text) received from twitter
          dataFromTwitterPerState += data.statuses[i].text;
        }
        watson.watson(dataFromTwitterPerState, res, false);
      });
    };

    var analyzeNation = function() {
      dataFromTwitterUS = '';
      console.log('analyzeNation')
      // geoUS: the geo location of United States
      var geoUS = ['39.8','-95.583068847656','2500km']
      T.get('search/tweets', { q: ''+req.body.subject+' since:2014-01-01', 
                               count: 5000, geocode: geoUS , lang: 'en' },
                               function(err, data, response) {
        
        for(var i = 0; i < data.statuses.length; i++) {
          // accumulate the data (each tweet as a text) received from twitter
          dataFromTwitterUS += data.statuses[i].text;
        }
        watson.watson(dataFromTwitterUS, res, true);
        analyzeState();
      });
    };
    analyzeNation();
};