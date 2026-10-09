import React, { useState } from 'react';
import { Settings, Check, Copy, ExternalLink, RefreshCw, AlertCircle, FileSpreadsheet, Server, Code, CheckCircle2, ShieldAlert, Users, CalendarCheck, BookOpen } from 'lucide-react';
import { DEFAULT_GAS_API_URL } from '../services/api';

interface ApiSettingsGuideProps {
  apiUrl: string;
  onSaveApiUrl: (url: string) => void;
  onTestConnection: () => Promise<void>;
  testStatus: {
    tested: boolean;
    success: boolean;
    message: string;
    raw?: string;
  } | null;
  isTesting: boolean;
}

export const ApiSettingsGuide: React.FC<ApiSettingsGuideProps> = ({
  apiUrl,
  onSaveApiUrl,
  onTestConnection,
  testStatus,
  isTesting,
}) => {
  const [inputUrl, setInputUrl] = useState(apiUrl);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onSaveApiUrl(inputUrl.trim());
    }
  };

  const handleResetDefault = () => {
    setInputUrl(DEFAULT_GAS_API_URL);
    onSaveApiUrl(DEFAULT_GAS_API_URL);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GAS_CODE_SNIPPET);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(inputUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-amber-200 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Google Apps Script (GAS) 3개 시트 연동 설정
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                '도서예약프로그램' 스프레드시트의 3개 시트(도서 목록, 사용자 정보, 예약 내역)와 실시간 연동합니다.
              </p>
            </div>
          </div>
        </div>

        {/* URL Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between">
              <span>웹 앱 배포 URL (API Endpoint)</span>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] text-amber-800 hover:underline"
              >
                기본 URL로 재설정
              </button>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shrink-0"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={onTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>연결 테스트</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  title="URL 복사"
                  className="p-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 shrink-0"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Status Output */}
          {testStatus && (
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                testStatus.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {testStatus.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Google Apps Script 연결 성공 (실시간 데이터 연동 중)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>진단 결과: {testStatus.message}</span>
                  </>
                )}
              </div>
              {testStatus.raw && (
                <div className="text-[11px] font-mono bg-white/80 p-2.5 rounded-lg border border-amber-300/60 overflow-x-auto max-h-32 text-stone-800">
                  {testStatus.raw}
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Guide 1: 3 Sheets Structure match */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-lg">
          <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
          <span>사용자님의 '도서예약프로그램' 3개 시트 구조 완벽 반영</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          올려주신 세 개의 시트 탭 이름(<strong>도서 목록</strong>, <strong>사용자 정보</strong>, <strong>예약 내역</strong>)과 컬럼 구조에 100% 맞추어 코드를 전면 개편했습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Sheet 1: 도서 목록 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                시트 1: <code className="bg-white px-2 py-0.5 rounded border border-stone-300 font-mono text-emerald-700 font-bold">도서 목록</code>
              </h4>
              <p className="text-[11px] font-semibold text-stone-600 mb-1">1행 컬럼:</p>
              <code className="block bg-white p-2 rounded-lg border font-mono text-[11px] text-stone-800 break-all leading-tight">
                bookId | title | author | category | status | coverUrl
              </code>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              * 예약 시 status(E열)가 '예약중'으로 자동 변경, 취소 시 '대출가능'으로 원복.
            </p>
          </div>

          {/* Sheet 2: 사용자 정보 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                시트 2: <code className="bg-white px-2 py-0.5 rounded border border-stone-300 font-mono text-blue-700 font-bold">사용자 정보</code>
              </h4>
              <p className="text-[11px] font-semibold text-stone-600 mb-1">1행 컬럼:</p>
              <code className="block bg-white p-2 rounded-lg border font-mono text-[11px] text-stone-800 break-all leading-tight">
                userId | name | email | phone
              </code>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              * 기본 사용자: <span className="font-semibold text-stone-800">U001 (홍길동)</span>
            </p>
          </div>

          {/* Sheet 3: 예약 내역 */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                <CalendarCheck className="w-4 h-4 text-amber-600" />
                시트 3: <code className="bg-white px-2 py-0.5 rounded border border-stone-300 font-mono text-amber-700 font-bold">예약 내역</code>
              </h4>
              <p className="text-[11px] font-semibold text-stone-600 mb-1">1행 컬럼:</p>
              <code className="block bg-white p-2 rounded-lg border font-mono text-[11px] text-stone-800 break-all leading-tight">
                reservationId | bookId | userId | reservationDate | status | createdAt
              </code>
            </div>
            <p className="text-[10px] text-stone-500 mt-2">
              * 웹앱에서 예약 시 신규 행 자동 추가 (예: RSV001, U001, 2026-10-15...)
            </p>
          </div>
        </div>
      </div>

      {/* Guide 2: GAS Code.gs Template */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-stone-900 font-serif font-bold text-lg">
            <Code className="w-5 h-5 text-amber-700" />
            <span>'도서예약프로그램' 전용 최종 Code.gs 소스코드</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shrink-0"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? '복사 완료!' : '수정된 Code.gs 복사하기'}</span>
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          기존 스크립트가 영어 이름("Books")을 찾다가 발생했던 오류를 완전히 해결했습니다. 아래 코드를 Apps Script 에디터에 그대로 붙여넣고 
          <strong>[배포] → [배포 관리] → [수정] → 새 버전 생성 후 [배포]</strong>를 눌러주시면 즉시 정상 작동합니다!
        </p>

        <div className="relative rounded-2xl bg-stone-900 text-stone-100 p-4 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-stone-800">
          <pre>{GAS_CODE_SNIPPET}</pre>
        </div>
      </div>
    </div>
  );
};

export const GAS_CODE_SNIPPET = `/**
 * 도서예약프로그램 - Google Apps Script (Code.gs)
 * 시트 1: "도서 목록" (bookId | title | author | category | status | coverUrl)
 * 시트 2: "사용자 정보" (userId | name | email | phone)
 * 시트 3: "예약 내역" (reservationId | bookId | userId | reservationDate | status | createdAt)
 *
 * [배포 설정]
 * - 실행할 사용자: 나 (Me)
 * - 액세스 권한: 모든 사용자 (Anyone)
 */

function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. 도서 목록 조회 (getBooks)
    if (action === "getBooks") {
      const bookSheet = ss.getSheetByName("도서 목록") || ss.getSheets()[0];
      const data = bookSheet.getDataRange().getValues();

      if (data.length <= 1) {
        return createJsonResponse({ status: "success", books: [] });
      }

      const headers = data[0].map(h => String(h).trim());
      const books = [];

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0]) continue; // 빈 행 무시

        const book = {};
        headers.forEach((h, idx) => {
          book[h] = row[idx];
        });

        // 웹앱 호환성을 위한 표준 필드 매핑
        book.id = String(book.bookId || book.id || ("BK" + (i + 2)));
        book.coverUrl = book.coverUrl || book.coverImage || "";
        books.push(book);
      }

      return createJsonResponse({ status: "success", books: books });
    }

    // 2. 내 예약 목록 조회 (getReservations)
    if (action === "getReservations") {
      const targetUserId = (params.userId || "").toLowerCase().trim();
      const resSheet = ss.getSheetByName("예약 내역");
      const bookSheet = ss.getSheetByName("도서 목록") || ss.getSheets()[0];
      const userSheet = ss.getSheetByName("사용자 정보");

      if (!resSheet) {
        return createJsonResponse({ status: "success", reservations: [] });
      }

      // 도서 정보 맵 생성 (예약 목록에 제목/표지 자동 조인)
      const bookMap = {};
      if (bookSheet) {
        const bData = bookSheet.getDataRange().getValues();
        const bHeaders = bData[0].map(h => String(h).trim());
        const idIdx = bHeaders.indexOf("bookId") !== -1 ? bHeaders.indexOf("bookId") : 0;
        const titleIdx = bHeaders.indexOf("title") !== -1 ? bHeaders.indexOf("title") : 1;
        const authorIdx = bHeaders.indexOf("author") !== -1 ? bHeaders.indexOf("author") : 2;
        const coverIdx = bHeaders.indexOf("coverUrl") !== -1 ? bHeaders.indexOf("coverUrl") : 5;

        for (let b = 1; b < bData.length; b++) {
          const bRow = bData[b];
          if (bRow[0]) {
            bookMap[String(bRow[idIdx])] = {
              title: bRow[titleIdx],
              author: bRow[authorIdx],
              coverUrl: bRow[coverIdx]
            };
          }
        }
      }

      // 사용자 정보 맵 생성
      const userMap = {};
      if (userSheet) {
        const uData = userSheet.getDataRange().getValues();
        for (let u = 1; u < uData.length; u++) {
          if (uData[u][0]) {
            userMap[String(uData[u][0])] = String(uData[u][1]); // userId -> name
          }
        }
      }

      const rData = resSheet.getDataRange().getValues();
      const rHeaders = rData[0].map(h => String(h).trim());
      const reservations = [];

      for (let i = 1; i < rData.length; i++) {
        const row = rData[i];
        if (!row[0]) continue;

        const res = {};
        rHeaders.forEach((h, idx) => {
          res[h] = row[idx];
        });

        // 날짜 객체 포맷 변환
        if (res.reservationDate instanceof Date) {
          res.reservationDate = Utilities.formatDate(res.reservationDate, "Asia/Seoul", "yyyy-MM-dd");
        }
        if (res.createdAt instanceof Date) {
          res.createdAt = Utilities.formatDate(res.createdAt, "Asia/Seoul", "yyyy-MM-dd HH:mm");
        }

        // 도서 제목 및 이미지 자동 연결
        const matchedBook = bookMap[String(res.bookId)] || {};
        res.bookTitle = res.bookTitle || matchedBook.title || "도서 예약";
        res.bookAuthor = res.bookAuthor || matchedBook.author || "";
        res.bookCover = res.bookCover || matchedBook.coverUrl || "";
        res.userName = res.userName || userMap[String(res.userId)] || "회원";

        if (!targetUserId || String(res.userId).toLowerCase().trim() === targetUserId) {
          reservations.push(res);
        }
      }

      return createJsonResponse({ status: "success", reservations: reservations.reverse() });
    }

    // 3. 사용자 정보 조회 (getUser)
    if (action === "getUser") {
      const uid = (params.userId || "").toLowerCase().trim();
      const userSheet = ss.getSheetByName("사용자 정보");
      if (userSheet) {
        const uData = userSheet.getDataRange().getValues();
        for (let i = 1; i < uData.length; i++) {
          if (String(uData[i][0]).toLowerCase().trim() === uid) {
            return createJsonResponse({
              status: "success",
              user: {
                userId: uData[i][0],
                name: uData[i][1],
                email: uData[i][2],
                phone: uData[i][3]
              }
            });
          }
        }
      }
      return createJsonResponse({ status: "error", message: "사용자를 찾을 수 없습니다." });
    }

    return createJsonResponse({ status: "error", message: "알 수 없는 요청: " + action });
  } catch (error) {
    return createJsonResponse({ status: "error", message: "doGet 오류: " + error.toString() });
  }
}

function doPost(e) {
  try {
    let req = {};
    if (e && e.postData && e.postData.contents) {
      req = JSON.parse(e.postData.contents);
    }
    const action = req.action;
    const payload = req.payload || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 4. 도서 예약 신청 (createReservation)
    if (action === "createReservation") {
      const bookId = payload.bookId;
      const userId = payload.userId;
      const resDate = payload.reservationDate;

      const resSheet = ss.getSheetByName("예약 내역") || ss.insertSheet("예약 내역");
      if (resSheet.getLastRow() === 0) {
        resSheet.appendRow(["reservationId", "bookId", "userId", "reservationDate", "status", "createdAt"]);
      }

      // 예약 ID 생성 (RSV + 일련번호)
      const count = Math.max(1, resSheet.getLastRow());
      const reservationId = "RSV" + String(count).padStart(3, "0");
      const createdAt = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm");

      // '예약 내역' 시트에 신규 행 추가
      // 컬럼: reservationId | bookId | userId | reservationDate | status | createdAt
      resSheet.appendRow([
        reservationId,
        bookId,
        userId,
        resDate,
        "예약완료",
        createdAt
      ]);

      // '도서 목록' 시트에서 해당 도서의 status(E열)를 '예약중'으로 변경
      const bookSheet = ss.getSheetByName("도서 목록") || ss.getSheets()[0];
      if (bookSheet) {
        const data = bookSheet.getDataRange().getValues();
        const headers = data[0].map(h => String(h).trim());
        const idIdx = headers.indexOf("bookId") !== -1 ? headers.indexOf("bookId") : 0;
        const statusIdx = headers.indexOf("status") !== -1 ? headers.indexOf("status") : 4; // 보통 5번째 열(E열)

        for (let i = 1; i < data.length; i++) {
          if (String(data[i][idIdx]) === String(bookId)) {
            bookSheet.getRange(i + 1, statusIdx + 1).setValue("예약중");
            break;
          }
        }
      }

      return createJsonResponse({
        status: "success",
        reservationId: reservationId,
        message: "도서 예약이 성공적으로 완료되었습니다!"
      });
    }

    // 5. 예약 취소 (cancelReservation)
    if (action === "cancelReservation") {
      const reservationId = payload.reservationId;
      const resSheet = ss.getSheetByName("예약 내역");
      let targetBookId = null;

      if (resSheet) {
        const rData = resSheet.getDataRange().getValues();
        const headers = rData[0].map(h => String(h).trim());
        const resIdIdx = headers.indexOf("reservationId") !== -1 ? headers.indexOf("reservationId") : 0;
        const bookIdIdx = headers.indexOf("bookId") !== -1 ? headers.indexOf("bookId") : 1;
        const statusIdx = headers.indexOf("status") !== -1 ? headers.indexOf("status") : 4;

        for (let i = 1; i < rData.length; i++) {
          if (String(rData[i][resIdIdx]) === String(reservationId)) {
            targetBookId = rData[i][bookIdIdx];
            resSheet.getRange(i + 1, statusIdx + 1).setValue("취소됨");
            break;
          }
        }
      }

      // '도서 목록' 시트에서 도서 상태를 다시 '대출가능'으로 원복
      if (targetBookId) {
        const bookSheet = ss.getSheetByName("도서 목록") || ss.getSheets()[0];
        if (bookSheet) {
          const bData = bookSheet.getDataRange().getValues();
          const headers = bData[0].map(h => String(h).trim());
          const idIdx = headers.indexOf("bookId") !== -1 ? headers.indexOf("bookId") : 0;
          const statusIdx = headers.indexOf("status") !== -1 ? headers.indexOf("status") : 4;

          for (let j = 1; j < bData.length; j++) {
            if (String(bData[j][idIdx]) === String(targetBookId)) {
              bookSheet.getRange(j + 1, statusIdx + 1).setValue("대출가능");
              break;
            }
          }
        }
      }

      return createJsonResponse({
        status: "success",
        message: "예약이 정상적으로 취소되었습니다."
      });
    }

    return createJsonResponse({ status: "error", message: "알 수 없는 요청 action: " + action });
  } catch (err) {
    return createJsonResponse({ status: "error", message: "doPost 오류: " + err.toString() });
  }
}

function createJsonResponse(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
`;
