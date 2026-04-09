import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { BoardStoreService } from '../../services/board-store.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-board-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-api.component.html'
})
export class BoardApiComponent implements OnInit, OnDestroy {
  boardStore = inject(BoardStoreService);
  private toast = inject(ToastService);
  private sub?: Subscription;

  apiEndpoint = '';
  apiToken = '';
  apiExampleJson = '';
  initialFormFields: any[] = [];

  ngOnInit() {
    this.apiEndpoint = this.boardStore.apiEndpoint;
    this.apiToken = this.boardStore.apiToken;
    this.sub = this.boardStore.initialFormFields$.subscribe(fields => {
      this.initialFormFields = fields;
      this.buildApiExample();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private buildApiExample() {
    const body: any = {};
    for (const field of this.initialFormFields || []) {
      const key = (field.apiFieldName?.trim()) || (field.name || 'campo');
      body[key] = this.getSample(field);
    }
    if (!body['origem'] && !body['origin'] && !body['source']) body['origem'] = 'Contato pelo Site';
    if (!body['assunto'] && !body['subject']) body['assunto'] = 'Interesse no produto X';
    if (!body['mensagem'] && !body['message']) body['mensagem'] = 'Gostaria de mais informações sobre...';
    this.apiExampleJson = JSON.stringify(body, null, 2);
  }

  private getSample(field: any): any {
    const type = (field.type || 'text').toLowerCase();
    if (type === 'email') return 'email@exemplo.com';
    if (type === 'tel' || type === 'phone') return '(11) 99999-9999';
    if (type === 'number') return 123;
    if (type === 'date') return '2024-01-01';
    if (type === 'cpf') return '000.000.000-00';
    if (type === 'cnpj') return '00.000.000/0001-00';
    if (type === 'select' || type === 'radio') {
      const opts = field.options || [];
      return opts.length > 0 ? opts[0] : 'Opção 1';
    }
    if (type === 'temperatura') return 'Quente';
    return field.label || field.name || 'Valor de exemplo';
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => this.toast.success('Copiado!'),
      () => this.toast.error('Erro ao copiar.')
    );
  }
}
