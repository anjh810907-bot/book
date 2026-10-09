import React, { useState, useMemo } from 'react';
import { Search, X, Filter, BookMarked, BookmarkCheck, Clock, MapPin, Check, AlertCircle, ArrowUpDown } from 'lucide-react';
import { Book } from '../types';

interface BookCatalogProps {
  books: Book[];
  isLoading: boolean;
  onOpenReserveModal: (book: Book) => void;
  apiError?: string;
  isFallback: boolean;
  onRefresh: () => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  isLoading,
  onOpenReserveModal,
  apiError,
  isFallback,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'author'>('default');

  // 도서 목록에서 실제 존재하는 카테고리 목록 동적 추출 (사용자 DB: 개발, 역사, 과학, 자기계발, 경제, 소설 등)
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => {
      if (b.category && b.category.trim()) {
        set.add(b.category.trim());
      }
    });
    return ['전체', ...Array.from(set)];
  }, [books]);

  // 필터링 및 정렬
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // 검색어 필터 (제목, 저자, 출판사, 청구기호)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(query);
          const matchAuthor = book.author.toLowerCase().includes(query);
          const matchPublisher = book.publisher?.toLowerCase().includes(query);
          const matchCallNum = book.callNumber?.toLowerCase().includes(query);
          if (!matchTitle && !matchAuthor && !matchPublisher && !matchCallNum) {
            return false;
          }
        }

        // 카테고리 필터
        if (selectedCategory !== '전체' && book.category !== selectedCategory) {
          return false;
        }

        // 상태 필터
        if (statusFilter === 'available' && book.status !== '대출가능') {
          return false;
        }
        if (statusFilter === 'reserved' && book.status === '대출가능') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title, 'ko');
        }
        if (sortBy === 'author') {
          return a.author.localeCompare(b.author, 'ko');
        }
        return 0;
      });
  }, [books, searchQuery, selectedCategory, statusFilter, sortBy]);

  // 대출 가능 도서 수
  const availableCount = useMemo(() => {
    return books.filter((b) => b.status === '대출가능').length;
  }, [books]);

  return (
    <div className="space-y-6">
      {/* Fallback / GAS Alert Banner if applicable */}
      {isFallback && apiError && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5 p-1 rounded-full bg-amber-200/80 text-amber-900">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">구글 앱스 스크립트 연결 안내</h3>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                현재 백엔드 응답: <span className="font-mono font-medium">{apiError}</span>
                <br />
                스마트 오프라인/로컬 캐시가 활성화되어 모든 검색과 도서 예약, 예약 취소 기능이 즉시 정상 작동합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="shrink-0 px-3.5 py-1.5 text-xs font-semibold bg-amber-200/80 hover:bg-amber-300/80 text-amber-950 rounded-lg transition-colors border border-amber-300"
          >
            실시간 재연결 시도
          </button>
        </div>
      )}

      {/* Hero / Search Section */}
      <div className="bg-gradient-to-b from-stone-900 to-stone-850 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/90 text-amber-300 text-xs font-medium border border-stone-700/80 mb-4">
            <BookMarked className="w-3.5 h-3.5" />
            <span>열린숲 도서관 온라인 예약 서비스</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-50 leading-tight">
            읽고 싶은 책을 찾고, <br className="hidden sm:inline" />
            미리 예약하여 바로 수령하세요.
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2 font-light">
            원하는 도서를 온라인으로 간편하게 예약하고 무인 대출기 또는 종합자료실에서 픽업하세요.
          </p>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="도서 제목, 저자, 출판사, 청구기호로 검색..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/80 focus:border-amber-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-1"
                  aria-label="검색어 지우기"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-stone-400 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> 분류:
          </span>
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs sm:text-sm">
          {/* Availability filter buttons */}
          <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 도서 ({books.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'available'
                  ? 'bg-white text-emerald-800 font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              대출 가능만 ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter('reserved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === 'reserved'
                  ? 'bg-white text-amber-900 font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              예약중 ({books.length - availableCount})
            </button>
          </div>

          {/* Right Sort dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-stone-500 hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> 정렬:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-1.5 pl-2.5 pr-8 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="default">도서관 추천순</option>
              <option value="title">도서명 오름차순</option>
              <option value="author">저자명 오름차순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-600">구글 시트 도서 목록을 불러오는 중입니다...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/80 p-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-stone-800">일치하는 도서가 없습니다</h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
            검색어 철자를 확인하시거나 필터 조건을 변경해 보세요.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('전체');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            검색 및 필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.status === '대출가능';

            return (
              <div
                key={book.id}
                className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Book Cover Image Container */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback image handling
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Fallback book illustration in case image fails */}
                  <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-stone-200 to-stone-300 text-stone-600 text-center">
                    <BookMarked className="w-12 h-12 text-stone-400 mb-2" />
                    <p className="font-serif font-bold text-sm text-stone-800 line-clamp-2">{book.title}</p>
                    <p className="text-xs text-stone-600 mt-1">{book.author}</p>
                  </div>

                  {/* Status Pill on Cover */}
                  <div className="absolute top-3 left-3">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-xs backdrop-blur-xs">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        대출가능
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-800/85 text-stone-200 shadow-xs backdrop-blur-xs">
                        <Clock className="w-3 h-3" />
                        예약중
                      </span>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/90 text-stone-800 shadow-xs backdrop-blur-xs">
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Book Metadata Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1 group-hover:text-amber-900 transition-colors" title={book.title}>
                      {book.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium line-clamp-1">
                      {book.author}
                      {book.publisher && <span className="text-stone-400 mx-1.5">|</span>}
                      {book.publisher && <span className="text-stone-500 font-normal">{book.publisher}</span>}
                    </p>

                    {/* Shelf Location / Call Number */}
                    {book.callNumber && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-stone-500 bg-stone-50 border border-stone-200/70 px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span className="font-mono text-stone-600">{book.callNumber}</span>
                      </div>
                    )}

                    {/* Brief snippet */}
                    {book.description && (
                      <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    )}
                  </div>

                  {/* Reserve Action Button */}
                  <div className="pt-2 border-t border-stone-100">
                    {isAvailable ? (
                      <button
                        onClick={() => onOpenReserveModal(book)}
                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 text-amber-50 hover:bg-amber-950 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <BookmarkCheck className="w-4 h-4 text-amber-400" />
                        <span>도서 예약하기</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium bg-stone-100 text-stone-400 cursor-not-allowed flex items-center justify-center gap-1.5"
                        title="현재 다른 이용자가 예약 또는 대출 중인 도서입니다."
                      >
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>예약 불가 (대출/예약중)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
