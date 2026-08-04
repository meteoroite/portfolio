import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useLang } from '../../lib/language';
import { 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  Terminal, 
  Award, 
  Bot, 
  Zap,
  Lock,
  Unlock,
  Radio,
  RotateCw
} from 'lucide-react';

interface Riddle {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  rewardText: string;
}

const COSMIC_RIDDLES: Riddle[] = [
  {
    id: 1,
    question: "I speak without a mouth and write thousands of lines without a pen. I execute logic, build servers, and optimize real-time neural networks. What am I?",
    options: [
      "A) Source Code & Algorithms",
      "B) A mechanical keyboard",
      "C) Cloud SQL Database",
      "D) Satellite Antenna"
    ],
    correctIndex: 0,
    hint: "Think about the underlying instructions that power software engines.",
    rewardText: "CORRECT! Source Code is the DNA of digital universe construction."
  },
  {
    id: 2,
    question: "Staff Architect Mahmoud Wehaiba engineered AI systems & computer vision after graduating with honors from which renowned Egyptian university?",
    options: [
      "A) Cairo University",
      "B) Tanta University",
      "C) Alexandria University",
      "D) Ain Shams University"
    ],
    correctIndex: 1,
    hint: "Check Mahmoud's Mission Log or Bio Section — Tanta '24!",
    rewardText: "PRECISE! Tanta University Faculty of Agricultural Engineering, Class of 2024."
  },
  {
    id: 3,
    question: "Which open-source framework does Mahmoud utilize to execute local LLM models like Llama 3 & DeepSeek completely offline?",
    options: [
      "A) TensorFlow",
      "B) Ollama",
      "C) Docker Engine",
      "D) Vite Server"
    ],
    correctIndex: 1,
    hint: "Look at the local AI stack items in the Skills Constellation.",
    rewardText: "EXCELLENT! Ollama provides localized, zero-latency neural inference."
  }
];

const SECRET_POSITIONS = [
  { top: '82%', left: '85%' },
  { top: '18%', left: '80%' },
  { top: '70%', left: '15%' },
  { top: '25%', left: '75%' },
  { top: '85%', left: '50%' },
];

export const ObserverSecretEye: React.FC = () => {
  const [posIndex, setPosIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showRiddleModal, setShowRiddleModal] = useState(false);
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [teleportEffect, setTeleportEffect] = useState(false);
  const { t } = useLang();

  const currentRiddle = COSMIC_RIDDLES[currentRiddleIdx];

  const handleEyeClick = () => {
    if (isUnlocked) {
      // If already unlocked, open the master observer archive
      setShowRiddleModal(true);
      return;
    }

    // Teleport to new position
    setTeleportEffect(true);
    setTimeout(() => {
      setPosIndex((prev) => (prev + 1) % SECRET_POSITIONS.length);
      setTeleportEffect(false);
      setShowRiddleModal(true);
    }, 300);
  };

  const handleVerifyAnswer = (idx: number) => {
    setSelectedOption(idx);
    if (idx === currentRiddle.correctIndex) {
      setFeedbackMsg({ text: currentRiddle.rewardText, isError: false });
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#a855f7']
      });

      setTimeout(() => {
        if (currentRiddleIdx < COSMIC_RIDDLES.length - 1) {
          setCurrentRiddleIdx(prev => prev + 1);
          setSelectedOption(null);
          setFeedbackMsg(null);
        } else {
          // Solved all riddles!
          setIsUnlocked(true);
          setFeedbackMsg({
            text: t.observerAllSolved,
            isError: false
          });
        }
      }, 1500);

    } else {
      setFeedbackMsg({
        text: t.observerWrong,
        isError: true
      });
    }
  };

  const currentPos = SECRET_POSITIONS[posIndex];

  return (
    <>
      {/* Floating Secret Observer Eye Orb */}
      <motion.div
        animate={{
          scale: teleportEffect ? [1, 0, 1] : [1, 1.08, 1],
          opacity: teleportEffect ? 0 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed',
          top: isUnlocked ? 'calc(100vh - 4.5rem)' : currentPos.top,
          left: isUnlocked ? 'calc(100vw - 4.25rem)' : `clamp(1rem, ${currentPos.left}, calc(100vw - 4.25rem))`,
          zIndex: 52,
        }}
        onClick={handleEyeClick}
        className="cursor-pointer group select-none"
      >
        <div className="relative flex items-center justify-center">
          
          {/* Teleport Flash Ring */}
          {teleportEffect && (
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-cyan-400 animate-ping opacity-90" />
          )}

          {/* Eye Outer Glow */}
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center shadow-2xl backdrop-blur-md ${
            isUnlocked 
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]' 
              : 'bg-slate-950/90 border-cyan-400/80 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110'
          }`}>
            {isUnlocked ? (
              <Unlock className="w-6 h-6 text-emerald-300 animate-pulse" />
            ) : (
              <Eye className="w-6 h-6 text-cyan-300 animate-pulse" />
            )}

            {/* Orbiting Pupil Ring */}
            <div className="absolute -inset-1 rounded-full border border-cyan-500/40 border-dashed animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          {/* Secret Alert Tag */}
          {!isUnlocked && (
            <div className="absolute -top-7 whitespace-nowrap bg-cyan-950 text-cyan-300 border border-cyan-500/50 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-md opacity-90 group-hover:opacity-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{t.observerClickMe}</span>
            </div>
          )}

          {isUnlocked && (
            <div className="absolute -top-7 whitespace-nowrap bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{t.observerUnlocked}</span>
            </div>
          )}

        </div>
      </motion.div>

      {/* Cosmic Telepathic Riddle Overlay Modal */}
      <AnimatePresence>
        {showRiddleModal && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono animate-fade-in">
            <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] relative max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setShowRiddleModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-md ${
                  isUnlocked 
                    ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' 
                    : 'bg-cyan-950 border-cyan-500/50 text-cyan-300'
                }`}>
                  {isUnlocked ? <Unlock className="w-6 h-6 text-emerald-400" /> : <Eye className="w-6 h-6 text-cyan-400 animate-pulse" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400">
                      {isUnlocked ? t.observerCoreArchive : `${t.observerChallenge} [ ${currentRiddleIdx + 1} / ${COSMIC_RIDDLES.length} ]`}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {isUnlocked ? t.observerArchive : t.observerRiddle}
                  </h3>
                </div>
              </div>

              {/* RIDDLE CHALLENGE VIEW (if not unlocked) */}
              {!isUnlocked && (
                <div className="space-y-5">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{t.observerPrompt}</span>
                    </div>
                    <p className="text-sm font-sans text-slate-200 leading-relaxed font-semibold">
                      "{currentRiddle.question}"
                    </p>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2">
                    {currentRiddle.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleVerifyAnswer(idx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                          selectedOption === idx
                            ? idx === currentRiddle.correctIndex
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                              : 'bg-red-950/80 border-red-500 text-red-200 font-bold'
                            : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-200 hover:border-cyan-500/50'
                        }`}
                      >
                        <span>{option}</span>
                        {selectedOption === idx && idx === currentRiddle.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Feedback Message */}
                  {feedbackMsg && (
                    <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      feedbackMsg.isError 
                        ? 'bg-red-950/80 border-red-500/50 text-red-300' 
                        : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 font-bold'
                    }`}>
                      <Zap className="w-4 h-4 shrink-0 text-cyan-400" />
                      <span>{feedbackMsg.text}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 italic">
                    {t.observerHint} {currentRiddle.hint}
                  </div>
                </div>
              )}

              {/* MASTER OBSERVER UNLOCKED ARCHIVE VIEW */}
              {isUnlocked && (
                <div className="space-y-4 font-sans text-xs text-slate-300">
                  <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 space-y-1 font-mono">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>{t.observerClearance}</span>
                    </div>
                    <p className="text-xs font-sans text-emerald-300/90">
                      {t.observerClearanceDesc}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono">
                    <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                      <Terminal className="w-4 h-4" />
                      <span>{t.observerProfileRecap}</span>
                    </div>
                    <ul className="space-y-2 text-slate-300 text-xs font-sans">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>{t.observerEducation}</strong> B.Sc. Agricultural Engineering (Honors), Tanta University 2024</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>{t.observerSpec}</strong> Autonomous AI Agents, Real-Time Computer Vision & C# Full-Stack</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>{t.observerKeySystems}</strong> AutoCRM Intelligence, MedQR Emergency Pass, HandsOn CV Control</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowRiddleModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl font-mono text-xs shadow-lg transition-all"
                  >
                    {t.observerClose}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
