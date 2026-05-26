import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Users, 
  Award,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  Loader2,
  QrCode,
  Smartphone,
  Star,
  Landmark
} from 'lucide-react';
import type { ExperimentConfig, ThemeID } from '../App';

interface CheckoutProps {
  config: ExperimentConfig;
  onBackToDashboard: () => void;
  onPaymentComplete?: (success: boolean) => void;
  geo?: 'US' | 'BR' | 'EU' | 'DE';
  theme?: ThemeID;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'declined';

const geoConfig = {
  US: { currency: '$', price: '119.99', localePrice: '$119.99', symbol: 'USD' },
  BR: { currency: 'R$', price: '599.00', localePrice: 'R$ 599,00', symbol: 'BRL' },
  EU: { currency: '€', price: '109.00', localePrice: '€109.00', symbol: 'EUR' },
  DE: { currency: '€', price: '410.00', localePrice: '€410.00', symbol: 'EUR' },
};

// EDGE TONE MAPPING SIMULATION (Pillar 3)
const TONE_MAP = {
  pro: {
    title: "Checkout",
    welcome: "Welcome to WellTech Pro",
    cta: "Start My Journey",
    sub_title: "Finalize Subscription",
    fail_msg: "Transaction Failed",
    fail_detail: "Your bank reported insufficient funds or a security block.",
    success_msg: "Payment Verified",
    success_detail: "Your subscription is now active. Access expert-backed programs now.",
    social_text: "Join 12,480+ Members",
    social_sub: "LTV Confidence: 92%"
  },
  wellness: {
    title: "Your Path",
    welcome: "Welcome to your Journey",
    cta: "Begin Wellness Path",
    sub_title: "Start Your Experience",
    fail_msg: "Let's try that again",
    fail_detail: "Something went wrong with your payment. We're here to help.",
    success_msg: "Heartfelt Welcome",
    success_detail: "You've taken the first step toward a balanced life. We are with you.",
    social_text: "A Community of 12,480",
    social_sub: "Nurturing growth together"
  }
};

const Checkout: React.FC<CheckoutProps> = ({ config, onBackToDashboard, onPaymentComplete, geo = 'US', theme = 'pro' }) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [upsellStatus, setUpsellStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'ideal' | 'sepa'>('card');
  const activeGeo = geoConfig[geo];
  const t = TONE_MAP[theme];

  useEffect(() => {
    if (geo === 'BR') setPaymentMethod('pix');
    else if (geo === 'EU' || geo === 'DE') setPaymentMethod('ideal');
    else setPaymentMethod('card');
  }, [geo]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let safetyHatch: ReturnType<typeof setTimeout>;

    if (status === 'processing') {
      timer = setTimeout(() => {
        const isSuccess = Math.random() < 0.85;
        if (isSuccess) {
          setStatus('success');
          onPaymentComplete?.(true);
        } else {
          setStatus('declined');
          onPaymentComplete?.(false);
        }
      }, 2000);

      safetyHatch = setTimeout(() => {
        setStatus(prev => {
          if (prev === 'processing') {
            setTimeout(() => onPaymentComplete?.(false), 0);
            return 'declined';
          }
          return prev;
        });
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (safetyHatch) clearTimeout(safetyHatch);
    };
  }, [status, onPaymentComplete]);

  // Phase 4: Safe Upsell Timeout to prevent memory leaks on unmount
  useEffect(() => {
    let upsellTimer: ReturnType<typeof setTimeout>;
    if (upsellStatus === 'processing') {
      upsellTimer = setTimeout(() => {
        setUpsellStatus('success');
      }, 1500);
    }
    return () => {
      if (upsellTimer) clearTimeout(upsellTimer);
    };
  }, [upsellStatus]);

  const handlePayment = () => {
    if (status === 'processing') return;
    setStatus('processing');
  };

  const handleUpsell = () => {
    if (upsellStatus === 'processing') return;
    setUpsellStatus('processing');
  };

  if (status === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-welltech-dark font-sans text-welltech-text">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 bg-red-500/20">
            <AlertCircle className="text-red-500" size={48} />
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">
            {t.fail_msg}
          </h1>
          <p className="text-welltech-muted mb-10 leading-relaxed font-medium">
            {t.fail_detail}
          </p>
          <div className="flex flex-col gap-4">
            <button onClick={() => setStatus('idle')} className="w-full py-5 bg-welltech-text text-welltech-dark font-black rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-widest">
              Try Again
            </button>
            <button onClick={onBackToDashboard} className="w-full py-4 text-welltech-muted font-bold uppercase text-[10px] tracking-[0.3em] hover:text-welltech-text transition-colors">
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-welltech-dark font-sans text-welltech-text">
        <div className="max-w-2xl w-full animate-in fade-in zoom-in duration-500">
          
          {/* Phase 4: The Immutable Receipt (Design Mandate) */}
          <div className="bg-welltech-primary/10 border border-welltech-primary/30 rounded-t-3xl p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-welltech-primary/20 blur-3xl rounded-full" />
             <CheckCircle2 className="text-welltech-primary mx-auto mb-4 relative z-10" size={48} />
             <h1 className="text-2xl font-black mb-2 tracking-tighter uppercase italic relative z-10 text-welltech-text">Purchase Complete</h1>
             <p className="text-welltech-primary font-bold text-sm tracking-widest uppercase relative z-10">Amount Paid: {activeGeo.localePrice}</p>
             <div className="mt-6 inline-flex items-center gap-2 bg-welltech-dark/50 px-4 py-2 rounded-full border border-welltech-primary/20 text-[10px] font-mono text-welltech-muted">
               <span>TRX_ID:</span>
               <span className="text-welltech-text">ch_3Nl8aF...</span>
               <Lock size={10} className="ml-2 text-welltech-primary" />
             </div>
          </div>

          {/* Phase 4: The 1-Click Upsell */}
          {upsellStatus === 'idle' || upsellStatus === 'processing' ? (
            <div className="bg-welltech-card border border-welltech-primary/30 rounded-b-3xl p-8 border-t-0 shadow-[var(--wt-shadow-card)] relative transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[rgba(var(--wt-primary-rgb),0.1)] hover:border-welltech-primary/50 group">
               <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-welltech-secondary mb-1">Exclusive Member Offer</h3>
                    <h2 className="text-3xl font-black tracking-tighter text-welltech-text italic">1-on-1 Nutrition Coaching</h2>
                  </div>
                  <div className="text-right">
                     <span className="block text-2xl font-black text-welltech-text">+$19<span className="text-sm text-welltech-muted">/mo</span></span>
                  </div>
               </div>
               
               <p className="text-sm text-welltech-muted leading-relaxed mb-8">
                 Maximize your results with a dedicated certified nutritionist. We will analyze your metrics and build a custom meal plan tailored exactly to your body type.
               </p>

               <div className="flex flex-col gap-4">
                 <button 
                   onClick={handleUpsell} 
                   disabled={upsellStatus === 'processing'}
                   className="w-full py-5 bg-welltech-secondary text-welltech-dark font-black rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(0,209,255,0.2)] uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {upsellStatus === 'processing' ? (
                     <><Loader2 className="animate-spin" size={20} /> Securing Upsell Lock...</>
                   ) : (
                     "Add to My Subscription with 1-Click"
                   )}
                 </button>
                 <button 
                   onClick={onBackToDashboard} 
                   disabled={upsellStatus === 'processing'}
                   className="w-full py-3 text-welltech-muted font-bold uppercase text-[10px] tracking-[0.3em] hover:text-welltech-text transition-colors disabled:opacity-20"
                 >
                   No thanks, take me to the hub
                 </button>
               </div>
            </div>
          ) : (
            <div className="bg-welltech-text/5 border border-welltech-border/10 rounded-b-3xl p-12 text-center animate-in fade-in slide-in-from-top-4">
               <Award className="mx-auto text-welltech-secondary mb-4" size={48} />
               <h2 className="text-2xl font-black text-welltech-text tracking-tighter italic uppercase mb-2">Coaching Added</h2>
               <p className="text-welltech-muted text-sm mb-8">Your nutritionist will reach out within 24 hours to begin your assessment.</p>
               <button onClick={onBackToDashboard} className="px-8 py-4 bg-welltech-text text-welltech-dark font-black rounded-xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs">
                 Enter Member Hub
               </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-welltech-dark flex flex-col md:flex-row font-sans text-welltech-text">
      {/* Left Side: Checkout Form */}
      <div className="flex-1 p-8 lg:p-16 overflow-y-auto pb-32 md:pb-16">
        <button onClick={onBackToDashboard} disabled={status === 'processing'} className="flex items-center gap-2 text-welltech-muted hover:text-welltech-text transition-colors mb-12 text-[10px] font-black uppercase tracking-widest disabled:opacity-20">
          <ArrowLeft size={14} /> Back to Hub
        </button>

        <div className="max-w-xl mx-auto md:mx-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t.title}</h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-welltech-muted mb-4 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-welltech-primary text-welltech-dark flex items-center justify-center text-[10px]">01</div>
                Payment Method
              </h3>
              
              <div className="flex gap-2 mb-4">
                 <MethodTab active={paymentMethod === 'card'} disabled={status === 'processing'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={16} />} label="CARD" />
                 {geo === 'BR' && <MethodTab active={paymentMethod === 'pix'} disabled={status === 'processing'} onClick={() => setPaymentMethod('pix')} icon={<QrCode size={16} />} label="PIX" />}
                 {(geo === 'EU' || geo === 'DE') && <MethodTab active={paymentMethod === 'ideal'} disabled={status === 'processing'} onClick={() => setPaymentMethod('ideal')} icon={<Smartphone size={16} />} label="IDEAL" />}
                 {(geo === 'EU' || geo === 'DE') && <MethodTab active={paymentMethod === 'sepa'} disabled={status === 'processing'} onClick={() => setPaymentMethod('sepa')} icon={<Landmark size={16} />} label="SEPA" />}
              </div>

              <div className="p-8 bg-welltech-text/5 rounded-2xl border border-welltech-border/10 min-h-[220px] flex flex-col justify-center transition-all duration-300">
                 {paymentMethod === 'card' ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-[10px] font-black text-welltech-muted uppercase mb-2 block tracking-widest">Card Number</label>
                           <div className="relative">
                             <input type="text" disabled={status === 'processing'} placeholder="**** **** **** 4242" className="w-full bg-welltech-card border border-welltech-border/20 p-4 rounded-xl text-welltech-text placeholder-welltech-muted/50 focus:border-welltech-primary outline-none transition-all disabled:opacity-50 font-mono shadow-sm" />
                             <CreditCard className="absolute right-4 top-4 text-welltech-muted" size={20} />
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-[10px] font-black text-welltech-muted uppercase mb-2 block tracking-widest">Expiry</label>
                           <input type="text" disabled={status === 'processing'} placeholder="MM/YY" className="w-full bg-welltech-card border border-welltech-border/20 p-4 rounded-xl text-welltech-text placeholder-welltech-muted/50 focus:border-welltech-primary outline-none transition-all disabled:opacity-50 shadow-sm" />
                        </div>
                        <div className="flex-1">
                           <label className="text-[10px] font-black text-welltech-muted uppercase mb-2 block tracking-widest">CVC</label>
                           <input type="text" disabled={status === 'processing'} placeholder="***" className="w-full bg-welltech-card border border-welltech-border/20 p-4 rounded-xl text-welltech-text placeholder-welltech-muted/50 focus:border-welltech-primary outline-none transition-all disabled:opacity-50 shadow-sm" />
                        </div>
                     </div>
                   </div>
                 ) : paymentMethod === 'pix' ? (
                    <div className="text-center py-4 animate-in fade-in slide-in-from-right-2">
                       <div className="w-20 h-20 mx-auto mb-6 bg-welltech-primary/10 rounded-xl flex items-center justify-center border border-welltech-primary/20 relative overflow-hidden">
                          <QrCode size={40} className="text-welltech-primary" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-welltech-primary/20 to-transparent" />
                       </div>
                       <p className="text-xs font-black text-welltech-text uppercase tracking-[0.2em]">Dynamic Pix QR</p>
                       <p className="text-[10px] text-welltech-muted mt-2 font-bold italic">Instant secure verification</p>
                    </div>
                 ) : paymentMethod === 'ideal' ? (
                    <div className="text-center py-4 animate-in fade-in slide-in-from-right-2">
                       <Smartphone size={64} className="mx-auto mb-4 text-welltech-secondary opacity-20" />
                       <p className="text-xs font-black text-welltech-text uppercase tracking-[0.2em]">Secure Bank Redirect</p>
                       <p className="text-[10px] text-welltech-muted mt-2 font-bold italic">Redirecting to financial institution</p>
                    </div>
                 ) : (
                    <div className="text-center py-4 animate-in fade-in slide-in-from-right-2">
                       <Landmark size={64} className="mx-auto mb-4 text-welltech-primary opacity-20" />
                       <p className="text-xs font-black text-welltech-text uppercase tracking-[0.2em]">SEPA Direct Debit</p>
                       <p className="text-[10px] text-welltech-muted mt-2 font-bold italic">Secure IBAN Processing</p>
                    </div>
                 )}
              </div>
            </section>

            <button onClick={handlePayment} disabled={status === 'processing'} className="w-full py-5 welltech-gradient text-welltech-dark font-black text-lg rounded-2xl shadow-[0_0_50px_rgba(var(--wt-primary-rgb),0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed group">
              {status === 'processing' ? <><Loader2 className="animate-spin" size={20} /><span>Verifying...</span></> : <><span>{t.cta} {activeGeo.localePrice}</span><ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>

            <p className="text-center text-[10px] text-welltech-muted font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2">
              <Lock size={10} /> Secure PCI-DSS Level 1 Encryption
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Summary & Value Blocks */}
      <div className="w-full md:w-96 lg:w-[450px] bg-welltech-text/[0.02] border-l border-welltech-border/5 p-8 lg:p-12 relative overflow-hidden">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-welltech-muted mb-8">Order Summary</h3>
        
        <div className="p-6 bg-welltech-text/5 rounded-2xl border border-welltech-border/10 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-black text-xl tracking-tighter uppercase italic">WellTech Pro</span>
            <span className="font-black text-xl tracking-tighter">{activeGeo.localePrice}</span>
          </div>
          <p className="text-[10px] text-welltech-primary font-black uppercase tracking-[0.2em] mb-6">Save 40% vs Monthly</p>
          
          <div className="space-y-3 pt-6 border-t border-welltech-border/5">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-welltech-muted">Subtotal</span>
              <span className="text-welltech-text">{activeGeo.localePrice}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-welltech-muted">Tax ({geo})</span>
              <span className="text-welltech-text">{activeGeo.currency} 0.00</span>
            </div>
            <div className="flex justify-between text-2xl font-black pt-4 italic tracking-tighter">
              <span>TOTAL</span>
              <span className="text-welltech-primary underline decoration-2 underline-offset-4">{activeGeo.localePrice}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Contextual Value Blocks */}
        <div className="space-y-4 hidden md:block">
          {config.showSocialProof && (
            <div className="p-4 bg-welltech-primary/5 border border-welltech-primary/10 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in">
              <div className="w-10 h-10 rounded-full bg-welltech-primary/20 flex items-center justify-center text-welltech-primary"><Users size={20} /></div>
              <div><p className="text-sm font-bold text-welltech-text">{t.social_text}</p><p className="text-[10px] text-welltech-muted font-bold uppercase tracking-widest mt-1">{t.social_sub}</p></div>
            </div>
          )}
          {config.showRiskReversal && (
            <div className="p-4 bg-welltech-secondary/5 border border-welltech-secondary/10 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in delay-150">
              <div className="w-10 h-10 rounded-full bg-welltech-secondary/20 flex items-center justify-center text-welltech-secondary"><ShieldCheck size={20} /></div>
              <div><p className="text-sm font-bold text-welltech-text">30-Day Money Back</p><p className="text-[10px] text-welltech-muted font-bold uppercase tracking-widest mt-1">Risk-free trial</p></div>
            </div>
          )}
          {config.showAuthority && (
            <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl flex items-center gap-4 animate-in fade-in zoom-in delay-300">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><Award size={20} /></div>
              <div><p className="text-sm font-bold text-welltech-text">Expert-Backed Programs</p><p className="text-[10px] text-welltech-muted font-bold uppercase tracking-widest mt-1">Clinical Authority</p></div>
            </div>
          )}
        </div>

        {/* Mobile Sticky Persuasion Bar (Pillar 3 Implementation) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-welltech-dark/80 backdrop-blur-xl border-t border-welltech-border/10 z-50 animate-in slide-in-from-bottom-full duration-500">
           <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {config.showSocialProof && <div className="shrink-0 flex items-center gap-2 bg-welltech-primary/10 border border-welltech-primary/20 px-3 py-2 rounded-full"><Users size={12} className="text-welltech-primary" /><span className="text-[8px] font-black text-welltech-text uppercase tracking-wider">{t.social_text}</span></div>}
              {config.showRiskReversal && <div className="shrink-0 flex items-center gap-2 bg-welltech-secondary/10 border border-welltech-secondary/20 px-3 py-2 rounded-full"><ShieldCheck size={12} className="text-welltech-secondary" /><span className="text-[8px] font-black text-welltech-text uppercase tracking-wider">30-DAY GUARANTEE</span></div>}
              {config.showAuthority && <div className="shrink-0 flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-2 rounded-full"><Award size={12} className="text-purple-400" /><span className="text-[8px] font-black text-welltech-text uppercase tracking-wider">EXPERT-BACKED</span></div>}
              <div className="shrink-0 flex items-center gap-2 bg-welltech-text/5 border border-welltech-border/10 px-3 py-2 rounded-full"><Star size={12} className="text-yellow-500" /><span className="text-[8px] font-black text-welltech-text uppercase tracking-wider">4.9/5 RATING</span></div>
           </div>
        </div>

        <div className="mt-12 hidden md:block">
           <div className="flex items-center gap-2 text-welltech-muted mb-4"><div className="h-px bg-welltech-text/5 flex-1" /><span className="text-[8px] font-black uppercase tracking-[0.4em]">Strategic Partners</span><div className="h-px bg-welltech-text/5 flex-1" /></div>
           <div className="flex justify-between opacity-20 grayscale contrast-125 px-4 items-center"><div className="font-black italic text-sm tracking-tighter">FITBIT</div><div className="font-black italic text-sm tracking-tighter">NIKE</div><div className="font-black italic text-sm tracking-tighter">GARMIN</div></div>
        </div>
      </div>
    </div>
  );
};

const MethodTab = ({ active, onClick, icon, label, disabled = false }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-black tracking-widest transition-all ${active ? 'bg-welltech-primary/10 border-welltech-primary text-welltech-primary' : 'bg-welltech-text/5 border-welltech-border/5 text-welltech-muted hover:bg-welltech-text/10'} disabled:opacity-20`}>{icon}{label}</button>
);

export default Checkout;
