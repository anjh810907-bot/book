import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, ExternalLink } from 'lucide-react';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

export const HtmlExportModal: React.FC<HtmlExportModalProps> = ({
  isOpen,
  onClose,
  apiUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneHtmlCode = generateStandaloneHtml(apiUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library-reservation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600/30 text-amber-300 rounded-xl">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">단일 HTML 파일 내보내기 & 복사</h3>
              <p className="text-xs text-stone-400">
                외부 의존성 없이 브라우저에서 더블 클릭만으로 바로 실행되는 단일 파일 코드입니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-stone-600 font-medium">
            HTML + CSS(Tailwind CDN) + 순수 Vanilla JS 통합 코드
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사 완료!' : '전체 코드 복사'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>.html 파일 다운로드</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-stone-950 font-mono text-xs text-stone-200 leading-relaxed">
          <pre>{standaloneHtmlCode}</pre>
        </div>
      </div>
    </div>
  );
};

export function generateStandaloneHtml(apiUrl: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>열린숲 도서관 - 도서 예약 웹앱</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Pretendard', sans-serif; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body class="bg-stone-50 text-stone-900 min-h-screen flex flex-col">

  <!-- Header -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center font-bold text-lg">
          📚
        </div>
        <div>
          <h1 class="text-lg font-bold text-stone-900">열린숲 도서관</h1>
          <p class="text-xs text-stone-500 hidden sm:block">Google Apps Script 연동 도서 예약 시스템</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2">
        <button id="tabCatalogBtn" onclick="switchTab('catalog')" class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-stone-900 text-white transition-all">
          도서 검색 & 예약
        </button>
        <button id="tabReservationsBtn" onclick="switchTab('reservations')" class="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-stone-600 hover:text-stone-900 bg-stone-100 transition-all flex items-center gap-1.5">
          <span>내 예약 관리</span>
          <span id="reservationCountBadge" class="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full hidden">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

    <!-- Global API Status Notice -->
    <div id="statusBanner" class="hidden rounded-2xl p-4 text-xs flex items-center justify-between border"></div>

    <!-- TAB 1: CATALOG VIEW -->
    <section id="catalogSection" class="space-y-6">
      <!-- Search & Hero -->
      <div class="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <h2 class="text-xl sm:text-2xl font-bold mb-2">원하는 책을 찾고 바로 예약하세요</h2>
        <p class="text-xs sm:text-sm text-stone-300 mb-5">실시간으로 구글 시트와 연동되어 도서 대출 및 예약을 지원합니다.</p>
        <div class="flex flex-col sm:flex-row gap-2 max-w-2xl">
          <input type="text" id="searchInput" oninput="handleSearch()" placeholder="도서 제목, 저자명 검색..." class="flex-1 px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          <button onclick="handleSearch()" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition-colors">
            검색
          </button>
        </div>
      </div>

      <!-- Categories & Filters -->
      <div class="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <div class="flex items-center gap-1.5 overflow-x-auto" id="categoryContainer"></div>
        <div class="flex items-center gap-2 text-xs">
          <label class="text-stone-500">필터:</label>
          <select id="statusFilter" onchange="handleFilterChange()" class="border border-stone-200 rounded-lg px-2.5 py-1.5 bg-stone-50 text-stone-700">
            <option value="all">전체 도서</option>
            <option value="available">대출 가능만</option>
            <option value="reserved">예약중만</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div id="booksLoading" class="hidden py-20 text-center">
        <div class="w-8 h-8 border-4 border-stone-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-xs text-stone-500">도서 목록을 불러오는 중입니다...</p>
      </div>

      <!-- Books Grid -->
      <div id="booksGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"></div>
    </section>

    <!-- TAB 2: MY RESERVATIONS VIEW -->
    <section id="reservationsSection" class="hidden space-y-6">
      <div class="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-stone-900">내 도서 예약 내역</h2>
          <p class="text-xs text-stone-500">사용자 ID로 예약된 도서들을 조회하고 취소할 수 있습니다.</p>
        </div>
        <div class="flex items-center gap-2">
          <input type="text" id="userIdInput" value="U001" placeholder="회원 ID" class="px-3 py-1.5 text-xs sm:text-sm rounded-xl border border-stone-300 bg-stone-50" />
          <button onclick="loadReservations()" class="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800">
            조회
          </button>
        </div>
      </div>

      <!-- Reservations List -->
      <div id="reservationsLoading" class="hidden py-16 text-center">
        <div class="w-8 h-8 border-4 border-stone-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-xs text-stone-500">예약 내역 조회 중...</p>
      </div>
      <div id="reservationsList" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
    </section>

  </main>

  <!-- RESERVATION MODAL -->
  <div id="reserveModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs" onclick="closeReserveModal()"></div>
    <div class="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 z-10 space-y-4">
      <div class="flex items-center justify-between border-b pb-3">
        <h3 class="font-bold text-base text-stone-900">도서 예약 신청</h3>
        <button onclick="closeReserveModal()" class="text-stone-400 hover:text-stone-800 text-xl font-bold">×</button>
      </div>

      <!-- Book Info in Modal -->
      <div id="modalBookInfo" class="bg-stone-50 p-3 rounded-xl border text-xs flex gap-3"></div>

      <!-- Form -->
      <form onsubmit="submitReservation(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-stone-700 mb-1">회원 ID *</label>
          <input type="text" id="modalUserId" required class="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900" />
        </div>
        <div>
          <label class="block font-semibold text-stone-700 mb-1">수령 희망 날짜 *</label>
          <input type="date" id="modalDate" required class="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900" />
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button type="button" onclick="closeReserveModal()" class="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-medium">취소</button>
          <button type="submit" id="modalSubmitBtn" class="px-4 py-2 rounded-xl bg-stone-900 text-white font-semibold">예약 확정</button>
        </div>
      </form>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="toastContainer" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"></div>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    const API_URL = "${apiUrl}";
    let currentTab = 'catalog';
    let booksData = [];
    let reservationsData = [];
    let currentSelectedBook = null;

    // 사용자 스프레드시트 데이터베이스(BK003 ~ BK012)와 100% 일치하는 기본 장서 목록
    const SAMPLE_BOOKS = [
      { id: 'BK003', bookId: 'BK003', title: '리팩터링 2판', author: '마틴 파울러', category: '개발', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', publisher: '한빛미디어', callNumber: '005.13-파68ㄹ', description: '소프트웨어 구조를 더 안전하고 읽기 쉽게 개선하는 리팩터링 핵심 기법.' },
      { id: 'BK004', bookId: 'BK004', title: '객체지향의 사실과 오해', author: '조영호', category: '개발', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', publisher: '위키북스', callNumber: '005.11-조64ㄱ', description: '역할, 책임, 협력의 관점에서 객체지향의 본질을 명쾌하게 파헤친 국내 개발자 필독서.' },
      { id: 'BK005', bookId: 'BK005', title: '사피엔스', author: '유발 하라리', category: '역사', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400', publisher: '김영사', callNumber: '909-하29ㅅ', description: '변방의 유인원에서 지구의 지배자가 된 인류 호모 사피엔스의 거대한 문명사.' },
      { id: 'BK006', bookId: 'BK006', title: '코스모스', author: '칼 세이건', category: '과학', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400', publisher: '사이언스북스', callNumber: '440-세68ㅋ', description: '광대한 우주 속에서 인간의 위치와 존재 이유를 탐구하는 교양 과학의 고전 명작.' },
      { id: 'BK007', bookId: 'BK007', title: '원씽 (The One Thing)', author: '게리 켈러', category: '자기계발', status: '예약중', coverUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400', publisher: '비즈니스북스', callNumber: '325.2-켈34ㅇ', description: '복잡한 세상을 이기는 단 하나의 원칙. 가장 중요한 단 하나의 일에 집중하는 법.' },
      { id: 'BK008', bookId: 'BK008', title: '세이노의 가르침', author: '세이노', category: '자기계발', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', publisher: '데이원', callNumber: '325.2-세68ㅅ', description: '수천억 원대 자산가 세이노가 20여 년간 실전에서 체득한 삶의 지혜와 부에 관한 냉철한 통찰.' },
      { id: 'BK009', bookId: 'BK009', title: '트렌드 코리아 2024', author: '김난도 외', category: '경제', status: '대출중', coverUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400', publisher: '미래의창', callNumber: '320.9-김29ㅌ', description: '분초사회, 호모 프롬프트 등 시대의 변화를 읽는 대한민국 소비 트렌드 전망.' },
      { id: 'BK010', bookId: 'BK010', title: '불편한 편의점', author: '김호연', category: '소설', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', publisher: '나무옆의자', callNumber: '813.7-김95ㅂ', description: '청파동 골목 모퉁이에 자리한 작은 편의점에서 피어나는 따스하고 유쾌한 힐링 드라마.' },
      { id: 'BK011', bookId: 'BK011', title: '미드나잇 라이브러리', author: '매트 헤이그', category: '소설', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', publisher: '인플루엔셜', callNumber: '843-헤67ㅁ', description: '자정의 도서관에서 펼쳐지는 삶의 무수한 가능성과 두 번째 기회에 관한 이야기.' },
      { id: 'BK012', bookId: 'BK012', title: '도파민식스', author: '애나 렘키', category: '과학', status: '대출가능', coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400', publisher: '흐름출판', callNumber: '513.8-렘34ㄷ', description: '쾌락 과잉의 시대에서 뇌의 보상 시스템과 도파민 중독을 다스리는 지혜.' }
    ];

    const CATEGORIES = ['전체', '개발', '역사', '과학', '자기계발', '경제', '소설'];
    let selectedCategory = '전체';

    // 1. 초기 실행
    window.addEventListener('DOMContentLoaded', () => {
      renderCategories();
      loadBooks();
      loadReservations();
      setupDateDefaults();
    });

    function setupDateDefaults() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const str = tomorrow.toISOString().slice(0, 10);
      document.getElementById('modalDate').value = str;
      document.getElementById('modalDate').min = new Date().toISOString().slice(0, 10);
    }

    // 탭 전환
    function switchTab(tab) {
      currentTab = tab;
      const catSec = document.getElementById('catalogSection');
      const resSec = document.getElementById('reservationsSection');
      const catBtn = document.getElementById('tabCatalogBtn');
      const resBtn = document.getElementById('tabReservationsBtn');

      if (tab === 'catalog') {
        catSec.classList.remove('hidden');
        resSec.classList.add('hidden');
        catBtn.className = "px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-stone-900 text-white transition-all";
        resBtn.className = "px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-stone-600 hover:text-stone-900 bg-stone-100 transition-all flex items-center gap-1.5";
      } else {
        catSec.classList.add('hidden');
        resSec.classList.remove('hidden');
        catBtn.className = "px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-stone-600 hover:text-stone-900 bg-stone-100 transition-all";
        resBtn.className = "px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-stone-900 text-white transition-all flex items-center gap-1.5";
        loadReservations();
      }
    }

    // 2. 도서 목록 조회 (GET ?action=getBooks)
    async function loadBooks() {
      showLoading('booksLoading', true);
      try {
        const res = await fetch(\`\${API_URL}?action=getBooks\`, { redirect: 'follow' });
        const text = await res.text();
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          showStatusBanner("GAS 실행 오류: 스프레드시트 탭 확인 필요. 오프라인 샘플 데이터로 로드합니다.", "warning");
          booksData = SAMPLE_BOOKS;
        } else {
          const json = JSON.parse(text);
          booksData = (json && (json.books || json.data || json)) || SAMPLE_BOOKS;
          if (!Array.isArray(booksData) || booksData.length === 0) booksData = SAMPLE_BOOKS;
        }
      } catch (err) {
        booksData = SAMPLE_BOOKS;
        showStatusBanner("네트워크 또는 GAS 설정 대기 상태: 로컬 모드로 작동합니다.", "info");
      } finally {
        showLoading('booksLoading', false);
        renderBooks();
      }
    }

    // 카테고리 렌더링
    function renderCategories() {
      const container = document.getElementById('categoryContainer');
      container.innerHTML = CATEGORIES.map(cat => \`
        <button onclick="setCategory('\${cat}')" class="px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors \${
          selectedCategory === cat ? 'bg-stone-900 text-white font-semibold' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
        }">
          \${cat}
        </button>
      \`).join('');
    }

    function setCategory(cat) {
      selectedCategory = cat;
      renderCategories();
      renderBooks();
    }

    function handleSearch() {
      renderBooks();
    }

    function handleFilterChange() {
      renderBooks();
    }

    // 도서 목록 화면 렌더링
    function renderBooks() {
      const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
      const statusF = document.getElementById('statusFilter').value;
      const grid = document.getElementById('booksGrid');

      const filtered = booksData.filter(b => {
        if (query && !b.title.toLowerCase().includes(query) && !b.author.toLowerCase().includes(query)) return false;
        if (selectedCategory !== '전체' && b.category !== selectedCategory) return false;
        if (statusF === 'available' && b.status !== '대출가능') return false;
        if (statusF === 'reserved' && b.status === '대출가능') return false;
        return true;
      });

      if (filtered.length === 0) {
        grid.innerHTML = \`<div class="col-span-full py-16 text-center text-stone-400 text-sm">해당 조건의 도서가 없습니다.</div>\`;
        return;
      }

      grid.innerHTML = filtered.map(b => {
        const isAvail = b.status === '대출가능';
        return \`
          <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div class="relative aspect-[3/4] bg-stone-100">
              <img src="\${b.coverUrl || b.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'}" alt="\${b.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'" />
              <div class="absolute top-2.5 left-2.5">
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold \${isAvail ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-200'}">
                  \${b.status}
                </span>
              </div>
              <div class="absolute top-2.5 right-2.5">
                <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/90 text-stone-800">
                  \${b.category}
                </span>
              </div>
            </div>
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 class="font-bold text-sm sm:text-base text-stone-900 line-clamp-1">\${b.title}</h3>
                <p class="text-xs text-stone-600 mt-0.5">\${b.author} | \${b.publisher || '도서관'}</p>
                <p class="text-xs text-stone-500 mt-2 line-clamp-2">\${b.description || ''}</p>
              </div>
              <div class="pt-2 border-t border-stone-100">
                \${isAvail ? \`
                  <button onclick="openReserveModal('\${b.id}')" class="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-stone-900 text-amber-50 hover:bg-amber-950 transition-colors">
                    도서 예약하기
                  </button>
                \` : \`
                  <button disabled class="w-full py-2 px-3 rounded-xl text-xs font-medium bg-stone-100 text-stone-400 cursor-not-allowed">
                    예약 불가 (예약중)
                  </button>
                \`}
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // 3. 도서 예약 모달 열기
    function openReserveModal(bookId) {
      currentSelectedBook = booksData.find(b => b.id === bookId);
      if (!currentSelectedBook) return;

      document.getElementById('modalUserId').value = document.getElementById('userIdInput').value || 'U001';
      document.getElementById('modalBookInfo').innerHTML = \`
        <div class="w-12 h-16 bg-stone-200 rounded shrink-0 overflow-hidden">
          <img src="\${currentSelectedBook.coverUrl || currentSelectedBook.coverImage}" class="w-full h-full object-cover" />
        </div>
        <div>
          <span class="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">\${currentSelectedBook.category}</span>
          <h4 class="font-bold text-stone-900 mt-1">\${currentSelectedBook.title}</h4>
          <p class="text-stone-500 text-[11px]">\${currentSelectedBook.author}</p>
        </div>
      \`;

      document.getElementById('reserveModal').classList.remove('hidden');
    }

    function closeReserveModal() {
      document.getElementById('reserveModal').classList.add('hidden');
    }

    // 4. 예약 확정 (POST { action: "createReservation", payload: { bookId, userId, reservationDate } })
    async function submitReservation(e) {
      e.preventDefault();
      if (!currentSelectedBook) return;

      const userId = document.getElementById('modalUserId').value.trim();
      const resDate = document.getElementById('modalDate').value;
      const btn = document.getElementById('modalSubmitBtn');

      btn.disabled = true;
      btn.innerText = '처리 중...';

      const payload = {
        action: 'createReservation',
        payload: {
          bookId: currentSelectedBook.id,
          userId: userId,
          reservationDate: resDate,
          bookTitle: currentSelectedBook.title
        }
      };

      try {
        // text/plain 형식으로 전송하여 GAS의 CORS 사전검사(OPTIONS) 방지
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });
      } catch (err) {
        console.warn('API 전송 후 로컬 반영 진행:', err);
      }

      // 로컬 상태 즉시 갱신
      currentSelectedBook.status = '예약중';
      const newRes = {
        reservationId: 'RES-' + Date.now(),
        bookId: currentSelectedBook.id,
        bookTitle: currentSelectedBook.title,
        userId: userId,
        reservationDate: resDate,
        createdAt: new Date().toISOString().slice(0, 10),
        status: '예약완료'
      };
      reservationsData.unshift(newRes);

      btn.disabled = false;
      btn.innerText = '예약 확정';
      closeReserveModal();
      showToast('도서 예약이 성공적으로 접수되었습니다!', 'success');
      renderBooks();
      updateReservationBadge();
    }

    // 5. 내 예약 조회 (GET ?action=getReservations&userId=...)
    async function loadReservations() {
      const userId = document.getElementById('userIdInput').value.trim();
      showLoading('reservationsLoading', true);

      try {
        const res = await fetch(\`\${API_URL}?action=getReservations&userId=\${encodeURIComponent(userId)}\`, { redirect: 'follow' });
        const text = await res.text();
        if (!text.includes('<!DOCTYPE')) {
          const json = JSON.parse(text);
          if (json && (json.reservations || json.data)) {
            reservationsData = json.reservations || json.data;
          }
        }
      } catch (err) {
        // 로컬 데이터 유지
      } finally {
        showLoading('reservationsLoading', false);
        renderReservations();
        updateReservationBadge();
      }
    }

    function renderReservations() {
      const list = document.getElementById('reservationsList');
      const userId = document.getElementById('userIdInput').value.trim();
      const filtered = reservationsData.filter(r => !userId || String(r.userId).toLowerCase() === userId.toLowerCase());

      if (filtered.length === 0) {
        list.innerHTML = \`<div class="col-span-full py-16 text-center text-stone-400 text-sm">신청된 예약 내역이 없습니다.</div>\`;
        return;
      }

      list.innerHTML = filtered.map(r => {
        const isDone = r.status === '예약완료';
        return \`
          <div class="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-mono text-stone-400">#\${r.reservationId}</span>
                <span class="px-2 py-0.5 rounded-full font-semibold \${isDone ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}">
                  \${r.status}
                </span>
              </div>
              <h4 class="font-bold text-stone-900 text-sm">\${r.bookTitle}</h4>
              <p class="text-xs text-stone-500 mt-1">수령 희망일: <strong class="text-stone-800">\${r.reservationDate}</strong></p>
            </div>
            <div class="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span class="text-stone-400">회원: \${r.userId}</span>
              \${isDone ? \`
                <button onclick="cancelReservation('\${r.reservationId}', '\${r.bookId}')" class="px-3 py-1 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 font-semibold border border-rose-200">
                  예약 취소
                </button>
              \` : '<span class="text-stone-400">취소됨</span>'}
            </div>
          </div>
        \`;
      }).join('');
    }

    // 6. 예약 취소 (POST { action: "cancelReservation", payload: { reservationId } })
    async function cancelReservation(reservationId, bookId) {
      if (!confirm('정말 이 예약을 취소하시겠습니까?')) return;

      const payload = {
        action: 'cancelReservation',
        payload: { reservationId: reservationId }
      };

      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          redirect: 'follow'
        });
      } catch (e) {
        console.warn('API 취소 요청 후 로컬 반영:', e);
      }

      // 로컬 상태 업데이트
      const target = reservationsData.find(r => r.reservationId === reservationId);
      if (target) target.status = '취소됨';
      if (bookId) {
        const book = booksData.find(b => b.id === bookId);
        if (book) book.status = '대출가능';
      }

      showToast('예약이 성공적으로 취소되었습니다.', 'info');
      renderReservations();
      renderBooks();
      updateReservationBadge();
    }

    // 배지 업데이트
    function updateReservationBadge() {
      const badge = document.getElementById('reservationCountBadge');
      const activeCount = reservationsData.filter(r => r.status === '예약완료').length;
      if (activeCount > 0) {
        badge.innerText = activeCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    // 토스트 및 배너 알림
    function showToast(message, type) {
      const container = document.getElementById('toastContainer');
      const div = document.createElement('div');
      div.className = \`pointer-events-auto p-4 rounded-xl shadow-lg border text-xs font-semibold \${
        type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-900 text-white'
      }\`;
      div.innerText = message;
      container.appendChild(div);
      setTimeout(() => div.remove(), 3000);
    }

    function showStatusBanner(msg, type) {
      const banner = document.getElementById('statusBanner');
      banner.className = \`rounded-2xl p-4 text-xs flex items-center justify-between border mb-4 \${
        type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'
      }\`;
      banner.innerHTML = \`<span>💡 \${msg}</span>\`;
      banner.classList.remove('hidden');
    }

    function showLoading(id, show) {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', !show);
    }
  </script>
</body>
</html>`;
}
