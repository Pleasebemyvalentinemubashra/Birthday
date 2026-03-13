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

/* ─── Candle "1" — serif numeral shape ─────────── */
function Candle1({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      {lit && <div style={{ marginBottom:-6 }}><Flame visible size={scale}/></div>}
      <svg width={46*scale} height={148*scale} viewBox="0 0 46 148" overflow="visible">
        <defs>
          <linearGradient id="cg1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#e888b0"/>
            <stop offset="35%"  stopColor="#fde8f0"/>
            <stop offset="100%" stopColor="#c8709a"/>
          </linearGradient>
        </defs>
        {/* Wick */}
        <rect x="22" y="2" width="2" height="9" rx="1" fill="#554433"/>
        {/* Diagonal flag of the "1" */}
        <path d="M10,22 L24,14 L24,28 L14,32Z" fill="url(#cg1)"/>
        {/* Vertical shaft */}
        <rect x="16" y="14" width="14" height="106" rx="3" fill="url(#cg1)"/>
        {/* Bottom serif platform */}
        <rect x="5" y="118" width="36" height="14" rx="3" fill="url(#cg1)"/>
        {/* Sheen */}
        <rect x="19" y="18" width="4" height="100" rx="2" fill="rgba(255,255,255,.22)"/>
        <rect x="8" y="120" width="8" height="8"   rx="2" fill="rgba(255,255,255,.18)"/>
      </svg>
    </div>
  );
}

/* ─── Candle "9" — TRUE 9-shaped numeral candle ───
   A real "9" digit with proper curves
────────────────────────────────────────────────── */
function Candle9({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      {lit && <div style={{ marginBottom:-6 }}><Flame visible size={scale}/></div>}
      <svg width={50*scale} height={148*scale} viewBox="0 0 50 148" overflow="visible">
        <defs>
          <linearGradient id="cg9" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#d89030"/>
            <stop offset="35%"  stopColor="#fff0b8"/>
            <stop offset="100%" stopColor="#b87020"/>
          </linearGradient>
        </defs>
        {/* Wick */}
        <rect x="24" y="2" width="2" height="8" rx="1" fill="#554433"/>
        
        {/* The "9" - drawn as a proper numeral */}
        {/* Outer shape of 9 */}
        <path d="
          M 25 12
          C 36 12, 45 21, 45 32
          C 45 43, 36 52, 25 52
          C 14 52, 5 43, 5 32
          C 5 21, 14 12, 25 12
          M 25 22
          C 19.5 22, 15 26.5, 15 32
          C 15 37.5, 19.5 42, 25 42
          C 30.5 42, 35 37.5, 35 32
          C 35 26.5, 30.5 22, 25 22
          M 35 42
          L 38 48
          L 38 120
          C 38 125, 35 128, 31 130
          L 31 134
          L 44 134
          L 44 148
          L 6 148
          L 6 134
          L 19 134
          L 19 130
          C 15 128, 12 125, 12 120
          L 12 48
          L 15 42
          C 18 39, 21 37, 25 37
          C 29 37, 32 39, 35 42
        " fill="url(#cg9)"/>
        
        {/* Highlight sheen */}
        <ellipse cx="20" cy="28" rx="4" ry="6" fill="rgba(255,255,255,.35)"/>
        <rect x="28" y="55" width="3" height="60" rx="1.5" fill="rgba(255,255,255,.25)"/>
        <rect x="8" y="136" width="7" height="8" rx="2" fill="rgba(255,255,255,.2)"/>
      </svg>
    </div>
  );
}

/* ─── Merged "19" ───────────────────────────────── */
function Candle19({ lit, scale=1 }: { lit?:boolean; scale?:number }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:6*scale }}>
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
    // After merge animation completes, switch to merged
    const t = setTimeout(() => advance('merged'), 1700);
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

      {/* ── Merge animation - smoother and more lovely ── */}
      <AnimatePresence>
        {phase === 'merging' && (
          <>
            {/* "1" candle glides from right */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none' }}
              initial={{ right:'min(22%, 80px)', top:'44vh', opacity:1, scale:1 }}
              animate={{ 
                right:'45%', 
                opacity:[1,1,1,0],
                scale:[1,1.05,1,0.9]
              }}
              transition={{ duration:1.2, delay:.2, times:[0,.3,.7,1], ease:[0.34, 1.56, 0.64, 1] }}>
              <div className="scale-[0.4] sm:scale-50 md:scale-75">
                <Candle1 scale={.75}/>
              </div>
            </motion.div>
            
            {/* "9" candle glides from left */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none' }}
              initial={{ left:'min(24%, 80px)', top:'44vh', opacity:0, scale:0.8 }}
              animate={{ 
                left:'35%', 
                opacity:[0,1,1,1,0],
                scale:[0.8,1,1.05,1,0.9]
              }}
              transition={{ duration:1.3, times:[0,.2,.5,.8,1], ease:[0.34, 1.56, 0.64, 1] }}>
              <div className="scale-[0.4] sm:scale-50 md:scale-75">
                <Candle9 scale={.75}/>
              </div>
            </motion.div>
            
            {/* Combined "19" appears with lovely bounce */}
            <motion.div style={{ position:'fixed', zIndex:500, pointerEvents:'none', left:'50%', top:'44vh' }}
              initial={{ opacity:0, scale:.5, x:'-50%', y:'-20%', rotate:-10 }}
              animate={{ 
                opacity:1, 
                scale:1, 
                y:'0%',
                rotate:0
              }}
              transition={{ 
                duration:.8, 
                delay:1.0,
                type: "spring",
                stiffness: 200,
                damping: 15
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

      {/* Section title - moved to top with more space */}
      <motion.div className="text-center mb-8 sm:mb-12 md:mb-16 mt-4 sm:mt-8"
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
        <p className="text-[10px] sm:text-xs md:text-sm tracking-[.2em] uppercase mb-1 sm:mb-2" style={{ fontFamily:'var(--font-serif)', color:ROSE }}>Make a Wish</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily:'var(--font-handwritten)', color:ROSE }}>Happy {age}th!</h2>
      </motion.div>

      {/* Cake stage - with more top margin */}
      <div ref={cakeRef} className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] px-4 mt-12 sm:mt-16 md:mt-20">
        <AnimatePresence>
          {(phase === 'landing' || phase === 'landed') && (
            <motion.div style={{ position:'absolute', left:'50%', zIndex:10, display:'flex', justifyContent:'center' }}
              initial={{ y:-170, x:'-50%' }}
              animate={{ y:-90, x:'-50%' }}
              transition={{ duration:1.1, ease:[.22,1,.36,1] }}>
              <motion.div className="scale-[0.6] sm:scale-75 md:scale-100"
                animate={phase==='landed' ? { x:[0,-14,14,-14,14,-14,0] } : {}}
                transition={{ duration:1, delay:.25 }}>
                <Candle19 lit={phase==='landed'} scale={.82}/>
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
