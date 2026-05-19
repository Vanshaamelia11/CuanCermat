/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ReactNode, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Settings, 
  ChevronRight, 
  Utensils, 
  Bus, 
  Gamepad2, 
  ShoppingBag, 
  FileText, 
  PiggyBank, 
  Paperclip,
  Sparkles,
  Send,
  Loader2,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Transaction, Budget } from './types';
import { cn, formatCurrency } from './lib/utils';

const CATEGORY_ICONS: Record<Transaction['category'], ReactNode> = {
  Makanan: <Utensils className="w-5 h-5" />,
  Transportasi: <Bus className="w-5 h-5" />,
  Hiburan: <Gamepad2 className="w-5 h-5" />,
  Belanja: <ShoppingBag className="w-5 h-5" />,
  Tagihan: <FileText className="w-5 h-5" />,
  Tabungan: <PiggyBank className="w-5 h-5" />,
  Lainnya: <Paperclip className="w-5 h-5" />,
};

const CATEGORY_COLORS: Record<Transaction['category'], string> = {
  Makanan: '#f97316', // orange-500
  Transportasi: '#0ea5e9', // sky-500
  Hiburan: '#a855f7', // purple-500
  Belanja: '#ec4899', // pink-500
  Tagihan: '#ef4444', // red-500
  Tabungan: '#14b8a6', // teal-500
  Lainnya: '#64748b', // slate-500
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', amount: 35000, category: 'Makanan', description: 'Makan Siang Padang', date: new Date().toISOString() },
    { id: '2', amount: 12000, category: 'Transportasi', description: 'Ojol ke Kantor', date: new Date().toISOString() },
    { id: '3', amount: 150000, category: 'Hiburan', description: 'Nonton Bioskop + Popcorn', date: new Date().toISOString() },
  ]);

  const [budgets] = useState<Budget[]>([
    { category: 'Makanan', limit: 1500000 },
    { category: 'Transportasi', limit: 500000 },
    { category: 'Hiburan', limit: 800000 },
    { category: 'Belanja', limit: 1000000 },
    { category: 'Tagihan', limit: 2000000 },
    { category: 'Tabungan', limit: 1000000 },
  ]);

  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalBalance = 2450000; // Simulated
  const totalExpense = useMemo(() => transactions.reduce((acc, curr) => acc + curr.amount, 0), [transactions]);

  const chartData = useMemo(() => {
    const data = budgets.map(b => {
      const spent = transactions
        .filter(t => t.category === b.category)
        .reduce((acc, curr) => acc + curr.amount, 0);
      return {
        name: b.category,
        spent,
        limit: b.limit,
      };
    });
    return data;
  }, [transactions, budgets]);

  const handleAISubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: data.amount,
        category: data.category as Transaction['category'],
        description: data.description,
        date: new Date().toISOString(),
      };

      setTransactions([newTransaction, ...transactions]);
      setInputText('');
      setIsInputOpen(false);
    } catch (err) {
      console.error(err);
      alert('Maaf, AI lagi istirahat sebentar. Coba lagi ya!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto relative shadow-2xl bg-white overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[20%] left-[-30px] w-48 h-48 bg-teal-400/20 rounded-full blur-3xl -z-10" />
      
      {/* Header */}
      <header className="bg-orange-500 p-6 pt-10 rounded-b-[40px] text-white shadow-lg relative overflow-hidden">
         {/* Internal Glow for Header */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
         
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-orange-100 text-xs font-medium uppercase tracking-wider">Selamat Sore, Vansha! 👋</p>
            <h1 className="text-2xl font-display font-bold">CuanCermat</h1>
          </div>
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
          >
            <Settings className="w-5 h-5" />
          </motion.div>
        </div>

        <div className="bg-white/15 backdrop-blur-xl p-6 rounded-3xl border border-white/25 shadow-inner relative z-10">
          <p className="text-xs text-orange-50 text-opacity-80 mb-1">Saldo Total</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold">{formatCurrency(totalBalance)}</h2>
            <div className="flex items-center gap-1 text-teal-400 text-xs font-bold bg-teal-900/20 px-3 py-1 rounded-full border border-teal-400/20">
              <TrendingUp className="w-3 h-3" />
              <span>+2.4%</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-yellow-300"
              />
            </div>
          </div>
          <p className="text-[10px] mt-2 text-orange-100 font-medium">✨ 65% target tabungan tercapai</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-8">
        {/* Budget Status */}
        <section className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-full -mr-12 -mt-12 blur-xl" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <div>
              <h3 className="font-display font-bold text-slate-800">Ringkasan Budget</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold italic underline decoration-yellow-400">Statistik Bulan Ini</p>
            </div>
            <button className="text-orange-600 text-xs font-bold flex items-center hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors">
              SEMUA <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', padding: '12px' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Transaction['category']]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-4 gap-3">
          {(['Makanan', 'Transportasi', 'Hiburan', 'Lainnya'] as const).map((cat) => (
            <motion.button 
              key={cat}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-100"
                style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              >
                {CATEGORY_ICONS[cat]}
              </div>
              <span className="text-[10px] font-medium text-slate-500">{cat}</span>
            </motion.button>
          ))}
        </section>

        {/* Transactions */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-slate-800">Transaksi Terakhir</h3>
          </div>
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {transactions.map((t) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-orange-100 transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center bg-opacity-10 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: CATEGORY_COLORS[t.category], color: CATEGORY_COLORS[t.category] }}
                    >
                      {CATEGORY_ICONS[t.category]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{t.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.category}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-rose-500 whitespace-nowrap">- {formatCurrency(t.amount)}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center z-10">
        <button className="text-orange-500">
          <Wallet className="w-6 h-6" />
        </button>
        <button className="text-slate-300">
          <PieChart className="w-6 h-6" />
        </button>
        <div className="w-12" /> {/* Space for FAB */}
        <button className="text-slate-300">
          <TrendingUp className="w-6 h-6" />
        </button>
        <button className="text-slate-300">
          <Settings className="w-6 h-6" />
        </button>

        {/* Floating Action Button */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsInputOpen(true)}
          className="absolute left-1/2 -top-8 -translate-x-1/2 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-200 border-[6px] border-white z-20"
        >
          <Plus className="w-10 h-10" />
        </motion.button>
      </nav>

      {/* AI Input Modal */}
      <AnimatePresence>
        {isInputOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInputOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-30"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-[3rem] p-8 pb-10 z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center shadow-inner">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-slate-800">Catat Kilat <span className="text-orange-500 italic">AI</span></h3>
                  </div>
                </div>
                <button onClick={() => setIsInputOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Tinggal ketik <span className="font-bold text-slate-700 font-mono text-xs">\"Kopi 25rb\"</span> atau <span className="font-bold text-slate-700 font-mono text-xs">\"Bensin Pertamax 100k\"</span>, AI bakal otomatis nyatet!
              </p>

              <form onSubmit={handleAISubmit} className="relative">
                <input 
                  autoFocus
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Beli apa hari ini...?"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-6 py-5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all pr-16 text-lg"
                />
                <button 
                  disabled={isLoading}
                  type="submit"
                  className={cn(
                    "absolute right-3 top-3 bottom-3 aspect-square rounded-2xl flex items-center justify-center transition-all",
                    isLoading ? "bg-slate-200 text-slate-400" : "bg-orange-500 text-white shadow-lg shadow-orange-200 hover:scale-105 active:scale-95"
                  )}
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </form>

              <div className="mt-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Contoh Input:</p>
                <div className="flex flex-wrap gap-2">
                  {['Baso aci 20rb', 'Bensin 50 ribu', 'Kopi Susu 25k'].map((sample) => (
                    <button 
                      key={sample}
                      onClick={() => setInputText(sample)}
                      className="text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100 px-4 py-2 rounded-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
