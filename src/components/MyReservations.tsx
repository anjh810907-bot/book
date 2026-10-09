import React, { useState } from 'react';
import { CalendarCheck, Search, BookOpen, Clock, XCircle, AlertTriangle, ArrowRight, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { Reservation } from '../types';

interface MyReservationsProps {
  reservations: Reservation[];
  isLoading: boolean;
  userId: string;
  onSearchUserId: (id: string) => void;
  onCancelReservation: (reservationId: string, bookId: string) => Promise<void>;
  onNavigateToCatalog: () => void;
  onRefresh: () => void;
  isCancelingId: string | null;
}

export const MyReservations: React.FC<MyReservationsProps> = ({
  reservations,
  isLoading,
  userId,
  onSearchUserId,
  onCancelReservation,
  onNavigateToCatalog,
  onRefresh,
  isCancelingId,
}) => {
  const [searchInput, setSearchInput] = useState(userId);
  const [cancelingTarget, setCancelingTarget] = useState<Reservation | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchUserId(searchInput.trim());
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelingTarget) return;
    await onCancelReservation(cancelingTarget.reservationId, cancelingTarget.bookId);
    setCancelingTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with Search & User filter */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              내 도서 예약 관리
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-stone-100 text-stone-700">
              총 {reservations.length}건
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            신청하신 도서의 예약 현황을 조회하고 필요 시 수령 전 취소할 수 있습니다.
          </p>
        </div>

        {/* User Search & Refresh Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="회원 ID 입력..."
              className="pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50 w-36 sm:w-48"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
          >
            조회
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="목록 새로고침"
            className="p-2 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
          </button>
        </form>
      </div>

      {/* Reservation Cards List */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-stone-200">
          <div className="w-9 h-9 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-medium text-stone-600">
            '{userId}' 님의 예약 내역을 불러오는 중입니다...
          </p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            현재 접수된 예약 내역이 없습니다
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
            도서 목록에서 읽고 싶은 책을 골라 예약해 보세요. 수령 일자에 맞춰 도서관에서 준비해 드립니다.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold bg-stone-900 text-amber-50 rounded-xl hover:bg-amber-950 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>도서 둘러보고 예약하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservations.map((res) => {
            const isCompleted = res.status === '예약완료' || res.status === '수령대기';
            const isCanceled = res.status === '취소됨';
            const isBusy = isCancelingId === res.reservationId;

            return (
              <div
                key={res.reservationId}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  isCanceled
                    ? 'border-stone-200/70 bg-stone-50/60 opacity-80'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  {/* Top: Status & Res ID */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] text-stone-400 font-medium">
                      #{res.reservationId}
                    </span>

                    {/* Status badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        예약 완료 (수령 대기)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                        <XCircle className="w-3.5 h-3.5 text-stone-400" />
                        취소 완료
                      </span>
                    )}
                  </div>

                  {/* Book information */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-20 bg-stone-100 rounded-lg shrink-0 overflow-hidden border border-stone-200/80 shadow-2xs">
                      {res.bookCover ? (
                        <img
                          src={res.bookCover}
                          alt={res.bookTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-base text-stone-900 truncate" title={res.bookTitle}>
                        {res.bookTitle}
                      </h4>
                      {res.bookAuthor && (
                        <p className="text-xs text-stone-600 mt-0.5">{res.bookAuthor}</p>
                      )}

                      <div className="mt-2.5 space-y-1 text-xs text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>
                            수령 희망일:{' '}
                            <strong className="text-stone-900 font-semibold">{res.reservationDate}</strong>
                          </span>
                        </div>
                        {res.createdAt && (
                          <div className="text-[11px] text-stone-400 pl-5">
                            신청일: {res.createdAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action: Cancel reservation button */}
                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-[11px] text-stone-500">
                    신청자: <span className="font-semibold text-stone-700">{res.userId}</span>
                    {res.userName && ` (${res.userName})`}
                  </div>

                  {isCompleted ? (
                    <button
                      onClick={() => setCancelingTarget(res)}
                      disabled={isBusy}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {isBusy ? (
                        <>
                          <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                          <span>취소 중...</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>예약 취소</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">취소된 건</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setCancelingTarget(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-200 z-10 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-stone-900 font-serif">
              도서 예약을 취소하시겠습니까?
            </h3>
            <p className="text-xs text-center text-stone-600 mt-2 leading-relaxed">
              <strong>'{cancelingTarget.bookTitle}'</strong> 예약이 취소되며, 다른 회원이 해당 도서를 예약할 수 있게 됩니다.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setCancelingTarget(null)}
                className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors"
              >
                예약 취소 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
