export interface Company {
  id?: string;
  subdomain: string; // gobuyer, cliente2, etc
  name: string; // Gobuyer Digital, Cliente 2, etc
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  cnpj?: string;
  
  // Configurações SMTP
  smtpConfig: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    fromName: string;
    fromEmail: string;
  };
  
  // Configurações da API
  apiConfig: {
    enabled: boolean;
    token: string;
    endpoint: string; // será gerado automaticamente
    webhookUrl?: string;
  };
  
  // Configurações do produto
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  features: {
    maxBoards: number;
    maxUsers: number;
    maxLeadsPerMonth: number;
    maxEmailsPerMonth: number;
    customBranding: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    advancedReports: boolean;
    whiteLabel: boolean;
  };
  
  // Metadados
  status: 'active' | 'inactive' | 'suspended';
  createdAt: any;
  updatedAt: any;
  
  // Owner/Admin
  ownerId: string;
  ownerEmail: string;
  maxUsers?: number;
  maxBoards?: number;
  
  // Branding
  brandingConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    favicon?: string;
    customCSS?: string;
    companyName?: string;
  };
}

export interface CompanyUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  joinedAt: any;
  lastActive?: any;
}

export interface CompanySettings {
  companyId: string;
  
  // Configurações gerais
  timezone: string;
  language: 'pt-BR' | 'en-US' | 'es-ES';
  dateFormat: string;
  
  // Configurações de notificação
  notifications: {
    emailOnNewLead: boolean;
    emailOnLeadMove: boolean;
    emailOnLeadComment: boolean;
    slackWebhook?: string;
  };
  
  // Configurações de formulário
  formSettings: {
    allowPublicForm: boolean;
    requireCaptcha: boolean;
    customCss?: string;
    thankyouMessage: string;
  };
}