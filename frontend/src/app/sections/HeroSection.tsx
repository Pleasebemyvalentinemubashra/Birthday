import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

/* ── Falling petal particle ──────────────────────── */
function Petal({ i }: { i: number }) {
  const left = `${4 + (i * 6.1) % 92}%`;
  const dur  = 9 + (i % 5);
  const size = 7 + (i % 4) * 2;
  const colors = ['#f7c6d9','#e89ab3','#d9c6f7','#fde0ec','#f0d8f8'];
  const c = colors[i % colors.length];
  return (
    <motion.div style={{ position:'absolute', left, top:-24, width:size, height:size, pointerEvents:'none' }}
      initial={{ y:-30, opacity:0, rotate:0, x:0 }}
      animate={{ y:'108vh', opacity:[0,.65,.5,0], rotate: i%2===0 ? 360 : -360, x:[0,20,-15,10,-5,0] }}
      transition={{ duration:dur, delay:i*0.55, repeat:Infinity, ease:'linear' }}>
      {i%3===0
        ? <svg viewBox="0 0 14 14"><path d="M7,2 C4,2 2,4 2,6.5 C2,9.5 7,13 7,13 C7,13 12,9.5 12,6.5 C12,4 10,2 7,2Z" fill={c}/></svg>
        : i%3===1
          ? <svg viewBox="0 0 12 12"><ellipse cx="6" cy="6" rx="5" ry="3" fill={c} opacity=".8"/></svg>
          : <svg viewBox="0 0 10 10"><path d="M5,1 Q7,3 9,5 Q7,7 5,9 Q3,7 1,5 Q3,3 5,1Z" fill={c} opacity=".7"/></svg>
      }
    </motion.div>
  );
}

/* ── Decorative ink flourish ─────────────────────── */
function Flourish({ flip=false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 24" style={{ width:120, height:24, transform: flip?'scaleX(-1)':undefined }}>
      <path d="M5,12 Q20,4 40,12 Q60,20 80,8 Q95,2 115,12" stroke="#e89ab3" strokeWidth="1.2" fill="none" opacity=".5" strokeLinecap="round"/>
      <path d="M8,12 Q12,8 16,12" stroke="#c8a05a" strokeWidth="1.5" fill="none" opacity=".6" strokeLinecap="round"/>
      <circle cx="5" cy="12" r="2" fill="#e89ab3" opacity=".5"/>
      <circle cx="115" cy="12" r="2" fill="#e89ab3" opacity=".5"/>
    </svg>
  );
}

/* ── Floating polaroid ───────────────────────────── */
function FloatingPolaroid({ rot, style, delay }: { rot:number; style:React.CSSProperties; delay:number }) {
  return (
    <motion.div className="absolute hidden lg:block" style={{ ...style, pointerEvents:'none' }}
      initial={{ opacity:0, scale:.75, rotate:rot }} animate={{ opacity:1, scale:1, rotate:rot }}
      transition={{ duration:1.4, delay, ease:[.22,1,.36,1] }}>
      <motion.div animate={{ y:[0,-16,0], rotate:[rot, rot+1.5, rot] }}
        transition={{ duration:4+delay, repeat:Infinity, ease:'easeInOut' }}>
        <div style={{ background:'#fff', padding:'8px 8px 36px', boxShadow:'4px 10px 36px rgba(80,20,40,.28)', width:148 }}>
          {/* tape */}
          <div style={{ position:'absolute', top:-9, left:'50%', transform:'translateX(-50%) rotate(-5deg)', width:52, height:18, background:'rgba(255,255,255,.55)', border:'1px solid rgba(255,255,255,.7)', backdropFilter:'blur(3px)' }}/>
          <div style={{ width:'100%', height:120, background:`linear-gradient(135deg,#fce4ef,#f8c0d4)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, opacity:.45 }}>✿</div>
          <div style={{ textAlign:'center', marginTop:8, fontFamily:'var(--font-handwritten)', fontSize:11, color:'#9a7080' }}>add your photo</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface HeroProps { recipient:string; age:number; onCTA:()=>void; musicUrl?:string|null }

export function HeroSection({ recipient, age, onCTA, musicUrl }: HeroProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness:40, damping:20 });
  const springY = useSpring(mouseY, { stiffness:40, damping:20 });
  const floatX  = useTransform(springX, [0,1], [-18, 18]);
  const floatY  = useTransform(springY, [0,1], [-12, 12]);

  const scrollY     = useMotionValue(0);
  const titleY      = useTransform(scrollY, [0,500], [0,-90]);
  const titleOpacity= useTransform(scrollY, [0,380], [1,0]);

  const audioRef = useRef<HTMLAudioElement|null>(null);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    const onScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive:true });
    return () => { window.removeEventListener('mousemove', onMouse); window.removeEventListener('scroll', onScroll); };
  }, [mouseX, mouseY, scrollY]);

  useEffect(() => {
    if (!musicUrl) return;
    const a = new Audio(musicUrl); a.loop = true; a.volume = 0.18;
    audioRef.current = a;
    return () => a.pause();
  }, [musicUrl]);

  return (
    <section style={{ position:'relative', minHeight:'100vh', overflow:'hidden',
      background:'linear-gradient(155deg, #fdf5e9 0%, #fce8f2 35%, #ede0f8 68%, #e8f0fa 100%)' }}>

      {/* Ambient blobs */}
      {[
        { w:520, h:520, l:'8%',  t:'5%',  c:'rgba(247,198,217,.22)', dur:6 },
        { w:440, h:440, l:'60%', t:'25%', c:'rgba(217,198,247,.18)', dur:7 },
        { w:360, h:360, l:'2%',  t:'58%', c:'rgba(232,154,179,.15)', dur:8 },
        { w:300, h:300, l:'70%', t:'65%', c:'rgba(200,180,247,.12)', dur:5 },
      ].map((b,i) => (
        <motion.div key={i} style={{ position:'absolute', width:b.w, height:b.h, borderRadius:'50%', background:b.c, left:b.l, top:b.t, filter:'blur(70px)', pointerEvents:'none' }}
          animate={{ scale:[1,1.18,1], opacity:[.8,1,.8] }} transition={{ duration:b.dur, repeat:Infinity, ease:'easeInOut', delay:i*1.2 }}/>
      ))}

      {/* Petals layer */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1, overflow:'hidden' }}>
        {Array.from({length:22}).map((_,i) => <Petal key={i} i={i}/>)}
      </div>

      {/* Floating polaroid frames */}
      <FloatingPolaroid rot={-13} delay={0.4} style={{ top:'10%',  left:'4%'  }}/>
      <FloatingPolaroid rot={10}  delay={0.8} style={{ top:'55%',  left:'3%'  }}/>
      <FloatingPolaroid rot={-8}  delay={0.6} style={{ top:'12%',  right:'4%' }}/>
      <FloatingPolaroid rot={11}  delay={1.0} style={{ bottom:'14%',right:'5%'}}/>

      {/* Subtle paper texture grid */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 1px 1px, rgba(180,120,100,.06) 1px, transparent 0)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>

      {/* Centre content — mouse parallax */}
      <motion.div style={{ y:titleY, opacity:titleOpacity, position:'relative', zIndex:10 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-28">

        <motion.div style={{ x:floatX, y:floatY }}>
          <motion.p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.4em', textTransform:'uppercase', color:'#9a6878', marginBottom:16 }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:.3 }}>
            a love letter in pages
          </motion.p>

          <motion.h1 style={{ fontFamily:'var(--font-handwritten)', color:'#e89ab3', fontSize:'clamp(48px,11vw,116px)', lineHeight:1.0, marginBottom:10 }}
            initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:1.3, delay:.55, ease:[.22,1,.36,1] }}>
            For Your {age}th Birthday
          </motion.h1>

          <motion.div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:12, margin:'14px 0' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}>
            <Flourish/> <span style={{ fontSize:16, color:'#c8a05a', opacity:.6 }}>✦</span> <Flourish flip/>
          </motion.div>

          <motion.p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'#7a5060', fontSize:'clamp(15px,2.2vw,20px)', maxWidth:520, lineHeight:1.9, marginBottom:44, margin:'0 auto 44px' }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:1, delay:.85 }}>
            Every moment with you is a treasure worth keeping forever,{' '}
            <span style={{ fontFamily:'var(--font-handwritten)', fontSize:'1.45em', color:'#e89ab3' }}>{recipient}</span>.
          </motion.p>

          <motion.button onClick={onCTA}
            style={{ padding:'17px 52px', borderRadius:999, background:'linear-gradient(135deg,#e89ab3,#b04e64)', color:'#fff', fontFamily:'var(--font-serif)', fontSize:17, letterSpacing:'.05em', border:'none', cursor:'pointer', boxShadow:'0 8px 36px rgba(232,154,179,.5), inset 0 1px 0 rgba(255,255,255,.2)', position:'relative', overflow:'hidden' }}
            initial={{ opacity:0, scale:.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.9, delay:1.15, ease:[.34,1.56,.64,1] }}
            whileHover={{ scale:1.07, boxShadow:'0 16px 52px rgba(232,154,179,.65)' }}
            whileTap={{ scale:.95 }}>
            Open the Album  ♡
            {/* shimmer */}
            <motion.div style={{ position:'absolute', top:0, left:'-100%', width:'55%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent)' }}
              animate={{ left:['−100%','220%'] }} transition={{ duration:2.8, repeat:Infinity, repeatDelay:1.2 }}/>
          </motion.button>
        </motion.div>

        {/* Scroll cue */}
        <motion.div style={{ position:'absolute', bottom:28, left:'50%', x:'-50%', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.2 }}>
          <span style={{ fontFamily:'var(--font-body)', fontSize:10, letterSpacing:'.25em', color:'#c090a0' }}>scroll</span>
          <motion.div style={{ width:1, height:38, background:'linear-gradient(to bottom,#e89ab3,transparent)' }}
            animate={{ scaleY:[1,.5,1], opacity:[1,.4,1] }} transition={{ duration:1.7, repeat:Infinity }}/>
        </motion.div>
      </motion.div>

      {/* Torn paper edge */}
      <div style={{ position:'absolute', bottom:-2, left:0, right:0, lineHeight:0, zIndex:10 }}>
        <svg viewBox="0 0 1440 42" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:42 }}>
          <path d="M0,24 Q72,8 144,20 Q216,32 288,12 Q360,0 432,18 Q504,32 576,14 Q648,0 720,20 Q792,34 864,14 Q936,0 1008,22 Q1080,36 1152,16 Q1224,0 1296,22 Q1368,36 1440,20 L1440,42 L0,42Z" fill="#fdf5e9"/>
        </svg>
      </div>

      {/* Music btn */}
      {musicUrl && (
        <button onClick={() => { const a=audioRef.current; if(!a) return; a.paused?a.play():a.pause(); }}
          title="Toggle music"
          style={{ position:'fixed', bottom:28, right:28, zIndex:8000, width:46, height:46, borderRadius:'50%', background:'rgba(255,255,255,.9)', boxShadow:'0 4px 20px rgba(140,50,80,.2)', border:'1.5px solid #f7c6d9', cursor:'pointer', fontSize:19, backdropFilter:'blur(8px)' }}>
          ♬
        </button>
      )}
    </section>
  );
}
