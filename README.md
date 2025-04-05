# Sweet Donut - Premium Donut Shop

![Sweet Donut Banner](https://images.unsplash.com/photo-1551024506-0bccd828d307)

## Overview

Sweet Donut is a modern, Apple-inspired website for a premium donut shop. The website allows customers to browse the menu, add items to their cart, and place orders online.

## 도넛 스토어 웹 페이지 프론트엔드 정의

### 핵심 요소

- **사용자 인터페이스(UI)**: 고객이 직접 상호작용하는 시각적 요소들로 구성
- **사용자 경험(UX)**: 사용자가 웹사이트를 사용할 때 느끼는 전반적인 경험
- **반응형 디자인**: 다양한 기기(데스크톱, 태블릿, 모바일)에서 최적화된 화면 제공

### 주요 페이지 구성

#### 메인 페이지
- 배너/슬라이더(특별 할인, 신제품 소개)
- 추천 도넛 섹션
- 간단한 회사 소개

#### 제품 목록 페이지
- 카테고리별 도넛 분류(클래식, 프리미엄, 시즌 한정 등)
- 필터링 및 정렬 기능
- 각 제품 썸네일 및 간략 정보

#### 제품 상세 페이지
- 제품 이미지 갤러리
- 상세 설명(재료, 칼로리 정보 등)
- 가격 및 옵션 선택
- 장바구니 추가 버튼

#### 장바구니/결제 페이지
- 선택한 제품 목록
- 수량 조절 기능
- 총 가격 계산
- 결제 프로세스

#### 사용자 계정 페이지
- 로그인/회원가입
- 주문 내역
- 개인정보 관리

### 기술 스택

- **HTML5/CSS3**: 웹 페이지 구조 및 스타일링
- **JavaScript/TypeScript**: 동적 기능 구현
- **React/Vue/Angular**: 프론트엔드 프레임워크
- **Tailwind CSS**: UI 컴포넌트 및 반응형 디자인 (Bootstrap 제외)
- **Redux/Vuex**: 상태 관리
- **Axios/Fetch API**: 구글 시트 API와의 통신

### 구글 시트 백엔드 연동 방안

- **Google Sheets API**: 제품 정보, 주문 데이터 저장 및 관리
- **Google Apps Script**: 구글 시트 기반 백엔드 로직 구현
- **Google OAuth**: 필요한 경우 인증 시스템 연동

### 구현 고려사항

#### 데이터 구조화:
- 제품 정보 시트 (ID, 이름, 가격, 설명, 카테고리, 이미지 URL 등)
- 주문 관리 시트 (주문번호, 고객정보, 주문상품, 결제정보 등)
- 재고 관리 시트 (재고량, 판매량 등)

#### API 호출 최적화:
- 캐싱 전략 구현으로 API 호출 최소화
- 필요한 데이터만 불러오는 최적화된 쿼리 설계

#### 보안 고려사항:
- API 키 보안 관리
- 민감한 고객 데이터 암호화 저장

## Features

- **Clean, Modern Design**: Inspired by Apple's design language with minimalist aesthetics
- **Responsive Layout**: Optimized for all devices from mobile to desktop
- **Dynamic Menu System**: Categories and menu items loaded dynamically
- **Shopping Cart**: User-friendly cart system with real-time updates
- **Checkout Process**: Streamlined ordering process
- **Image Optimization**: Multiple fallback methods for image loading

## Technology Stack

- HTML5
- CSS3 with modern features like Flexbox and Grid
- Vanilla JavaScript
- Google Fonts and Material Icons
- Google Sheets as backend (for menu data)

## Menu Categories

The website dynamically loads and displays menu items in the following categories:

- Donuts
- Cake Donuts
- Breakfast Items

Each menu item includes:
- High-quality image
- Name
- Description
- Price
- Add to cart button

## Design Elements

### Color Palette

- Primary Background: #ffffff (White)
- Secondary Background: #fbfbfd (Light Gray)
- Primary Text: #1d1d1f (Almost Black)
- Secondary Text: #86868b (Medium Gray)
- Accent Color: #0071e3 (Apple Blue)

### Typography

- Primary Font: 'Inter' with system font fallbacks
- Header Font Sizes: 2.5rem - 3.5rem
- Body Font Sizes: 0.9rem - 1.2rem
- Font Weights: 400 (Regular), 500 (Medium), 600 (Semibold)

### Components

- **Header**: Clean, centered layout with large title
- **Navigation**: Sticky category tabs with smooth hover effects
- **Menu Cards**: Elegant cards with subtle shadows and hover animations
- **Cart System**: Slide-in cart panel with item management
- **Order Form**: User-friendly form with Apple-style inputs

## Responsive Design

The website is fully responsive with specific optimizations for:
- Mobile devices (below 768px)
- Tablets (768px - 1100px)
- Desktop (above 1100px)

## Performance Optimization

- Lazy loading of images
- Multiple image fallback strategies
- Regular menu refresh (every 5 minutes)

## Installation and Setup

1. Clone the repository
2. Open `lee.html` in a modern web browser
3. No build process required - pure HTML, CSS, and JavaScript

## Backend Integration

The website connects to a Google Sheets backend for menu data:
- Menu items stored in Google Sheets
- JSONP or CSV formats supported for data loading
- Automatic fallback to default menu if data loading fails

## Future Enhancements

- User accounts and order history
- Loyalty program integration
- Online payment processing
- Real-time order tracking

---

© 2023 Sweet Donut. All rights reserved. 