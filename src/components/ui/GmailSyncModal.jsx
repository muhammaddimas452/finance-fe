import { useState, useEffect } from "react";
import {
  X,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useFinanceStore } from "../../store/useFinanceStore";
import { formatRupiah } from "../../utils/currency";

const SAMPLE_TEMPLATES = [
  {
    name: "Bank Jago (Send Money)",
    from: "notification@jago.com",
    subject: "You have successfully sent money to Budi Santoso",
    body: "Hi Dimas, you successfully sent Rp 150.000 to Budi Santoso (BCA - 1234567890). Note: Lunch together.",
  },
  {
    name: "Bank Jago (Money Received)",
    from: "notification@jago.com",
    subject: "Incoming transfer from PT Teknologi Digital",
    body: "Yay! Rp 3.500.000 from PT Teknologi Digital has entered your Main Pocket on October 20, 2026.",
  },
  {
    name: "Bank Permata (Debit)",
    from: "notifikasi@permatabank.co.id",
    subject: "PermataBank Account Transaction Notification",
    body: "Your Permata Account xxx4321 has been debited for IDR 275,000.00 on 20/10/2026. Description: Supermarket Grocery Payment.",
  },
  {
    name: "Bank Permata (Credit)",
    from: "notifikasi@permatabank.co.id",
    subject: "PermataBank Account Transaction Notification",
    body: "Your Permata Account xxx4321 has been credited for IDR 1,200,000.00 on 20/10/2026. Description: Incoming Transfer from Ahmad Fauzi.",
  },
  {
    name: "GoPay (Payment)",
    from: "no-reply@gopay.co.id",
    subject: "GoPay Transaction Receipt",
    body: "GoFood payment of Rp 58.000 to Kopi Kenangan was successful using your GoPay balance.",
  },
];

const SUPPORTED_BANKS = [
  {
    name: "Bank Jago",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    name: "Bank Permata",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  { name: "GoPay", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "DANA", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { name: "OVO", color: "bg-violet-100 text-violet-700 border-violet-200" },
  {
    name: "ShopeePay / SeaBank",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  { name: "BCA / Mandiri", color: "bg-gray-100 text-gray-700 border-gray-200" },
];

const GmailSyncModal = () => {
  const { isGmailSyncModalOpen, closeGmailSyncModal } = useUIStore();
  const { user, connectGmail, syncGmail, disconnectGmail, testParseEmail } =
    useAuthStore();
  const { fetchInitialData } = useFinanceStore();
  const { refreshUser } = useAuthStore();

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Test Simulator State
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const [testFrom, setTestFrom] = useState("notification@jago.com");
  const [testSubject, setTestSubject] = useState(SAMPLE_TEMPLATES[0].subject);
  const [testBody, setTestBody] = useState(SAMPLE_TEMPLATES[0].body);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isGmailSyncModalOpen) {
      refreshUser();
    }
  }, [isGmailSyncModalOpen, refreshUser]);

  if (!isGmailSyncModalOpen) return null;

  const isConnected = Boolean(user && user.google_email);

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMessage("");
    const res = await connectGmail();
    if (!res.success) {
      setErrorMessage(res.message);
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setErrorMessage("");
    setSyncResult(null);

    const res = await syncGmail();
    setIsSyncing(false);

    if (res.success) {
      setSyncResult(res);
      // Refresh transactions and wallets
      await fetchInitialData();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleDisconnect = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disconnect your Gmail integration?",
      )
    ) {
      return;
    }
    setIsDisconnecting(true);
    setErrorMessage("");
    const res = await disconnectGmail();
    setIsDisconnecting(false);
    if (res.success) {
      setSyncResult(null);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleApplyTemplate = (tmpl) => {
    setTestFrom(tmpl.from);
    setTestSubject(tmpl.subject);
    setTestBody(tmpl.body);
    setTestResult(null);
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    const res = await testParseEmail({
      from: testFrom,
      subject: testSubject,
      body: testBody,
    });
    setIsTesting(false);
    if (res.success) {
      setTestResult(res.data);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm transition-opacity flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl md:rounded-4xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-gray-50 via-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5b58ff]/10 text-[#5b58ff] flex items-center justify-center font-bold">
              <Mail size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-gray-900">
                  Automatic Bank & E-Wallet Sync
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200 flex items-center gap-1">
                  <Sparkles size={11} /> Gmail API
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Income and expenses are automatically recorded directly from
                your email notifications.
              </p>
            </div>
          </div>
          <button
            onClick={closeGmailSyncModal}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Connection Status Card */}
          <div
            className={`p-5 rounded-3xl border transition-all ${
              isConnected
                ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                : "bg-linear-to-br from-indigo-50/70 to-purple-50/40 border-indigo-100"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isConnected
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                      : "bg-[#5b58ff] text-white shadow-md shadow-brand-500/20"
                  }`}
                >
                  {isConnected ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    <Mail size={24} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">
                      {isConnected
                        ? "Gmail Connected"
                        : "Connect Gmail Account"}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isConnected
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {isConnected ? "Active" : "Not Connected"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1">
                    {isConnected ? (
                      <>
                        Account:{" "}
                        <strong className="text-gray-900">
                          {user?.google_email || user?.email}
                        </strong>
                      </>
                    ) : (
                      "Allow read access to bank notifications so transactions can be automatically recorded into the database."
                    )}
                  </p>

                  {isConnected && user?.google_last_synced_at && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Last synced:{" "}
                      {new Date(user.google_last_synced_at).toLocaleString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isConnected ? (
                  <>
                    <button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <RefreshCw
                        size={15}
                        className={isSyncing ? "animate-spin" : ""}
                      />
                      <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={isDisconnecting}
                      className="p-2.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 rounded-xl transition-all cursor-pointer"
                      title="Disconnect"
                    >
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex items-center gap-2 bg-[#5b58ff] hover:bg-[#4a47e6] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-brand-500/30 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Redirecting to Google...</span>
                      </>
                    ) : (
                      <>
                        <span>Connect Gmail</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sync Result Banner */}
          {syncResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                <CheckCircle2 size={16} className="text-emerald-600" />
                {syncResult.message}
              </div>
              <div className="text-emerald-700 flex flex-wrap gap-x-4 gap-y-1 mt-1 font-medium">
                <span>
                  Newly imported: <strong>{syncResult.synced_count}</strong>
                </span>
                <span>
                  Already recorded:{" "}
                  <strong>{syncResult.already_synced_count}</strong>
                </span>
                {syncResult.unrecognized_count > 0 && (
                  <span>
                    Not a transaction:{" "}
                    <strong>{syncResult.unrecognized_count}</strong>
                  </span>
                )}
              </div>

              {/* List of imported transactions preview */}
              {syncResult.transactions &&
                syncResult.transactions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/60 space-y-2">
                    <p className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider">
                      Recently imported transactions:
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {syncResult.transactions.map((t) => (
                        <div
                          key={t.id}
                          className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`p-1 rounded-md ${
                                t.type === "income"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {t.type === "income" ? (
                                <TrendingUp size={13} />
                              ) : (
                                <TrendingDown size={13} />
                              )}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {t.title}
                            </span>
                            {t.wallet && (
                              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                                {t.wallet.name}
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-bold ${
                              t.type === "income"
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {t.type === "income" ? "+" : "-"}{" "}
                            {formatRupiah(t.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Supported Banks & E-Wallets */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1 flex items-center gap-1.5">
              <HelpCircle size={14} /> Supported Banks & E-Wallets
            </h4>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_BANKS.map((b) => (
                <span
                  key={b.name}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${b.color}`}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Test & Preview Simulator */}
          <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50/50">
            <button
              onClick={() => setIsTesterOpen(!isTesterOpen)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-100/60 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Email Notification Parser Simulator
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    Try pasting a bank notification text and check if the system
                    can extract the amount & type.
                  </p>
                </div>
              </div>
              {isTesterOpen ? (
                <ChevronUp size={18} className="text-gray-400" />
              ) : (
                <ChevronDown size={18} className="text-gray-400" />
              )}
            </button>

            {isTesterOpen && (
              <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                {/* Sample Template Chips */}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Select Quick Template:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SAMPLE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="text-[11px] font-semibold bg-gray-100 hover:bg-brand-50 hover:text-brand-600 text-gray-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-brand-200"
                      >
                        {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Sender (From)
                    </label>
                    <input
                      type="text"
                      value={testFrom}
                      onChange={(e) => setTestFrom(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white"
                      placeholder="Example: notification@jago.com"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Email Subject
                    </label>
                    <input
                      type="text"
                      value={testSubject}
                      onChange={(e) => setTestSubject(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white"
                      placeholder="Notification email subject"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Email Body
                  </label>
                  <textarea
                    rows={3}
                    value={testBody}
                    onChange={(e) => setTestBody(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-500 focus:bg-white"
                    placeholder="Paste the bank notification email body here..."
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleRunTest}
                    disabled={isTesting}
                    className="bg-[#5b58ff] hover:bg-[#4a47e6] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Test Notification Parser</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Result Display */}
                {testResult && (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Transaction Extraction Result
                      </span>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          testResult.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {testResult.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Bank / Service:
                        </span>
                        <p className="font-bold text-gray-800">
                          {testResult.bank_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Amount:
                        </span>
                        <p
                          className={`font-bold text-sm ${
                            testResult.type === "income"
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {formatRupiah(testResult.amount)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Transaction Title:
                        </span>
                        <p className="font-semibold text-gray-800">
                          {testResult.title}
                        </p>
                      </div>
                      {testResult.notes && (
                        <div className="col-span-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            Notes / Description:
                          </span>
                          <p className="text-gray-600">{testResult.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Privacy protected: The system only reads official transaction
            notifications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GmailSyncModal;
