import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { motion } from 'motion/react';
import { AlertCircle, ShieldAlert, Terminal } from 'lucide-react';

export default function ConsequenceMode() {
  const { setMode, spendCredits } = useGameStore();

  const handleRemediate = () => {
    // In a real game, this would involve a micro-learning task
    spendCredits(20);
    setMode('ACTION');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-base-dark flex items-center justify-center overflow-hidden">
      {/* Glitch Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-50"></div>
        <motion.div 
          animate={{ 
            x: [0, -20, 20, -10, 0],
            y: [0, 10, -10, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute inset-0 border-[20px] border-status-error/30"
        />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass border-status-error/50 p-12 rounded-3xl max-w-2xl w-full relative z-10 text-center space-y-8 shadow-[0_0_100px_rgba(217,106,114,0.2)]"
      >
        <div className="flex justify-center">
          <div className="relative">
            <ShieldAlert size={80} className="text-status-error animate-pulse" />
            <motion.div 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute inset-0 text-status-error"
            >
              <ShieldAlert size={80} />
            </motion.div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-serif font-black tracking-tight text-status-error uppercase">
            System Compromised
          </h1>
          <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">
            Critical breach detected in sector 7G
          </p>
        </div>

        <div className="bg-black/40 p-6 rounded-xl border border-white/5 text-left font-mono text-xs space-y-2">
          <div className="flex items-center space-x-2 text-status-error">
            <Terminal size={14} />
            <span>RANSOMWARE_LOG_0x882.txt</span>
          </div>
          <div className="text-text-secondary/60">
            {">"} ENCRYPTING LOCAL ASSETS... DONE<br/>
            {">"} LOCKING CORPORATE SKYLINE... DONE<br/>
            {">"} DEMANDING FORFEITURE OF 20 CYBER CREDITS<br/>
            {">"} ERROR: USER_VULNERABILITY_EXPLOITED
          </div>
        </div>

        <div className="p-6 bg-status-error/10 rounded-xl border border-status-error/20 text-sm text-text-primary/80 italic font-serif text-lg leading-relaxed">
          "You clicked a link from 'support@rnicrosoft.com'. The real domain was Microsoft.com. This is a classic 'typosquatting' attack."
        </div>

        <button 
          onClick={handleRemediate}
          className="w-full py-4 bg-status-error text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(217,106,114,0.4)] uppercase tracking-widest text-xs"
        >
          <AlertCircle size={20} />
          <span>Pay Ransom & Remediate (20 CR)</span>
        </button>
      </motion.div>
    </div>
  );
}
