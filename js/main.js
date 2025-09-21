// overlay-script.js
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger-overlay');
  const nav = document.querySelector('.nav-overlay');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');

    const isOpen = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);

    // メニューオープン時に背景スクロールを防止
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ESCキーでメニューを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      nav.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".page-links a.card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1 // 少しでも見えたら発火
  });

  cards.forEach(card => observer.observe(card));
});
// テキストを文字単位に分割する関数
function splitText(element) {
  const text = element.textContent;
  element.innerHTML = '';

  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char; // スペースの処理
    element.appendChild(span);
  });
}

// タイトルのアニメーション
const title = document.querySelector('.animated-title');
splitText(title);

gsap.from('.animated-title .char', {
  duration: 0.8,
  y: 100,
  opacity: 0,
  rotationX: -90,
  stagger: 0.05,
  ease: "back.out(1.7)",
  transformOrigin: "50% 50% -50px"
});

// 段落のアニメーション
const paragraph = document.querySelector('.animated-paragraph');
splitText(paragraph);

gsap.from('.animated-paragraph .char', {
  duration: 0.6,
  y: 50,
  opacity: 0,
  stagger: 0.02,
  ease: "power2.out",
  delay: 1
});

// カラフルなテキストエフェクト
gsap.to('.animated-title .char', {
  duration: 2,
  color: () => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  stagger: 0.1,
  repeat: -1,
  yoyo: true,
  delay: 2
});