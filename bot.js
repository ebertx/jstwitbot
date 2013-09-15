//
//  Bot
//  class for performing various twitter actions
//
var Twit = require('twit');

var Bot = module.exports = function(config) { 
	this.twit = new Twit(config);
};

//
//  post a tweet
//
Bot.prototype.tweet = function (status, callback) {
	if(typeof status !== 'string') {
		return callback(new Error('tweet must be of type String'));
	} else if(status.length > 140) {
		return callback(new Error('tweet is too long: ' + status.length));
	}
	this.twit.post('statuses/update', { status: status }, callback);
};

// 
// search
//
Bot.prototype.search = function (terms, callback) {

};

//
// retweet
//
Bot.prototype.retweet = function (params, callback) {
	var self = this;

	self.twit.get('search/tweets', params, function (err, reply) {
		if(err) return callback(err);

		var tweets = reply.statuses;
		var randomTweet = randIndex(tweets);

		self.twit.post('statuses/retweet/:id', { id: randomTweet.id_str }, callback);
	});
};

//
// favorite a tweet
//
Bot.prototype.favorite = function (params, callback) {
	var self = this;

	self.twit.get('search/tweets', params, function (err, reply) {
		if(err) return callback(err);

		var tweets = reply.statuses;
		var randomTweet = randIndex(tweets);

		self.twit.post('favorites/create', { id: randomTweet.id_str }, callback);
	});
};

//
// topical follow
//
Bot.prototype.searchFollow = function (status, callback) {

};

//
//  choose a random friend of one of your followers, and follow that user
//
Bot.prototype.mingle = function (callback) {
	var self = this;

	this.twit.get('followers/ids', function(err, reply) {
		if(err) { return callback(err); }

		var followers = reply.ids
		, randFollower  = randIndex(followers);
		
		self.twit.get('friends/ids', { user_id: randFollower }, function(err, reply) {
			if(err) { return callback(err); }

			var friends = reply.ids
			, target  = randIndex(friends);
			
			self.twit.post('friendships/create', { id: target }, callback); 
		})
	})
};

//
//  prune your followers list; unfollow a friend that hasn't followed you back
//
Bot.prototype.prune = function (callback) {
	var self = this;

	this.twit.get('followers/ids', function(err, reply) {
		if(err) return callback(err);

		var followers = reply.ids;

		self.twit.get('friends/ids', function(err, reply) {
			if(err) return callback(err);

			var friends = reply.ids
			, pruned = false;

			while(!pruned) {
				var target = randIndex(friends);

				if(!~followers.indexOf(target)) {
					pruned = true;
					self.twit.post('friendships/destroy', { id: target }, callback);   
				}
			}
		});
	});
};

function searchTweetsHelper (params, callback) {

}

function randIndex (arr) {
	var index = Math.floor(arr.length*Math.random());
	return arr[index];
};