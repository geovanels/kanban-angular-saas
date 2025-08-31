import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../../services/company.service';
import { SubdomainService } from '../../services/subdomain.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface CompanyRegistration {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  companyName: string;
  subdomain: string;
  contactEmail?: string;
  website?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private companyService = inject(CompanyService);
  private subdomainService = inject(SubdomainService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Forms
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  
  // UI State
  currentView = signal<'login' | 'register' | 'company-setup'>('login');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  
  // Registration state
  userCreated = signal(false);
  currentUser = signal<any>(null);
  
  // Alias validation
  isCheckingAlias = signal(false);
  aliasAvailable = signal<boolean | null>(null);
  aliasError = signal('');

  ngOnInit() {
    this.initializeForms();
    this.setupAliasValidation();
  }

  private initializeForms() {
    // Login Form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Register Form
    this.registerForm = this.fb.group({
      ownerName: ['', [Validators.required, Validators.minLength(2)]],
      ownerEmail: ['', [Validators.required, Validators.email]],
      ownerPhone: ['', [Validators.required, this.phoneValidator]],
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      subdomain: ['', [Validators.required, Validators.minLength(3), this.aliasValidator.bind(this)]],
      contactEmail: [''],
      website: ['', this.urlValidator],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  private setupAliasValidation() {
    // Validação em tempo real do alias/subdomínio
    this.registerForm.get('subdomain')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(alias => {
        if (!alias || alias.length < 3) {
          this.aliasAvailable.set(null);
          this.aliasError.set('');
          return of(null);
        }
        
        // Validar formato do alias
        const aliasRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
        if (!aliasRegex.test(alias)) {
          this.aliasAvailable.set(false);
          this.aliasError.set('Use apenas letras minúsculas, números e hífens. Não pode começar ou terminar com hífen.');
          return of(false);
        }

        // Verificar palavras reservadas
        const reserved = ['www', 'api', 'admin', 'app', 'apps', 'mail', 'ftp', 'blog', 'shop', 'store', 'support', 'help'];
        if (reserved.includes(alias)) {
          this.aliasAvailable.set(false);
          this.aliasError.set('Este alias é reservado. Escolha outro.');
          return of(false);
        }

        this.isCheckingAlias.set(true);
        this.aliasError.set('');
        
        return this.companyService.isSubdomainAvailable(alias);
      })
    ).subscribe({
      next: (available) => {
        this.isCheckingAlias.set(false);
        if (available !== null) {
          this.aliasAvailable.set(available);
          if (!available) {
            this.aliasError.set('Este alias já está em uso. Escolha outro.');
          } else {
            this.aliasError.set('');
          }
        }
      },
      error: () => {
        this.isCheckingAlias.set(false);
        this.aliasError.set('Erro ao verificar disponibilidade.');
      }
    });
  }

  async signInWithEmail() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    const { email, password } = this.loginForm.value;
    const result = await this.authService.signInWithEmail(email, password);
    
    if (result.success) {
      await this.handleSuccessfulLogin();
    } else {
      this.errorMessage.set(this.getErrorMessage(result.error));
    }
    
    this.isLoading.set(false);
  }

  async signInWithGoogle() {
    this.isLoading.set(true);
    this.clearMessages();

    const result = await this.authService.signInWithGoogle();
    
    if (result.success) {
      await this.handleSuccessfulLogin();
    } else {
      this.errorMessage.set(this.getErrorMessage(result.error));
    }
    
    this.isLoading.set(false);
  }

  async registerUser() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    if (this.aliasAvailable() !== true) {
      this.errorMessage.set('Aguarde a verificação do alias ou escolha outro.');
      return;
    }

    this.isLoading.set(true);
    this.clearMessages();

    try {
      const formData = this.registerForm.value;
      
      // 1. Criar usuário no Firebase Auth
      const authResult = await this.authService.createUserWithEmail(formData.ownerEmail, formData.password);
      
      if (!authResult.success) {
        throw new Error(authResult.error || 'Erro ao criar usuário');
      }

      // 2. Atualizar perfil do usuário
      await this.authService.updateUserProfile({
        displayName: formData.ownerName,
        phoneNumber: formData.ownerPhone
      });

      // 3. Criar empresa
      const companyData = {
        subdomain: formData.subdomain,
        name: formData.companyName,
        contactEmail: formData.contactEmail || formData.ownerEmail,
        website: formData.website,
        ownerId: authResult.user?.uid || '',
        ownerEmail: formData.ownerEmail,
        plan: 'free' as const,
        smtpConfig: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          user: '',
          password: '',
          fromName: formData.companyName,
          fromEmail: formData.ownerEmail
        },
        apiConfig: {
          enabled: true,
          token: this.generateApiToken(),
          endpoint: `https://${formData.subdomain}.taskboard.com.br/api/v1/lead-intake`,
          webhookUrl: ''
        },
        features: {
          maxBoards: 1,
          maxUsers: 2,
          maxLeadsPerMonth: 100,
          maxEmailsPerMonth: 50,
          customBranding: false,
          apiAccess: false,
          webhooks: false,
          advancedReports: false,
          whiteLabel: false
        },
        status: 'active' as const
      };

      const companyId = await this.companyService.createCompany(companyData);
      
      // 4. Definir contexto da empresa
      const newCompany = await this.companyService.getCompany(companyId);
      if (newCompany) {
        this.subdomainService.setCurrentCompany(newCompany);
      }

      // 5. Criar board padrão
      await this.createDefaultBoard(authResult.user?.uid || '', companyId);

      this.successMessage.set(`Empresa criada com sucesso! Seu subdomínio: ${formData.subdomain}.taskboard.com.br`);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        // Se estamos em desenvolvimento, redirecionar com parâmetro
        if (this.subdomainService.isDevelopment()) {
          window.location.href = `http://localhost:${window.location.port}?subdomain=${formData.subdomain}`;
        } else {
          window.location.href = `https://${formData.subdomain}.taskboard.com.br`;
        }
      }, 2000);

    } catch (error: any) {
      this.errorMessage.set(error.message || 'Erro ao criar empresa. Tente novamente.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async createDefaultBoard(userId: string, companyId: string) {
    try {
      // Criar board padrão usando o FirestoreService
      // Como o contexto da empresa já foi definido, o FirestoreService usará automaticamente
      const { FirestoreService } = await import('../../services/firestore.service');
      const firestoreService = new FirestoreService();
      
      const defaultBoard = {
        name: 'Quadro Principal',
        description: 'Seu primeiro quadro Kanban',
        companyId: companyId,
        createdAt: null // Será preenchido pelo serverTimestamp
      };
      
      await firestoreService.createBoard(userId, defaultBoard);
    } catch (error) {
      // Handle error silently
    }
  }

  private async handleSuccessfulLogin() {
    try {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser?.email) {
        this.errorMessage.set('Erro ao obter dados do usuário');
        return;
      }

      console.log('Login processado para usuário:', currentUser.email);

      // Se o usuário é da Gobuyer, configurar contexto e ir para dashboard
      if (currentUser.email.includes('gobuyer.com.br')) {
        console.log('Usuário da Gobuyer detectado:', currentUser.email);
        // Set up Gobuyer context for development
        if (this.subdomainService.isDevelopment()) {
          localStorage.setItem('dev-subdomain', 'gobuyer');
        }
        
        // Try to get real company data or create it
        await this.subdomainService.initializeFromSubdomain();
        
        // Em desenvolvimento, apenas navegar localmente
        if (this.subdomainService.isDevelopment()) {
          this.router.navigate(['/dashboard']);
          return;
        }
        
        // Em produção, redirecionar para o subdomínio correto da Gobuyer
        const gobuyerUrl = this.subdomainService.getCompanyUrl('gobuyer');
        window.location.href = gobuyerUrl + '/dashboard';
        return;
      }

      // Para outros usuários, tentar buscar empresa
      try {
        const userCompany = await this.companyService.getCompanyByUserEmail(currentUser.email);
        
        if (userCompany) {
          // Definir contexto da empresa
          this.subdomainService.setCurrentCompany(userCompany);
          
          // Em desenvolvimento, apenas navegar localmente
          if (this.subdomainService.isDevelopment()) {
            // Definir subdomínio no localStorage
            localStorage.setItem('dev-subdomain', userCompany.subdomain);
            this.router.navigate(['/dashboard']);
          } else {
            // Em produção, redirecionar para o subdomínio correto da empresa
            const companyUrl = this.subdomainService.getCompanyUrl(userCompany.subdomain);
            window.location.href = companyUrl + '/dashboard';
          }
        } else {
          // Usuário não tem empresa
          this.errorMessage.set('Usuário não pertence a nenhuma empresa. Entre em contato com o suporte.');
        }
      } catch (searchError) {
        // Em caso de erro de busca, redirecionar para dashboard mesmo assim
        this.router.navigate(['/dashboard']);
      }
      
    } catch (error) {
      this.errorMessage.set('Erro ao processar login. Tente novamente.');
    }
  }

  generateSuggestions() {
    const companyName = this.registerForm.get('companyName')?.value;
    if (!companyName) return;

    const suggestions = this.generateAliasSuggestions(companyName);
    const firstAvailable = suggestions[0];
    
    if (firstAvailable) {
      this.registerForm.patchValue({ subdomain: firstAvailable });
    }
  }

  private generateAliasSuggestions(companyName: string): string[] {
    const base = companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplos
      .replace(/^-|-$/g, ''); // Remove hífens no início e fim

    return [
      base,
      `${base}-digital`,
      `${base}-corp`,
      `${base}-br`,
      `${base}${Math.floor(Math.random() * 100)}`,
      `${base}-${new Date().getFullYear()}`
    ].filter(alias => alias.length >= 3 && alias.length <= 30);
  }

  switchView(view: 'login' | 'register') {
    this.currentView.set(view);
    this.clearMessages();
    this.resetForms();
  }

  private resetForms() {
    this.loginForm.reset();
    this.registerForm.reset();
    this.aliasAvailable.set(null);
    this.aliasError.set('');
  }

  private clearMessages() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Validators
  private phoneValidator(control: AbstractControl) {
    if (!control.value) return null;
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  private urlValidator(control: AbstractControl) {
    if (!control.value) return null;
    const urlRegex = /^https?:\/\/.+\..+/;
    return urlRegex.test(control.value) ? null : { invalidUrl: true };
  }

  private aliasValidator(control: AbstractControl) {
    if (!control.value) return null;
    const aliasRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (control.value.length < 3) return { minLength: true };
    if (control.value.length > 30) return { maxLength: true };
    return aliasRegex.test(control.value) ? null : { invalidAlias: true };
  }

  private passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Getters para template
  get loginFormValid() { return this.loginForm.valid; }
  get registerFormValid() { return this.registerForm.valid && this.aliasAvailable() === true; }
  get subdomainControl() { return this.registerForm.get('subdomain'); }
  
  getFieldError(formName: 'login' | 'register', fieldName: string): string {
    const form = formName === 'login' ? this.loginForm : this.registerForm;
    const control = form.get(fieldName);
    
    if (!control?.errors || !control.touched) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['email']) return 'E-mail inválido';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['invalidPhone']) return 'Telefone inválido. Use formato: (11) 99999-9999';
    if (errors['invalidUrl']) return 'URL inválida. Use formato: https://exemplo.com';
    if (errors['invalidAlias']) return 'Use apenas letras minúsculas, números e hífens';
    if (errors['passwordMismatch']) return 'Senhas não coincidem';
    
    return 'Campo inválido';
  }

  getAliasPreview(): string {
    const alias = this.registerForm.get('subdomain')?.value;
    return alias ? `${alias}.taskboard.com.br` : 'seudominio.taskboard.com.br';
  }

  private generateApiToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getErrorMessage(error: string): string {
    if (error.includes('user-not-found')) {
      return 'Usuário não encontrado.';
    }
    if (error.includes('wrong-password')) {
      return 'Senha incorreta.';
    }
    if (error.includes('invalid-email')) {
      return 'E-mail inválido.';
    }
    if (error.includes('email-already-in-use')) {
      return 'Este e-mail já está em uso.';
    }
    if (error.includes('weak-password')) {
      return 'Senha muito fraca. Use pelo menos 6 caracteres.';
    }
    if (error.includes('too-many-requests')) {
      return 'Muitas tentativas. Tente novamente mais tarde.';
    }
    return 'Erro inesperado. Tente novamente.';
  }
}