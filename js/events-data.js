/**
 * ==============================================================================
 * 龍翔会 大会・審査スケジュール管理データ (events-data.js)
 * ==============================================================================
 * 
 * 【次回主要行事の自動切り替えについて】
 * 本スクリプトは、端末の日付（現在日）を自動取得し、
 * 開催日が過ぎた大会・審査を自動的に終了とみなして非表示にし、
 * 次に最も近い「大会」と「審査」をそれぞれ1つずつトップページに自動表示します。
 * 
 * 【新しい大会・審査 実施要項の追加方法】
 * 令和8年度（および今後の年度）の新しい要項ファイル（PDFやExcel）が届いた際は、
 * 下記の `RYUSHOKAI_EVENTS` リストに以下のように追加してください。
 * 日付順はプログラムが自動で判定・整列するため、リストのどこに追加しても問題ありません。
 * 
 * 《追加テンプレート》
 * {
 *   type: 'tournament', // 大会なら 'tournament'、審査なら 'exam'
 *   title: '第〇〇回 〇〇弓道大会', // 行事名称
 *   date: '2026-12-10', // 開催日 (西暦 YYYY-MM-DD 半角英数字)
 *   dateDisplay: '令和8年12月10日(日)', // 画面に表示する日本語日付
 *   venue: '〇〇弓道場', // 会場名
 *   file: 'assets/PDF/〇〇要項.pdf', // 資料ファイルへのパス (index.htmlからの相対パス)
 *   fileType: 'PDF' // 'PDF' または 'Excel'
 * },
 */

window.RYUSHOKAI_EVENTS = [
  // --- 令和8年度 (2026年度) 大会・審査リスト ---
  {
    type: 'tournament',
    title: '第33回 県南弓道大会',
    date: '2026-09-27',
    dateDisplay: '令和8年9月27日(日)',
    venue: '取手グリーンスポーツセンター弓道場',
    file: 'assets/PDF/（県南弓道大会)  県下各支部へのご案内.pdf',
    fileType: 'PDF'
  },
  {
    type: 'tournament',
    title: '第18回 かすみがうら市長杯弓道大会',
    date: '2026-10-25',
    dateDisplay: '令和8年10月25日(日)',
    venue: 'かすみがうら市多目的運動広場 弓道場',
    file: 'assets/PDF/第18回かすみがうら市長杯案内.pdf',
    fileType: 'PDF'
  },
  {
    type: 'tournament',
    title: '2026年 中野杯記念大会',
    date: '2026-11-15',
    dateDisplay: '令和8年11月15日(日)',
    venue: '土浦市立武道館弓道場',
    file: 'assets/PDF/2026年11月15日　中野杯記念大会_大会要項.pdf',
    fileType: 'PDF'
  },
  {
    type: 'tournament',
    title: '第77回 三十三間堂大的全国大会',
    date: '2027-01-17',
    dateDisplay: '令和9年1月17日(日)',
    venue: '蓮華王院（三十三間堂）境内特設射場',
    file: 'assets/PDF/①第77回 三十三間堂大的全国大会実施要項.pdf',
    fileType: 'PDF'
  },
  {
    type: 'exam',
    title: '令和8年度 第3回【東京】関東地域連合審査会',
    date: '2026-11-15',
    dateDisplay: '令和8年11月15日(日)',
    venue: '明治神宮至誠館・全日本弓道連盟中央道場',
    file: 'assets/Excel/R8.11.15 第３回【東京】関東地域連連合審査実施要項等(茨城用).xlsx',
    fileType: 'Excel'
  },
  {
    type: 'exam',
    title: '令和8年度【千葉】関東地域連合審査会',
    date: '2026-11-29',
    dateDisplay: '令和8年11月29日(日)',
    venue: '千葉県総合スポーツセンター弓道場',
    file: 'assets/Excel/【茨城用】令和8年度(千葉)関東地域連合審査会　　　実施要項.xlsx',
    fileType: 'Excel'
  }
];

/**
 * 現在日時と照合し、直近の大会と審査を【次回主要行事】に自動描画する関数
 */
function updateUpcomingEvents() {
  const container = document.getElementById('upcoming-events-container');
  if (!container || !Array.isArray(window.RYUSHOKAI_EVENTS)) return;

  const now = new Date();
  // 当日00:00:00のタイムスタンプ（当日中は開催行事を表示し続ける）
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // 本日以降の予定行事を抽出
  const upcoming = window.RYUSHOKAI_EVENTS.filter(function (ev) {
    if (!ev.date) return false;
    const parts = ev.date.split('-').map(Number);
    if (parts.length !== 3) return false;
    const evDate = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    return evDate >= todayStart;
  });

  // 日付の近い順（昇順）にソート
  upcoming.sort(function (a, b) {
    const daParts = a.date.split('-').map(Number);
    const dbParts = b.date.split('-').map(Number);
    const da = new Date(daParts[0], daParts[1] - 1, daParts[2]).getTime();
    const db = new Date(dbParts[0], dbParts[1] - 1, dbParts[2]).getTime();
    return da - db;
  });

  // 直近の大会と審査をそれぞれ1件取得
  const nextTournament = upcoming.find(function (ev) { return ev.type === 'tournament'; });
  const nextExam = upcoming.find(function (ev) { return ev.type === 'exam'; });

  const tournamentBox = document.getElementById('upcoming-tournament-box');
  const examBox = document.getElementById('upcoming-exam-box');

  // 大会エリアの更新
  if (tournamentBox) {
    if (nextTournament) {
      const fileLabel = nextTournament.fileType === 'Excel' ? 'Excel' : 'PDF';
      tournamentBox.innerHTML =
        '<span style="font-weight: 600; color: #fff;">［大会］</span> ' + escapeHtml(nextTournament.dateDisplay) + ' ' + escapeHtml(nextTournament.title) + '<br>' +
        '<span style="font-size: 13px; color: var(--sub);">会場：' + escapeHtml(nextTournament.venue) + '</span><br>' +
        (nextTournament.file ? '<a href="' + encodeURI(nextTournament.file) + '" target="_blank" rel="noopener" style="text-decoration: underline; color: var(--accent); font-size: 13px;">▶ 大会案内 (' + fileLabel + ')</a>' : '');
    } else {
      tournamentBox.innerHTML =
        '<span style="font-weight: 600; color: #fff;">［大会］</span> 現在、次回予定の大会はありません<br>' +
        '<span style="font-size: 13px; color: var(--sub);">※実施要項が届き次第、更新いたします</span>';
    }
  }

  // 審査エリアの更新
  if (examBox) {
    if (nextExam) {
      const fileLabel = nextExam.fileType === 'Excel' ? 'Excel' : 'PDF';
      examBox.innerHTML =
        '<span style="font-weight: 600; color: #fff;">［審査］</span> ' + escapeHtml(nextExam.dateDisplay) + ' ' + escapeHtml(nextExam.title) + '<br>' +
        '<span style="font-size: 13px; color: var(--sub);">会場：' + escapeHtml(nextExam.venue) + '</span><br>' +
        (nextExam.file ? '<a href="' + encodeURI(nextExam.file) + '" target="_blank" rel="noopener" style="text-decoration: underline; color: var(--accent); font-size: 13px;">▶ 審査実施要項等 (' + fileLabel + ')</a>' : '');
    } else {
      examBox.innerHTML =
        '<span style="font-weight: 600; color: #fff;">［審査］</span> 現在、次回予定の審査はありません<br>' +
        '<span style="font-size: 13px; color: var(--sub);">※実施要項が届き次第、更新いたします</span>';
    }
  }
}

// XSS対策用エスケープ関数
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 初期実行（DOM読み込み時）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateUpcomingEvents);
} else {
  updateUpcomingEvents();
}
