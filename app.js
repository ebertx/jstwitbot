var Bot = require('./bot');
var config = require('./node_modules/twit/config.js');
var util = require('util');

var bot = new Bot(config);

console.log('jstwitbot: Running.');

/*
bot.twit.get('application/rate_limit_status', function(err, reply) {
	if(err) return handleError(err);
	console.log('\nRATE LIMIT: ' + reply);
});
*/

/*
bot.twit.get('followers/ids', function(err, reply) {
	if(err) return handleError(err);
	console.log('\n# followers:' + reply.ids.length.toString());
});
*/

setInterval(function() {

	var rand = Math.random();

	if(rand <= .90) {
		// favorite or retweet popular web development tweets
		var params = {
			q: 'hamster'
			, since: datestring()
			, result_type: 'mixed'
			, limit: 10
		};

		if(rand <= .50) {
			console.log("\nBegin favoriting");
			bot.favorite(params, function(err, reply) {
				if(err) return handleError(err);

				console.log('Favorite response: ' + reply.id);
			});

		} else {
			console.log("\nBegin retweeting");
			bot.retweet(params, function(err, reply) {
				if(err) return handleError(err);

				console.log('Retweet response: ' + reply.id);
			});
		}
	} else if(rand <= .95) {
		console.log("\nBegin mingle");
		bot.mingle(function(err, reply) {
			if(err) return handleError(err);

			var name = reply.screen_name;
			console.log('Mingle: followed @' + name);
		});
	} else {
		console.log("\nBegin prune");
		bot.prune(function(err, reply) { 
			if(err) return handleError(err);

			var name = reply.screen_name;
			console.log('Prune: unfollowed @'+ name);
		});
	}
}, config.interval);


//get date string for today's date (e.g. '2011-01-01')
function datestring () {
	var d = new Date(Date.now() - 8*60*60*1000);  //mst timezone
	return d.getUTCFullYear()   + '-' 
	+  (d.getUTCMonth() + 1) + '-'
	+   d.getDate();
};

function handleError(err) {
	console.error('response status:', err.statusCode);
	console.error('data:', err.data);
}
