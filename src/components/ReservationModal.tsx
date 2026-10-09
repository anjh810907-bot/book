import React, { useState, useEffect } from 'react';
import { X, Calendar, User, BookOpen, Clock, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { Book } from '../types';

interface ReservationModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onConfirmReservation: (data: {
    bookId: string;
    userId: string;
    reservationDate: string;
    userName?: string;
    bookTitle: string;
    bookAuthor?: string;
    bookCover?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  book,
  isOpen,
  onClose,
  userId,
  onConfirmReservation,
  isSubmitting
}) => {
  const [inputUserId, setInputUserId] = useState(userId);
  const [userName, setUserName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('1층 무인 예약 대출기');

  // 날짜 계산: 오늘로부터 내일 기본값, 최소 오늘, 최대 14일 뒤
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);
  const maxDateStr = maxDate.toISOString().slice(0, 10);

  const [reservationDate, setReservationDate] = useState(tomorrowStr);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputUserId(userId);
      setReservationDate(tomorrowStr);
      setErrorMsg('');
    }
  }, [isOpen, userId]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUserId.trim()) {
      setErrorMsg('사용자 ID 또는 회원 번호를 입력해 주세요.');
      return;
    }
    if (!reservationDate) {
      setErrorMsg('수령 희망 날짜를 선택해 주세요.');
      return;
    }

    try {
      await onConfirmReservation({
        bookId: book.id,
        userId: inputUserId.trim(),
        userName: userName.trim() || undefined,
        reservationDate,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.coverImage
      });
    } catch (err: any) {
      setErrorMsg(err.message || '예약 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600/30 text-amber-300 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">도서 대출 예약 신청</h3>
              <p className="text-xs text-stone-400">수령 희망일자와 수령 장소를 확인해 주세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-50"
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Book Mini Card */}
        <div className="p-6 bg-stone-50 border-b border-stone-200/80">
          <div className="flex items-start gap-4">
            <div className="w-16 h-22 rounded-lg bg-stone-200 shrink-0 overflow-hidden shadow-xs border border-stone-300/60">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-300 text-stone-600">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-100 text-amber-900 border border-amber-200 mb-1">
                {book.category}
              </span>
              <h4 className="font-serif font-bold text-base text-stone-900 truncate" title={book.title}>
                {book.title}
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">{book.author} · {book.publisher || '도서관'}</p>
              {book.callNumber && (
                <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span className="font-mono">{book.callNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* User ID and Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span>회원 ID / 대출자 식별번호 *</span>
              </label>
              <input
                type="text"
                required
                value={inputUserId}
                onChange={(e) => setInputUserId(e.target.value)}
                placeholder="예: U001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                예약자 성명 (선택)
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>수령 희망 날짜 *</span>
            </label>
            <input
              type="date"
              required
              min={todayStr}
              max={maxDateStr}
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              disabled={isSubmitting}
            />
            <p className="text-[11px] text-stone-500 mt-1">
              오늘로부터 14일 이내({maxDateStr}까지) 선택 가능합니다.
            </p>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>수령 장소</span>
            </label>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 bg-white"
              disabled={isSubmitting}
            >
              <option value="1층 무인 예약 대출기">1층 로비 무인 예약 대출기 (24시간 운영)</option>
              <option value="2층 종합자료실 안내데스크">2층 종합자료실 안내데스크 (09:00~18:00)</option>
              <option value="3층 특성화자료실">3층 인문·디지털 특성화자료실</option>
            </select>
          </div>

          {/* Policy Notice Box */}
          <div className="bg-amber-50/80 rounded-xl p-3.5 border border-amber-200/70 text-amber-950 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-900">
              <Clock className="w-3.5 h-3.5" />
              <span>예약 안내 및 유의사항</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              • 예약 확정 후 수령 희망일 기준 3일 이내에 미수령 시 예약이 자동으로 취소됩니다.
              <br />
              • 취소는 언제든지 '내 예약 관리' 탭에서 가능합니다.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-900 text-amber-50 hover:bg-amber-950 active:scale-[0.99] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                  <span>예약 처리 중...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>예약 확정하기</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
