/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BookCatalog } from './components/BookCatalog';
import { ReservationModal } from './components/ReservationModal';
import { MyReservations } from './components/MyReservations';
import { ApiSettingsGuide } from './components/ApiSettingsGuide';
import { HtmlExportModal } from './components/HtmlExportModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Book, Reservation } from './types';
import {
  getStoredApiUrl,
  setStoredApiUrl,
  getStoredUserId,
  setStoredUserId,
  fetchBooksFromApi,
  fetchReservationsFromApi,
  createReservationApi,
  cancelReservationApi,
  getLocalBooks,
  getLocalReservations,
  DEFAULT_GAS_API_URL
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'reservations' | 'settings'>('catalog');
  const [apiUrl, setApiUrl] = useState<string>(getStoredApiUrl());
  const [userId, setUserId] = useState<string>(getStoredUserId());

  const [books, setBooks] = useState<Book[]>(getLocalBooks());
  const [reservations, setReservations] = useState<Reservation[]>(getLocalReservations());

  const [isLoadingBooks, setIsLoadingBooks] = useState<boolean>(true);
  const [isLoadingReservations, setIsLoadingReservations] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [apiError, setApiError] = useState<string>('');
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(false);

  // Reservation Modal
  const [selectedBookForReserve, setSelectedBookForReserve] = useState<Book | null>(null);
  const [isSubmittingReserve, setIsSubmittingReserve] = useState<boolean>(false);

  // Canceling Reservation
  const [isCancelingId, setIsCancelingId] = useState<string | null>(null);

  // HTML Export Modal
  const [isHtmlExportOpen, setIsHtmlExportOpen] = useState<boolean>(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // API Test Status
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    raw?: string;
  } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 도서 목록 불러오기
  const loadBooks = useCallback(async (currentUrl: string, silent = false) => {
    if (!silent) setIsLoadingBooks(true);
    try {
      const res = await fetchBooksFromApi(currentUrl);
      setBooks(res.books);
      setIsFallback(res.isFallback);
      setApiConnected(res.success);

      if (!res.success && res.errorMessage) {
        setApiError(res.errorMessage);
      } else {
        setApiError('');
      }
    } catch (err: any) {
      setIsFallback(true);
      setApiError(err.message || '도서 목록 조회 실패');
    } finally {
      if (!silent) setIsLoadingBooks(false);
    }
  }, []);

  // 내 예약 목록 불러오기
  const loadReservations = useCallback(async (currentUrl: string, currentUserId: string, silent = false) => {
    if (!silent) setIsLoadingReservations(true);
    try {
      const res = await fetchReservationsFromApi(currentUrl, currentUserId);
      setReservations(res.reservations);
    } catch (err) {
      const local = getLocalReservations().filter(
        (r) => !currentUserId || r.userId.toLowerCase() === currentUserId.toLowerCase()
      );
      setReservations(local);
    } finally {
      if (!silent) setIsLoadingReservations(false);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    loadBooks(apiUrl);
    loadReservations(apiUrl, userId);
  }, [apiUrl, userId, loadBooks, loadReservations]);

  // 전체 새로고침
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadBooks(apiUrl, true),
      loadReservations(apiUrl, userId, true),
    ]);
    setIsRefreshing(false);
    addToast('데이터 동기화 완료', '도서 목록 및 예약 내역이 갱신되었습니다.', 'info');
  };

  // 사용자 ID 변경
  const handleSetUserId = (newId: string) => {
    setUserId(newId);
    setStoredUserId(newId);
    loadReservations(apiUrl, newId);
    addToast('사용자 전환', `현재 사용자 ID가 '${newId}'(으)로 변경되었습니다.`, 'info');
  };

  // API URL 저장
  const handleSaveApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
    setStoredApiUrl(newUrl);
    addToast('설정 저장 완료', 'API 배포 URL이 업데이트되었습니다.', 'success');
    loadBooks(newUrl);
    loadReservations(newUrl, userId);
  };

  // API 연결 테스트
  const handleTestConnection = async () => {
    setIsTestingApi(true);
    setTestStatus(null);
    try {
      const testRes = await fetchBooksFromApi(apiUrl);
      if (testRes.success) {
        setTestStatus({
          tested: true,
          success: true,
          message: `연결 성공! ${testRes.books.length}권의 도서 데이터를 수신했습니다.`,
          raw: testRes.rawText,
        });
        addToast('연결 테스트 성공', 'Google Apps Script와 정상적으로 통신 중입니다.', 'success');
      } else {
        setTestStatus({
          tested: true,
          success: false,
          message: testRes.errorMessage || '응답 오류 발생',
          raw: testRes.rawText || testRes.errorMessage,
        });
        addToast('연결 테스트 안내', testRes.errorMessage || '오류가 발생했습니다.', 'error');
      }
    } catch (err: any) {
      setTestStatus({
        tested: true,
        success: false,
        message: err.message || '네트워크 연결 실패',
      });
      addToast('네트워크 오류', '서버에 접근할 수 없습니다.', 'error');
    } finally {
      setIsTestingApi(false);
    }
  };

  // 도서 예약 모달 열기
  const handleOpenReserveModal = (book: Book) => {
    setSelectedBookForReserve(book);
  };

  // 도서 예약 확정 처리
  const handleConfirmReservation = async (data: {
    bookId: string;
    userId: string;
    reservationDate: string;
    userName?: string;
    bookTitle: string;
    bookAuthor?: string;
    bookCover?: string;
  }) => {
    setIsSubmittingReserve(true);
    try {
      const result = await createReservationApi(apiUrl, data);
      
      // 모달 닫기
      setSelectedBookForReserve(null);

      // 도서 목록 상태에서 해당 도서 '예약중'으로 업데이트
      setBooks((prev) =>
        prev.map((b) => (b.id === data.bookId ? { ...b, status: '예약중' } : b))
      );

      // 내 예약 목록 갱신
      if (result.reservation) {
        setReservations((prev) => [result.reservation!, ...prev]);
      } else {
        await loadReservations(apiUrl, userId, true);
      }

      addToast('도서 예약 완료', result.message, 'success');

      // 예약 후 내 예약 탭으로 자동 이동 안내 옵션
    } catch (err: any) {
      addToast('예약 실패', err.message || '도서 예약 중 문제가 발생했습니다.', 'error');
      throw err;
    } finally {
      setIsSubmittingReserve(false);
    }
  };

  // 예약 취소 처리
  const handleCancelReservation = async (reservationId: string, bookId: string) => {
    setIsCancelingId(reservationId);
    try {
      const result = await cancelReservationApi(apiUrl, reservationId, bookId);

      // 예약 상태 '취소됨'으로 반영
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId ? { ...r, status: '취소됨' } : r
        )
      );

      // 도서 상태 '대출가능'으로 원복
      setBooks((prev) =>
        prev.map((b) => (b.id === bookId ? { ...b, status: '대출가능' } : b))
      );

      addToast('예약 취소 완료', result.message, 'info');
    } catch (err: any) {
      addToast('취소 오류', err.message || '예약 취소 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsCancelingId(null);
    }
  };

  // 내 활성 예약 수
  const activeReservationCount = reservations.filter(
    (r) => r.status === '예약완료' || r.status === '수령대기'
  ).length;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col selection:bg-amber-200 selection:text-amber-950">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userId={userId}
        setUserId={handleSetUserId}
        reservationCount={activeReservationCount}
        apiConnected={apiConnected}
        onRefreshAll={handleRefreshAll}
        isRefreshing={isRefreshing}
        onOpenHtmlExport={() => setIsHtmlExportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'catalog' && (
          <BookCatalog
            books={books}
            isLoading={isLoadingBooks}
            onOpenReserveModal={handleOpenReserveModal}
            apiError={apiError}
            isFallback={isFallback}
            onRefresh={() => loadBooks(apiUrl)}
          />
        )}

        {activeTab === 'reservations' && (
          <MyReservations
            reservations={reservations}
            isLoading={isLoadingReservations}
            userId={userId}
            onSearchUserId={handleSetUserId}
            onCancelReservation={handleCancelReservation}
            onNavigateToCatalog={() => setActiveTab('catalog')}
            onRefresh={() => loadReservations(apiUrl, userId)}
            isCancelingId={isCancelingId}
          />
        )}

        {activeTab === 'settings' && (
          <ApiSettingsGuide
            apiUrl={apiUrl}
            onSaveApiUrl={handleSaveApiUrl}
            onTestConnection={handleTestConnection}
            testStatus={testStatus}
            isTesting={isTestingApi}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 열린숲 스마트 도서관 · Google Apps Script & Sheets 실시간 연동</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHtmlExportOpen(true)}
              className="text-stone-600 hover:text-stone-900 underline decoration-dotted font-medium"
            >
              단일 HTML 파일 다운로드
            </button>
            <span className="text-stone-300">·</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-stone-600 hover:text-stone-900 underline decoration-dotted font-medium"
            >
              GAS API 설정
            </button>
          </div>
        </div>
      </footer>

      {/* Reservation Modal */}
      <ReservationModal
        book={selectedBookForReserve}
        isOpen={Boolean(selectedBookForReserve)}
        onClose={() => setSelectedBookForReserve(null)}
        userId={userId}
        onConfirmReservation={handleConfirmReservation}
        isSubmitting={isSubmittingReserve}
      />

      {/* Standalone Single HTML Code Modal */}
      <HtmlExportModal
        isOpen={isHtmlExportOpen}
        onClose={() => setIsHtmlExportOpen(false)}
        apiUrl={apiUrl}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
