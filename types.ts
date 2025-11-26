import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export type ViewState = 'landing' | 'dashboard' | 'pricing' | 'calculator' | 'login' | 'register' | 'about' | 'support';

export type DashboardTab = 'overview' | 'transactions' | 'reports' | 'settings' | 'banks';

export type UserPlan = 'Free' | 'Pro';

export interface CardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export interface MetricData {
  label: string;
  value: string;
  change: number;
  isCurrency?: boolean;
}

// Monday.com Style Types
export type BoardStatus = 'Done' | 'Pending' | 'Stuck' | 'Review' | 'HMRC';
export type BoardPriority = 'High' | 'Medium' | 'Low';

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface BoardItem {
  id: string;
  name: string;
  person: string; // Initials
  status: BoardStatus;
  priority: BoardPriority;
  date: string;
  timelineStart?: string; // For Timeline View
  timelineEnd?: string;   // For Timeline View
  amount: number;
  category: string;
  files?: number;
  updates?: number; // The conversation bubble count
  notes?: string;   // For the detail drawer
  activity?: ActivityLog[]; // Audit trail
}

export interface BoardGroup {
  id: string;
  title: string;
  color: string; // The side border color
  items: BoardItem[];
}

export type ColumnType = 'text' | 'number' | 'status' | 'date' | 'person' | 'timeline';

export interface BoardColumn {
  id: string;
  title: string;
  type: ColumnType;
  width: string;
}

// AI Copilot Types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// Onboarding Types
export type Profession = 'Developer' | 'Creative' | 'Trades' | 'Driver' | 'General';

// --- NEW GLOBAL STATE TYPES ---

export interface UserTaxProfile {
  utr: string;
  niNumber: string;
  taxCode: string;
  vatRegistered: boolean;
}

export interface UserNotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  hmrcDeadlines: boolean;
}

export interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  biometricLogin: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  // Extended Settings
  tax: UserTaxProfile;
  notifications: UserNotificationSettings;
  security: UserSecuritySettings;
  settings?: UserSettings; // Optional to handle initial state load
}

export interface UserSettings {
  theme: 'dark' | 'light';
  currency: 'GBP' | 'USD' | 'EUR';
}

export interface DashboardData {
  incomeItems: BoardItem[];
  expenseItems: BoardItem[];
  customBoards: BoardGroup[];
  banks: any[];
  chatMessages: ChatMessage[];
  showOnboarding: boolean;
}