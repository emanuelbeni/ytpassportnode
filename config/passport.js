const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcyrpt = require("bcryptjs");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Math user
			User.findOne({ email: email })
				.then((user) => {
					if (!user) {
						// No user found
						return done(null, false, { message: "Email not registered" });
					}

					// Match password
					bcyrpt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;

						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: "Password incorrect" });
						}
					});
				})
				.catch((err) => console.log(err));
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
