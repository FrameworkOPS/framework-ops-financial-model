import { useState, useEffect, useRef, useCallback } from 'react';
import Logo from './components/Logo.jsx';
import IndustrySelector from './components/IndustrySelector.jsx';
import GenericForm from './components/GenericForm.jsx';
import HomeServicesForm from './components/HomeServicesForm.jsx';
import RecurringForm from './components/RecurringForm.jsx';
import { GenericResults, HomeServicesResults, RecurringResults } from './components/ResultsPanel.jsx';
import AIRecommendations from './components/AIRecommendations.jsx';
import {
  calculateGeneric, calculateHomeServices, calculateRecurring,
  isGenericComplete, isHomeComplete, isRecurringComplete,
} from './calculations.js';

const DEFAULT_GENERIC = {
  price: '', monthlyUnits: '', variableCostPerUnit: '', monthlyOverhead: '',
};
const DEFAULT_HOME = {
  numTechs: '', hoursPerWeek: '', techHourlyWage: '',
  materialCostPct: '20', monthlyOverhead: '', targetNetMarginPct: '15',
  pricingModel: 'flat', currentRate: '', avgJobDuration: '2',
};
const DEFAULT_RECURRING = {
  numClients: '', retainerRate: '', cogsPerClient: '0',
  targetNetMarginPct: '25',
  overheadItems: [{ id: '1', label: '', amount: '' }],
  hires: [],
  scalingHires: [],
};

export default function App() {
  const [industry, setIndustry] = useState(null);
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const handleSelect = (type) => {
    setIndustry(type);
    setInputs(type === 'generic' ? DEFAULT_GENERIC : type === 'home' ? DEFAULT_HOME : DEFAULT_RECURRING);
    setResults(null);
    setAiText('');
    setAiError('');
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleListAdd = useCallback((field, item) => {
    setInputs((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  }, []);

  const handleListUpdate = useCallback((field, index, updates) => {
    setInputs((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? { ...item, ...updates } : item)),
    }));
  }, []);

  const handleListRemove = useCallback((field, index) => {
    setInputs((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  }, []);

  const runAnalysis = useCallback(async (ind, inp, res) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setAiText('');
    setAiError('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: ind, inputs: inp, results: res }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data.error) { setAiError(data.error); return; }

      setAiLoading(false);
      const words = (data.text || '').split(/(\s+)/);
      for (const word of words) {
        if (controller.signal.aborted) break;
        setAiText((prev) => prev + word);
        await new Promise((r) => setTimeout(r, 18));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setAiError('Failed to get AI analysis. Check your API key and try again.');
      }
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!industry) return;
    const isComplete = industry === 'generic' ? isGenericComplete(inputs)
      : industry === 'home' ? isHomeComplete(inputs)
      : isRecurringComplete(inputs);
    if (!isComplete) { setResults(null); return; }

    const res = industry === 'generic' ? calculateGeneric(inputs)
      : industry === 'home' ? calculateHomeServices(inputs)
      : calculateRecurring(inputs);
    setResults(res);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runAnalysis(industry, inputs, res), 2000);
    return () => clearTimeout(debounceRef.current);
  }, [inputs, industry, runAnalysis]);

  const handleReset = () => {
    setIndustry(null);
    setInputs({});
    setResults(null);
    setAiText('');
    setAiError('');
    if (abortRef.current) abortRef.current.abort();
  };

  if (!industry) return <IndustrySelector onSelect={handleSelect} />;


  return (
    <div className="min-h-screen" style={{ background: '#061220' }}>
      {/* Header */}
      <header className="no-print px-6 py-4 flex items-center justify-between" style={{ background: '#081B2F', borderBottom: '1px solid #102d4d' }}>
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-4 w-px" style={{ background: '#102d4d' }} />
          <button onClick={handleReset} className="text-sm transition-colors" style={{ color: '#475569' }}
            onMouseEnter={(e) => e.target.style.color = '#94a3b8'}
            onMouseLeave={(e) => e.target.style.color = '#475569'}
          >
            ← Back
          </button>
          <div className="h-4 w-px" style={{ background: '#102d4d' }} />
          <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
            {industry === 'generic' ? '📊 General Business Model' : industry === 'home' ? '🏠 Home Services Model' : '🔁 Recurring Revenue Model'}
          </span>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          style={{ background: '#10B981', color: '#061220' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
        >
          ⬇ Export PDF
        </button>
      </header>

      {/* Print header */}
      <div className="hidden print:block p-6 border-b">
        <h1 className="text-2xl font-bold">
          {industry === 'generic' ? 'General Business Financial Model' : industry === 'home' ? 'Home Services Financial Model' : 'Recurring Revenue Financial Model'}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Framework Ops LLC — Financial Modeling Tool</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form panel */}
          <div className="lg:col-span-2 no-print">
            <div className="rounded-xl p-6" style={{ background: '#081B2F', border: '1px solid #102d4d' }}>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#475569' }}>Your Numbers</h2>
              {industry === 'generic'
                ? <GenericForm inputs={inputs} onChange={handleChange} />
                : industry === 'home'
                ? <HomeServicesForm inputs={inputs} onChange={handleChange} />
                : <RecurringForm inputs={inputs} onChange={handleChange} onListAdd={handleListAdd} onListUpdate={handleListUpdate} onListRemove={handleListRemove} />
              }
              {results ? (
                <button
                  onClick={() => runAnalysis(industry, inputs, results)}
                  disabled={aiLoading}
                  className="w-full mt-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    background: aiLoading ? '#334155' : '#10B981',
                    color: aiLoading ? '#64748b' : '#061220',
                    cursor: aiLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {aiLoading ? 'Analyzing...' : 'Get Framework Analysis'}
                </button>
              ) : (
                <p className="text-xs mt-5 text-center" style={{ color: '#334155' }}>
                  Fill in the required fields to see your results
                </p>
              )}
            </div>
          </div>

          {/* Results panel */}
          <div className="lg:col-span-3 space-y-5 print-full">
            {results ? (
              <>
                <div className="rounded-xl p-6" style={{ background: '#081B2F', border: '1px solid #102d4d' }}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#475569' }}>Your Results</h2>
                  {industry === 'generic'
                    ? <GenericResults results={results} inputs={inputs} />
                    : industry === 'home'
                    ? <HomeServicesResults results={results} inputs={inputs} />
                    : <RecurringResults results={results} inputs={inputs} />
                  }
                </div>
                <AIRecommendations text={aiText} loading={aiLoading} error={aiError} />
              </>
            ) : (
              <div className="rounded-xl p-16 text-center" style={{ background: '#081B2F', border: '1px dashed #102d4d' }}>
                <p className="text-4xl mb-3">📋</p>
                <p className="text-sm" style={{ color: '#334155' }}>Your analysis will appear here once you fill in your numbers.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
