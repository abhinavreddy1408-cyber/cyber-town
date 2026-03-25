/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from './store/useGameStore';
import ActionMode from './features/action-mode/ActionMode';
import SimulationMode from './features/simulation-mode/SimulationMode';
import ConsequenceMode from './features/consequence-mode/ConsequenceMode';
import { LayoutGrid, Mail, Shield, Zap, LogIn, LogOut, User as UserIcon, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from './components/FirebaseProvider';

export default function App() {
  const { mode, setMode, credits } = useGameStore();
  const { user, loading, login, logout, saveGame } = useFirebase();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-base-dark flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-accent-gold"
        >
          <Zap size={48} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-base-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/5 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-16 rounded-3xl border-white/5 max-w-lg w-full text-center relative z-10 shadow-2xl bg-surface-dark/40 backdrop-blur-2xl"
        >
          <div className="flex justify-center mb-10">
            <div className="p-6 bg-accent-gold/10 rounded-2xl text-accent-gold border border-accent-gold/20">
              <Shield size={64} />
            </div>
          </div>
          <h1 className="text-5xl font-serif font-black tracking-tight mb-6 text-text-primary uppercase">Cyber Town</h1>
          <p className="text-text-secondary mb-12 leading-relaxed font-serif text-lg italic">
            Protect the digital frontier. Build your defense, neutralize threats, and secure the future.
          </p>
          <button 
            onClick={login}
            className="w-full flex items-center justify-center space-x-3 py-5 bg-accent-gold text-base-dark rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-gold/10 uppercase tracking-widest text-xs"
          >
            <LogIn size={20} />
            <span>Initialize Session</span>
          </button>
          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-text-secondary/40 font-bold">
            Secure Authentication Required
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-base-dark flex flex-col overflow-hidden text-text-primary">
      {/* Global Header / Mode Switcher */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 z-40 bg-surface-dark/80 backdrop-blur-xl">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <Zap className="text-accent-gold fill-accent-gold" size={24} />
            <span className="font-serif font-black tracking-tight text-2xl uppercase">Cyber Town</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <nav className="flex space-x-2">
            <button 
              onClick={() => setMode('ACTION')}
              className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all flex items-center space-x-2 uppercase tracking-widest ${
                mode === 'ACTION' ? 'bg-accent-gold text-base-dark shadow-lg shadow-accent-gold/20' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Mail size={14} />
              <span>Action Mode</span>
            </button>
            <button 
              onClick={() => setMode('SIMULATION')}
              className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all flex items-center space-x-2 uppercase tracking-widest ${
                mode === 'SIMULATION' ? 'bg-accent-gold text-base-dark shadow-lg shadow-accent-gold/20' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Simulation Mode</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center space-x-8">
          <button 
            onClick={saveGame}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-text-primary transition-all text-[10px] font-bold uppercase tracking-widest border border-white/5"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-widest text-text-secondary/60 leading-none mb-1 font-bold">Cyber Credits</span>
            <span className="font-serif text-status-success font-black text-xl leading-none">{credits.toLocaleString()}</span>
          </div>
          <div className="group relative">
            <button className="w-12 h-12 rounded-full border border-white/10 bg-surface-dark flex items-center justify-center overflow-hidden hover:border-accent-gold/50 transition-colors shadow-xl">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon size={24} className="text-accent-gold" />
              )}
            </button>
            <div className="absolute top-full right-0 mt-3 w-64 glass p-3 rounded-2xl border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-2xl bg-surface-dark/95 backdrop-blur-2xl">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <div className="text-sm font-serif font-bold text-text-primary truncate">{user.displayName}</div>
                <div className="text-[10px] text-text-secondary/60 truncate tracking-wider">{user.email}</div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl hover:bg-status-error/10 text-status-error text-[10px] font-bold transition-colors uppercase tracking-widest"
              >
                <LogOut size={14} />
                <span>Terminate Session</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === 'ACTION' && (
            <motion.div 
              key="action"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0"
            >
              <ActionMode />
            </motion.div>
          )}
          {mode === 'SIMULATION' && (
            <motion.div 
              key="simulation"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0"
            >
              <SimulationMode />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consequence Overlay */}
        <AnimatePresence>
          {mode === 'CONSEQUENCE' && (
            <motion.div
              key="consequence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[100]"
            >
              <ConsequenceMode />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
