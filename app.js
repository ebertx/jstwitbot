var Bot = require('./bot');
var config = require('./config.js');
var util = require('util');

console.log('jstwitbot: Running.');

for(bot in config) {

	console.log("Setting up " + config[bot].name);

	var thisBot = new Bot(config[bot]);

	// build weights array
	var weights = new Array();
	var weightCounter = 0;
	for(action in config[bot].weights) {
		weightCounter += config[bot].weights[action];
		var tempAction = action;
		weights.push({ "action" : action, "weight" : weightCounter });
	}

	var params = config[bot].params;
	params.since = datestring();

	// Bot's event loop
	(function(thisBot, params) {
		setInterval(function() {

			var action = getAction();
			performAction(thisBot, action, params);

		}, config[bot].interval);
	})(thisBot, params);
}



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

function performAction (bot, key, params) {
	var actions = {
		'favorite': function(params) {
			bot.favorite(params, function(err, reply) {
				if(err) return handleError(err);

				console.log(bot.name + ' favorited response: ' + reply.id);
			});
			},
		'retweet': function(params) {
			bot.retweet(params, function(err, reply) {
				if(err) return handleError(err);

				console.log(bot.name + ' retweeted response: ' + reply.id);
			});
		},
		'mingle': function() {
			bot.mingle(function(err, reply) {
				if(err) return handleError(err);

				var name = reply.screen_name;
				console.log(bot.name + ' mingled: followed @' + name);
			});
		},
		'searchFollow': function(params) {
			bot.searchFollow(params, function(err, reply) {
				if(err) return handleError(err);

				console.log(bot.name + ' searchFollowed: followed @' + reply.screen_name);
			});
		},
		'prune': function() {
			bot.prune(function(err, reply) { 
				if(err) return handleError(err);

				var name = reply.screen_name;
				console.log(bot.name + ' pruned: unfollowed @'+ name);
			});
		},
		'unknown': function() {
			console.log("\nUnknown action");
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
