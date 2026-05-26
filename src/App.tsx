import { useState, useMemo, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Checkout from './components/Checkout'
import { useBandit } from './hooks/useBandit'
import type { BanditVariant } from './hooks/useBandit'

export type ThemeID = 'pro' | 'wellness';

export interface ExperimentConfig {
  showSocialProof: boolean;
  showRiskReversal: boolean;
  showAuthority: boolean;
  activeVariant: 'control' | 'social_proof' | 'authority';
  geo: 'US' | 'BR' | 'EU' | 'DE';
  theme: ThemeID;
  killSwitch: boolean;
}

const INITIAL_VARIANTS: BanditVariant[] = [
  { id: 'control', name: 'Control', conversions: 120, engagements: 95, failures: 80, explorationFloor: 15 },
  { id: 'social_proof', name: 'Social Proof', conversions: 145, engagements: 110, failures: 55, explorationFloor: 15 },
  { id: 'authority', name: 'Authority/Risk', conversions: 188, engagements: 152, failures: 32, explorationFloor: 15 },
];

function App() {
  const [view, setView] = useState<'dashboard' | 'checkout'>('dashboard')
  const { allocation, assignVariant, recordOutcome, weights, setWeights } = useBandit(INITIAL_VARIANTS);
  
  const [config, setConfig] = useState<ExperimentConfig>({
    showSocialProof: true,
    showRiskReversal: true,
    showAuthority: true,
    activeVariant: 'social_proof',
    geo: 'US',
    theme: 'pro',
    killSwitch: false // Emergency fallback toggle
  })

  // THEME ORCHESTRATION: Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', config.theme);
  }, [config.theme]);

  // MAB Logic: Assign variant ONCE when entering checkout to prevent flickering on retry
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const assignedVariantId = useMemo(() => assignVariant(), [view]);

  // Sync config with MAB assignment
  const activeConfig = useMemo(() => {
    if (view === 'dashboard') return config; // Respect manual toggles in Hub
    
    // Engineering Kill Switch: Override all MAB logic and fall back to safe Control
    if (config.killSwitch) {
      return {
        ...config,
        activeVariant: 'control' as any,
        showSocialProof: false,
        showRiskReversal: false,
        showAuthority: false,
      };
    }

    return {
      ...config,
      activeVariant: assignedVariantId as any,
      showSocialProof: assignedVariantId === 'social_proof',
      showRiskReversal: assignedVariantId === 'authority',
      showAuthority: assignedVariantId === 'authority',
    };
  }, [assignedVariantId, config, view]);

  const handlePaymentComplete = (success: boolean) => {
    if (config.killSwitch) return; // Do not poison data if in safe mode
    
    // Simulating Kafka Queue batching (QA Constraint)
    console.log(`[Kafka Queue] Queued MAB update: Variant ${assignedVariantId}, Success: ${success}`);
    
    if (success) {
      const engaged = Math.random() > 0.2;
      recordOutcome(assignedVariantId, true, engaged);
    } else {
      recordOutcome(assignedVariantId, false, false);
    }
  };

  return (
    <div className="min-h-screen bg-welltech-dark text-welltech-text font-sans selection:bg-welltech-primary selection:text-welltech-dark">
      {view === 'dashboard' ? (
        <Dashboard 
          config={config}
          setConfig={setConfig}
          mabAllocation={allocation}
          weights={weights}
          setWeights={setWeights}
          onNavigateToCheckout={() => setView('checkout')} 
        />
      ) : (
        <Checkout 
          config={activeConfig}
          geo={config.geo}
          theme={config.theme}
          onBackToDashboard={() => setView('dashboard')} 
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

export default App
