/**
 * ContactPage — contact form, contact details, helpful links and data privacy info.
 *
 * The "SEND MESSAGE" button opens the user's default email client via a mailto: URL
 * pre-filled with the form contents. No data is submitted to any server.
 * The form validates required fields before opening the mailto link.
 *
 * "Helpful Links" card:
 *   - User Guide         → opens UserGuideModal
 *   - Bug Hunt Setup Tips → opens BugHuntSetupTipsModal
 *   - Privacy Notice     → opens PrivacyNoticeModal
 *
 * The contact form is marked with a warning notice because actual backend submission
 * is not implemented — mailto is the only mechanism.
 */
import { useState } from "react";
import { useSession } from "../state/sessionStore";
import { AppHeader } from "../components/layout/AppHeader";
import { AppTabs, type TabId } from "../components/layout/AppTabs";
import { CloseSessionModal } from "../components/modals/CloseSessionModal";
import { UserGuideModal } from "../components/modals/UserGuideModal";
import { BugHuntSetupTipsModal } from "../components/modals/BugHuntSetupTipsModal";
import { PrivacyNoticeModal } from "../components/modals/PrivacyNoticeModal";
import { exportSessionAsJSON } from "../logic/exportSession";
import styles from "./ContactPage.module.css";

const CONTACT_EMAIL = "ronan.van.stokkom@de.ey.com";

type FormData = {
  fullName: string;
  email: string;
  companyOrTeam: string;
  subject: string;
  message: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const EMPTY: FormData = { fullName: "", email: "", companyOrTeam: "", subject: "", message: "" };

export function ContactPage() {
  const { session, clearSession, navigateTo } = useSession();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [showSetupTips, setShowSetupTips] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleTabChange = (tab: TabId) => {
    if (tab === "leaderboard") navigateTo("leaderboard");
    else if (tab === "setup") navigateTo("setup");
  };

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (field in errors) setErrors((prev) => ({ ...prev, [field]: undefined }));
      setSubmitted(false);
    };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    
    setIsSending(true);
    setServerError(null);
    setSubmitted(false);

    try {
      const response = await fetch("./send-email.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setForm(EMPTY); // Clear form on success
      } else {
        setServerError(result.message || "Failed to send message.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className={styles.page}>
      <AppHeader
        onExport={() => session && exportSessionAsJSON(session)}
        onCloseSession={() => setShowCloseConfirm(true)}
      />

      <div className={styles.tabsWrapper}>
        <AppTabs active="contact" onChange={handleTabChange} />
      </div>

      <div className={styles.heading}>
        <h2 className={styles.headingTitle}>SUPPORT</h2>
        <p className={styles.headingSubtitle}>
          Get help for exploratory sessions, hoster setup, and bug hunt planning.
        </p>
      </div>

      {/* Two-column content: form left, sidebar right */}
      <div className={styles.content}>

        {/* ── LEFT: contact form card ───────────────────────────────────── */}
        <div className={styles.formCard}>
          <h3 className={styles.cardTitle}>REQUEST SUPPORT</h3>

          <div className={styles.formGrid}>
            <label className={styles.label} htmlFor="cf-name">
              Full Name <span className={styles.req}>*</span>
            </label>
            <div className={styles.fieldWrap}>
              <input
                id="cf-name"
                className={`${styles.input} ${errors.fullName ? styles.inputErr : ""}`}
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={update("fullName")}
                autoComplete="name"
              />
              {errors.fullName && <p className={styles.errMsg}>{errors.fullName}</p>}
            </div>

            <label className={styles.label} htmlFor="cf-email">
              Email Address <span className={styles.req}>*</span>
            </label>
            <div className={styles.fieldWrap}>
              <input
                id="cf-email"
                className={`${styles.input} ${errors.email ? styles.inputErr : ""}`}
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={update("email")}
                autoComplete="email"
              />
              {errors.email && <p className={styles.errMsg}>{errors.email}</p>}
            </div>

            <label className={styles.label} htmlFor="cf-company">
              Company / Team <span className={styles.opt}>(optional)</span>
            </label>
            <div className={styles.fieldWrap}>
              <input
                id="cf-company"
                className={styles.input}
                type="text"
                placeholder="Enter your company or team"
                value={form.companyOrTeam}
                onChange={update("companyOrTeam")}
                autoComplete="organization"
              />
            </div>

            <label className={styles.label} htmlFor="cf-subject">
              Subject <span className={styles.req}>*</span>
            </label>
            <div className={styles.fieldWrap}>
              <input
                id="cf-subject"
                className={`${styles.input} ${errors.subject ? styles.inputErr : ""}`}
                type="text"
                placeholder="What do you need help with?"
                value={form.subject}
                onChange={update("subject")}
              />
              {errors.subject && <p className={styles.errMsg}>{errors.subject}</p>}
            </div>

            <label className={styles.label} htmlFor="cf-message">
              Message <span className={styles.req}>*</span>
            </label>
            <div className={styles.fieldWrap}>
              <textarea
                id="cf-message"
                className={`${styles.textarea} ${errors.message ? styles.inputErr : ""}`}
                placeholder="Describe your issue or the setup support you need..."
                value={form.message}
                onChange={update("message")}
                rows={6}
              />
              {errors.message && <p className={styles.errMsg}>{errors.message}</p>}
            </div>
          </div>

          {submitted && (
            <div className={styles.successBanner} role="status">
              <svg viewBox="0 0 20 20" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" width="16" height="16" aria-hidden="true">
                <polyline points="3,10 8,15 17,5" strokeLinejoin="round" />
              </svg>
              Thank you! Your support request has been sent successfully.
            </div>
          )}

          {serverError && (
            <div className={styles.errorBanner} role="alert">
              <svg viewBox="0 0 20 20" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" width="16" height="16" aria-hidden="true">
                <circle cx="10" cy="10" r="8" />
                <line x1="10" y1="6" x2="10" y2="10" />
                <line x1="10" y1="14" x2="10.01" y2="14" />
              </svg>
              {serverError}
            </div>
          )}

          <div className={styles.formActions}>
            <button 
              className={styles.sendBtn} 
              onClick={handleSend} 
              type="button"
              disabled={isSending}
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
                <path d="M17 3L2 9l5.5 2.5L10 17l2-5.5L17 3z" />
              </svg>
              {isSending ? "SENDING..." : "SEND REQUEST"}
            </button>
            <button className={styles.clearBtn} onClick={handleClear} type="button">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16" aria-hidden="true">
                <path d="M4 10a6 6 0 1112 0 6 6 0 01-12 0z" />
                <path d="M4 10V6M4 6H8" />
              </svg>
              CLEAR
            </button>
          </div>
        </div>

        {/* ── RIGHT: sidebar cards ───────────────────────────────────── */}
        <div className={styles.sidebar}>

          {/* Support Details */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>SUPPORT DETAILS</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#d97706" strokeWidth="1.6" width="18" height="18">
                  <rect x="2" y="5" width="16" height="11" rx="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 6.5l8 5.5 8-5.5" />
                </svg>
              </span>
              <div>
                <p className={styles.detailLabel}>Support Email</p>
                <p className={styles.detailValue}>{CONTACT_EMAIL}</p>
              </div>
            </div>
            <div className={styles.detailDivider} />
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#d97706" strokeWidth="1.6" width="18" height="18">
                  <circle cx="10" cy="10" r="7.5" />
                  <path strokeLinecap="round" d="M10 6v4l2.5 2" />
                </svg>
              </span>
              <div>
                <p className={styles.detailLabel}>Response Time</p>
                <p className={styles.detailValue}>Typically within 2 business days</p>
              </div>
            </div>
            <div className={styles.detailDivider} />
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#d97706" strokeWidth="1.6" width="18" height="18">
                  <rect x="2" y="4" width="16" height="14" rx="1.5" />
                  <path strokeLinecap="round" d="M6 2v3M14 2v3M2 9h16" />
                </svg>
              </span>
              <div>
                <p className={styles.detailLabel}>Availability</p>
                <p className={styles.detailValue}>Mon–Fri</p>
              </div>
            </div>
          </div>

          {/* Helpful Links — open modal overlays */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>SUPPORT RESOURCES</h3>
            <div className={styles.linkList}>
              <button className={styles.linkRow} type="button" aria-label="User Guide" onClick={() => setShowUserGuide(true)}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#374151" strokeWidth="1.6" width="16" height="16" aria-hidden="true">
                  <rect x="4" y="2" width="12" height="16" rx="1.5" />
                  <path strokeLinecap="round" d="M7 7h6M7 10.5h6M7 14h4" />
                </svg>
                <span className={styles.linkLabel}>User Guide</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" width="13" height="13" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
              <button className={styles.linkRow} type="button" aria-label="Bug Hunt Setup Tips" onClick={() => setShowSetupTips(true)}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#374151" strokeWidth="1.6" width="16" height="16" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6c-2.2 0-3.5 1.6-3.5 3.5S7.8 13 10 13s3.5-1.6 3.5-3.5S12.2 6 10 6z" />
                  <path strokeLinecap="round" d="M4 10H2M18 10h-2M10 4V2M10 18v-2M5.5 5.5l-1.4-1.4M15.9 15.9l-1.4-1.4M14.5 5.5l1.4-1.4M4.1 15.9l1.4-1.4" />
                </svg>
                <span className={styles.linkLabel}>Bug Hunt Setup Tips</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" width="13" height="13" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
              <button className={styles.linkRow} type="button" aria-label="Privacy Notice" onClick={() => setShowPrivacyNotice(true)}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#374151" strokeWidth="1.6" width="16" height="16" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 2l6 2.5V10c0 4-2.5 6.5-6 8-3.5-1.5-6-4-6-8V4.5L10 2z" />
                </svg>
                <span className={styles.linkLabel}>Privacy Notice</span>
                <svg viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" width="13" height="13" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Data & Privacy summary */}
          <div className={styles.sideCard}>
            <h3 className={styles.sideCardTitle}>DATA &amp; PRIVACY</h3>
            <div className={styles.privacyRow}>
              <span className={styles.privacyIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.6" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5.5-3.2 9.5-7 10.5C8.2 19.5 5 15.5 5 10V5l7-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <p className={styles.privacyText}>
                Bug Hunt Live Leaderboard does not automatically store bug hunt data on any server.
                JSON export/import is the only persistence mechanism available.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>Version 1.0.0</footer>

      <CloseSessionModal
        isOpen={showCloseConfirm}
        onStayInSession={() => setShowCloseConfirm(false)}
        onExportAndClose={() => { if (session) exportSessionAsJSON(session); clearSession(); }}
        onCloseWithoutSaving={clearSession}
      />

      <UserGuideModal
        isOpen={showUserGuide}
        onClose={() => setShowUserGuide(false)}
      />

      <BugHuntSetupTipsModal
        isOpen={showSetupTips}
        onClose={() => setShowSetupTips(false)}
      />

      <PrivacyNoticeModal
        isOpen={showPrivacyNotice}
        onClose={() => setShowPrivacyNotice(false)}
      />
    </div>
  );
}
