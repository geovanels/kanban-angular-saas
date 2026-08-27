import { Injectable, signal } from '@angular/core';

// Detecta quando uma nova versão do app foi publicada. SPAs mantêm o bundle
// carregado na memória da aba indefinidamente; abas antigas continuam rodando
// código antigo após um deploy. Este serviço compara periodicamente o hash do
// bundle main.*.js do index.html publicado com o da aba atual e sinaliza
// quando divergirem, para o usuário recarregar.
@Injectable({ providedIn: 'root' })
export class UpdateCheckService {
  readonly updateAvailable = signal(false);

  private currentBundle: string | null = null;
  private timer: any = null;
  private static readonly CHECK_INTERVAL_MS = 5 * 60 * 1000;

  start(): void {
    if (this.timer || typeof document === 'undefined') return;

    this.currentBundle = this.extractBundleFromDocument();
    if (!this.currentBundle) return; // dev server (main.js sem hash) ou estrutura inesperada

    this.timer = setInterval(() => this.check(), UpdateCheckService.CHECK_INTERVAL_MS);

    // Checar também quando a aba volta a ficar visível (momento típico de uso)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.check();
    });
  }

  reload(): void {
    location.reload();
  }

  private extractBundleFromDocument(): string | null {
    const script = document.querySelector('script[src*="main."]') as HTMLScriptElement | null;
    const src = script?.getAttribute('src') || '';
    const match = src.match(/main\.[a-z0-9]+\.js/);
    return match ? match[0] : null;
  }

  private async check(): Promise<void> {
    if (this.updateAvailable()) return;
    try {
      const res = await fetch(`/index.html?u=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const html = await res.text();
      const match = html.match(/main\.[a-z0-9]+\.js/);
      if (match && this.currentBundle && match[0] !== this.currentBundle) {
        this.updateAvailable.set(true);
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
      }
    } catch {
      // Sem rede/erro transitório: tenta de novo no próximo ciclo
    }
  }
}
