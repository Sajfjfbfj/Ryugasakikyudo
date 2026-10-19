/**
 * ==============================================================================
 * 龍翔会 サブページ共通インタラクションスクリプト (subpage.js)
 * メガカーテンメニュー、検索モーダル、Back to Top を統合
 * ==============================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. メガカーテンメニューの開閉
    const mb = document.getElementById('mb');
    const curtainTriggerBtn = document.getElementById('curtainTriggerBtn');
    const cur = document.getElementById('cur');

    function toggleCurtain() {
      if (!cur) return;
      const isOpen = cur.classList.toggle('open');
      if (mb) {
        mb.setAttribute('aria-expanded', isOpen);
        mb.textContent = isOpen ? '閉じる' : 'メニュー';
      }
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    if (mb) mb.addEventListener('click', toggleCurtain);
    if (curtainTriggerBtn) curtainTriggerBtn.addEventListener('click', toggleCurtain);

    // カーテン内アコーディオン
    const grpBtns = document.querySelectorAll('#cur .grp h3 button');
    grpBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const grp = btn.closest('.grp');
        if (grp) grp.classList.toggle('on');
      });
    });

    // 2. 検索モーダル制御
    const searchTriggerBtn = document.getElementById('searchTriggerBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');

    const mobileSearchTriggerBtn = document.getElementById('mobileSearchTriggerBtn');

    function openSearchModal(e) {
      if (e) e.stopPropagation();
      if (cur && cur.classList.contains('open')) {
        toggleCurtain();
      }
      if (searchModal) {
        searchModal.classList.toggle('open');
        if (searchModal.classList.contains('open') && searchInput) {
          searchInput.focus();
        }
      }
    }

    if (searchTriggerBtn) {
      searchTriggerBtn.addEventListener('click', openSearchModal);
    }
    if (mobileSearchTriggerBtn) {
      mobileSearchTriggerBtn.addEventListener('click', openSearchModal);
    }

    if (searchModal) {
      document.addEventListener('click', function (e) {
        if (!searchModal.contains(e.target) && e.target !== searchTriggerBtn && e.target !== mobileSearchTriggerBtn) {
          searchModal.classList.remove('open');
        }
      });
    }

    // 検索用インデックスデータ
    const siteData = [
      {
        "title": "初心者教室について",
        "description": "龍翔会の初心者教室では、弓道の基本から丁寧に指導いたします。見学は随時受け付けております。",
        "url": "../beginner/index.html"
      },
      {
        "title": "県連・全弓連スケジュール",
        "description": "令和8年度・令和7年度の県連および全日本弓道連盟の行事予定表。",
        "url": "../schedule/index.html"
      },
      {
        "title": "第18回 かすみがうら市長杯弓道大会 要項",
        "description": "令和8年10月25日(日) かすみがうら市多目的運動広場 弓道場",
        "file": "../../assets/PDF/第18回かすみがうら市長杯案内.pdf"
      },
      {
        "title": "令和8年度 第3回【東京】関東地域連合審査会 要項",
        "description": "令和8年11月15日(日) 明治神宮至誠館・中央道場",
        "file": "../../assets/Excel/R8.11.15 第３回【東京】関東地域連連合審査実施要項等(茨城用).xlsx"
      },
      {
        "title": "2026年 中野杯記念大会 要項",
        "description": "令和8年11月15日(日) 土浦市立武道館弓道場",
        "file": "../../assets/PDF/2026年11月15日　中野杯記念大会_大会要項.pdf"
      },
      {
        "title": "第77回 三十三間堂大的全国大会 要項",
        "description": "令和9年1月17日(日) 蓮華王院本堂東庭 特設射場",
        "file": "../../assets/PDF/①第77回 三十三間堂大的全国大会実施要項.pdf"
      },
      {
        "title": "令和8年度【千葉】関東地域連合審査会 要項",
        "description": "令和8年11月29日(日) 千葉県総合スポーツセンター弓道場",
        "file": "../../assets/Excel/【茨城用】令和8年度(千葉)関東地域連合審査会　　　実施要項.xlsx"
      },
      {
        "title": "大会出席簿について",
        "description": "龍翔会大会出席簿・参加申し込み表。",
        "file": "../../assets/PDF/龍翔会　大会申し込み.pdf"
      },
      {
        "title": "お問い合わせ・見学案内",
        "description": "入門・見学のお問い合わせフォーム、弓道場へのアクセス情報。",
        "url": "../contact/index.html"
      }
    ];

    if (searchBtn && searchInput && searchResults) {
      function executeSearch() {
        const query = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        if (!query) return;

        const results = siteData.filter(function (item) {
          return (item.title + ' ' + item.description).toLowerCase().indexOf(query) !== -1;
        });

        if (results.length === 0) {
          searchResults.innerHTML = '<div class="search-result-entry"><p>該当する情報は見つかりませんでした。</p></div>';
          return;
        }

        results.forEach(function (item) {
          const div = document.createElement('div');
          div.className = 'search-result-entry';
          let html = '<h4>' + item.title + '</h4><p>' + item.description + '</p>';
          if (item.url) {
            html += '<p><a href="' + item.url + '" style="color:var(--accent);">🔗 ページを開く</a></p>';
          }
          if (item.file) {
            html += '<p><a href="' + item.file + '" target="_blank" style="color:var(--accent);">📄 資料を開く</a></p>';
          }
          div.innerHTML = html;
          searchResults.appendChild(div);
        });
      }

      searchBtn.addEventListener('click', executeSearch);
      searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') executeSearch();
      });
    }

    // 3. Back to Top (スムーズに最上部へスクロール)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      function checkScroll() {
        if (window.scrollY > 300) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }

      window.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll(); // 初期チェック

      backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  });
})();
