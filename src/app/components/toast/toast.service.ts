import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  show(text: string, type: ToastMessage['type'] = 'info', timeoutMs: number = 3000) {
    const id = Math.random().toString(36).slice(2);
    const msg: ToastMessage = { id, text, type, timeoutMs };
    const list = this.messagesSubject.value.slice();
    list.push(msg);
    this.messagesSubject.next(list);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }

  success(text: string, timeoutMs: number = 3000) { this.show(text, 'success', timeoutMs); }
  error(text: string, timeoutMs: number = 4000) { this.show(text, 'error', timeoutMs); }
  info(text: string, timeoutMs: number = 3000) { this.show(text, 'info', timeoutMs); }
  warning(text: string, timeoutMs: number = 3000) { this.show(text, 'warning', timeoutMs); }

  dismiss(id: string) {
    this.messagesSubject.next(this.messagesSubject.value.filter(m => m.id !== id));
  }
}



