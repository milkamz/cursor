// passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;

// <<--- 추가 시작 --->>
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET); // 비밀번호도 확인차 출력
// <<--- 추가 끝 --->>

// Google 전략 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // 실제 앱에서는 여기서 사용자 정보를 DB에 저장하거나 조회합니다.
    return done(null, profile);
  }
));

// Facebook 전략 설정
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // 실제 앱에서는 여기서 사용자 정보를 DB에 저장하거나 조회합니다.
    return done(null, profile);
  }
));

// Apple 전략 설정
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: '/auth/apple/callback'
  },
  (accessToken, refreshToken, idToken, profile, done) => {
    // 실제 앱에서는 여기서 사용자 정보를 DB에 저장하거나 조회합니다.
    // Apple 로그인은 profile 객체가 비어있을 수 있으므로 idToken을 파싱하여 사용해야 할 수 있습니다.
    return done(null, profile || { id: idToken.sub, displayName: `${idToken.email}` }); // 예시: 프로필 없으면 idToken 사용
  }
));

// 사용자 직렬화 및 역직렬화
passport.serializeUser((user, done) => {
  // 세션에 저장할 사용자 정보 선택 (보통 user.id)
  done(null, user); // 예시로 전체 프로필 저장, 실제로는 ID만 저장하는 것이 좋음
});

passport.deserializeUser((user, done) => {
  // 세션에 저장된 정보를 이용해 DB에서 사용자 정보 조회
  // 여기서는 user 객체를 그대로 사용 (DB 연동 없으므로)
  done(null, user);
});