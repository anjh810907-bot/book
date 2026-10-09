export type BookStatus = '대출가능' | '예약중' | '대출중' | 'available' | 'reserved';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  coverImage?: string;
  publisher?: string;
  year?: string | number;
  callNumber?: string; // 청구기호
  description?: string;
}

export type ReservationStatus = '예약완료' | '수령대기' | '취소됨' | '대출완료';

export interface Reservation {
  reservationId: string;
  bookId: string;
  bookTitle: string;
  bookAuthor?: string;
  bookCover?: string;
  userId: string;
  userName?: string;
  reservationDate: string; // YYYY-MM-DD
  createdAt?: string;
  status: ReservationStatus;
}

export interface ApiStatusLog {
  timestamp: string;
  endpoint: string;
  method: string;
  success: boolean;
  message: string;
  details?: string;
}
