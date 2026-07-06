# PROJECT_SPEC.md

# 💖 Date Invitation Website

## Overview

Xây dựng một website "Date Invitation" để một chàng trai gửi cho bạn gái trước khi lên kế hoạch cho buổi hẹn.

Website không chỉ là một biểu mẫu mà phải mang cảm giác của một món quà nhỏ được thiết kế riêng cho cô ấy.

Mục tiêu:

* Lãng mạn
* Dễ thương
* Cao cấp
* Mượt mà
* Responsive
* Có nhiều animation
* Có trải nghiệm người dùng thật tốt

Toàn bộ website phải có chất lượng tương đương một landing page thương mại.

---

# Tech Stack

Sử dụng:

* HTML5
* CSS3
* Vanilla JavaScript ES6+

Không sử dụng:

* React
* Vue
* Angular
* Bootstrap
* Tailwind

Có thể sử dụng:

* SortableJS (Drag & Drop)
* Canvas Confetti
* GSAP hoặc AOS nếu cần animation

---

# File Structure

```
/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── icons/
│   ├── images/
│   ├── music/
│   └── fonts/
│
└── README.md
```

---

# Design

Theme:

Romantic + Glassmorphism

Primary Colors

* Pink
* White
* Lavender
* Peach

Background

Animated Gradient

Floating Hearts

Sparkles

Blur Shapes

Petal Falling Animation

Typography

Heading

* Dancing Script

Body

* Poppins

---

# Header

Left

Made with ❤️ just for you

Right

Dark Mode Toggle

Music Toggle

Sticky Header

---

# Hero Section

Typing Animation

Title

💌 Em có muốn dành một buổi hẹn thật đặc biệt cùng anh không?

Subtitle

Anh muốn chuẩn bị một buổi hẹn thật phù hợp với em.
Chỉ cần vài phút điền chiếc form nhỏ này nhé ❤️

Button

✨ Bắt đầu

Smooth Scroll xuống Form.

---

# Progress

Question X / 12

Animated Progress Bar.

---

# Form Sections

## 1. Tên

Text Input

Placeholder

"Bé yêu"

---

## 2. Ngày rảnh

Date Picker

---

## 3. Khoảng thời gian

Morning

Afternoon

Evening

Night

---

## 4. Địa điểm đón

Text Input

---

# 5. Date Planner (Quan trọng nhất)

Đây là section lớn nhất của website.

Tiêu đề

📍 Em muốn chúng mình đi đâu?

Mô tả

Em có thể chọn một hoặc nhiều địa điểm.
Sau đó sắp xếp theo thứ tự ưu tiên để anh biết nơi em thích nhất.

---

## Preset Places

Hiển thị dạng Card.

Danh sách:

☕

Cafe

🍰

Bakery

🧋

Milk Tea

🍣

Sushi

🍕

Pizza

🍲

Hotpot

🥩

BBQ

🎬

Cinema

🎳

Bowling

🎤

Karaoke

🏞

Picnic

🌊

Beach

🌳

Park

🏛

Museum

🐟

Aquarium

📚

Bookstore

🎨

Workshop

🛍

Shopping Mall

🌃

Rooftop

🚗

Road Trip

🏕

Camping

✨

Surprise Me

---

## Card Behavior

Hover

Scale

Glow

Shadow

Click

Selected

Checkmark

Animated Border

Allow multiple selection.

---

# Custom Place

Button

➕

Add My Own Place

Mỗi lần click tạo:

Place Name

Address (optional)

Reason

Có thể thêm vô hạn.

---

# Priority Ranking

Sau khi chọn xong.

Hiển thị

❤️ Priority List

Cho phép Drag & Drop.

Desktop

Mouse

Mobile

Touch

Animation

Scale

Shadow

Smooth Transition

Hiển thị

🥇 Priority #1

🥈 Priority #2

🥉 Priority #3

...

Sau khi kéo

Tự động cập nhật số thứ tự.

---

# Preference

Mỗi địa điểm có:

❤️ Really Want

⭐ Want To Try

🔥 Long Time Wish

😊 Optional

---

# Why?

Textarea

Ví dụ

"Em thấy view đẹp."

---

# Surprise Option

Nếu chọn

✨ Surprise Me

Ẩn toàn bộ Priority List.

Hiện

"I trust you ❤️"

---

# 6 Budget

Slider

0

↓

2,000,000 VND

Live Preview.

---

# 7 Outfit

Dropdown

Shirt

T-shirt

Hoodie

Suit

Surprise

---

# 8 Dress Code

Input

---

# 9 Playlist

Input

Taylor Swift

IU

Lofi

US-UK

Kpop

---

# 10 Favorite Food

Textarea

---

# 11 Things You Must NOT Do

Textarea

---

# 12 Message For Me

Large Textarea

---

# Confirmation

Checkbox

I agree to spend this date together ❤️

---

# Submit

Button

💖 Send to Him

Animation

Ripple

Glow

Scale

---

# Validation

Required Fields

Shake Animation

Beautiful Error Message

No Page Reload

---

# Success Screen

Confetti

Flying Hearts

Message

🎉 Anh đã nhận được đơn đăng ký đi date của em.

Anh sẽ chuẩn bị thật chu đáo ❤️

Buttons

View Answers

Edit Again

---

# Local Storage

Auto Save

Restore on Reload

---

# Export

Export JSON

---

# Special Effects

Floating Hearts

Sparkles

Click Anywhere → Small Heart

Cute Bear Holding Flowers

Bear Waves On Hover

Background Music

Countdown To Date

Typing Animation

Parallax

Scroll Reveal

60 FPS Animation

---

# Accessibility

Keyboard Navigation

ARIA

Focus Ring

Semantic HTML

---

# Performance

Lazy Loading

Optimized Animation

Debounce Events

Avoid Layout Thrashing

Mobile Friendly

---

# Final Goal

Người mở website phải có cảm giác đây là một website được thiết kế riêng cho mình chứ không phải một biểu mẫu thông thường.

Ưu tiên:

* UI thật đẹp.
* UX tự nhiên.
* Animation tinh tế.
* Tốc độ nhanh.
* Code sạch.
* Component dễ mở rộng.
* Responsive hoàn chỉnh.
* Trải nghiệm giống một landing page cao cấp.
