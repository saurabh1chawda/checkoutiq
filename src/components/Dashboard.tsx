import React from 'react';
import { 
  BarChart3, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Activity, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Award, 
  Zap, 
  PieChart as PieChartIcon, 
  MousePointer2, 
  Database, 
  Info,
  X,
  Target,
  Share2,
  LineChart
} from 'lucide-react';
import { 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import type { ExperimentConfig, ThemeID } from '../App';

interface DashboardProps {
  onNavigateToCheckout: () => void;
  config: ExperimentConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExperimentConfig>>;
  mabAllocation: { id: string; name: string; percentage: number; status: 'exploring' | 'exploiting'; confidence: number }[];
  weights: { conversion: number; engagement: number };
  setWeights: React.Dispatch<React.SetStateAction<{ conversion: number; engagement: number }>>;
}

const regionMetrics = {
  US: { mrr: '$248,500', mrrChange: '+$42k/mo', conv: '71.4%', convChange: '+11.4%' },
  BR: { mrr: 'R$ 1,240,000', mrrChange: '+R$ 210k/mo', conv: '64.2%', convChange: '+8.2%' },
  EU: { mrr: '€212,000', mrrChange: '+€36k/mo', conv: '68.8%', convChange: '+9.4%' },
  DE: { mrr: '€410,000', mrrChange: '+€65k/mo', conv: '69.1%', convChange: '+8.9%' },
};

const experimentData = [
  { name: 'Control', conversion: 60.2 },
  { name: 'Social Proof', conversion: 68.4 },
  { name: 'Authority/Risk', conversion: 74.1 },
];

const COLORS = ['#444', '#00FF41', '#00D1FF'];

/**
 * UI FIX: PREMIUM UNIFIED HEADER
 * Ensures icon alignment and intelligent tooltip positioning for both themes.
 */
const CardHeader = ({ 
  title, 
  tooltip, 
  icon: Icon, 
  colorClass = "text-welltech-muted", 
  position = "top",
  isSidebar = false
}: { 
  title: string, 
  tooltip: string, 
  icon?: any, 
  colorClass?: string, 
  position?: "top" | "bottom" | "right" | "left",
  isSidebar?: boolean
}) => (
  <div className={`flex items-center gap-2 ${isSidebar ? 'mb-0' : 'mb-6'} group/header relative w-fit`}>
    {Icon && <Icon size={16} className={colorClass} />}
    <h3 className={`text-sm font-black uppercase tracking-widest ${colorClass}`}>{title}</h3>
    
    <div className="relative group/tooltip flex items-center">
      <div className="p-1 -m-1 opacity-40 group-hover/tooltip:opacity-100 cursor-help transition-opacity">
        <Info size={12} className="text-welltech-muted" />
      </div>
      
      {/* PREMIUM RESPONSIVE TOOLTIP: ALWAYS DARK THEME FOR CONTRAST */}
      <div className={`
        pointer-events-none absolute z-[110] w-64 md:w-80 p-4 rounded-2xl
        tooltip-box transition-all duration-300 opacity-0 group-hover/tooltip:opacity-100
        scale-90 group-hover/tooltip:scale-100
        ${isSidebar ? 'left-full ml-4 top-1/2 -translate-y-1/2 origin-left' : 
          position === 'top' ? 'bottom-full mb-4 left-1/2 -translate-x-1/2 origin-bottom' : 
          position === 'bottom' ? 'top-full mt-4 left-1/2 -translate-x-1/2 origin-top' : 
          position === 'right' ? 'left-full ml-4 top-1/2 -translate-y-1/2 origin-left' : 
          'right-full mr-4 top-1/2 -translate-y-1/2 origin-right'}
      `}>
         <p className="text-xs font-bold leading-relaxed whitespace-normal normal-case tracking-normal text-center text-white">
           {tooltip}
         </p>
         {/* Adaptive Arrow */}
         <div className={`
           absolute border-[6px] border-transparent
           ${isSidebar ? 'right-full top-1/2 -translate-y-1/2 border-r-[#1A2E26]' : 
             position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-[#1A2E26]' : 
             'bottom-full left-1/2 -translate-x-1/2 border-b-[#1A2E26]'}
         `} />
      </div>
    </div>
    {title === "TRAFFIC ALLOCATION" && <span className="text-[10px] text-welltech-muted font-bold tracking-widest animate-pulse ml-4 uppercase">Dynamic AI</span>}
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToCheckout, config, setConfig, mabAllocation, weights, setWeights }) => {
  const activeMetrics = regionMetrics[config.geo];
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  
  const toggleConfig = (key: keyof ExperimentConfig) => {
    if (key === 'activeVariant' || key === 'geo' || key === 'theme' || key === 'killSwitch') return;
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setGeo = (geo: 'US' | 'BR' | 'EU' | 'DE') => {
    setConfig(prev => ({ ...prev, geo }));
  };

  const setTheme = (theme: ThemeID) => {
    setConfig(prev => ({ ...prev, theme }));
  };

  const toggleKillSwitch = () => {
    setConfig(prev => ({ ...prev, killSwitch: !prev.killSwitch }));
  };

  return (
    <div className="flex bg-welltech-dark min-h-screen text-welltech-text font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-welltech-border/10 p-6 flex flex-col gap-8 bg-welltech-sidebar sticky top-0 h-screen overflow-y-visible z-30 transition-colors duration-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 welltech-gradient rounded-lg flex items-center justify-center font-bold text-welltech-dark text-lg italic">
            IQ
          </div>
          <span className="font-bold text-xl tracking-tight text-welltech-text uppercase italic">CheckoutIQ</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" active onClick={() => setActiveModal(null)} />
          <NavItem icon={<Zap size={20} />} label="MAB Engine" active={activeModal === 'mab'} onClick={() => setActiveModal('mab')} />
          <NavItem icon={<Settings size={20} />} label="Strategic Hypotheses" active={activeModal === 'hypo'} onClick={() => setActiveModal('hypo')} />
          <NavItem icon={<Activity size={20} />} label="Webhooks" active={activeModal === 'web'} onClick={() => setActiveModal('web')} />
        </nav>

        {/* Global Kill Switch */}
        <div className={`p-4 rounded-xl border transition-all relative hover:z-50 ${config.killSwitch ? 'bg-red-500/10 border-red-500/30' : 'bg-welltech-text/5 border-welltech-border/10'}`}>
          <div className="flex justify-between items-center mb-2">
             <CardHeader 
               title="SAFE MODE" 
               tooltip="Engineering Safe Mode: Bypasses the AI engine and forces 100% of checkout traffic to the static Control variant." 
               colorClass={config.killSwitch ? 'text-red-400' : 'text-welltech-muted'}
               isSidebar
             />
             <div onClick={toggleKillSwitch} className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${config.killSwitch ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-welltech-text/10'}`}>
               <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-welltech-dark transition-all ${config.killSwitch ? 'left-4.5' : 'left-0.5'}`} />
             </div>
          </div>
        </div>

        {/* Brand Identity */}
        <div className="p-4 bg-welltech-primary/5 rounded-xl border border-welltech-primary/20 relative hover:z-50">
          <CardHeader 
            title="BRAND IDENTITY" 
            tooltip="Simulate Source-to-Theme mapping. Orchestrate visual identities based on UTMs." 
            colorClass="text-welltech-primary"
            isSidebar
          />
          <div className="flex flex-col gap-2">
             <ThemeButton active={config.theme === 'pro'} label="VIBRANT PRO" onClick={() => setTheme('pro')} />
             <ThemeButton active={config.theme === 'wellness'} label="CALM WELLNESS" onClick={() => setTheme('wellness')} />
          </div>
        </div>

        {/* UI Fragments */}
        <div className="p-4 bg-welltech-text/5 rounded-xl border border-welltech-border/10 opacity-70 relative hover:z-50">
          <CardHeader 
            title="UI FRAGMENTS" 
            tooltip="Manual overrides for UI components. Overridden by AI when MAB is active." 
            isSidebar
          />
          <div className="space-y-3">
            <ToggleItem label="Social Proof" active={config.showSocialProof} disabled={config.killSwitch} onClick={() => toggleConfig('showSocialProof')} />
            <ToggleItem label="Risk Reversal" active={config.showRiskReversal} disabled={config.killSwitch} onClick={() => toggleConfig('showRiskReversal')} />
            <ToggleItem label="Authority" active={config.showAuthority} disabled={config.killSwitch} onClick={() => toggleConfig('showAuthority')} />
          </div>
        </div>

        {/* MAB Strategy */}
        <div className="p-4 bg-welltech-text/5 rounded-xl border border-welltech-border/10 relative hover:z-50">
          <CardHeader 
            title="MAB STRATEGY" 
            tooltip="Adjust the Multi-Armed Bandit algorithm's priority between immediate checkout conversion and Day-1 user engagement to protect LTV." 
            isSidebar
          />
          <div className="space-y-4">
             <div>
                <div className="flex justify-between text-[9px] font-bold text-welltech-muted uppercase mb-1">
                   <span>Conv. Weight</span>
                   <span>{(weights.conversion * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={weights.conversion}
                  disabled={config.killSwitch}
                  onChange={(e) => {
                    const conv = parseFloat(e.target.value);
                    setWeights({ conversion: conv, engagement: 1 - conv });
                  }}
                  className={`w-full h-1 bg-welltech-text/10 rounded-lg appearance-none cursor-pointer ${config.killSwitch ? 'accent-gray-500' : 'accent-welltech-primary'}`} 
                />
             </div>
          </div>
        </div>

        {/* Regional Routing */}
        <div className="p-4 bg-welltech-secondary/5 rounded-xl border border-welltech-secondary/20 relative hover:z-50">
          <CardHeader 
            title="REGIONAL ROUTING" 
            tooltip="Simulate Edge Geo-Routing. Injects local methods (Pix, iDEAL, SEPA)." 
            colorClass="text-welltech-secondary"
            isSidebar
          />
          <div className="grid grid-cols-2 gap-2">
            <GeoButton active={config.geo === 'US'} label="US" onClick={() => setGeo('US')} />
            <GeoButton active={config.geo === 'BR'} label="BR" onClick={() => setGeo('BR')} />
            <GeoButton active={config.geo === 'EU'} label="EU" onClick={() => setGeo('EU')} />
            <GeoButton active={config.geo === 'DE'} label="DE" onClick={() => setGeo('DE')} />
          </div>
        </div>

        <div className="mt-auto pt-4 pb-4">
          <button 
            onClick={onNavigateToCheckout}
            className="w-full py-4 rounded-xl bg-welltech-primary text-welltech-dark flex items-center justify-center gap-2 hover:opacity-90 transition-all font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(var(--wt-primary-rgb),0.2)]"
          >
            Preview Checkout <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative z-10">
        <header className="mb-10 flex justify-between items-end text-welltech-text">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic text-stroke-sm">Monetization Hub</h1>
            <p className="text-welltech-muted font-bold uppercase text-[10px] tracking-widest leading-relaxed">
              Strategic Monetization Orchestrator <br/> 
              {config.killSwitch ? (
                <span className="text-red-400">SAFE MODE ACTIVE: STATIC ROUTING ONLY</span>
              ) : (
                <span className="text-welltech-secondary font-black">AI-Driven Thompson Sampling Engine Active</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <div className={`px-4 py-2 bg-welltech-text/5 rounded-lg border border-welltech-border/10 text-[10px] font-black flex items-center gap-2 uppercase tracking-widest ${config.killSwitch ? 'text-welltech-muted' : 'text-welltech-primary'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${config.killSwitch ? 'bg-welltech-muted' : 'bg-welltech-primary shadow-[0_0_10px_#00FF41]'}`} />
              Edge Strategy: {config.geo} / {config.theme.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Executive Metrics: INSIGHT EXPANSION FIX */}
        <div className="grid grid-cols-4 gap-6 mb-8 relative h-fit items-start">
          <MetricCard 
            title="Avg Conversion" 
            value={activeMetrics.conv} 
            change={activeMetrics.convChange} 
            icon={<TrendingUp className="text-welltech-primary" />} 
            tooltip="The average percentage of users who complete the checkout process successfully across all active variants."
          />
          <MetricCard 
            title="Incremental MRR" 
            value={activeMetrics.mrr} 
            change={activeMetrics.mrrChange} 
            icon={<DollarSign className="text-welltech-secondary" />} 
            tooltip="The projected additional Monthly Recurring Revenue generated by the winning experiment variants in this region."
          />
          <MetricCard 
            title="D1 Engagement" 
            value="84.2%" 
            change="+2.4%" 
            icon={<Zap className="text-welltech-primary" />} 
            tooltip="Percentage of users completing their first core app action within 24 hours of purchase. Serves as our primary LTV proxy."
          />
          <MetricCard 
            title="Decline Rate" 
            value="6.2%" 
            change="-1.4%" 
            icon={<AlertCircle className="text-red-400" />} 
            tooltip="The percentage of payment intents that fail due to bank declines, insufficient funds, or fraud triggers."
          />
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8 relative">
          {/* MAB Traffic Allocation */}
          <div className={`welltech-card flex flex-col border-welltech-border/5 bg-welltech-text/[0.02] relative overflow-visible transition-all hover:z-[100] ${config.killSwitch ? 'opacity-50 grayscale' : ''}`}>
            <CardHeader 
              title="TRAFFIC ALLOCATION" 
              icon={PieChartIcon} 
              colorClass="text-welltech-secondary"
              position="bottom"
              tooltip="Displays how the Multi-Armed Bandit engine is dynamically distributing incoming traffic based on real-time variant performance." 
            />
            <div className="h-48 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mabAllocation}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="percentage"
                  >
                    {mabAllocation.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--wt-card-bg)', border: '1px solid var(--wt-border)', color: 'var(--wt-text-main)' }}
                    itemStyle={{ color: 'var(--wt-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 ml-4">
                 {mabAllocation.map((v, i) => (
                   <div key={v.id} className="flex flex-col">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[9px] font-black text-welltech-muted uppercase tracking-tighter leading-none">{v.name}: {v.percentage}%</span>
                     </div>
                     <span className="text-[8px] font-bold text-welltech-primary ml-4 uppercase">Conf: {v.confidence}%</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          {/* Conversion Lift Chart */}
          <div className="welltech-card col-span-2 border-welltech-border/5 bg-welltech-text/[0.02] relative overflow-visible hover:z-[100]">
            <CardHeader 
              title="BAYESIAN PROBABILITY DISTRIBUTION" 
              icon={BarChart3} 
              colorClass="text-welltech-primary"
              position="bottom"
              tooltip="The raw Bayesian probability that a specific variant outperforms the control, factoring in the composite reward." 
            />
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--wt-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--wt-text-dim)" fontSize={10} fontWeight="bold" />
                  <YAxis stroke="var(--wt-text-dim)" fontSize={10} fontWeight="bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--wt-card-bg)', border: '1px solid var(--wt-border)', color: 'var(--wt-text-main)' }}
                    itemStyle={{ color: 'var(--wt-primary)' }}
                  />
                  <Bar dataKey="conversion" fill="var(--wt-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 relative text-welltech-text">
           {/* Compliance Audit Log (CEO Mandate) */}
           <div className="welltech-card border-welltech-border/5 bg-welltech-text/[0.02] flex flex-col relative overflow-visible hover:z-[100]">
             <CardHeader 
               title="IMMUTABLE AUDIT LEDGER" 
               icon={Database} 
               colorClass="text-purple-400"
               tooltip="An immutable, append-only ledger recording every MAB variant assignment decision for compliance." 
             />
             <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px]">
                <AuditRow timestamp="14:02:01.001Z" session="sess_89f2a" variant="social_proof" score="84" event="MAB_ASSIGN" />
                <AuditRow timestamp="14:01:59.432Z" session="sess_3bb9c" variant="authority" score="91" event="MAB_ASSIGN" />
                <AuditRow timestamp="14:01:55.110Z" session="sess_7c12f" variant="control" score="12" event="MAB_ASSIGN" />
                <AuditRow timestamp="14:01:42.999Z" session="sess_82d9a" variant="social_proof" score="82" event="MAB_ASSIGN" />
                <AuditRow timestamp="14:01:30.125Z" session="sess_9f001" variant="authority" score="89" event="MAB_ASSIGN" />
             </div>
           </div>

           {/* Decline Taxonomy */}
           <div className="welltech-card border-welltech-border/5 bg-welltech-text/[0.02] relative overflow-visible hover:z-[100]">
              <CardHeader 
                title="DECLINE TAXONOMY" 
                icon={AlertCircle} 
                colorClass="text-red-500"
                tooltip="Categorizes failed transactions by root cause, enabling targeted Dunning and recovery A/B tests." 
              />
              <div className="space-y-6 text-welltech-text">
                <DeclineItem label="Insufficient Funds" percentage={42} count={1240} />
                <DeclineItem label="Do Not Honor" percentage={28} count={820} />
                <DeclineItem label="Security Violation" percentage={18} count={530} />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 relative">
           {/* Proprietary Growth Moat */}
           <div className="welltech-card border-welltech-border/5 bg-welltech-text/[0.02] relative overflow-visible hover:z-[100]">
              <CardHeader 
                title="PROPRIETARY GROWTH MOAT" 
                icon={MousePointer2} 
                colorClass="text-welltech-secondary"
                tooltip="Maps which UX value propositions perform best in specific geographical regions." 
              />
              <div className="space-y-4">
                 <MappingItem geo="BR" prop="Pix + Social Proof" uplift="+18.4%" />
                 <MappingItem geo="EU" prop="iDEAL + Risk Reversal" uplift="+14.2%" />
                 <MappingItem geo="US" prop="Card + Authority" uplift="+9.8%" />
              </div>
           </div>
           
           {/* Active Experiment Details */}
           <div className={`welltech-card border-welltech-border/5 bg-welltech-text/[0.02] transition-all relative overflow-visible hover:z-[100] ${config.killSwitch ? 'opacity-50 grayscale' : ''}`}>
             <div className="flex justify-between items-center mb-6">
               <CardHeader 
                 title="ACTIVE OPTIMIZATION PATH" 
                 icon={Activity} 
                 colorClass="text-welltech-primary"
                 tooltip="Detailed performance metrics and AI confidence scores for each variant." 
                 position="top"
               />
               <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-widest ${config.killSwitch ? 'bg-welltech-muted/10 text-welltech-muted border-welltech-muted/20' : 'bg-welltech-primary/10 text-welltech-primary border-welltech-primary/20'}`}>
                 {config.killSwitch ? 'MAB DISABLED' : 'AI-DRIVEN'}
               </span>
             </div>
             <div className="grid grid-rows-3 gap-4">
                {mabAllocation.map((v) => (
                  <VariantDetail 
                    key={v.id}
                    variant={v.name} 
                    status={config.killSwitch ? 'Offline' : (v.status === 'exploiting' ? 'Exploiting (Winner)' : 'Exploring')}
                    confidence={v.confidence}
                    highlight={v.status === 'exploiting' && !config.killSwitch}
                    icon={v.id === 'control' ? <ShieldCheck className="text-welltech-muted" /> : v.id === 'social_proof' ? <Users className="text-welltech-primary" /> : <Award className="text-welltech-secondary" />} 
                  />
                ))}
             </div>
           </div>
        </div>

      </div>

      {/* ROADMAP MODALS (Pillar 5 - Vision Extension) */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 modal-overlay animate-in fade-in duration-300">
           <div className="max-w-xl w-full bg-welltech-card border border-welltech-border/20 rounded-[3rem] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative text-welltech-text">
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-10 right-10 text-welltech-muted hover:text-welltech-text transition-colors"
              >
                <X size={24} />
              </button>

              {activeModal === 'mab' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                   <div className="w-20 h-20 rounded-2xl welltech-gradient flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(var(--wt-primary-rgb),0.3)]">
                      <Zap size={40} className="text-welltech-dark" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2 text-welltech-text">MAB Control Engine</h2>
                   <div className="inline-block px-3 py-1 bg-welltech-primary/10 border border-welltech-primary/20 rounded-full text-[10px] font-black text-welltech-primary uppercase tracking-[0.2em] mb-8">Coming Q3: Advanced Oversight</div>
                   
                   <div className="space-y-8">
                      <RoadmapItem icon={<LineChart size={20}/>} title="Bayesian Regret Curves" desc="Visualize the revenue opportunity cost in real-time as the AI explores new hypotheses." />
                      <RoadmapItem icon={<Target size={20}/>} title="Contextual Bandits" desc="Dynamic allocation based on user device, time-of-day, and local weather conditions." />
                      <RoadmapItem icon={<ShieldCheck size={20}/>} title="Exploration Safety Floors" desc="Hard-coded traffic minimums to prevent brand-damaging variant starvation." />
                   </div>
                </div>
              )}

              {activeModal === 'hypo' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                   <div className="w-20 h-20 rounded-2xl bg-welltech-secondary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,209,255,0.3)]">
                      <Settings size={40} className="text-welltech-dark" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2 text-welltech-text">Strategic Hypotheses</h2>
                   <div className="inline-block px-3 py-1 bg-welltech-secondary/10 border border-welltech-secondary/20 rounded-full text-[10px] font-black text-welltech-secondary uppercase tracking-[0.2em] mb-8">The PM Strategic Sandbox</div>
                   
                   <div className="space-y-8">
                      <RoadmapItem icon={<Target size={20}/>} title="Hypothesis Builder" desc="Define Expected Uplift vs. Guardrail Metrics (Churn/CSAT) before launching any test." />
                      <RoadmapItem icon={<Share2 size={20}/>} title="Cross-Functional Sync" desc="Automated Slack notifications for marketing and engineering when a new variable is introduced." />
                      <RoadmapItem icon={<DollarSign size={20}/>} title="ROI Projections" desc="AI-powered annualized MRR forecasting based on initial sample segments." />
                   </div>
                </div>
              )}

              {activeModal === 'web' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                   <div className="w-20 h-20 rounded-2xl bg-purple-500 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                      <Activity size={40} className="text-welltech-dark" />
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2 text-welltech-text">Webhook Health</h2>
                   <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-8">Reliability Monitor</div>
                   
                   <div className="space-y-8 text-welltech-text">
                      <RoadmapItem icon={<Activity size={20}/>} title="Idempotency Audit" desc="Real-time verification of duplicate transaction prevention across Stripe and Supabase." />
                      <RoadmapItem icon={<Database size={20}/>} title="Payload Inspection" desc="Deep-dive into gateway JSON responses to debug regional 3DS2 failures instantly." />
                      <RoadmapItem icon={<Zap size={20}/>} title="Latency Guard" desc="Automatic alerts if Stripe webhook delivery exceeds the 2000ms reliability threshold." />
                   </div>
                </div>
              )}

              <button 
                onClick={() => setActiveModal(null)}
                className="w-full mt-12 py-5 bg-welltech-text text-welltech-dark font-black uppercase italic rounded-2xl hover:scale-[1.02] transition-all shadow-xl"
              >
                Close Strategic Overview
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const RoadmapItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-6 group cursor-default">
     <div className="shrink-0 w-12 h-12 rounded-xl bg-welltech-text/5 flex items-center justify-center text-welltech-muted group-hover:text-welltech-primary transition-colors border border-welltech-border/5 shadow-inner">
        {icon}
     </div>
     <div>
        <h4 className="text-lg font-black text-welltech-text uppercase tracking-tighter italic">{title}</h4>
        <p className="text-[11px] text-welltech-muted font-bold leading-relaxed mt-1">{desc}</p>
     </div>
  </div>
);

const AuditRow = ({ timestamp, session, variant, score, event }: { timestamp: string, session: string, variant: string, score: string, event: string }) => (
  <div className="flex justify-between items-center bg-welltech-text/[0.02] p-3 rounded-lg border border-welltech-border/5 text-welltech-muted hover:text-welltech-text hover:bg-welltech-text/5 transition-all font-bold text-welltech-text">
    <span className="text-purple-400/80 w-24 shrink-0 font-mono text-[9px]">{timestamp}</span>
    <span className="w-24 shrink-0 font-mono text-[9px]">{session}</span>
    <span className="text-welltech-primary w-24 shrink-0 uppercase tracking-widest text-[8px]">{event}</span>
    <span className="w-32 shrink-0 uppercase text-[9px]">{variant}</span>
    <span className="text-right font-black text-[10px]">Conf: {score}%</span>
  </div>
);

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-welltech-primary text-white border-welltech-primary shadow-[0_10px_20px_rgba(var(--wt-primary-rgb),0.2)] font-black scale-[1.02]' : 'text-welltech-muted hover:bg-welltech-text/5 hover:text-welltech-text'}`}
  >
    <div className={active ? 'text-white' : ''}>{icon}</div>
    <span className="text-xs uppercase tracking-widest">{label}</span>
  </div>
);

const ToggleItem = ({ label, active, onClick, disabled = false }: { label: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
  <div 
    onClick={disabled ? undefined : onClick}
    className={`flex items-center justify-between group ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${active && !disabled ? 'text-welltech-text' : 'text-welltech-muted'}`}>{label}</span>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${active && !disabled ? 'bg-welltech-primary shadow-[0_0_10px_rgba(var(--wt-primary-rgb),0.5)]' : 'bg-welltech-text/10'}`}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-welltech-dark transition-all ${active && !disabled ? 'left-4.5' : 'left-0.5'}`} />
    </div>
  </div>
);

const GeoButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg border text-[10px] font-black transition-all ${active ? 'bg-welltech-secondary text-welltech-dark border-welltech-secondary shadow-[0_0_15px_rgba(0,209,209,0.3)]' : 'bg-welltech-text/5 text-welltech-muted border-welltech-border/10 hover:bg-welltech-text/10'}`}
  >
    {label}
  </button>
);

const ThemeButton = ({ active, label, onClick }: { active: boolean, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full py-2 rounded-lg border text-[10px] font-black transition-all ${active ? 'bg-welltech-primary text-white border-welltech-primary shadow-[0_0_15px_rgba(var(--wt-primary-rgb),0.2)]' : 'bg-welltech-text/5 text-welltech-muted border-welltech-border/10 hover:bg-welltech-text/10'}`}
  >
    {label}
  </button>
);

const MetricCard = ({ title, value, change, icon, tooltip }: { title: string, value: string, change?: string, icon: React.ReactNode, tooltip: string }) => (
  <div className="welltech-card border-welltech-border/5 relative overflow-hidden group bg-welltech-text/[0.02] hover:-translate-y-1 transition-all min-h-[160px] flex flex-col justify-between hover:z-[100] cursor-default text-welltech-text">
    <div className="flex justify-between items-start mb-2 relative z-10">
      <div className="flex flex-col gap-1 w-full mr-4">
         <span className="text-welltech-muted text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
         {/* INSIGHT EXPANSION: HIGH-CONTRAST FIX */}
         <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-500 ease-in-out">
            <p className="text-welltech-text text-[10px] font-bold leading-relaxed pt-2 border-l-2 border-welltech-primary/50 pl-3 mt-1 bg-welltech-primary/5 rounded-r-lg">
              {tooltip}
            </p>
         </div>
      </div>
      <div className="shrink-0">{icon}</div>
    </div>
    <div className="flex items-baseline gap-2 relative z-10 mt-auto">
      <h2 className="text-3xl font-black tracking-tighter uppercase italic text-welltech-text leading-none group-hover:scale-105 transition-transform origin-left">{value}</h2>
      {change && <span className={`text-[10px] font-black ${change.startsWith('+') ? 'text-welltech-primary' : 'text-red-500'}`}>{change}</span>}
    </div>
    <div className="absolute top-0 right-0 w-12 h-12 welltech-gradient opacity-[0.03] rounded-full blur-2xl group-hover:opacity-10 transition-all" />
  </div>
);

const DeclineItem = ({ label, percentage, count }: { label: string, percentage: number, count: number }) => (
  <div className="text-welltech-text">
    <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
      <span className="font-bold">{label}</span>
      <span className="text-welltech-muted font-black">{count} events</span>
    </div>
    <div className="w-full bg-welltech-text/5 h-2 rounded-full overflow-hidden border border-welltech-border/5">
      <div 
        className="bg-red-500/80 h-full rounded-full transition-all duration-1000" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const MappingItem = ({ geo, prop, uplift }: { geo: string, prop: string, uplift: string }) => (
  <div className="flex justify-between items-center p-3 bg-welltech-text/[0.02] border border-welltech-border/5 rounded-lg hover:border-welltech-secondary/30 transition-all group cursor-default text-welltech-text">
    <div className="flex items-center gap-3">
       <span className="text-[10px] font-black text-welltech-secondary bg-welltech-secondary/10 px-2 py-0.5 rounded uppercase">{geo}</span>
       <span className="text-[10px] font-black uppercase tracking-widest">{prop}</span>
    </div>
    <span className="text-[10px] font-black text-welltech-primary tracking-tighter group-hover:scale-110 transition-transform">{uplift} LIFT</span>
  </div>
);

const VariantDetail = ({ variant, status, confidence, highlight = false, icon }: { variant: string, status: string, confidence?: number, highlight?: boolean, icon: React.ReactNode }) => (
  <div className={`p-4 rounded-xl border transition-all flex items-center justify-between text-welltech-text ${highlight ? 'border-welltech-primary/30 bg-welltech-primary/[0.02] shadow-[inset_0_0_20px_rgba(var(--wt-primary-rgb),0.05)]' : 'border-welltech-border/5 bg-welltech-text/[0.02]'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? 'bg-welltech-primary/10 shadow-[0_0_10px_rgba(var(--wt-primary-rgb),0.2)]' : 'bg-welltech-text/5'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-black uppercase italic tracking-tighter text-xs leading-tight">{variant}</span>
        <span className={`text-[9px] font-black uppercase tracking-widest ${status.includes('Winner') ? 'text-welltech-primary' : status === 'Exploiting' ? 'text-welltech-secondary' : 'text-welltech-muted'}`}>
          {status}
        </span>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[8px] text-welltech-muted font-black uppercase tracking-widest mb-1">Confidence</p>
      <p className="text-xl font-black text-welltech-text italic tracking-tighter leading-none">{confidence}%</p>
    </div>
  </div>
);

export default Dashboard;
