require('dotenv').config();

// app.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path'); // path 모듈 추가
require('./passport-setup'); // Passport 설정 파일을 가져옵니다.

const app = express();

// 세션 설정
app.use(session({
  secret: 'your_secret_key', // 보안을 위해 실제 비밀 키로 변경하세요.
  resave: false,
  saveUninitialized: true
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// Google 인증 라우트
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/profile');
});

// Facebook 인증 라우트
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/profile');
});

// Apple 인증 라우트
app.get('/auth/apple', passport.authenticate('apple'));

app.get('/auth/apple/callback', passport.authenticate('apple', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/profile');
});

// 정적 파일 제공 설정 (선택사항: CSS, JS 등 별도 파일이 있다면)
// app.use(express.static(path.join(__dirname, 'public')));

// 프로필 라우트
app.get('/profile', (req, res) => {
  // 로그인 확인 로직 추가 (선택사항)
  if (!req.user) {
    return res.redirect('/'); // 로그인 안 했으면 홈으로
  }
  res.send(`Hello, ${req.user.displayName}`);
});

// 루트 경로 핸들러 수정
app.get('/', (req, res) => {
    // res.send('Welcome to the Home Page!');
    res.sendFile(path.join(__dirname, 'lee.html')); // lee.html 파일 제공
  });
  
// 서버 시작
const PORT = process.env.PORT || 3000; // 환경 변수 PORT 사용, 없으면 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});