import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, History, ActivitySquare, BrainCircuit } from 'lucide-react';
import SymptomChecker from './SymptomChecker';
import HistoryTable from './HistoryTable';
import Charts from './Charts';
import InsightPanel from './InsightPanel';
import { Logo } from './Logo';

export default function Dashboard({ onLogout, token }: { onLogout: () => void; token: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/analytics/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchHistory();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'NEW_PREDICTION') {
        setHistory((prev) => [data, ...prev].slice(0, 50));
        fetchAnalytics(); // Refresh analytics on new prediction
      }
    };

    return () => ws.close();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center justify-center border-b border-slate-100">
          <Logo className="w-48 h-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'predict' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <BrainCircuit className="w-5 h-5" />
            AI Predict
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'history' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <History className="w-5 h-5" />
            History
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-7xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
              <p className="text-slate-500 mt-2">Real-time AI health analytics and insights.</p>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-1">Total Predictions</div>
                <div className="text-3xl font-bold text-slate-800">{analytics?.cards?.totalPredictions || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  {analytics?.cards?.highRiskAlerts > 0 && (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-red-500 mb-1">High Risk Alerts</div>
                <div className="text-3xl font-bold text-red-600">{analytics?.cards?.highRiskAlerts || 0}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-1">Avg Confidence</div>
                <div className="text-3xl font-bold text-blue-600">{analytics?.cards?.avgConfidence?.toFixed(1) || 0}%</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-sm font-medium text-slate-500 mb-1">Top Disease</div>
                <div className="text-xl font-bold text-slate-800 truncate">{analytics?.cards?.mostFrequentDisease || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {analytics && <Charts data={analytics.charts} />}
              </div>
              <div className="space-y-8">
                {analytics && <InsightPanel insights={analytics.insights} />}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'predict' && (
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">AI Symptom Intelligence</h2>
              <p className="text-slate-500 mt-2">Enter symptoms for real-time AI disease prediction.</p>
            </header>
            <SymptomChecker token={token} onPredictionComplete={() => setActiveTab('history')} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">Prediction History</h2>
              <p className="text-slate-500 mt-2">Review past AI predictions and risk assessments.</p>
            </header>
            <HistoryTable history={history} />
          </div>
        )}
      </main>
    </div>
  );
}
