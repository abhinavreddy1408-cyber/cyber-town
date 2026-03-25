import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Mail, Shield, AlertTriangle, CheckCircle2, XCircle, Search, Inbox, Send, Trash2, ShieldAlert, Timer, Wallet, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  realSenderEmail: string;
  receivedAt: number;
  originIp?: string;
  originLocation?: string;
  isReplyEligible?: boolean;
  replied?: boolean;
  isReply?: boolean;
}

const EMAIL_POOL: Email[] = [
  {
    id: '1',
    senderName: 'IT Support',
    senderEmail: 'support@corporate.com',
    subject: 'Urgent: Password Reset Required',
    body: 'We detected a suspicious login attempt on your account. Please click the link below to reset your password immediately to prevent unauthorized access.',
    isPhishing: true,
    realSenderEmail: 'support@rnicrosoft.com',
    receivedAt: Date.now() - 100000,
    originIp: '103.24.11.82',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '2',
    senderName: 'HR Department',
    senderEmail: 'hr@corporate.com',
    subject: 'Updated Employee Handbook 2026',
    body: 'Please find the updated employee handbook for the year 2026 attached. All employees are required to review the new policies by the end of the week.',
    isPhishing: false,
    realSenderEmail: 'hr@corporate.com',
    receivedAt: Date.now() - 50000,
    originIp: '172.16.4.12',
    originLocation: 'Corporate Gateway / Verified',
    isReplyEligible: true
  },
  {
    id: '3',
    senderName: 'CEO Office',
    senderEmail: 'ceo@corporate.com',
    subject: 'Quick Request',
    body: 'Are you at your desk? I need you to process an urgent wire transfer for a new vendor. Let me know when you are available.',
    isPhishing: true,
    realSenderEmail: 'ceo-office@gmail.com',
    receivedAt: Date.now() - 200000,
    originIp: '192.0.2.45',
    originLocation: 'Public Webmail / Unverified',
    isReplyEligible: true
  },
  {
    id: '4',
    senderName: 'Finance Team',
    senderEmail: 'billing@corporate.com',
    subject: 'Invoice #8821 Overdue',
    body: 'Your payment for invoice #8821 is 30 days overdue. Please settle the balance immediately to avoid service interruption.',
    isPhishing: false,
    realSenderEmail: 'billing@corporate.com',
    receivedAt: Date.now() - 300000,
    originIp: '172.16.4.15',
    originLocation: 'Corporate Gateway / Verified',
    isReplyEligible: true
  },
  {
    id: '5',
    senderName: 'Microsoft Security',
    senderEmail: 'security@microsoft.com',
    subject: 'Security Alert: New Device Login',
    body: 'A new device has logged into your Microsoft account from a location in Eastern Europe. If this was not you, please secure your account.',
    isPhishing: true,
    realSenderEmail: 'security-alert@micros0ft-login.com',
    receivedAt: Date.now() - 400000,
    originIp: '45.12.88.21',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '6',
    senderName: 'Internal Comms',
    senderEmail: 'comms@corporate.com',
    subject: 'Town Hall Meeting - Friday',
    body: 'Join us this Friday for our monthly town hall meeting. We will be discussing the Q1 roadmap and new office perks.',
    isPhishing: false,
    realSenderEmail: 'comms@corporate.com',
    receivedAt: Date.now() - 500000,
    originIp: '172.16.4.1',
    originLocation: 'Corporate Gateway / Verified',
    isReplyEligible: true
  },
  {
    id: '7',
    senderName: 'Legal Department',
    senderEmail: 'legal@corporate.com',
    subject: 'CONFIDENTIAL: Litigation Hold Notice',
    body: 'You are hereby notified that a litigation hold has been placed on all documents related to Project X. Do not delete any emails or files. Click here to acknowledge receipt.',
    isPhishing: true,
    realSenderEmail: 'legal-dept@corporate-legal.net',
    receivedAt: Date.now() - 600000,
    originIp: '185.22.41.109',
    originLocation: 'Offshore Hosting / Unverified'
  },
  {
    id: '8',
    senderName: 'Facilities',
    senderEmail: 'facilities@corporate.com',
    subject: 'Scheduled Maintenance: Floor 4',
    body: 'Please be advised that the HVAC system on Floor 4 will be undergoing maintenance this Saturday from 8 AM to 4 PM. Expect temporary temperature fluctuations.',
    isPhishing: false,
    realSenderEmail: 'facilities@corporate.com',
    receivedAt: Date.now() - 700000,
    originIp: '172.16.4.22',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '9',
    senderName: 'LinkedIn',
    senderEmail: 'notifications@linkedin.com',
    subject: 'You have 3 new connection requests',
    body: 'See who wants to connect with you on LinkedIn. Expand your professional network today.',
    isPhishing: true,
    realSenderEmail: 'notifications@linkdin-alerts.com',
    receivedAt: Date.now() - 800000,
    originIp: '91.22.44.12',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '10',
    senderName: 'Benefits Team',
    senderEmail: 'benefits@corporate.com',
    subject: 'Open Enrollment Ends Tomorrow',
    body: 'This is a final reminder that the open enrollment period for your 2026 benefits ends tomorrow at midnight. Please ensure your selections are finalized in the portal.',
    isPhishing: false,
    realSenderEmail: 'benefits@corporate.com',
    receivedAt: Date.now() - 900000,
    originIp: '172.16.4.8',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '11',
    senderName: 'UPS Delivery',
    senderEmail: 'pkginfo@ups.com',
    subject: 'Package Delivery Failed - Action Required',
    body: 'We were unable to deliver your package today. Please update your delivery preferences and pay the redelivery fee of $1.99 to receive your item.',
    isPhishing: true,
    realSenderEmail: 'support@parcel-delivery-service.com',
    receivedAt: Date.now() - 1000000,
    originIp: '104.21.44.1',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '12',
    senderName: 'Marketing Team',
    senderEmail: 'marketing@corporate.com',
    subject: 'New Brand Guidelines Released',
    body: 'The updated brand guidelines for 2026 are now available on the intranet. Please ensure all future client presentations adhere to these new standards.',
    isPhishing: false,
    realSenderEmail: 'marketing@corporate.com',
    receivedAt: Date.now() - 1100000,
    originIp: '172.16.4.19',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '13',
    senderName: 'IT Security Team',
    senderEmail: 'security@corporate.com',
    subject: 'Action Required: Mandatory Security Patch',
    body: 'A critical vulnerability has been discovered in our remote access software. Please download and install the attached security patch immediately to protect your workstation.',
    isPhishing: true,
    realSenderEmail: 'security-patch-deploy@corporate-it-updates.com',
    receivedAt: Date.now() - 1200000,
    originIp: '185.199.108.153',
    originLocation: 'CDN / Unverified Source'
  },
  {
    id: '14',
    senderName: 'Payroll Services',
    senderEmail: 'payroll@corporate.com',
    subject: 'Q1 Performance Bonus - Action Required',
    body: 'Congratulations! You have been awarded a performance bonus for Q1. Please log in to the payroll portal via the link below to verify your banking details for the deposit.',
    isPhishing: true,
    realSenderEmail: 'payroll-rewards@gmail.com',
    receivedAt: Date.now() - 1300000,
    originIp: '209.85.232.1',
    originLocation: 'Public Webmail / Unverified'
  },
  {
    id: '15',
    senderName: 'IT Infrastructure',
    senderEmail: 'it-infra@corporate.com',
    subject: 'Scheduled Intranet Downtime',
    body: 'The corporate intranet will be offline for scheduled maintenance this Sunday from 2 AM to 6 AM. Please save your work and log off before the maintenance window.',
    isPhishing: false,
    realSenderEmail: 'it-infra@corporate.com',
    receivedAt: Date.now() - 1400000,
    originIp: '172.16.4.2',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '16',
    senderName: 'HR Training',
    senderEmail: 'training@corporate.com',
    subject: 'Mandatory Workplace Safety Training',
    body: 'All employees are required to complete the 2026 Workplace Safety Training module by the end of the month. You can access the training via the Learning Management System (LMS).',
    isPhishing: false,
    realSenderEmail: 'training@corporate.com',
    receivedAt: Date.now() - 1500000,
    originIp: '172.16.4.9',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '17',
    senderName: 'Internal Audit',
    senderEmail: 'audit@corporate.com',
    subject: 'URGENT: Suspicious Expense Report #9112',
    body: 'Our automated systems flagged a suspicious expense report submitted under your name. Please review the attached PDF and provide justification by EOD to avoid disciplinary action.',
    isPhishing: true,
    realSenderEmail: 'audit-compliance@corporate-internal.org',
    receivedAt: Date.now() - 1600000,
    originIp: '103.24.11.99',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '18',
    senderName: 'Office Manager',
    senderEmail: 'office@corporate.com',
    subject: 'Vote for the New Coffee Machine!',
    body: 'We are upgrading the breakroom! Please click the link below to vote for your favorite coffee machine model. Your input matters!',
    isPhishing: true,
    realSenderEmail: 'office-admin@gmail.com',
    receivedAt: Date.now() - 1700000,
    originIp: '209.85.232.2',
    originLocation: 'Public Webmail / Unverified'
  },
  {
    id: '19',
    senderName: 'SOC Analyst',
    senderEmail: 'soc@corporate.com',
    subject: 'CRITICAL: Data Leak Prevention Alert',
    body: 'Our DLP system has detected an unauthorized data export from your workstation. We have temporarily locked your account. Click here to verify your identity and unlock it.',
    isPhishing: true,
    realSenderEmail: 'soc-alerts@security-ops.io',
    receivedAt: Date.now() - 1800000,
    originIp: '185.22.41.11',
    originLocation: 'Offshore Hosting / Unverified'
  },
  {
    id: '20',
    senderName: 'Travel Desk',
    senderEmail: 'travel@corporate.com',
    subject: 'Flight Confirmation: London to New York',
    body: 'Your flight to New York for the Q3 strategy meeting has been confirmed. Please find your itinerary and e-ticket attached. Safe travels!',
    isPhishing: false,
    realSenderEmail: 'travel@corporate.com',
    receivedAt: Date.now() - 1900000,
    originIp: '172.16.4.33',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '21',
    senderName: 'IT Asset Management',
    senderEmail: 'assets@corporate.com',
    subject: 'Laptop Refresh Eligibility Notice',
    body: 'Our records show your current laptop is over 3 years old. You are now eligible for a hardware refresh. Please visit the internal hardware portal to select your new device.',
    isPhishing: false,
    realSenderEmail: 'assets@corporate.com',
    receivedAt: Date.now() - 2000000,
    originIp: '172.16.4.44',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '22',
    senderName: 'PMO Office',
    senderEmail: 'pmo@corporate.com',
    subject: 'Weekly Status Report Reminder',
    body: 'This is a friendly reminder that your weekly status reports are due every Friday by 4 PM. Please ensure your project dashboards are updated in Jira.',
    isPhishing: false,
    realSenderEmail: 'pmo@corporate.com',
    receivedAt: Date.now() - 2100000,
    originIp: '172.16.4.55',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '23',
    senderName: 'DocuSign',
    senderEmail: 'dse@docusign.net',
    subject: 'Sign your 2026 Stock Option Agreement',
    body: 'You have been granted new stock options as part of the 2026 retention program. Please review and sign the agreement via DocuSign to finalize the grant.',
    isPhishing: true,
    realSenderEmail: 'dse@docusign-agreements.com',
    receivedAt: Date.now() - 2200000,
    originIp: '104.21.44.8',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '24',
    senderName: 'Microsoft 365',
    senderEmail: 'no-reply@microsoft.com',
    subject: 'Warning: Your mailbox is 95% full',
    body: 'Your corporate mailbox has reached 95% of its storage capacity. You will soon be unable to send or receive new emails. Click here to increase your storage limit for free.',
    isPhishing: true,
    realSenderEmail: 'no-reply@office365-admin.net',
    receivedAt: Date.now() - 2300000,
    originIp: '185.199.108.1',
    originLocation: 'CDN / Unverified Source'
  },
  {
    id: '25',
    senderName: 'Catering Services',
    senderEmail: 'catering@corporate.com',
    subject: 'Lunch Menu: Week of March 23rd',
    body: 'Check out next week\'s lunch specials in the corporate cafeteria! We have a new selection of healthy bowls and international cuisines.',
    isPhishing: false,
    realSenderEmail: 'catering@corporate.com',
    receivedAt: Date.now() - 2400000,
    originIp: '172.16.4.66',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '26',
    senderName: 'Board of Directors',
    senderEmail: 'board@corporate.com',
    subject: 'CONFIDENTIAL: Merger Discussion Draft',
    body: 'Please review the attached confidential draft regarding the upcoming merger discussions. This information is strictly for authorized personnel only.',
    isPhishing: true,
    realSenderEmail: 'board-directors@corporate-exec.com',
    receivedAt: Date.now() - 2500000,
    originIp: '185.22.41.22',
    originLocation: 'Offshore Hosting / Unverified'
  },
  {
    id: '27',
    senderName: 'CFO Office',
    senderEmail: 'cfo@corporate.com',
    subject: 'URGENT: Confidential Project Payment',
    body: 'I am in a meeting and cannot be disturbed. We need to finalize the initial payment for Project "Stealth" immediately. Please process the attached wire transfer request to the offshore account provided. This is time-sensitive.',
    isPhishing: true,
    realSenderEmail: 'cfo-office-urgent@finance-dept.net',
    receivedAt: Date.now() - 2600000,
    originIp: '103.24.11.1',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '28',
    senderName: 'Internal Comms',
    senderEmail: 'comms@corporate.com',
    subject: 'Survey: New Office Layout Feedback',
    body: 'We are planning to redesign the common areas on Floor 2. Please take a moment to fill out our internal feedback survey on the SharePoint portal to share your thoughts.',
    isPhishing: false,
    realSenderEmail: 'comms@corporate.com',
    receivedAt: Date.now() - 2700000,
    originIp: '172.16.4.77',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '29',
    senderName: 'Legal Counsel',
    senderEmail: 'legal@corporate.com',
    subject: 'Action Required: Updated Non-Disclosure Agreement',
    body: 'Due to recent regulatory changes, all employees must sign the updated 2026 NDA. Please review the document at the link below and provide your digital signature by Friday.',
    isPhishing: true,
    realSenderEmail: 'legal-notices@corporate-legal-updates.com',
    receivedAt: Date.now() - 2800000,
    originIp: '185.22.41.33',
    originLocation: 'Offshore Hosting / Unverified'
  },
  {
    id: '30',
    senderName: 'IT Security',
    senderEmail: 'security@corporate.com',
    subject: 'Security Awareness Reward Program',
    body: 'Congratulations! You have been selected for our monthly Security Awareness Reward. Click the link below to claim your $50 Amazon gift card as a thank you for your vigilance.',
    isPhishing: true,
    realSenderEmail: 'rewards@security-awareness-training.io',
    receivedAt: Date.now() - 2900000,
    originIp: '104.21.44.9',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '31',
    senderName: 'Finance Department',
    senderEmail: 'finance@corporate.com',
    subject: 'Travel Reimbursement Approved: #TR-4421',
    body: 'Your travel reimbursement request for the Q1 Sales Conference has been approved. The funds will be deposited into your registered bank account within 3-5 business days.',
    isPhishing: false,
    realSenderEmail: 'finance@corporate.com',
    receivedAt: Date.now() - 3000000,
    originIp: '172.16.4.88',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '32',
    senderName: 'AWS Support',
    senderEmail: 'no-reply@amazon.com',
    subject: 'Service Termination Notice: Account #99218',
    body: 'Your AWS account is scheduled for termination in 24 hours due to repeated billing failures. To prevent data loss, please update your payment method immediately via the link below.',
    isPhishing: true,
    realSenderEmail: 'support@aws-account-security.com',
    receivedAt: Date.now() - 3100000,
    originIp: '104.21.44.11',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '33',
    senderName: 'HR Benefits',
    senderEmail: 'hr-benefits@corporate.com',
    subject: 'Mandatory 401(k) Contribution Update',
    body: 'The company is updating its 401(k) matching policy for 2026. Please log in to the benefits portal via the corporate intranet to review how this affects your contributions.',
    isPhishing: false,
    realSenderEmail: 'hr-benefits@corporate.com',
    receivedAt: Date.now() - 3200000,
    originIp: '172.16.4.99',
    originLocation: 'Corporate Gateway / Verified'
  },
  {
    id: '34',
    senderName: 'Tax Authority',
    senderEmail: 'audit@irs.gov',
    subject: 'Notice of Corporate Tax Audit - Immediate Action',
    body: 'Your organization has been selected for a federal tax audit. Please download the attached "Audit Requirements" document and provide the requested financial records within 48 hours.',
    isPhishing: true,
    realSenderEmail: 'tax-audit-notice@govt-tax-portal.com',
    receivedAt: Date.now() - 3300000,
    originIp: '103.24.11.2',
    originLocation: 'Unknown / High-Risk Proxy'
  },
  {
    id: '35',
    senderName: 'IT Helpdesk',
    senderEmail: 'helpdesk@corporate.com',
    subject: 'New Printer Driver Installation Instructions',
    body: 'We have replaced the printers on the East Wing. Please follow the instructions on the IT Wiki to install the new drivers on your workstation.',
    isPhishing: false,
    realSenderEmail: 'helpdesk@corporate.com',
    receivedAt: Date.now() - 3400000,
    originIp: '172.16.4.101',
    originLocation: 'Corporate Gateway / Verified'
  }
];

type SortCriteria = 'senderName' | 'subject' | 'receivedAt';
type SortOrder = 'asc' | 'desc';

export default function ActionMode() {
  const { addCredits, setMode, credits, shiftTime, tick } = useGameStore();
  const [inbox, setInbox] = useState<Email[]>([EMAIL_POOL[0], EMAIL_POOL[1]]);
  const [trash, setTrash] = useState<Email[]>([]);
  const [sent, setSent] = useState<Email[]>([]);
  const [currentFolder, setCurrentFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(EMAIL_POOL[0]);
  const [isHoveringSender, setIsHoveringSender] = useState(false);
  const [isHoveringOrigin, setIsHoveringOrigin] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [sortBy, setSortBy] = useState<SortCriteria>('receivedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isComposing, setIsComposing] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '' });

  const lastSpawnTimeRef = useRef<number>(-1);

  // Shift timer and email spawning
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [tick]);

  // Spawn email every 20 seconds based on shiftTime
  useEffect(() => {
    if (shiftTime > 0 && shiftTime < 600 && shiftTime % 20 === 0 && lastSpawnTimeRef.current !== shiftTime) {
      lastSpawnTimeRef.current = shiftTime;
      setInbox(prevInbox => {
        const remainingPool = EMAIL_POOL.filter(e => !prevInbox.find(i => i.id === e.id) && !trash.find(t => t.id === e.id));
        if (remainingPool.length > 0) {
          const randomEmail = { 
            ...remainingPool[Math.floor(Math.random() * remainingPool.length)], 
            id: Date.now().toString(),
            receivedAt: Date.now()
          };
          return [...prevInbox, randomEmail];
        }
        return prevInbox;
      });
    }
  }, [shiftTime, trash]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClassification = (isPhishing: boolean) => {
    if (!selectedEmail) return;

    if (selectedEmail.isPhishing === isPhishing) {
      setFeedback({ type: 'success', message: 'THREAT NEUTRALIZED' });
      addCredits(50);
      
      // Move to trash
      setInbox(prev => prev.filter(e => e.id !== selectedEmail.id));
      setTrash(prev => [selectedEmail, ...prev]);
      setSelectedEmail(null);

      setTimeout(() => setFeedback(null), 2000);
    } else {
      setFeedback({ type: 'error', message: 'SYSTEM COMPROMISED' });
      setTimeout(() => {
        setFeedback(null);
        setMode('CONSEQUENCE');
      }, 1500);
    }
  };

  const handleReply = () => {
    if (!selectedEmail || selectedEmail.replied) return;

    if (selectedEmail.isPhishing) {
      setFeedback({ type: 'error', message: 'DATA BREACH: -50 CR' });
      addCredits(-50);
    } else {
      setFeedback({ type: 'success', message: 'SECURE REPLY: +50 CR' });
      addCredits(50);
    }

    // Mark as replied in all folders to maintain consistency
    const updateEmail = (list: Email[]) => 
      list.map(e => e.id === selectedEmail.id ? { ...e, replied: true } : e);
    
    // Create a new sent email representing the reply
    const replyEmail: Email = {
      id: `reply-${Date.now()}`,
      senderName: 'Me',
      senderEmail: 'me@corporate.com',
      subject: `Re: ${selectedEmail.subject}`,
      body: `This is a secure reply to your message regarding: ${selectedEmail.subject}.\n\n--- Original Message ---\n${selectedEmail.body}`,
      isPhishing: false,
      realSenderEmail: 'me@corporate.com',
      receivedAt: Date.now(),
      isReply: true
    };

    setInbox(updateEmail);
    setSent(prev => [replyEmail, ...updateEmail(prev)]);
    setTrash(updateEmail);
    setSelectedEmail(prev => prev ? { ...prev, replied: true } : null);

    setTimeout(() => setFeedback(null), 2000);
  };

  const getFolderEmails = () => {
    switch (currentFolder) {
      case 'inbox': return inbox;
      case 'sent': return sent;
      case 'trash': return trash;
      default: return inbox;
    }
  };

  const sortedEmails = [...getFolderEmails()].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (criteria: SortCriteria) => {
    if (sortBy === criteria) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('desc');
    }
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const newSentEmail: Email = {
      id: Date.now().toString(),
      senderName: 'Me',
      senderEmail: 'me@corporate.com',
      subject: composeForm.subject,
      body: composeForm.body,
      isPhishing: false,
      realSenderEmail: 'me@corporate.com',
      receivedAt: Date.now()
    };
    setSent(prev => [newSentEmail, ...prev]);
    setFeedback({ type: 'success', message: 'EMAIL TRANSMITTED' });
    setIsComposing(false);
    setComposeForm({ to: '', subject: '', body: '' });
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="flex h-full w-full bg-base-dark text-text-primary font-sans overflow-hidden">
      {/* Navigation Pane */}
      <div className="w-64 border-r border-white/5 flex flex-col p-4 space-y-6 bg-surface-dark/50">
        <div className="flex items-center space-x-2 text-accent-gold mb-4">
          <ShieldAlert size={24} />
          <span className="font-serif font-bold tracking-tight text-xl uppercase">Cyber Town</span>
        </div>

        <button 
          onClick={() => setIsComposing(true)}
          className="w-full flex items-center justify-center space-x-2 py-3 bg-accent-gold text-white rounded-xl font-bold hover:bg-accent-gold-bright transition-all shadow-lg shadow-accent-gold/20 mb-2"
        >
          <Plus size={20} />
          <span>Compose</span>
        </button>

        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-2 px-2 font-bold">Folders</div>
          <button 
            onClick={() => { setCurrentFolder('inbox'); setSelectedEmail(null); }}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              currentFolder === 'inbox' ? "bg-panel-dark text-accent-gold" : "hover:bg-white/5 text-text-secondary"
            )}
          >
            <Inbox size={18} />
            <span className="text-sm font-medium">Inbox</span>
            <span className="ml-auto text-xs bg-accent-gold/20 px-1.5 rounded">{inbox.length}</span>
          </button>
          <button 
            onClick={() => { setCurrentFolder('sent'); setSelectedEmail(null); }}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              currentFolder === 'sent' ? "bg-panel-dark text-accent-gold" : "hover:bg-white/5 text-text-secondary"
            )}
          >
            <Send size={18} />
            <span className="text-sm font-medium">Sent</span>
            <span className="ml-auto text-xs bg-white/10 px-1.5 rounded">{sent.length}</span>
          </button>
          <button 
            onClick={() => { setCurrentFolder('trash'); setSelectedEmail(null); }}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              currentFolder === 'trash' ? "bg-panel-dark text-accent-gold" : "hover:bg-white/5 text-text-secondary"
            )}
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Trash</span>
            <span className="ml-auto text-xs bg-white/10 px-1.5 rounded">{trash.length}</span>
          </button>
        </div>

        <div className="mt-auto glass rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-status-success">
              <Wallet size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Credits</span>
            </div>
            <span className="font-mono text-status-success font-bold">
              {credits}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-accent-gold-muted">
              <Timer size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Shift Ends</span>
            </div>
            <span className="font-mono text-accent-gold-muted">{formatTime(shiftTime)}</span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-surface-dark/30">
        <div className="p-4 border-b border-white/5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Search intelligence..." 
              className="w-full bg-panel-dark border border-white/5 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-gold/50 transition-colors placeholder:text-text-secondary/50"
            />
          </div>
          
          <div className="flex items-center justify-between px-1">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Sort Intelligence</div>
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleSort('receivedAt')}
                className={cn(
                  "text-[10px] px-2 py-1 rounded transition-colors font-bold tracking-wider uppercase",
                  sortBy === 'receivedAt' ? "bg-accent-gold/20 text-accent-gold" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Time
              </button>
              <button 
                onClick={() => toggleSort('senderName')}
                className={cn(
                  "text-[10px] px-2 py-1 rounded transition-colors font-bold tracking-wider uppercase",
                  sortBy === 'senderName' ? "bg-accent-gold/20 text-accent-gold" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Source
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedEmails.map((email) => (
            <motion.button
              key={email.id}
              onClick={() => setSelectedEmail(email)}
              animate={selectedEmail?.id === email.id ? { 
                backgroundColor: email.isPhishing ? "rgba(217, 106, 114, 0.12)" : "rgba(181, 122, 52, 0.08)"
              } : { 
                backgroundColor: email.isPhishing ? "rgba(217, 106, 114, 0.05)" : "rgba(255, 255, 255, 0)"
              }}
              className={cn(
                "w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/5",
                selectedEmail?.id === email.id && "border-l-2 border-l-accent-gold",
                email.isPhishing && "border-r-2 border-r-status-error/30"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2 truncate pr-2">
                  <span className="font-bold text-sm truncate text-text-primary">{email.senderName}</span>
                  {email.isPhishing && (
                    <AlertTriangle size={12} className="text-status-error flex-shrink-0" />
                  )}
                  {email.isReply && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-accent-gold/20 text-accent-gold rounded font-black tracking-tighter uppercase">Reply</span>
                  )}
                </div>
                <span className="text-[10px] text-text-secondary whitespace-nowrap font-mono">
                  {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="text-xs font-serif font-medium text-text-primary truncate mb-1">{email.subject}</div>
              <div className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{email.body}</div>
            </motion.button>
          ))}
          {sortedEmails.length === 0 && (
            <div className="p-8 text-center text-text-secondary/30 text-sm italic font-serif">
              {currentFolder === 'inbox' ? 'Intelligence stream clear...' : 
               currentFolder === 'sent' ? 'No outgoing transmissions.' : 'Archive empty.'}
            </div>
          )}
        </div>
      </div>

      {/* Message Body */}
      <div className="flex-1 flex flex-col relative">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={cn(
                "absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-md",
                feedback.type === 'success' ? "bg-success-emerald/10" : "bg-malicious-magenta/10"
              )}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={cn(
                  "text-4xl font-serif font-black tracking-tighter mb-4 uppercase",
                  feedback.type === 'success' ? "text-status-success" : "text-status-error"
                )}
              >
                {feedback.message}
              </motion.div>
              {feedback.type === 'success' ? (
                <CheckCircle2 size={64} className="text-status-success" />
              ) : (
                <XCircle size={64} className="text-status-error" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedEmail ? (
          <>
            <div className="p-8 border-b border-white/5 bg-panel-dark/20">
              <h1 className="text-3xl font-serif font-bold mb-6 text-text-primary tracking-tight">{selectedEmail.subject}</h1>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-panel-dark flex items-center justify-center text-accent-gold font-serif text-xl font-bold border border-accent-gold/20">
                  {selectedEmail.senderName[0]}
                </div>
                <div className="relative">
                  <div 
                    className="font-bold cursor-help hover:text-accent-gold transition-colors text-text-primary"
                    onMouseEnter={() => setIsHoveringSender(true)}
                    onMouseLeave={() => setIsHoveringSender(false)}
                  >
                    {selectedEmail.senderName}
                  </div>
                  <div className="text-xs text-text-secondary font-mono">{selectedEmail.senderEmail}</div>
                  
                  <AnimatePresence>
                    {isHoveringSender && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 z-20 glass p-4 rounded-xl border-accent-gold-muted/30 w-72 shadow-2xl"
                      >
                        <div className="text-[10px] uppercase tracking-widest text-accent-gold-muted font-bold mb-2 flex items-center space-x-1">
                          <AlertTriangle size={10} />
                          <span>Security Inspection</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs font-mono break-all">
                            <span className="text-text-secondary">Full Email:</span> <br/>
                            <span className="text-text-primary">{selectedEmail.senderEmail}</span>
                          </div>
                          <div className="text-xs font-mono break-all">
                            <span className="text-text-secondary">True Origin:</span> <br/>
                            <span className="text-accent-gold-muted">{selectedEmail.realSenderEmail}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto font-sans text-text-primary/90 leading-relaxed text-lg">
              {/* True Origin Clue Tooltip */}
              <div className="mb-8 relative inline-block">
                <div 
                  className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-accent-gold-muted cursor-help hover:text-accent-gold transition-colors bg-accent-gold-muted/5 border border-accent-gold-muted/20 px-4 py-2 rounded-full"
                  onMouseEnter={() => setIsHoveringOrigin(true)}
                  onMouseLeave={() => setIsHoveringOrigin(false)}
                >
                  <Search size={12} />
                  <span>Inspect Intelligence Source</span>
                </div>
                
                <AnimatePresence>
                  {isHoveringOrigin && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 z-30 glass p-5 rounded-xl border-accent-gold-muted/30 w-80 shadow-2xl"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-accent-gold-muted font-bold mb-3 flex items-center space-x-1 border-b border-accent-gold-muted/20 pb-2">
                        <Shield size={10} />
                        <span>Origin Analysis Report</span>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-black/40 rounded border border-white/5">
                            <div className="text-[8px] uppercase text-text-secondary mb-0.5">Server IP</div>
                            <div className="text-[10px] font-mono text-accent-gold-muted truncate">
                              {selectedEmail.originIp || 'Scanning...'}
                            </div>
                          </div>
                          <div className="p-2 bg-black/40 rounded border border-white/5">
                            <div className="text-[8px] uppercase text-text-secondary mb-0.5">Location</div>
                            <div className="text-[10px] font-mono text-accent-gold-muted truncate">
                              {selectedEmail.originLocation || 'Unknown'}
                            </div>
                          </div>
                        </div>

                        <div className="p-2 bg-black/40 rounded border border-white/5">
                          <div className="text-[8px] uppercase text-text-secondary mb-0.5">Verified Source</div>
                          <div className="text-[10px] font-mono text-accent-gold-muted break-all">
                            {selectedEmail.realSenderEmail}
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
                          <div className="text-[8px] uppercase text-text-secondary">Security Score</div>
                          <div className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            selectedEmail.isPhishing ? "bg-status-error/20 text-status-error" : "bg-status-success/20 text-status-success"
                          )}>
                            {selectedEmail.isPhishing ? 'LOW / CRITICAL' : 'HIGH / SECURE'}
                          </div>
                        </div>

                        {selectedEmail.isPhishing && (
                          <div className="text-[9px] text-status-error font-bold flex items-center space-x-1 bg-status-error/5 p-1.5 rounded border border-status-error/20">
                            <AlertTriangle size={10} />
                            <span>SENDER IDENTITY MISMATCH DETECTED</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <p className="whitespace-pre-wrap font-serif italic text-xl text-text-primary/80 border-l-2 border-accent-gold/30 pl-6 py-2 mb-8">{selectedEmail.body}</p>
              
              {selectedEmail.isPhishing && (
                <div className="mt-8 p-6 border border-dashed border-accent-gold/20 rounded-xl bg-accent-gold/5">
                  <div className="text-[10px] uppercase tracking-widest text-text-secondary mb-3 font-bold">Encrypted Attachment</div>
                  <div className="flex items-center space-x-4 p-4 bg-panel-dark rounded-lg border border-white/5 group cursor-pointer hover:border-status-error/50 transition-colors">
                    <div className="p-3 bg-status-error/20 text-status-error rounded-lg">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">intelligence_brief_9921.pdf</div>
                      <div className="text-[10px] text-text-secondary font-mono">1.2 MB • PDF Document</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-panel-dark/40 border-t border-white/5 flex justify-end items-center space-x-4">
              {selectedEmail.isReplyEligible && !selectedEmail.replied && (
                <button 
                  onClick={handleReply}
                  className="mr-auto flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-text-primary font-bold hover:bg-white/10 hover:text-white transition-all group"
                >
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Reply for this email</span>
                </button>
              )}
              {selectedEmail.replied && (
                <div className="mr-auto flex items-center space-x-2 px-6 py-3 rounded-xl bg-status-success/10 border border-status-success/20 text-status-success font-bold">
                  <CheckCircle2 size={18} />
                  <span>Replied</span>
                </div>
              )}
              <button 
                onClick={() => handleClassification(false)}
                className="px-8 py-3 rounded-xl bg-accent-gold text-white font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(181,122,52,0.3)]"
              >
                VERIFY SAFE
              </button>
              <button 
                onClick={() => handleClassification(true)}
                className="px-8 py-3 rounded-xl bg-status-error text-white font-bold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(217,106,114,0.3)]"
              >
                FLAG AS PHISHING
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20">
            <div className="text-center">
              <Mail size={64} className="mx-auto mb-4 opacity-20" />
              <p>Select an email to begin investigation</p>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsComposing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-panel-dark border border-accent-gold/20 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <h3 className="font-serif font-bold text-2xl flex items-center space-x-3">
                  <Plus size={24} className="text-accent-gold" />
                  <span>New Transmission</span>
                </h3>
                <button 
                  onClick={() => setIsComposing(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSendEmail} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-accent-gold font-bold px-1">Recipient Address</label>
                  <input 
                    required
                    type="email"
                    placeholder="e.g. admin@corporate.com"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full bg-base-dark border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold/50 transition-colors placeholder:text-text-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-accent-gold font-bold px-1">Subject Line</label>
                  <input 
                    required
                    type="text"
                    placeholder="Subject of your inquiry"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-base-dark border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold/50 transition-colors font-serif text-lg placeholder:text-text-secondary/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-accent-gold font-bold px-1">Message Body</label>
                  <textarea 
                    required
                    rows={8}
                    placeholder="Type your message here..."
                    value={composeForm.body}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full bg-base-dark border border-white/5 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent-gold/50 transition-colors resize-none font-serif text-lg italic placeholder:text-text-secondary/30"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                  <button 
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="px-6 py-3 rounded-xl font-bold text-text-secondary hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center space-x-2 px-10 py-3 bg-accent-gold text-white rounded-xl font-bold hover:bg-accent-gold-bright transition-all shadow-lg shadow-accent-gold/20"
                  >
                    <Send size={18} />
                    <span>Transmit</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
