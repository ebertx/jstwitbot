jstwitbot
===========

## Configuration
Create a `config.js` at the root of the project folder. It will export the oauth credentials, as well as provide a series of actions, an interval for performing the actions, and weights for determining the distribution of those actions. It will look something like this:

```
module.exports = {
    consumer_key: '...'
  , consumer_secret: '...'
  , access_token: '...'
  , access_token_secret: '...'
  , interval: 3000
  , query: "some search term"
  , weights: {
   		"favorite": 1,
  		"retweet": 1,
  		"mingle": 1,
  		"searchFollow": 1,
  		"prune": 2
  	}
}

```