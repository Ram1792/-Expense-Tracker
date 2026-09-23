import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Trash2, 
  Filter, 
  PieChart as PieChartIcon, 
  Calendar, 
  Tag, 
  DollarSign, 
  BarChart2, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Search,
  Edit2,
  X,
  Check,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Database,
  Activity,
  Layers,
  Sparkles,
  Lock,
  Mail,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#3B82F6', icon: '🏠' },
  { id: 'food', name: 'Food & Dining', color: '#10B981', icon: '🍔' },
  { id: 'transportation', name: 'Transportation', color: '#F59E0B', icon: '🚗' },
  { id: 'utilities', name: 'Utilities', color: '#6366F1', icon: '⚡' },
  { id: 'entertainment', name: 'Entertainment', color: '#EC4899', icon: '🎬' },
  { id: 'salary', name: 'Salary', color: '#059669', icon: '💼' },
  { id: 'investment', name: 'Investment', color: '#8B5CF6', icon: '📈' },
  { id: 'freelance', name: 'Freelance/Side Business', color: '#14B8A6', icon: '💻' },
  { id: 'other', name: 'Other', color: '#6B7280', icon: '📦' }
];

const DEFAULT_USERS = [
  {
    id: 'user_demo_1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    joinedDate: '2025-11-15'
  }
];

const DEFAULT_TRANSACTIONS = {
  'user_demo_1': [
    { id: '1', title: 'Monthly Tech Salary', amount: 4200, category: 'salary', type: 'income', date: '2026-03-01' },
    { id: '2', title: 'Luxury Apartment Rent', amount: 1350, category: 'housing', type: 'expense', date: '2026-03-02' },
    { id: '3', title: 'Whole Foods Grocery', amount: 185.40, category: 'food', type: 'expense', date: '2026-03-05' },
    { id: '4', title: 'Freelance UI/UX Audit', amount: 850, category: 'freelance', type: 'income', date: '2026-03-10' },
    { id: '5', title: 'High-Speed Fiber Internet', amount: 79.99, category: 'utilities', type: 'expense', date: '2026-03-12' },
    { id: '6', title: 'Cinema & Dinner Date', amount: 95.50, category: 'entertainment', type: 'expense', date: '2026-03-14' }
  ]
};

export default function App() {
  // Database Mock Persistence
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('exp_db_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  });

  const [dbTransactions, setDbTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('exp_db_transactions');
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
    } catch (e) {
      return DEFAULT_TRANSACTIONS;
    }
  });

  // Auth Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('exp_auth_jwt');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1] || ''));
        return payload || null;
      }
    } catch (e) {
      return null;
    }
    return null;
  });

  // UI State: Modals & Panels
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Backend Simulation State
  const [apiLatency, setApiLatency] = useState(42);
  const [dbStatus, setDbStatus] = useState('connected'); // 'connected' | 'syncing'

  // Auth Form Input State
  const [loginEmail, setLoginEmail] = useState('alex@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Transaction Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Filters & Search
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Local Storage Synchronization
  useEffect(() => {
    localStorage.setItem('exp_db_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('exp_db_transactions', JSON.stringify(dbTransactions));
  }, [dbTransactions]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateMockJWT = (user) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      joinedDate: user.joinedDate,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }));
    const signature = btoa('mock_mongodb_secret_key');
    return `${header}.${payload}.${signature}`;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setDbStatus('syncing');

    setTimeout(() => {
      const found = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase() && u.password === loginPassword);
      if (found) {
        const token = generateMockJWT(found);
        localStorage.setItem('exp_auth_jwt', token);
        setCurrentUser(found);
        setAuthModalOpen(false);
        setDbStatus('connected');
        showToast(`Welcome back, ${found.name}!`);
      } else {
        setDbStatus('connected');
        setAuthError('Invalid email or password credentials');
      }
    }, 400);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setAuthError('Please fill in all registration fields');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === regEmail.toLowerCase())) {
      setAuthError('An account with this email already exists');
      return;
    }

    setDbStatus('syncing');

    setTimeout(() => {
      const newUser = {
        id: `user_${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(regName)}`,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setUsers([...users, newUser]);
      setDbTransactions({ ...dbTransactions, [newUser.id]: [] });

      const token = generateMockJWT(newUser);
      localStorage.setItem('exp_auth_jwt', token);
      setCurrentUser(newUser);
      setAuthModalOpen(false);
      setDbStatus('connected');
      showToast('Account created successfully!');
      
      // Clear registration form
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('exp_auth_jwt');
    setCurrentUser(null);
    setProfileDrawerOpen(false);
    showToast('Logged out of session', 'info');
  };

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    return dbTransactions[currentUser.id] || [];
  }, [currentUser, dbTransactions]);

  const summary = useMemo(() => {
    const income = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const expense = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return {
      income,
      expense,
      balance: income - expense
    };
  }, [userTransactions]);

  const categoryBreakdown = useMemo(() => {
    const expenseTx = userTransactions.filter(t => t.type === 'expense');
    const totalExpense = expenseTx.reduce((sum, t) => sum + Number(t.amount), 0);
    
    if (totalExpense === 0) return [];

    const map = {};
    expenseTx.forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });

    return Object.keys(map).map(catId => {
      const catObj = CATEGORIES.find(c => c.id === catId) || { name: catId, color: '#6B7280', icon: '📦' };
      const catTotal = map[catId];
      return {
        ...catObj,
        total: catTotal,
        percentage: ((catTotal / totalExpense) * 100).toFixed(1)
      };
    }).sort((a, b) => b.total - a.total);
  }, [userTransactions]);

  const filteredTransactions = useMemo(() => {
    return userTransactions.filter(t => {
      const matchesType = filterType === 'all' || t.type === filterType;
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [userTransactions, filterType, filterCategory, searchTerm]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    setDbStatus('syncing');

    setTimeout(() => {
      const newTx = {
        id: `tx_${Date.now()}`,
        title: title.trim(),
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        category,
        type,
        date: date || new Date().toISOString().split('T')[0]
      };

      const updatedUserTx = [newTx, ...(dbTransactions[currentUser.id] || [])];
      setDbTransactions({
        ...dbTransactions,
        [currentUser.id]: updatedUserTx
      });

      setTitle('');
      setAmount('');
      setDbStatus('connected');
      showToast('Transaction added to database!');
    }, 250);
  };

  const handleOpenEditModal = (tx) => {
    setEditingTx({ ...tx });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTx.title.trim() || !editingTx.amount || Number(editingTx.amount) <= 0) return;

    setDbStatus('syncing');

    setTimeout(() => {
      const updatedList = userTransactions.map(t => 
        t.id === editingTx.id ? { 
          ...editingTx, 
          amount: parseFloat(parseFloat(editingTx.amount).toFixed(2)),
          title: editingTx.title.trim() 
        } : t
      );

      setDbTransactions({
        ...dbTransactions,
        [currentUser.id]: updatedList
      });

      setEditingTx(null);
      setDbStatus('connected');
      showToast('Transaction synced successfully!');
    }, 200);
  };

  const handleDelete = (id) => {
    setDbStatus('syncing');
    setTimeout(() => {
      const updatedList = userTransactions.filter(t => t.id !== id);
      setDbTransactions({
        ...dbTransactions,
        [currentUser.id]: updatedList
      });
      if (editingTx && editingTx.id === id) {
        setEditingTx(null);
      }
      setDbStatus('connected');
      showToast('Entry removed', 'info');
    }, 200);
  };

  const handleResetData = () => {
    if (!currentUser) return;
    setDbTransactions({
      ...dbTransactions,
      [currentUser.id]: DEFAULT_TRANSACTIONS['user_demo_1'] || []
    });
    showToast('Reset sample data for current account', 'info');
  };

  const pingBackend = () => {
    setDbStatus('syncing');
    setTimeout(() => {
      setApiLatency(Math.floor(Math.random() * 25) + 20);
      setDbStatus('connected');
      showToast(`Database pinged: ${apiLatency}ms latency`, 'info');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 transition-colors">
      
      {/* Dynamic Toast Popup */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-bounce border border-slate-700">
          <CheckCircle2 className={`w-4 h-4 ${toast.type === 'info' ? 'text-blue-400' : 'text-emerald-400'}`} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & API Connectivity Badge */}
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg leading-tight">ExpenseTracker</h1>
                {/* <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Fullstack API
                </span> */}
              </div>
              {/* <p className="text-xs text-slate-400">Node.js + MongoDB Simulation</p> */}
            </div>
          </div>

          {/* Database Control & Auth Controls */}
          <div className="flex items-center space-x-3">
            {/* Backend Sync Indicator */}
            {/* <button
              onClick={pingBackend}
              className="hidden sm:flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs transition-colors"
              title="Click to check simulated MongoDB ping"
            >
              <Database className={`w-3.5 h-3.5 ${dbStatus === 'syncing' ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
              <span className="text-slate-300 font-mono text-[11px]">{dbStatus === 'syncing' ? 'SYNCING...' : `${apiLatency}ms`}</span>
            </button> */}

            {currentUser ? (
              <button
                onClick={() => setProfileDrawerOpen(true)}
                className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 px-3 py-1.5 rounded-xl transition-all"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full bg-indigo-500 object-cover border border-indigo-400"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold leading-none">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser.email}</div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthTab('login');
                  setAuthModalOpen(true);
                }}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Dashboard Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Guest Warning / Unauthenticated State Banner */}
        {!currentUser && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-900">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-900">Guest Simulation Active</h4>
                <p className="text-xs text-amber-800">Sign in to sync your expenses with isolated multi-tenant MongoDB storage.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button 
                onClick={() => { setAuthTab('login'); setAuthModalOpen(true); }}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                Sign In Demo User
              </button>
            </div>
          </div>
        )}

        {/* Financial Stat Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="z-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Balance</p>
              <h2 className={`text-3xl font-extrabold mt-1 ${summary.balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                ${summary.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className={`p-4 rounded-2xl ${summary.balance >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>
              <Wallet className="w-8 h-8" />
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 flex items-center space-x-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Total Income</span>
              </p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900">
                ${summary.income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center space-x-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Total Expenses</span>
              </p>
              <h2 className="text-3xl font-extrabold mt-1 text-slate-900">
                ${summary.expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Form & Expense Visual Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Add Transaction Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-indigo-600" />
                  <span>New Transaction</span>
                </span>
                {/* <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  POST /api/v1/expenses
                </span> */}
              </h3>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Transaction Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                      type === 'expense' 
                        ? 'bg-white text-rose-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                      type === 'income' 
                        ? 'bg-white text-emerald-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Income
                  </button>
                </div>

                {/* Title Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grocery Store, Client Invoice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                {/* Amount & Date Input Group */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Amount ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center space-x-2 ${
                    type === 'expense' 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  }`}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Save {type === 'expense' ? 'Expense' : 'Income'} Record</span>
                </button>
              </form>
            </div>

            {/* Visual Category Breakdown Progress Bars */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <PieChartIcon className="w-5 h-5 text-indigo-600" />
                  <span>Category Breakdown</span>
                </span>
                <span className="text-xs font-normal text-slate-500">Expenses Only</span>
              </h3>

              {categoryBreakdown.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No expense records logged for this account.
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-700">
                        <span className="flex items-center space-x-1.5">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        <span>${cat.total.toFixed(2)} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Transaction History List & Filters */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[500px] flex flex-col justify-between">
              
              <div>
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">Database Transactions</h3>
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
                    />
                  </div>
                </div>

                {/* Filter Bar Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                  {/* Type Filters */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('income')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        filterType === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Income
                    </button>
                    <button
                      onClick={() => setFilterType('expense')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        filterType === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Expenses
                    </button>
                  </div>

                  {/* Category Filter Select */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transaction Rows */}
                <div className="space-y-3 mt-2">
                  {filteredTransactions.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <p className="text-sm font-medium">No records found matching query.</p>
                      <p className="text-xs mt-1">Try resetting search filters or adding a new transaction.</p>
                    </div>
                  ) : (
                    filteredTransactions.map(tx => {
                      const categoryObj = CATEGORIES.find(c => c.id === tx.category) || { name: tx.category, icon: '📦' };
                      return (
                        <div 
                          key={tx.id} 
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-inner">
                              {categoryObj.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-slate-800 leading-snug">{tx.title}</h4>
                              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                                <span>{categoryObj.name}</span>
                                <span>•</span>
                                <span>{tx.date}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                            </span>
                            
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEditModal(tx)}
                                className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Edit transaction"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(tx.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Delete transaction"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Transaction Footer Info */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>Showing {filteredTransactions.length} of {userTransactions.length} items</span>
                {/* <div className="flex items-center space-x-3">
                  {currentUser && (
                    <button 
                      onClick={handleResetData}
                      className="hover:text-slate-600 flex items-center space-x-1 underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Account Data</span>
                    </button>
                  )}
                  <span className="font-mono text-[10px]">Indexed by UserID</span>
                </div> */}
              </div>

            </div>

          </div>

        </div>
      </main>

      {}
      {profileDrawerOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>User Profile</span>
                </h3>
                <button 
                  onClick={() => setProfileDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="mt-6 text-center space-y-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-20 h-20 rounded-full mx-auto bg-indigo-100 border-2 border-indigo-500 shadow-md object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500 font-mono">{currentUser.email}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Entries</span>
                  <span className="text-lg font-extrabold text-slate-800">{userTransactions.length}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Member Since</span>
                  <span className="text-xs font-bold text-slate-800">{currentUser.joinedDate || '2026-01-01'}</span>
                </div>
              </div>

              {/* MongoDB Record Info */}
              {/* <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Simulated MongoDB Document ID</label>
                <div className="bg-slate-900 text-indigo-300 font-mono text-[11px] p-3 rounded-xl overflow-x-auto border border-slate-800">
                  {`{\n  "_id": "${currentUser.id}",\n  "role": "standard_user",\n  "status": "active"\n}`}
                </div>
              </div> */}
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      )}

      {}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
                <Edit2 className="w-5 h-5 text-indigo-600" />
                <span>Edit Record</span>
              </h3>
              <button 
                onClick={() => setEditingTx(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEditingTx({ ...editingTx, type: 'expense' })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    editingTx.type === 'expense' 
                      ? 'bg-white text-rose-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTx({ ...editingTx, type: 'income' })}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    editingTx.type === 'income' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Income
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingTx.title}
                  onChange={(e) => setEditingTx({ ...editingTx, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Amount & Date Input Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingTx.amount}
                      onChange={(e) => setEditingTx({ ...editingTx, amount: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editingTx.date}
                    onChange={(e) => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={editingTx.category}
                  onChange={(e) => setEditingTx({ ...editingTx, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Entry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">Authentication Portal</h3>
              </div>
              <button 
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auth Tab Buttons */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('register'); setAuthError(''); }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authTab === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-0.5">Demo Credentials:</span>
                  alex@example.com / password123
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}