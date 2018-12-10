const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
            error: err
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.get_all_users= (req, res, next) => {
  User.find()
    .select("_id email ")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        user: docs.map(doc => {
          return {
            //_id: doc._id,
            email: doc.email,
            //followers: doc.followers,
            request: {
              type: "GET",
              url: "http://localhost:3000/user/" + doc._id
            }
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
        error: err
      });
    });
};


exports.get_user_details = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .select("_id email followers")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          _id: doc._id,
          
          user: doc,
          request: {
            type: "PATCH",
            follow : "http://localhost:3000/user/"+doc._id+"/"+doc.followers+"/follow/",
            unfollow:  "http://localhost:3000/user/"+doc._id+"/"+doc.followers+"/unfollow/"
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

exports.follow_user = (req, res, next) => {
  const id = req.params.userId;
  var f_count = parseInt(req.params.followers);
  // var f = parseInt(User.followers);
  // f = f+1;
  // User.followers = Number(f);
  //var f = parseInt(User.followers)+1;
  f_count = f_count+1;
  User.update({ _id: id }, { $set: {followers: f_count} })
  .exec()
    .then(result => {
      res.status(200).json({
        message: "Followed",
        request: {
          type: "GET",
          follow : "http://localhost:3000/user/"+doc._id,
          unfollow:  "http://localhost:3000/user/"+doc._id
        }
    });
})
    .catch(err => {
      console.log(err);
      res.status(200).json({
        message: "Followed",
        error: err
      });
});
};

exports.unfollow_user = (req, res, next) => {
  const id = req.params.userId;
  var f_count = parseInt(req.params.followers);
  // var f = parseInt(User.followers);
  // f = f+1;
  // User.followers = Number(f);
  //var f = parseInt(User.followers)+1;
  f_count = f_count-1;
  User.update({ _id: id }, { $set: {followers: f_count} })
  .exec()
    .then(result => {
      res.status(200).json({
        message: "Unfollowed",
        request: {
          type: "GET",
          follow : "http://localhost:3000/user/"+doc._id,
          unfollow:  "http://localhost:3000/user/"+doc._id
        }
    });
})
    .catch(err => {
      console.log(err);
      res.status(200).json({
        message: "Unollowed",
        error: err
      });
});
};


// exports.follow_user = (req, res, next) => {
//   const id = req.params.userId;
//   User.findById(id)
//     .select("_id email followers")
//     .exec()
//     .then(doc => {
//       console.log("From database", doc);
//       if (doc) {
//         res.status(200).json({
//           _id: doc._id,
//           followers: doc.followers + 1,
//           user: doc,
//           request: {
//             type: "GET",
//             follow : "http://localhost:3000/user/"+doc._id+"/follow",
//             unfollow:  "http://localhost:3000/user/"+doc._id+"/unfollow"
//           }
//         });
//       } else {
//         res
//           .status(404)
//           .json({ message: "No valid entry found for provided ID" });
//       }
//     })
//     // .catch(err => {
//     //   console.log(err);
//     //   res.status(500).json({ error: err });
//     // });
// };

// exports.unfollow_user = (req, res, next) => {
//   const id = req.params.userId;
//   // var f = parseInt(User.followers);
//   // f = f+1;
//   // User.followers = Number(f);
//   //var f = parseInt(User.followers)+1;
//   User.findById(id)
//   .select("_id followers")
//   User.update({ _id: id }, { $set: {followers: 0} })
//   .exec()
//     .then(error => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     })
//     .catch(result => {
//       res.status(200).json({
//         message: "updated",
        
//     });
// });
// }