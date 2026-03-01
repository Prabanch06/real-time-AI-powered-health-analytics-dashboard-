import React, { useState, useEffect } from 'react';
import { Search, X, Activity, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'fever', 'cough', 'headache', 'fatigue', 'nausea', 'vomiting',
  'muscle pain', 'joint pain', 'rash', 'sore throat', 'runny nose',
  'shortness of breath', 'loss of taste', 'loss of smell', 'chills'
];

export default function SymptomChecker({ token, onPredictionComplete }: { token: string; onPredictionComplete: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      const filtered = COMMON_SYMPTOMS.filter(
        s => s.toLowerCase().includes(query.toLowerCase()) && !selectedSymptoms.includes(s)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, selectedSymptoms]);

  const handleAddSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setQuery('');
    setSuggestions([]);
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ symptoms: selectedSymptoms })
      });

      if (!res.ok) {
        throw new Error('Prediction failed');
      }

      const data = await res.json();
      setPrediction(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Search Symptoms</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="e.g., fever, headache..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query && !suggestions.includes(query)) {
                  handleAddSymptom(query);
                }
              }}
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {suggestions.map((symptom, index) => (
                  <li
                    key={index}
                    className="text-slate-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                    onClick={() => handleAddSymptom(symptom)}
                  >
                    {symptom}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Selected Symptoms</h3>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {selectedSymptoms.length === 0 ? (
              <span className="text-slate-400 text-sm italic">No symptoms selected yet.</span>
            ) : (
              selectedSymptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {symptom}
                  <button
                    type="button"
                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white transition-colors"
                    onClick={() => handleRemoveSymptom(symptom)}
                  >
                    <span className="sr-only">Remove symptom</span>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handlePredict}
          disabled={loading || selectedSymptoms.length === 0}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <BrainCircuit className="w-5 h-5" />
          )}
          {loading ? 'Analyzing...' : 'Generate AI Prediction'}
        </button>

        {/* Prediction Result Panel */}
        {prediction && (
          <div className="mt-8 p-6 rounded-2xl border border-slate-200 bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              AI Analysis Complete
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-500 mb-1">Predicted Disease</p>
                <p className="text-2xl font-bold text-slate-800">{prediction.predicted_disease}</p>
              </div>
              
              <div className={`p-5 rounded-xl border shadow-sm ${
                prediction.risk_level === 'High' ? 'bg-red-50 border-red-200' :
                prediction.risk_level === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <p className={`text-sm mb-1 ${
                  prediction.risk_level === 'High' ? 'text-red-600' :
                  prediction.risk_level === 'Medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>Risk Level</p>
                <div className="flex items-center gap-2">
                  {prediction.risk_level === 'High' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                  <p className={`text-2xl font-bold ${
                    prediction.risk_level === 'High' ? 'text-red-700' :
                    prediction.risk_level === 'Medium' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>{prediction.risk_level}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-medium text-slate-700">AI Confidence Score</p>
                <p className="text-lg font-bold text-blue-600">{prediction.confidence_score.toFixed(1)}%</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${prediction.confidence_score}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={onPredictionComplete}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                View in History &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
