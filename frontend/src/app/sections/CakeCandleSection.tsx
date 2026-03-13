import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ROSE  = '#e89ab3';

/* ─── SVG Flame ─────────────────────────────────── */
function Flame({ visible, size = 1 }: { visible: boolean; size?: number }) {
  if (!visible) return null;
  return (
    <svg width={14 * size} height={24 * size} viewBox="0 0 14 24" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <filter id="fglow2">
          <feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <ellipse cx="7" cy="20" rx="8" ry="5" fill="rgba(255,200,50,.2)" filter="url(#fglow2)"/>
      <motion.path
        d="M7,2 C4,7 1,13 3,19 C5,23 9,23 11,19 C13,13 10,7 7,2Z"
        fill="#ffcc44" filter="url(#fglow2)"
        animate={{ scaleX:[1,.85,1], scaleY:[1,1.08,1] }}
        transition={{ duration:.32, repeat:Infinity, ease:'easeInOut' }}
        style={{ transformOrigin:'7px 20px' }}
      />
      <motion.path
        d="M7,6 C5.5,10 4,14 5.5,18 C6,20 8,20 8.5,18 C10,14 8.5,10 7,6Z"
        fill="#fff8c0"
        animate={{ scaleX:[1,.82,1], scaleY:[1,1.1,1] }}
        transition={{ duration:.28, delay:.08, repeat:Infinity, ease:'easeInOut' }}
        style={{ transformOrigin:'7px 18px' }}
      />
    </svg>
  );
}

/* ─── Image-based Candles ─────────────────────────── */
function Candle1({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      {lit && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', zIndex:10 }}><Flame visible size={scale}/></div>}
      <img src={`${import.meta.env.BASE_URL}candle_1073338.png`} alt="1" style={{ width: 60*scale, height: 'auto', display:'block' }} />
    </div>
  );
}

function Candle9({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      {lit && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', zIndex:10 }}><Flame visible size={scale}/></div>}
      <img src={`${import.meta.env.BASE_URL}candle_8128768.png`} alt="9" style={{ width: 60*scale, height: 'auto', display:'block' }} />
    </div>
  );
}

function Candle19({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8*scale, position:'relative' }}>
      <Candle1 lit={lit} scale={scale}/>
      <Candle9 lit={lit} scale={scale}/>
    </div>
  );
}

/* ─── Birthday Cake ─────────────────────────────── */
function BirthdayCake() {
  return (
    <svg className="w-full" viewBox="0 0 340 225" style={{ filter:'drop-shadow(0 12px 28px rgba(180,80,100,.25))' }}>
      {/* Shadow */}
      <ellipse cx="170" cy="215" rx="145" ry="10" fill="rgba(180,80,100,.08)"/>
      
      {/* Bottom tier */}
      <rect x="28" y="148" width="284" height="66" rx="10" fill="url(#ck1)"/>
      <ellipse cx="170" cy="148" rx="142" ry="14" fill="url(#ck1t)"/>
      
      {/* Frosting waves on bottom tier */}
      <path d="M48,148 Q58,138 68,148 Q78,138 88,148 Q98,138 108,148 Q118,138 128,148 Q138,138 148,148 Q158,138 168,148 Q178,138 188,148 Q198,138 208,148 Q218,138 228,148 Q238,138 248,148 Q258,138 268,148 Q278,138 288,148 Q298,138 308,148" fill="#fde8f0"/>
      
      {/* Decorative ribbon */}
      <rect x="28" y="164" width="284" height="8" rx="2" fill="rgba(212,100,126,.2)"/>
      
      {/* Decorative dots on bottom tier */}
      <circle cx="75"  cy="178" r="5" fill="#f8a0b8" opacity=".8"/>
      <circle cx="120" cy="178" r="5" fill="#f8a0b8" opacity=".8"/>
      <circle cx="170" cy="178" r="5" fill="#f8a0b8" opacity=".8"/>
      <circle cx="220" cy="178" r="5" fill="#f8a0b8" opacity=".8"/>
      <circle cx="260" cy="178" r="5" fill="#f8a0b8" opacity=".8"/>
      
      {/* Middle tier */}
      <rect x="64" y="97" width="212" height="57" rx="8" fill="url(#ck2)"/>
      <ellipse cx="170" cy="97" rx="106" ry="11" fill="url(#ck2t)"/>
      
      {/* Frosting waves on middle tier */}
      <path d="M74,97 Q82,89 90,97 Q98,89 106,97 Q114,89 122,97 Q130,89 138,97 Q146,89 154,97 Q162,89 170,97 Q178,89 186,97 Q194,89 202,97 Q210,89 218,97 Q226,89 234,97 Q242,89 250,97 Q258,89 266,97" fill="#fde8f0"/>
      
      {/* Decorative ribbon on middle tier */}
      <rect x="64" y="114" width="212" height="7" rx="2" fill="rgba(212,100,126,.18)"/>
      
      {/* Decorative dots on middle tier */}
      <circle cx="100" cy="125" r="4" fill="#f8a0b8" opacity=".7"/>
      <circle cx="170" cy="125" r="4" fill="#f8a0b8" opacity=".7"/>
      <circle cx="240" cy="125" r="4" fill="#f8a0b8" opacity=".7"/>
      
      {/* Top tier */}
      <rect x="110" y="55" width="120" height="48" rx="7" fill="url(#ck3)"/>
      <ellipse cx="170" cy="55" rx="60" ry="8" fill="url(#ck3t)"/>
      
      {/* Frosting waves on top tier */}
      <path d="M118,55 Q125,48 132,55 Q139,48 146,55 Q153,48 160,55 Q167,48 174,55 Q181,48 188,55 Q195,48 202,55 Q209,48 216,55" fill="#fde8f0"/>
      
      {/* Decorative hearts and flowers */}
      <text x="170" y="84" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,.55)">♡</text>
      <text x="142" y="77" textAnchor="middle" fontSize="9"  fill="rgba(255,255,255,.4)">✿</text>
      <text x="198" y="77" textAnchor="middle" fontSize="9"  fill="rgba(255,255,255,.4)">✿</text>
      <text x="170" y="70" textAnchor="middle" fontSize="7"  fill="rgba(255,255,255,.35)">✦</text>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="ck1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c8d8"/>
          <stop offset="100%" stopColor="#e898b8"/>
        </linearGradient>
        <radialGradient id="ck1t" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fce4ef"/>
          <stop offset="100%" stopColor="#f8c0d4"/>
        </radialGradient>
        <linearGradient id="ck2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8d8e8"/>
          <stop offset="100%" stopColor="#ecaac4"/>
        </linearGradient>
        <radialGradient id="ck2t" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdeef5"/>
          <stop offset="100%" stopColor="#f8cce0"/>
        </radialGradient>
        <linearGradient id="ck3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fce8f0"/>
          <stop offset="100%" stopColor="#f0b4c8"/>
        </linearGradient>
        <radialGradient id="ck3t" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff0f6"/>
          <stop offset="100%" stopColor="#fcd8e8"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ─── Spark particle ─────────────────────────────── */
function Spark({ x,y,color,angle,dist }: { x:number;y:number;color:string;angle:number;dist:number }) {
  return (
    <motion.div style={{ position:'absolute', left:x, top:y, width:6, height:6, borderRadius:'50%', background:color }}
      initial={{ opacity:1, x:0, y:0, scale:1 }}
      animate={{ opacity:0, x:Math.cos(angle)*dist, y:-Math.abs(Math.sin(angle))*dist-20, scale:0 }}
      transition={{ duration:.8+Math.random()*.7, ease:'easeOut', delay:Math.random()*.4 }}
    />
  );
}

const SPARK_COLORS = ['#f4c2c2','#d4688e','#f9d8bc','#e898b8','#fff0c0','#f8c8e8','#d9c6f7'];
type Phase = 'traveling'|'merging'|'merged'|'landing'|'landed';

interface CakeCandleSectionProps { age: number; recipient?: string }

export function CakeCandleSection({ age, recipient = 'Mubashira' }: CakeCandleSectionProps) {
  const cakeRef    = useRef<HTMLDivElement>(null);
  const phaseRef   = useRef<Phase>('traveling');
  const rafRef     = useRef<number>();
  const [phase,    setPhase]   = useState<Phase>('traveling');
  const [c1y,      setC1y]     = useState(0);  // 0→1 = 8vh→44vh
  const [sparks,   setSparks]  = useState<{ id:number;x:number;y:number;color:string;angle:number;dist:number }[]>([]);
  const [showMsg,  setShowMsg] = useState(false);

  const advance = useCallback((next: Phase) => {
    phaseRef.current = next; setPhase(next);
  }, []);

  useEffect(() => {
    let smooth = window.scrollY, target = window.scrollY;
    const onScroll = () => { target = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive:true });

    const tick = () => {
      smooth += (target - smooth) * 0.07;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? smooth/max : 0;

      if (phaseRef.current === 'traveling') {
        setC1y(Math.min(1, pct/0.5));
        if (cakeRef.current) {
          const r = cakeRef.current.getBoundingClientRect();
          if (r.top < window.innerHeight*2) advance('merging');
        }
      }
      if (phaseRef.current === 'merged' && cakeRef.current) {
        if (cakeRef.current.getBoundingClientRect().top < window.innerHeight*0.5) advance('landing');
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafRef.current!); };
  }, [advance]);

  useEffect(() => {
    if (phase !== 'merging') return;
    // After merge animation completes, switch to merged (increased timing for smoother animation)
    const t = setTimeout(() => advance('merged'), 2400);
    return () => clearTimeout(t);
  }, [phase, advance]);

  useEffect(() => {
    if (phase !== 'landing') return;
    const t = setTimeout(() => {
      advance('landed');
      setTimeout(() => {
        setSparks(Array.from({ length:55 }, (_,i) => ({
          id:i, x:100+Math.random()*140, y:20+Math.random()*50,
          color:SPARK_COLORS[~~(Math.random()*SPARK_COLORS.length)],
          angle:Math.random()*Math.PI*2, dist:60+Math.random()*80,
        })));
        setTimeout(() => setShowMsg(true), 500);
      }, 400);
    }, 1000);
    return () => clearTimeout(t);
  }, [phase, advance]);

  // Fallback: if user jumped straight here
  useEffect(() => {
    if (phase === 'traveling' && cakeRef.current) {
      const r = cakeRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight*0.65) advance('landing');
    }
  });

  const c1TopVh = 8 + c1y * 36;

  return (
    <section id="cake" className="min-h-screen flex flex-col items-center py-4 sm:py-6 md:py-8 px-4 relative overflow-hidden"
      style={{ background:'radial-gradient(ellipse 90% 70% at 50% 100%,#ffe0e8 0%,transparent 55%),radial-gradient(ellipse 80% 50% at 0% 30%,#fde8d8 0%,transparent 50%),#f7ede0' }}>

      {/* ── Traveling "1" ── */}
      {phase === 'traveling' && (
        <div style={{ position:'fixed', right:'min(22%, 80px)', top:`${c1TopVh}vh`, pointerEvents:'none', zIndex:500 }}>
          <div className="scale-[0.4] sm:scale-50 md:scale-75">
            <Candle1 scale={.75}/>
          </div>
        </div>
      )}

      {/* ── Merge animation - smooth, attractive and beautiful ── */}
      <AnimatePresence>
        {phase === 'merging' && (
          <>
            {/* "1" candle glides from right with rotation */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none' }}
              initial={{ right:'min(22%, 80px)', top:'44vh', opacity:1, scale:1, rotate:0 }}
              animate={{ 
                right:'45%', 
                opacity:[1,1,1,0.8,0],
                scale:[1,1.08,1.05,0.95,0.85],
                rotate:[0,5,10,15,20]
              }}
              transition={{ duration:1.5, delay:.15, times:[0,.25,.5,.75,1], ease:[0.25, 0.46, 0.45, 0.94] }}>
              <div className="scale-[0.4] sm:scale-50 md:scale-75">
                <Candle1 scale={.75}/>
              </div>
            </motion.div>
            
            {/* "9" candle glides from left with rotation */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none' }}
              initial={{ left:'min(24%, 80px)', top:'44vh', opacity:0, scale:0.7, rotate:0 }}
              animate={{ 
                left:'35%', 
                opacity:[0,1,1,1,0.8,0],
                scale:[0.7,0.95,1.08,1.05,0.95,0.85],
                rotate:[0,-5,-10,-15,-20,-25]
              }}
              transition={{ duration:1.6, times:[0,.15,.35,.55,.75,1], ease:[0.25, 0.46, 0.45, 0.94] }}>
              <div className="scale-[0.4] sm:scale-50 md:scale-75">
                <Candle9 scale={.75}/>
              </div>
            </motion.div>
            
            {/* Sparkle effect during merge */}
            <motion.div style={{ position:'fixed', zIndex:499, pointerEvents:'none', left:'50%', top:'44vh', transform:'translate(-50%, -50%)' }}
              initial={{ opacity:0, scale:0 }}
              animate={{ 
                opacity:[0,0.6,0.8,0.6,0],
                scale:[0,1.5,2,2.5,3]
              }}
              transition={{ duration:1.2, delay:0.8, times:[0,.3,.5,.7,1] }}>
              <div style={{ 
                width:120, 
                height:120, 
                borderRadius:'50%', 
                background:'radial-gradient(circle, rgba(255,220,180,0.4) 0%, rgba(248,200,232,0.2) 40%, transparent 70%)',
                filter:'blur(20px)'
              }}/>
            </motion.div>
            
            {/* Combined "19" appears with lovely bounce and glow */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none', left:'50%', top:'44vh' }}
              initial={{ opacity:0, scale:.4, x:'-50%', y:'-30%', rotate:-15 }}
              animate={{ 
                opacity:[0,0,1,1],
                scale:[.4,.6,.95,1], 
                y:['-30%','-10%','5%','0%'],
                rotate:[-15,-8,3,0]
              }}
              transition={{ 
                duration:1.1, 
                delay:1.2,
                times:[0,.3,.7,1],
                type: "spring",
                stiffness: 180,
                damping: 12
              }}>
              <div className="scale-[0.4] sm:scale-50 md:scale-75">
                <Candle19 scale={.75}/>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Merged traveling ── */}
      {phase === 'merged' && (
        <div style={{ position:'fixed', top:'44vh', left:'50%', transform:'translateX(-50%)', pointerEvents:'none', zIndex:500 }}>
          <div className="scale-[0.4] sm:scale-50 md:scale-75">
            <Candle19 scale={.75}/>
          </div>
        </div>
      )}

      {/* Section title - ABSOLUTE TOP with conditional visibility */}
      <AnimatePresence>
        {(phase === 'traveling' || phase === 'merged' || phase === 'landing' || phase === 'landed') && (
          <motion.div className="text-center mb-0 mt-2 sm:mt-4"
            initial={{ opacity:0, y:20 }} 
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-20 }}
            transition={{ duration:0.5 }}>
            <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[.2em] uppercase mb-1" style={{ fontFamily:'var(--font-serif)', color:ROSE }}>Make a Wish</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl" style={{ fontFamily:'var(--font-handwritten)', color:ROSE }}>Happy {age}th!</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MASSIVE SPACER TO COMPLETELY PREVENT OVERLAP */}
      <div className="flex-1 min-h-[280px] sm:min-h-[340px] md:min-h-[400px]" />

      {/* Cake stage - PUSHED WAY DOWN */}
      <div ref={cakeRef} className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] px-4">
        <AnimatePresence>
          {(phase === 'landing' || phase === 'landed') && (
            <motion.div style={{ position:'absolute', left:'50%', zIndex:10, display:'flex', justifyContent:'center' }}
              initial={{ y:-180, x:'-50%' }}
              animate={{ y:-100, x:'-50%' }}
              transition={{ duration:1.1, ease:[.22,1,.36,1] }}>
              <motion.div className="scale-[0.5] sm:scale-[0.6] md:scale-75"
                animate={phase==='landed' ? { x:[0,-12,12,-12,12,-12,0] } : {}}
                transition={{ duration:1, delay:.25 }}>
                <Candle19 lit={phase==='landed'} scale={.7}/>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ position:'relative', zIndex:4 }}><BirthdayCake/></div>

        {/* Glow flash on landing */}
        {phase === 'landed' && (
          <motion.div style={{ position:'fixed', inset:0, background:'radial-gradient(circle,rgba(248,200,180,.32) 0%,transparent 70%)', pointerEvents:'none', zIndex:400 }}
            initial={{ opacity:0 }} animate={{ opacity:[0,1,0] }} transition={{ duration:1.4 }}/>
        )}

        {/* Sparkles */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:5 }}>
          {sparks.map(s => <Spark key={s.id} {...s}/>)}
        </div>

        <AnimatePresence>
          {showMsg && (
            <motion.div className="text-center mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4"
              initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ duration:.8, ease:[.34,1.56,.64,1] }}>
              <p className="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2"
                style={{ fontFamily:'var(--font-handwritten)', color:ROSE, textShadow:'0 2px 20px rgba(180,80,100,.3)' }}>
                Happy Birthday! ♡
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl"
                style={{ fontFamily:'var(--font-handwritten)', color:ROSE, textShadow:'0 2px 20px rgba(180,80,100,.3)' }}>
                {recipient}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
