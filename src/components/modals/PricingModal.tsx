import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { api } from '../../lib/api';
import { triggerConfetti } from '../../lib/confetti';
import { SubscriptionPlan, PaymentGateway } from '../../types';
import { X, Check, Sparkles, ShieldCheck, CreditCard, Zap, ArrowRight } from 'lucide-react';

export const PricingModal: React.FC = () => {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { activePaywallModal, closePaywallModal } = useLearning();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_six_months');
  const [currency, setCurrency] = useState<'NPR' | 'EUR'>('NPR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentGateway>('esewa');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activePaywallModal) {
      api.getPlans().then((res) => setPlans(res)).catch(() => {});
    }
  }, [activePaywallModal]);

  if (!activePaywallModal) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setError('Please log in or create an account first to activate Premium.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.checkout({
        planId: selectedPlanId,
        paymentMethod,
        currency,
      });

      setSuccess(true);
      triggerConfetti();
      await refreshUser();
      setTimeout(() => {
        closePaywallModal();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Payment simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={closePaywallModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Unlock Fluency & Exam Confidence
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Upgrade to DeutschMeister <span className="text-amber-400">Premium</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto mt-2">
            Get unlimited access to B1–B2 advanced lessons, Goethe/telc full mock exams, AI writing examiner, and priority spaced repetition flashcards.
          </p>

          {/* Currency Switcher */}
          <div className="mt-4 inline-flex p-1 bg-stone-800 rounded-xl border border-stone-700">
            <button
              onClick={() => {
                setCurrency('NPR');
                if (paymentMethod === 'card') setPaymentMethod('esewa');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                currency === 'NPR' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              🇳🇵 NPR (Nepal - eSewa / Khalti)
            </button>
            <button
              onClick={() => {
                setCurrency('EUR');
                setPaymentMethod('card');
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                currency === 'EUR' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              🇪🇺 EUR (Global / Card)
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl text-center font-bold flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Herzlichen Glückwunsch! Your Premium Account has been activated!</span>
            </div>
          )}

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monthly */}
            <div
              onClick={() => setSelectedPlanId('plan_monthly')}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlanId === 'plan_monthly'
                  ? 'border-amber-500 bg-amber-50/20 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">Monthly Pass</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-serif font-bold text-2xl text-stone-900">
                  {currency === 'NPR' ? 'Rs. 799' : '€5.99'}
                </span>
                <span className="text-xs text-stone-500">/ month</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Fast test prep & focused review.</p>
              <ul className="mt-4 space-y-2 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> All A1–B2 Lessons
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Full Grammar Library
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Spaced Repetition SRS
                </li>
              </ul>
            </div>

            {/* 6 Months - Popular */}
            <div
              onClick={() => setSelectedPlanId('plan_six_months')}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlanId === 'plan_six_months'
                  ? 'border-amber-500 bg-amber-50/30 shadow-lg scale-[1.02]'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase rounded-full shadow-xs">
                Most Popular (Save 48%)
              </div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">6-Month Pass</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-serif font-bold text-2xl text-stone-900">
                  {currency === 'NPR' ? 'Rs. 2,499' : '€18.99'}
                </span>
                <span className="text-xs text-stone-500">/ 6 mos</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Recommended for complete A1 to B2 journey.</p>
              <ul className="mt-4 space-y-2 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Everything in Monthly
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Full Mock Exam Simulators
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> AI Writing & Essay Examiner
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Downloadable Cheatsheet PDFs
                </li>
              </ul>
            </div>

            {/* Lifetime */}
            <div
              onClick={() => setSelectedPlanId('plan_lifetime')}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlanId === 'plan_lifetime'
                  ? 'border-amber-500 bg-amber-50/20 shadow-md'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">Lifetime Mastery</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-serif font-bold text-2xl text-stone-900">
                  {currency === 'NPR' ? 'Rs. 4,999' : '€39.99'}
                </span>
                <span className="text-xs text-stone-500">/ once</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">Never pay again. Free future updates.</p>
              <ul className="mt-4 space-y-2 text-xs text-stone-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Unlimited Lifetime Access
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> All Upcoming C1 Expansions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> VIP Leaderboard Badge
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-700 mb-2">Select Secure Payment Gateway:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {currency === 'NPR' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('esewa')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'esewa'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> eSewa Digital
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('khalti')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'khalti'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Khalti Wallet
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('fonepay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'fonepay'
                        ? 'border-red-500 bg-red-50 text-red-800 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Fonepay QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className="col-span-4 p-3 rounded-xl border border-amber-500 bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Credit or Debit Card (Stripe / Visa / MasterCard / Apple Pay)
                </button>
              )}
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>30-Day Money-Back Guarantee • Instant Digital Activation</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || success}
              className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? (
                <span>Activating Premium...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Activate Premium Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
