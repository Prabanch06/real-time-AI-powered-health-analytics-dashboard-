import React from 'react';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function InsightPanel({ insights }: { insights: string[] }) {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">AI Health Insights</h3>
        </div>
        <p className="text-slate-500 text-sm italic">Not enough data to generate insights yet. Start making predictions.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-lg shadow-sm">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">AI Health Insights</h3>
      </div>

      <div className="space-y-4 relative z-10">
        {insights.map((insight, index) => {
          let Icon = CheckCircle2;
          let iconColor = 'text-green-500';
          let bgColor = 'bg-green-50';

          if (insight.toLowerCase().includes('high-risk') || insight.toLowerCase().includes('spike')) {
            Icon = AlertCircle;
            iconColor = 'text-red-500';
            bgColor = 'bg-red-50';
          } else if (insight.toLowerCase().includes('increase') || insight.toLowerCase().includes('trend')) {
            Icon = TrendingUp;
            iconColor = 'text-blue-500';
            bgColor = 'bg-blue-50';
          } else if (insight.toLowerCase().includes('confidence')) {
            Icon = CheckCircle2;
            iconColor = 'text-indigo-500';
            bgColor = 'bg-indigo-50';
          }

          return (
            <div key={index} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white shadow-sm">
              <div className={`p-2 rounded-full ${bgColor} flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
