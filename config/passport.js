// Load bcrypt
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport, admin) {
    var Admin = admin;
    var LocalStrategy = require('passport-local').Strategy;
    //serialize
    passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });
    // deserialize admin
    passport.deserializeUser(function(id, done) {
        Admin.findById(id).then(function(admin) {
            if (admin) {
                done(null, admin.get());
            }
            else {
                done(admin.errors, null);
            }
        });
    });

    // SIGN UP
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'adminU',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, admin, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            Admin.findOne({
                where: {
                    admin: admin
                }
            }).then(function(dbResult) {
                if (dbResult)
                {
                    return done(null, false, {
                        message: 'That username is already taken'
                    });
                } else {
                    var adminPassword = generateHash(password);
                    var data = {
                            admin: admin,
                            password: adminPassword,
                        };
                    Admin.create(data).then(function(newAdmin, created) {
                        if (!newAdmin) {
                            return done(null, false);
                        }

                        if (newAdmin) {
                            return done(null, newAdmin);
                        }
                    });
                }
            });
        }
    ));

    // LOCAL SIGN IN
    passport.use('local-signin', new LocalStrategy({
            // by default, local strategy uses admin and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, user, password, done) {
            var Admin = admin;
            var isValidPassword = function(adminpass, password) {
                return bCrypt.compareSync(password, adminpass);
            };
            Admin.findOne({
                where: {
                    admin: user
                }
            }).then(function(dbResult) {
                if (!dbResult) {
                    return done(null, false, {
                        message: 'Account does not exist'
                    });
                }
                if (!isValidPassword(dbResult.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                var admininfo = dbResult.get();
                return done(null, admininfo);
            }).catch(function(err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your credentials'
                });
            });
        }
    ));
};