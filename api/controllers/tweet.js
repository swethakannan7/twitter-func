const mongoose = require("mongoose");
const Tweet = require("../models/tweet");

exports.get_all_tweets = (req, res, next) => {
  Tweet.find()
    .select("_id tweet likes retweets")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        tweet: docs.map(doc => {
          return {
            request: {
              type: "GET",
              url: "http://localhost:3000/tweet/" + doc._id
            },
           // _id: doc._id,
            tweet: doc.tweet,
            likes: doc.likes,
            retweets: doc.retweets,
            
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message :"failed mmmmm",
        error: err
      });
    });
};

exports.create_tweet = (req, res, next) => {
  const tweet = new Tweet({
    _id: new mongoose.Types.ObjectId(),
    tweet: req.body.tweet,
    // likes: req.body.likes,
    // retweets: req.file.retweets
  });
  tweet
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created tweet successfully",
        createdtweet: {
          
          _id: result._id,
          tweet: result.tweet,
          // likes: result.likes,
          // retweets: result.retweets,
         
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//To get a particular tweet (id)
exports.get_tweet= (req, res, next) => {
  const id = req.params.tweetId;
  Tweet.findById(id)
    .select("_id tweet likes retweets")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          user: doc,
          request: {
            type: "GET",
            like : "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/like/",
          unlike: "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/unlike/",
          retweet : "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/retweet"
          
            
          }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    // .catch(err => {
    //   console.log(err);
    //   res.status(500).json({ error: err });
    // });
};

exports.delete_tweet = (req, res, next) => {
  const id = req.params.tweetId;
  Tweet.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Tweet deleted",
        
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.like_tweet = (req, res, next) => {
  const id = req.params.userId;
  var l_count = parseInt(req.params.likes);
  // var f = parseInt(User.followers);
  // f = f+1;
  // User.followers = Number(f);
  //var f = parseInt(User.followers)+1;
  l_count = l_count+1;
  Tweet.update({ _id: id }, { $set: {likes: l_count} })
  .exec()
    .then(result => {
      res.status(200).json({
        message: "liked",
        request: {
          type: "GET",
          like : "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/like/",
          unlike: "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/unlike/"
          
        }
    });
})
    .catch(err => {
      console.log(err);
      res.status(200).json({
        message: "Liked",
        error: err
      });
});
};


exports.unlike_tweet = (req, res, next) => {
  const id = req.params.userId;
  var l_count = parseInt(req.params.likes);
  // var f = parseInt(User.followers);
  // f = f+1;
  // User.followers = Number(f);
  //var f = parseInt(User.followers)+1;
  l_count = l_count+1;
  Tweet.update({ _id: id }, { $set: {likes: l_count} })
  .exec()
    .then(result => {
      res.status(200).json({
        message: "liked",
        request: {
          type: "GET",
          like : "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/like",
          unlike: "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/unlike"
        }
    });
})
    .catch(err => {
      console.log(err);
      res.status(200).json({
        message: "Liked",
        error: err
      });
});
};

exports.retweet_tweet = (req, res, next) => {
  const id = req.params.userId;
  var l_count = parseInt(req.params.likes);
  // var f = parseInt(User.followers);
  // f = f+1;
  // User.followers = Number(f);
  //var f = parseInt(User.followers)+1;
  l_count = l_count+1;
  Tweet.update({ _id: id }, { $set: {likes: l_count} })
  .exec()
    .then(result => {
      res.status(200).json({
        message: "liked",
        request: {
          type: "GET",
          like : "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/like",
          unlike: "http://localhost:3000/tweet/"+doc._id+"/"+doc.likes+"/unlike"
        }
    });
})
    .catch(err => {
      console.log(err);
      res.status(200).json({
        message: "Liked",
        error: err
      });
});
};
