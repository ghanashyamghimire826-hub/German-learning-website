import React, { useEffect, useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, Loader2, CreditCard, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';

type PlanChoice = 'single' | 'all';
type ProviderChoice = 'esewa' | 'khalti';
type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2';

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2'];

export const PricingModal: React.FC = () => {
  const { isPaywallModalOpen, closePaywallModal, refreshUser, user, openAuthModal } = useApp();

  const [planType, setPlanType] = useState<PlanChoice>('single');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel>('A1');
  const [provider, setProvider] = useState<ProviderChoice>('esewa');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnedProvider = params.get('provider');
    const orderId = params.get('orderId');
    const pidx = params.get('pidx');
    const statusParam = params.get('status');

    if (!returnedProvider && !orderId && !pidx) return;

    const cleanUrl = () => {
      const cleanPath = window.location.pathname;
      window.history.replaceState({}, document.title, cleanPath);
    };

    if (statusParam === 'failed') {
      setError('Payment was cancelled or failed. No charge was activated.');
      cleanUrl();
      return;
    }

    if (returnedProvider === 'esewa' || returnedProvider === 'khalti') {
      setVerifying(true);
      setError('');
      api
        .verifyPayment({
          provider: returnedProvider,
          orderId: orderId || undefined,
          pidx: pidx || undefined,
        })
        .then(async (res) => {
          await refreshUser();
          setSuccessMessage(res.message || 'Payment verified! Your 30-day pass is active.');
          triggerConfetti();
        })
        .catch((err: any) => {
          setError(err.message || 'Payment could not be verified.');
        })
        .finally(() => {
          setVerifying(false);
          cleanUrl();
        });
    }
  }, [refreshUser]);

  if (!isPaywallModalOpen && !verifying && !successMessage && !error) return null;

  const amountNpr = planType === 'single' ? 30 : 100;

  const submitEsewaForm = (paymentUrl: string, formFields: Record<string, string>) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    Object.entries(formFields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleStartPayment = async () => {
    setError('');
    setSuccessMessage('');

    if (!user) {
      closePaywallModal();
      openAuthModal('login');
      return;
    }

    setLoading(true);
    try {
      const data = await api.initiatePayment({
        planType,
        selectedLevel: planType === 'single' ? selectedLevel : undefined,
        provider,
      });

      if (data.provider === 'esewa' && data.paymentUrl && data.formFields) {
        submitEsewaForm(data.paymentUrl, data.formFields);
        return;
      }

      if (data.provider === 'khalti' && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      throw new Error('Unexpected response from payment gateway.');
    } catch (err: any) {
      setError(err.message || 'Could not start payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-stone-900 text-white p-6 text-center relative">
          <button
            onClick={() => {
              setError('');
              setSuccessMessage('');
              closePaywallModal();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Viel Erfolg · 30-Day Monthly Pass
          </div>
          <h2 className="text-2xl font-bold">Unlock German Learning</h2>
          <p className="text-stone-300 text-sm mt-1">
            Pay securely with eSewa or Khalti · Verified activation only
          </p>
        </div>

        <div className="p-6 space-y-5">
          {verifying && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying your payment with the gateway...
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPlanType('single')}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                planType === 'single'
                  ? 'border-stone-900 bg-stone-50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">Single Level</span>
                <span className="text-lg font-extrabold text-stone-900">NPR 30</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">1 level of your choice · 30 days</p>
              <ul className="mt-3 space-y-1.5 text-xs text-stone-700">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Lessons, grammar & notes for {selectedLevel}
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Flashcards & practice questions
                </li>
              </ul>
            </button>

            <button
              type="button"
              onClick={() => setPlanType('all')}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                planType === 'all'
                  ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900">All Levels (A1–B2)</span>
                <span className="text-lg font-extrabold text-amber-700">NPR 100</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">Complete access · 30 days</p>
              <ul className="mt-3 space-y-1.5 text-xs text-stone-700">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Every level from A1 to B2 unlocked
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  Full exam practice & AI learning tools
                </li>
              </ul>
            </button>
          </div>

          {planType === 'single' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Choose Your Level (NPR 30 / 30 days)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                      selectedLevel === lvl
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Choose Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('esewa')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-semibold text-sm transition-colors ${
                  provider === 'esewa'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                eSewa
              </button>

              <button
                type="button"
                onClick={() => setProvider('khalti')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-semibold text-sm transition-colors ${
                  provider === 'khalti'
                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Khalti
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={loading || verifying}
            onClick={handleStartPayment}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting to {provider === 'esewa' ? 'eSewa' : 'Khalti'}...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay NPR {amountNpr} with {provider === 'esewa' ? 'eSewa' : 'Khalti'}
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Subscription activates only after gateway payment verification.
          </div>
        </div>
      </div>
    </div>
  );
};