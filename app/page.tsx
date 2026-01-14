'use client'; 

import { useState, useEffect } from 'react';

interface DashboardData {
  address: string;
  totalValue: number;
  eth: { balance: number; value: number };
  usdc: { balance: number; value: number };
  ethPrice: number;
  analysis: string;
  timestamp: string;
  error?: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/treasury');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fmt = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-xl font-mono">Loading Neural Link...</div>
      </div>
    );
  }

  if (!data || data.error) return <div className="text-white p-10">System Offline / API Error. Check console.</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            🛡️ DAO Sentinel
          </h1>
          <p className="text-slate-500 mt-2 font-mono text-sm break-all">Target: {data.address}</p>
        </header>

        {/* Hero Card */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-slate-400 text-xs uppercase tracking-widest mb-2">Total Treasury Value</h2>
            <div className="text-5xl font-extrabold text-white tracking-tight">
                {fmt(data.totalValue)}
            </div>
            <div className="mt-4 flex gap-3">
                <span className="px-3 py-1 bg-blue-950 text-blue-400 rounded-md text-xs font-medium border border-blue-900">
                    ETH: {fmt(data.ethPrice)}
                </span>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-400 rounded-md text-xs font-medium border border-emerald-900">
                    System: Online 🟢
                </span>
            </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-slate-900/50 p-6 rounded-xl border border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-4xl">🧠</div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-300">AI Risk Assessment</h3>
            <p className="text-lg text-slate-300 italic leading-relaxed">
                &quot;{data.analysis}&quot;
            </p>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-slate-400">Ethereum</h3>
                    <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">Ξ</div>
                </div>
                <div className="text-2xl font-bold">{data.eth.balance.toFixed(2)} ETH</div>
                <div className="text-slate-500 text-sm">{fmt(data.eth.value)}</div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-slate-400">USD Coin</h3>
                    <div className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">$</div>
                </div>
                <div className="text-2xl font-bold">{fmt(data.usdc.balance)}</div>
                <div className="text-slate-500 text-sm">Stablecoin</div>
            </div>
        </div>

      </div>
    </main>
  );
}