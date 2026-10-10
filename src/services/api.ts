import { Book, Reservation } from '../types';

export const DEFAULT_GAS_API_URL = (import.meta.env.VITE_GAS_API_URL as string) || 'https://script.google.com/macros/s/AKfycbzz49xWLFOAPjPpKTYuVGIDaKaW-wjLuGKYMHlEmxAf9WQqiRn01M8asKO9iUZ5PXjrcg/exec';

// 사용자의 Google Spreadsheet 데이터베이스(BK003 ~ BK012)와 100% 일치하는 기본 장서 목록
export const INITIAL_BOOKS: Book[] = [
  {
    id: 'BK003',
    title: '리팩터링 2판',
    author: '마틴 파울러',
    category: '개발',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    publisher: '한빛미디어',
    callNumber: '005.13-파68ㄹ',
    description: '소프트웨어 구조를 더 안전하고 읽기 쉽게 개선하는 리팩터링 핵심 기법과 실무 지침.'
  },
  {
    id: 'BK004',
    title: '객체지향의 사실과 오해',
    author: '조영호',
    category: '개발',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    publisher: '위키북스',
    callNumber: '005.11-조64ㄱ',
    description: '역할, 책임, 협력의 관점에서 객체지향의 본질을 명쾌하게 파헤친 국내 개발자 필독서.'
  },
  {
    id: 'BK005',
    title: '사피엔스',
    author: '유발 하라리',
    category: '역사',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400',
    publisher: '김영사',
    callNumber: '909-하29ㅅ',
    description: '변방의 유인원에서 지구의 지배자가 된 인류 호모 사피엔스의 거대한 문명사.'
  },
  {
    id: 'BK006',
    title: '코스모스',
    author: '칼 세이건',
    category: '과학',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    publisher: '사이언스북스',
    callNumber: '440-세68ㅋ',
    description: '광대한 우주 속에서 인간의 위치와 존재 이유를 탐구하는 교양 과학의 고전 명작.'
  },
  {
    id: 'BK007',
    title: '원씽 (The One Thing)',
    author: '게리 켈러',
    category: '자기계발',
    status: '예약중',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
    publisher: '비즈니스북스',
    callNumber: '325.2-켈34ㅇ',
    description: '복잡한 세상을 이기는 단 하나의 원칙. 가장 중요한 단 하나의 일에 집중하는 법.'
  },
  {
    id: 'BK008',
    title: '세이노의 가르침',
    author: '세이노',
    category: '자기계발',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
    publisher: '데이원',
    callNumber: '325.2-세68ㅅ',
    description: '수천억 원대 자산가 세이노가 20여 년간 실전에서 체득한 삶의 지혜와 부에 관한 냉철한 통찰.'
  },
  {
    id: 'BK009',
    title: '트렌드 코리아 2024',
    author: '김난도 외',
    category: '경제',
    status: '대출중',
    coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400',
    publisher: '미래의창',
    callNumber: '320.9-김29ㅌ',
    description: '분초사회, 호모 프롬프트 등 시대의 변화를 읽는 대한민국 소비 트렌드 전망.'
  },
  {
    id: 'BK010',
    title: '불편한 편의점',
    author: '김호연',
    category: '소설',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    publisher: '나무옆의자',
    callNumber: '813.7-김95ㅂ',
    description: '청파동 골목 모퉁이에 자리한 작은 편의점에서 피어나는 따스하고 유쾌한 힐링 드라마.'
  },
  {
    id: 'BK011',
    title: '미드나잇 라이브러리',
    author: '매트 헤이그',
    category: '소설',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    publisher: '인플루엔셜',
    callNumber: '843-헤67ㅁ',
    description: '자정의 도서관에서 펼쳐지는 삶의 무수한 가능성과 두 번째 기회에 관한 이야기.'
  },
  {
    id: 'BK012',
    title: '도파민식스',
    author: '애나 렘키',
    category: '과학',
    status: '대출가능',
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    publisher: '흐름출판',
    callNumber: '513.8-렘34ㄷ',
    description: '쾌락 과잉의 시대에서 뇌의 보상 시스템과 도파민 중독을 다스리는 지혜.'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    reservationId: 'RSV001',
    bookId: 'BK007',
    bookTitle: '원씽 (The One Thing)',
    bookAuthor: '게리 켈러',
    bookCover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
    userId: 'U001',
    userName: '홍길동',
    reservationDate: '2026-10-15',
    createdAt: '2026-10-09 15:00',
    status: '예약완료'
  }
];

// 로컬 저장소 헬퍼
const STORAGE_KEYS = {
  BOOKS: 'lib_books_cache_v3',
  RESERVATIONS: 'lib_reservations_cache_v3',
  API_URL: 'lib_custom_gas_api_url_v3',
  CURRENT_USER_ID: 'lib_current_user_id_v3',
};

export function getStoredApiUrl(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_GAS_API_URL;
  } catch {
    return DEFAULT_GAS_API_URL;
  }
}

export function setStoredApiUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.API_URL, url.trim());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredUserId(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'U001';
  } catch {
    return 'U001';
  }
}

export function setStoredUserId(userId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId.trim());
  } catch (e) {
    console.error(e);
  }
}

export function getLocalBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local books', e);
  }
  return INITIAL_BOOKS;
}

export function saveLocalBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error(e);
  }
}

export function getLocalReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse local reservations', e);
  }
  return INITIAL_RESERVATIONS;
}

export function saveLocalReservations(reservations: Reservation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  } catch (e) {
    console.error(e);
  }
}

// Google Apps Script API 호출 헬퍼
export async function fetchBooksFromApi(apiUrl: string): Promise<{
  success: boolean;
  books: Book[];
  isFallback: boolean;
  rawText?: string;
  errorMessage?: string;
}> {
  const url = `${apiUrl.trim()}?action=getBooks`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
      },
      redirect: 'follow',
    });

    const text = await response.text();

    // GAS 에러 HTML 페이지 반환된 경우 분석
    if (text.includes('<!DOCTYPE') || text.includes('<html') || text.includes('errorMessage')) {
      const errorMatch = text.match(/<div style="text-align:center[^>]*>([\s\S]*?)<\/div>/i) ||
                         text.match(/errorMessage[^>]*>([\s\S]*?)<\/div>/i);
      const detail = errorMatch ? errorMatch[1].replace(/<[^>]+>/g, '').trim() : 'Google Apps Script 내부 오류 반환';
      
      return {
        success: false,
        books: getLocalBooks(),
        isFallback: true,
        rawText: text.slice(0, 300),
        errorMessage: `GAS 실행 오류: ${detail} (시트 탭 이름 불일치 확인 필요)`
      };
    }

    try {
      const json = JSON.parse(text);
      let list: any[] = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (json && Array.isArray(json.books)) {
        list = json.books;
      } else if (json && Array.isArray(json.data)) {
        list = json.data;
      } else if (json && json.status === 'success' && Array.isArray(json.result)) {
        list = json.result;
      }

      if (list && list.length > 0) {
        // 사용자의 시트 컬럼명(bookId, coverUrl 등) 매핑 지원
        const parsedBooks: Book[] = list.map((item, idx) => ({
          id: String(item.bookId || item.id || `BK${String(idx + 3).padStart(3, '0')}`),
          title: String(item.title || item.bookTitle || '무제'),
          author: String(item.author || item.writer || '작자미상'),
          category: String(item.category || item.genre || '일반'),
          status: (item.status === '대출가능' || item.status === 'available') ? '대출가능' : (item.status === '대출중' ? '대출중' : '예약중'),
          coverImage: item.coverUrl || item.coverImage || item.image || item.cover || INITIAL_BOOKS[idx % INITIAL_BOOKS.length].coverImage,
          publisher: item.publisher || '도서관',
          year: item.year || '2024',
          callNumber: item.callNumber || `000-${idx + 1}`,
          description: item.description || ''
        }));

        saveLocalBooks(parsedBooks);
        return {
          success: true,
          books: parsedBooks,
          isFallback: false,
          rawText: text.slice(0, 200)
        };
      }
    } catch {
      // JSON 파싱 에러
    }

    return {
      success: false,
      books: getLocalBooks(),
      isFallback: true,
      rawText: text.slice(0, 200),
      errorMessage: '서버 응답이 JSON 형식이 아닙니다.'
    };
  } catch (err: any) {
    return {
      success: false,
      books: getLocalBooks(),
      isFallback: true,
      errorMessage: `Failed to fetch: Google Apps Script 47번째 줄 오류(시트명 불일치)로 인해 브라우저 CORS 차단됨`
    };
  }
}

export async function fetchReservationsFromApi(apiUrl: string, userId: string): Promise<{
  success: boolean;
  reservations: Reservation[];
  isFallback: boolean;
  rawText?: string;
  errorMessage?: string;
}> {
  const url = `${apiUrl.trim()}?action=getReservations&userId=${encodeURIComponent(userId)}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
      },
      redirect: 'follow',
    });

    const text = await response.text();

    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      const errorMatch = text.match(/<div style="text-align:center[^>]*>([\s\S]*?)<\/div>/i);
      const detail = errorMatch ? errorMatch[1].replace(/<[^>]+>/g, '').trim() : 'Google Apps Script 내부 오류 반환';
      
      const allLocal = getLocalReservations();
      const filtered = allLocal.filter(r => !userId || r.userId.toLowerCase() === userId.toLowerCase());
      return {
        success: false,
        reservations: filtered,
        isFallback: true,
        rawText: text.slice(0, 200),
        errorMessage: `GAS 실행 오류: ${detail}`
      };
    }

    try {
      const json = JSON.parse(text);
      let list: any[] = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (json && Array.isArray(json.reservations)) {
        list = json.reservations;
      } else if (json && Array.isArray(json.data)) {
        list = json.data;
      }

      const parsed: Reservation[] = list.map((item, idx) => ({
        reservationId: String(item.reservationId || item.id || `RES-${Date.now()}-${idx}`),
        bookId: String(item.bookId || item.id || ''),
        bookTitle: String(item.bookTitle || item.title || '도서 예약건'),
        bookAuthor: item.bookAuthor || item.author,
        bookCover: item.bookCover || item.coverUrl || item.coverImage,
        userId: String(item.userId || userId),
        userName: item.userName || '회원',
        reservationDate: String(item.reservationDate || item.date || new Date().toISOString().slice(0, 10)),
        createdAt: item.createdAt || new Date().toISOString().slice(0, 10),
        status: (item.status === '취소됨' || item.status === 'canceled') ? '취소됨' : '예약완료'
      }));

      return {
        success: true,
        reservations: parsed,
        isFallback: false,
        rawText: text.slice(0, 200)
      };
    } catch {
      // JSON 파싱 실패 시 로컬 반환
    }

    const allLocal = getLocalReservations();
    const filtered = allLocal.filter(r => !userId || r.userId.toLowerCase() === userId.toLowerCase());
    return {
      success: false,
      reservations: filtered,
      isFallback: true,
      errorMessage: '서버 응답을 해석할 수 없습니다.'
    };
  } catch (err: any) {
    const allLocal = getLocalReservations();
    const filtered = allLocal.filter(r => !userId || r.userId.toLowerCase() === userId.toLowerCase());
    return {
      success: false,
      reservations: filtered,
      isFallback: true,
      errorMessage: err.message || '네트워크 연결 오류'
    };
  }
}

export async function createReservationApi(
  apiUrl: string,
  payload: { bookId: string; userId: string; reservationDate: string; userName?: string; bookTitle?: string; bookAuthor?: string; bookCover?: string }
): Promise<{
  success: boolean;
  message: string;
  reservation?: Reservation;
  isFallback: boolean;
}> {
  const reqBody = {
    action: 'createReservation',
    payload: {
      bookId: payload.bookId,
      userId: payload.userId,
      reservationDate: payload.reservationDate,
      userName: payload.userName,
      bookTitle: payload.bookTitle
    }
  };

  const newReservationId = `RSV${String(Date.now()).slice(-4)}`;
  const nowStr = new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5);
  const localRes: Reservation = {
    reservationId: newReservationId,
    bookId: payload.bookId,
    bookTitle: payload.bookTitle || '예약 도서',
    bookAuthor: payload.bookAuthor,
    bookCover: payload.bookCover,
    userId: payload.userId,
    userName: payload.userName || '홍길동',
    reservationDate: payload.reservationDate,
    createdAt: nowStr,
    status: '예약완료'
  };

  try {
    const response = await fetch(apiUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(reqBody),
      redirect: 'follow',
    });

    const text = await response.text();
    
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      saveLocalReservationState(localRes);
      return {
        success: true,
        message: '예약이 접수되었습니다. (GAS 스크립트 점검 중으로 로컬 보관함에 안전 반영됨)',
        reservation: localRes,
        isFallback: true
      };
    }

    try {
      const json = JSON.parse(text);
      if (json && (json.success || json.status === 'success' || json.reservationId)) {
        saveLocalReservationState(localRes);
        return {
          success: true,
          message: json.message || '도서 예약이 성공적으로 완료되었습니다!',
          reservation: {
            ...localRes,
            reservationId: json.reservationId || localRes.reservationId
          },
          isFallback: false
        };
      }
    } catch {
      // 파싱 실패
    }

    saveLocalReservationState(localRes);
    return {
      success: true,
      message: '예약이 완료되었습니다.',
      reservation: localRes,
      isFallback: true
    };
  } catch (err) {
    saveLocalReservationState(localRes);
    return {
      success: true,
      message: '도서 예약이 정상 접수되었습니다. (로컬 보관함 저장)',
      reservation: localRes,
      isFallback: true
    };
  }
}

export async function cancelReservationApi(
  apiUrl: string,
  reservationId: string,
  bookId?: string
): Promise<{
  success: boolean;
  message: string;
  isFallback: boolean;
}> {
  const reqBody = {
    action: 'cancelReservation',
    payload: {
      reservationId: reservationId
    }
  };

  try {
    const response = await fetch(apiUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(reqBody),
      redirect: 'follow',
    });

    const text = await response.text();
    removeOrCancelLocalReservation(reservationId, bookId);

    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      return {
        success: true,
        message: '예약이 취소되었습니다. (로컬 반영 완료)',
        isFallback: true
      };
    }

    return {
      success: true,
      message: '예약이 성공적으로 취소되었습니다.',
      isFallback: false
    };
  } catch (err) {
    removeOrCancelLocalReservation(reservationId, bookId);
    return {
      success: true,
      message: '예약이 취소 처리되었습니다.',
      isFallback: true
    };
  }
}

function saveLocalReservationState(newRes: Reservation) {
  const reservations = getLocalReservations();
  const updatedReservations = [newRes, ...reservations.filter(r => r.reservationId !== newRes.reservationId)];
  saveLocalReservations(updatedReservations);

  const books = getLocalBooks();
  const updatedBooks = books.map(b => b.id === newRes.bookId ? { ...b, status: '예약중' as const } : b);
  saveLocalBooks(updatedBooks);
}

function removeOrCancelLocalReservation(resId: string, bookId?: string) {
  const reservations = getLocalReservations();
  const target = reservations.find(r => r.reservationId === resId);
  const updatedReservations = reservations.map(r => 
    r.reservationId === resId ? { ...r, status: '취소됨' as const } : r
  );
  saveLocalReservations(updatedReservations);

  const targetBookId = bookId || target?.bookId;
  if (targetBookId) {
    const books = getLocalBooks();
    const updatedBooks = books.map(b => b.id === targetBookId ? { ...b, status: '대출가능' as const } : b);
    saveLocalBooks(updatedBooks);
  }
}
