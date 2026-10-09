import React from 'react';
import { BookOpen, CalendarCheck, Settings, User, Code2, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'catalog' | 'reservations' | 'settings';
  setActiveTab: (tab: 'catalog' | 'reservations' | 'settings') => void;
  userId: string;
  setUserId: (id: string) => void;
  reservationCount: number;
  apiConnected: boolean;
  onRefreshAll: () => void;
  isRefreshing: boolean;
  onOpenHtmlExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userId,
  setUserId,
  reservationCount,
  apiConnected,
  onRefreshAll,
  isRefreshing,
  onOpenHtmlExport,
}) => {
  const [isEditingUser, setIsEditingUser] = React.useState(false);
  const [tempUserId, setTempUserId] = React.useState(userId);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserId.trim()) {
      setUserId(tempUserId.trim());
      setIsEditingUser(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 text-amber-100 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 font-serif">
                  열린숲 도서관
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-100/70 text-amber-900 border border-amber-200/60">
                  도서 예약 포털
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                구글 시트 & Apps Script 실시간 연동 스마트 도서관
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200/80">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>도서 검색 & 대출 예약</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all relative ${
                activeTab === 'reservations'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-emerald-700" />
              <span>내 예약 관리</span>
              {reservationCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full">
                  {reservationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Settings className="w-4 h-4 text-stone-700" />
              <span>API 설정 & GAS 가이드</span>
            </button>
          </nav>

          {/* Right Controls: User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Refresh */}
            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              title="데이터 동기화 및 새로고침"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200/80 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`} />
            </button>

            {/* Standalone HTML Export button */}
            <button
              onClick={onOpenHtmlExport}
              title="단일 HTML 코드 복사 및 다운로드"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-stone-600" />
              <span>단일 HTML 보기</span>
            </button>

            {/* User ID profile button */}
            <div className="relative">
              {isEditingUser ? (
                <form onSubmit={handleSaveUser} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempUserId}
                    onChange={(e) => setTempUserId(e.target.value)}
                    placeholder="사용자 ID"
                    className="w-28 sm:w-32 px-2.5 py-1 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    확인
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempUserId(userId);
                    setIsEditingUser(true);
                  }}
                  className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200/80 rounded-lg transition-colors"
                  title="클릭하여 사용자 ID 변경"
                >
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="max-w-[100px] sm:max-w-[140px] truncate font-medium">
                    {userId === 'U001' ? 'U001 (홍길동)' : userId}
                  </span>
                  <span className="text-[10px] text-stone-400 underline decoration-dotted">변경</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
              activeTab === 'catalog' ? 'text-amber-950 font-bold' : 'text-stone-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>도서목록</span>
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg relative ${
              activeTab === 'reservations' ? 'text-emerald-950 font-bold' : 'text-stone-500'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>내 예약 ({reservationCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${
              activeTab === 'settings' ? 'text-stone-950 font-bold' : 'text-stone-500'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>API 설정</span>
          </button>
        </div>
      </div>
    </header>
  );
};
