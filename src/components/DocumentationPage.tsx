import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  Shield,
  Key,
  Wifi,
  Server,
  Cloud,
  TestTube,
  AlertTriangle,
  Layers,
  Lock,
  Activity,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Code2,
  Zap,
  Terminal,
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  icon: typeof Shield;
  description: string;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  summary: string;
  content: string[];
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    description: 'Everything you need to begin using QuantumSecure',
    articles: [
      {
        id: 'overview',
        title: 'Platform Overview',
        summary: 'Understand the QuantumSecure platform architecture',
        content: [
          'QuantumSecure is a next-generation Web3 security platform combining quantum-grade encryption, real-time threat analysis, and AI-powered detection.',
          'The platform is organized into a Security Operations Center with specialized dashboards for analytics, quantum key management, network monitoring, mainframe integration, Cloudflare security, security testing, and incident reporting.',
          'Authentication is handled through Supabase Auth with optional two-factor authentication (2FA) via TOTP. Subscription billing is processed through Stripe.',
        ],
      },
      {
        id: 'account-setup',
        title: 'Account Setup',
        summary: 'Create and secure your QuantumSecure account',
        content: [
          'Navigate to the Sign Up page and provide your email address and a password of at least 6 characters. Email confirmation is disabled, so you can sign in immediately after registration.',
          'After signing in, visit the Profile tab to manage your account. From there you can enable two-factor authentication, view your subscription status, and sign out.',
          'To enable 2FA, open the Security Settings panel and scan the provided QR code with an authenticator app such as Google Authenticator or Authy. Enter the 6-digit verification code to confirm, then save your backup codes in a secure location.',
        ],
      },
      {
        id: 'navigation',
        title: 'Navigating the Dashboard',
        summary: 'Learn the layout of the Security Operations Center',
        content: [
          'The top navigation bar provides access to the Dashboard, Pricing, Documentation, and Support pages, along with your account menu.',
          'The dashboard uses a tabbed interface. Each tab corresponds to a security module: Security Analytics, Quantum Infrastructure, DoD Compliance, PQC Compliance, Quantum Threats, Quantum Keys, Network Monitor, IBM Z Series, Cloudflare, Security Testing, Incident Reports, Enterprise Security, User Registration, and Profile.',
          'Tabs are horizontally scrollable on smaller screens, so swipe left or right to reveal additional modules.',
        ],
      },
    ],
  },
  {
    id: 'security-analytics',
    title: 'Security Analytics',
    icon: Shield,
    description: 'Real-time threat detection and traffic analysis',
    articles: [
      {
        id: 'monitoring',
        title: 'Starting Real-Time Monitoring',
        summary: 'Capture and analyze live network traffic',
        content: [
          'Open the Security Analytics tab and click Start Monitoring. The platform begins capturing simulated packets and computing security metrics in real time.',
          'Overview cards display threats detected, threats blocked, packets analyzed, and the percentage of encrypted traffic. These values update continuously while monitoring is active.',
          'Click Stop Monitoring to pause capture. Historical data from the current session remains visible in the charts until monitoring is restarted.',
        ],
      },
      {
        id: 'charts',
        title: 'Reading the Analytics Charts',
        summary: 'Interpret trends, distributions, and system health',
        content: [
          'The Security Metrics Trends chart plots threats blocked and packets analyzed over time. The Encryption Strength chart overlays encryption strength and quantum entropy as area graphs.',
          'The Threat Level Distribution pie chart breaks captured packets into low, medium, and high risk categories. The Protocol Distribution bar chart shows the mix of HTTPS, HTTP, TCP, UDP, and ICMP traffic.',
          'The System Health panel shows live quantum entropy and encryption strength as progress bars, giving you a quick read on the overall security posture.',
        ],
      },
    ],
  },
  {
    id: 'quantum-keys',
    title: 'Quantum Keys',
    icon: Key,
    description: 'Quantum key generation and entanglement monitoring',
    articles: [
      {
        id: 'key-generation',
        title: 'Generating Quantum Keys',
        summary: 'Produce 128-bit quantum keys on demand',
        content: [
          'Open the Quantum Keys tab and click Start Generation. The platform generates 128-bit quantum keys every two seconds, each with a fidelity score between 85% and 100%.',
          'Each key displays its ID, the raw quantum bits, the measurement basis (rectilinear or diagonal), and a timestamp. Keys are kept in memory for the current session.',
          'Click Stop Generation to halt the process. The entanglement strength meter fluctuates continuously to simulate quantum state behavior.',
        ],
      },
    ],
  },
  {
    id: 'network-monitor',
    title: 'Network Monitor',
    icon: Wifi,
    description: 'Packet capture, protocol analysis, and threat levels',
    articles: [
      {
        id: 'packet-capture',
        title: 'Capturing Packets',
        summary: 'Monitor live network packet activity',
        content: [
          'The Network Monitor captures packets in real time, recording source and destination addresses, protocol, size, threat level, and encryption status.',
          'Status cards show packets captured, threats detected, encrypted traffic percentage, and network entropy. The Recent Packet Activity table lists the latest captured packets.',
          'Protocol Distribution and Threat Level Analysis panels summarize the traffic mix and risk profile for the current session.',
        ],
      },
    ],
  },
  {
    id: 'mainframe',
    title: 'IBM Z Series',
    icon: Server,
    description: 'Mainframe connection and job monitoring',
    articles: [
      {
        id: 'mainframe-monitoring',
        title: 'Monitoring Mainframes',
        summary: 'Track IBM Z Series connections and jobs',
        content: [
          'The IBM Z Series tab shows simulated connections to production, backup, and development mainframes. Each connection reports CPU, memory, storage, active jobs, region, and z/OS version.',
          'The Active Jobs table lists running, completed, failed, and queued jobs with priority, CPU, memory, and duration. Failed jobs trigger an alert banner at the bottom of the panel.',
          'Click Start or Stop Monitoring to control the polling cycle.',
        ],
      },
    ],
  },
  {
    id: 'cloudflare',
    title: 'Cloudflare',
    icon: Cloud,
    description: 'Edge security and performance metrics',
    articles: [
      {
        id: 'cloudflare-metrics',
        title: 'Reviewing Cloudflare Metrics',
        summary: 'Track requests, threats, and cache performance',
        content: [
          'The Cloudflare tab displays total requests, threats blocked, average response time, and cache hit ratio. Traffic and performance charts update as new metrics arrive.',
          'The Security Features panel confirms the status of DDoS protection, the Web Application Firewall, bot management, and SSL/TLS encryption.',
          'The Global Traffic Distribution panel shows unique visitors and the top countries contributing traffic.',
        ],
      },
    ],
  },
  {
    id: 'security-testing',
    title: 'Security Testing',
    icon: TestTube,
    description: 'Penetration tests, vulnerability scans, and stress tests',
    articles: [
      {
        id: 'running-tests',
        title: 'Running Security Tests',
        summary: 'Launch penetration, vulnerability, and load tests',
        content: [
          'The Security Testing Suite offers penetration tests, vulnerability scans, load tests, DDoS simulations, SQL injection tests, and XSS tests. Click any card to start that test against the platform target.',
          'Active tests show a live progress bar, elapsed duration, and findings count. When a test completes, it moves to the Completed Tests list with a severity rating and a summary of findings.',
          'The Stress Testing panel lets you start and stop a load simulation that reports concurrent users, requests per second, response time, and error rate in real time.',
        ],
      },
    ],
  },
  {
    id: 'incidents',
    title: 'Incident Reports',
    icon: AlertTriangle,
    description: 'Create, track, and resolve security incidents',
    articles: [
      {
        id: 'reporting-incidents',
        title: 'Reporting an Incident',
        summary: 'Create and categorize security incidents',
        content: [
          'Click Report Incident to open the creation form. Provide a title, description, severity (low, medium, high, or critical), and category (malware, phishing, DDoS, breach, vulnerability, unauthorized access, data leak, system failure, or other).',
          'You can optionally add a source, affected systems (comma-separated), an impact assessment, and tags. Incidents are stored in your Supabase project and are scoped to your account.',
          'New incidents start in the open status. Use the status selector in the detail view to move them through investigating, resolved, and closed.',
        ],
      },
      {
        id: 'managing-incidents',
        title: 'Managing Incidents',
        summary: 'Comment, update status, and filter incidents',
        content: [
          'The incidents list supports search by title or description, plus filtering by status and severity. Click any incident to open the detail view.',
          'In the detail view, change the status with the dropdown, review affected systems and tags, and add comments. Comments are timestamped and attributed to your account email.',
          'The dashboard charts show the distribution of incidents by severity and status, giving you a quick overview of your current workload.',
        ],
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & PQC',
    icon: Lock,
    description: 'DoD, CMMC, CNSA 2.0, and post-quantum cryptography',
    articles: [
      {
        id: 'dod-compliance',
        title: 'DoD Compliance Center',
        summary: 'Track NIST 800-171, CMMC, FIPS 140-3, and CNSA 2.0',
        content: [
          'The DoD Compliance tab provides an overview of your compliance posture across NIST SP 800-171, CMMC Level 3, NSA CNSA 2.0, FIPS 140-3, DoD SRG IL5, and the NIST Cybersecurity Framework.',
          'Switch between the Overview, Controls, Crypto, Audit, and Risk views. The Controls view lists implemented security controls by family and CMMC level. The Crypto view shows CNSA 2.0 algorithm compliance and FIPS 140-3 validation status.',
          'The Audit view presents an immutable audit trail of compliance, security, incident, and system events. The Risk view lists assessed risks with mitigation progress and recommended actions.',
        ],
      },
      {
        id: 'pqc-compliance',
        title: 'Post-Quantum Cryptography',
        summary: 'Monitor ML-KEM-768 and ML-DSA-65 adoption',
        content: [
          'The PQC Compliance tab tracks your readiness for the NSA CNSA 2.0 mandate. Overview cards show CNSA 2.0 compliance, annual savings, breach risk reduction, and days until Q-Day.',
          'The Algorithms view details NIST post-quantum standards including ML-KEM-768, ML-DSA-65, FALCON-512, and SPHINCS+ with key sizes and security levels.',
          'The Roadmap view lays out a 24-month implementation plan across assessment, pilot, rollout, and full migration phases. The ROI view quantifies the financial impact of PQC adoption.',
        ],
      },
    ],
  },
  {
    id: 'quantum-infrastructure',
    title: 'Quantum Infrastructure',
    icon: Layers,
    description: 'IaaS layer protection and quantum threat monitoring',
    articles: [
      {
        id: 'infrastructure-layers',
        title: 'Infrastructure Layers',
        summary: 'Review quantum risk by infrastructure layer',
        content: [
          'The Quantum Infrastructure tab breaks your stack into layers such as application, data, runtime, middleware, OS, virtualization, hardware, storage, and network.',
          'Each layer reports a quantum risk score, vulnerability count, mitigations deployed, and PQC readiness. Use the Infrastructure view to drill into any layer.',
          'The Threats, PQC Algorithms, and Vulnerabilities views list detected quantum threats, deployed post-quantum algorithms, and open vulnerabilities with remediation status.',
        ],
      },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: Code2,
    description: 'Edge functions and integration endpoints',
    articles: [
      {
        id: 'stripe-checkout',
        title: 'Stripe Checkout',
        summary: 'Create a checkout session for subscriptions',
        content: [
          'POST a request to the /functions/v1/stripe-checkout endpoint with a JSON body containing price_id, success_url, cancel_url, and mode ("payment" or "subscription").',
          'Include the user\'s Authorization header with a Bearer token. The function creates or reuses a Stripe customer, creates a subscription record when applicable, and returns a checkout URL.',
          'On success the response contains { sessionId, url }. Redirect the user to the url to complete payment. The success and cancel URLs must be absolute URLs on your domain.',
        ],
      },
      {
        id: 'stripe-webhook',
        title: 'Stripe Webhook',
        summary: 'Handle Stripe events to sync subscription state',
        content: [
          'The /functions/v1/stripe-webhook endpoint receives Stripe events. It verifies the webhook signature using the STRIPE_WEBHOOK_SECRET environment variable.',
          'For subscription mode, the webhook syncs the customer\'s latest subscription from Stripe into the stripe_subscriptions table. For one-time payments, it inserts a record into stripe_orders.',
          'Configure this endpoint in your Stripe Dashboard as a webhook pointing to your Supabase project URL.',
        ],
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: Zap,
    description: 'Plans, upgrades, and subscription management',
    articles: [
      {
        id: 'plans',
        title: 'Available Plans',
        summary: 'Compare the Free and Premium plans',
        content: [
          'The Free plan includes basic network monitoring, limited quantum key generation, basic security analytics, community support, and Web3 wallet integration.',
          'The Advanced Quantum Encryption plan ($40/month) adds unlimited quantum key generation, advanced threat analysis with AI detection, real-time security monitoring, priority support, API access, advanced compliance reporting, and enterprise-grade security features.',
          'Visit the Pricing page to compare plans and start an upgrade. New subscribers are covered by a 30-day money-back guarantee.',
        ],
      },
      {
        id: 'upgrading',
        title: 'Upgrading Your Subscription',
        summary: 'Start a Stripe checkout session',
        content: [
          'On the Pricing page, click Upgrade Now or Subscribe Now. This calls the Stripe checkout edge function and redirects you to Stripe\'s hosted checkout page.',
          'After completing payment, you are redirected to the success page. Your subscription status is synced to the database via the Stripe webhook and reflected in the Profile and User Registration tabs.',
          'You can cancel at any time and retain access until the end of your billing period.',
        ],
      },
    ],
  },
];

export const DocumentationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('getting-started');
  const [activeArticle, setActiveArticle] = useState<{ sectionId: string; articleId: string }>({
    sectionId: 'getting-started',
    articleId: 'overview',
  });

  const filteredSections = docSections
    .map((section) => ({
      ...section,
      articles: section.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.articles.length > 0);

  const activeSection = docSections.find((s) => s.id === activeArticle.sectionId);
  const activeArticleData = activeSection?.articles.find((a) => a.id === activeArticle.articleId);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const selectArticle = (sectionId: string, articleId: string) => {
    setActiveArticle({ sectionId, articleId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
              <BookOpen className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Documentation</h1>
              <p className="text-gray-400">QuantumSecure Platform Guide</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              {filteredSections.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No results found</p>
              ) : (
                filteredSections.map((section) => {
                  const SectionIcon = section.icon;
                  const isExpanded = expandedSection === section.id;
                  return (
                    <div key={section.id} className="mb-2">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <SectionIcon className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-200 truncate">
                            {section.title}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="ml-6 mt-1 space-y-1"
                        >
                          {section.articles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => selectArticle(section.id, article.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                                activeArticle.sectionId === section.id &&
                                activeArticle.articleId === article.id
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                              }`}
                            >
                              {article.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {activeArticleData ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <span>{activeSection?.title}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-cyan-400">{activeArticleData.title}</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">{activeArticleData.title}</h2>
                <p className="text-gray-400 mb-6">{activeArticleData.summary}</p>

                <div className="prose prose-invert max-w-none">
                  {activeArticleData.content.map((paragraph, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="text-gray-300 leading-relaxed mb-4"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Navigation footer */}
                <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Terminal className="h-3 w-3" />
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <a
                    href="/"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    Back to Dashboard
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select an article from the sidebar to begin reading.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
