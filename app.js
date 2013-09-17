var Bot = require('./bot');
var config = require('./node_modules/twit/config.js');
var util = require('util');

var bot = new Bot(config);

console.log('jstwitbot: Running.');

var weights = new Array();
var weightCounter = 0;

// build weights array
for(action in config.weights) {
	weightCounter += config.weights[action];
	var tempAction = action;
	weights.push({ "action" : action, "weight" : weightCounter });
}

setInterval(function() {

	// favorite or retweet popular web development tweets
	var params = {
		q: config.query
		, since: datestring()
		, result_type: 'mixed'
		, limit: 10
	};

	var action = getAction();
	performAction(action, params);

}, config.interval);


//get date string for today's date (e.g. '2011-01-01')
function datestring () {
	var d = new Date(Date.now() - 8*60*60*1000);  //MST
	return d.getUTCFullYear()   + '-' 
	+  (d.getUTCMonth() + 1) + '-'
	+   d.getDate();
};

function getAction () {
	var rand = Math.ceil(Math.random() * weightCounter);

	var action = weights[0].action;
	for(var i=0, tot=weights.length; i < tot; i++) {
		if(rand <= weights[i].weight) {
			action = weights[i].action;
			return action;
		}
	}
};

function performAction (key, params) {
	var actions = {
		'favorite': function(params) {
			console.log("\nBegin favoriting");
			bot.favorite(params, function(err, reply) {
				if(err) return handleError(err);

				console.log('Favorite response: ' + reply.id);
			});
			},
		'retweet': function(params) {
			console.log("\nBegin retweeting");
			bot.retweet(params, function(err, reply) {
				if(err) return handleError(err);

				console.log('Retweet response: ' + reply.id);
			});
		},
		'mingle': function() {
			console.log("\nBegin mingle");
			bot.mingle(function(err, reply) {
				if(err) return handleError(err);

				var name = reply.screen_name;
				console.log('Mingle: followed @' + name);
			});
		},
		'searchFollow': function(params) {
			console.log("\nBegin searchFollow");
			bot.searchFollow(params, function(err, reply) {
				if(err) return handleError(err);

				console.log('SearchFollow: followed @' + reply.screen_name);
			});
		},
		'prune': function() {
			console.log("\nBegin prune");
			bot.prune(function(err, reply) { 
				if(err) return handleError(err);

				var name = reply.screen_name;
				console.log('Prune: unfollowed @'+ name);
			});
		},
		'unknown': function() {
			console.log("\nUnkown action");
		}
	};

	if(actions[key])
		actions[key](params);
	else
		actions.unknown();

}

function handleError(err) {
	console.error('response status:', err.statusCode);
	console.error('data:', err.data);
}
