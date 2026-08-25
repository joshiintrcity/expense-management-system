const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const adminModel = require('../models/adminModel');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleUserId = profile.id;
                const googleEmail = profile.emails?.[0]?.value;
                const googleName = profile.displayName;

                if (!googleEmail) {
                    return done(null, false);
                }

                let user = await adminModel.findAdminByGoogleId(
                    googleUserId
                );

                if (!user) {
                    user = await adminModel.findAdminByEmail(
                        googleEmail
                    );
                }

                if (user) {
                    if (!user.is_active) {
                        return done(null, false);
                    }

                    return done(null, user);
                }

                const newUser = await adminModel.createGoogleAdmin({
                    email: googleEmail,
                    provider: 'google',
                    uid: googleUserId,
                    name: googleName,
                    role: 'lounge_user',
                    is_active: 1
                });

                return done(null, newUser);

            } catch (error) {
                console.error('Google authentication error:', error);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
