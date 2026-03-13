import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SiteConfig, defaultConfig, fetchConfig } from './config';
import { HeroSection }    from './sections/HeroSection';
import { GallerySection } from './sections/GallerySection';
import { BookSection }    from './sections/BookSection';
import { LetterSection }  from './sections/LetterSection';
import { CakeCandleSection } from './sections/CakeCandleSection';
import { FinalSection }   from './sections/FinalSection';
import { PolaroidCard }   from './components/PolaroidCard';

/* ─── Story intro ───────────────────────────────── */
const STORY_IMGS = [
  { src:'https://images.unsplash.com/photo-1636886556199-6aa6988c6323?w=500&q=80', cap:'Our first adventure' },
  { src:'https://images.unsplash.com/photo-1631609473077-67318e84b31c?w=500&q=80', cap:'Hand in hand, forever' },
  { src:'https://images.unsplash.com/photo-1599331426174-6fffc9c614fe?w=500&q=80', cap:'Sunset dreams' },
];

function StoryIntro({ recipient }: { recipient:string }) {
  return (
    <section style={{ padding:'80px 24px', background:'#fdf5e9', position:'relative', overflow:'hidden' }}>
      {/* Subtle polka-dot pattern */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 1px 1px,rgba(232,154,179,.07) 1px,transparent 0)', backgroundSize:'32px 32px', pointerEvents:'none' }}/>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:64, alignItems:'center' }}>
        {/* Photo collage */}
        <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:'-100px' }} transition={{ duration:.9 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div style={{ gridColumn:'1 / -1' }}>
              <PolaroidCard image={STORY_IMGS[0].src} caption={STORY_IMGS[0].cap} rotation={-3}/>
            </div>
            <PolaroidCard image={STORY_IMGS[1].src} rotation={2}  delay={.2}/>
            <PolaroidCard image={STORY_IMGS[2].src} rotation={-2} delay={.3}/>
          </div>
        </motion.div>
        {/* Text */}
        <motion.div initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:'-100px' }} transition={{ duration:.9, delay:.2 }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.32em', textTransform:'uppercase', color:'#b07890', marginBottom:12 }}>Our Beautiful Journey</p>
          <h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:'clamp(36px,5vw,58px)', color:'#e89ab3', lineHeight:1.1, marginBottom:20 }}>Every Chapter Matters</h2>
          {/* Ink rule */}
          <div style={{ width:80, height:1.5, background:'linear-gradient(to right,#c8a05a,transparent)', marginBottom:20 }}/>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(14px,1.8vw,17px)', color:'#6a4050', lineHeight:1.85, marginBottom:16, fontStyle:'italic' }}>
            This scrapbook holds the most precious moments we've shared together.
            Each photograph tells a story of laughter, love, and unforgettable memories
            that have shaped our journey, {recipient}.
          </p>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'clamp(14px,1.8vw,17px)', color:'#6a4050', lineHeight:1.85 }}>
            From spontaneous adventures to quiet moments of joy, every memory here
            is a reminder of why you mean the world to me.
          </p>
          <div style={{ marginTop:28, display:'flex', gap:14, flexWrap:'wrap' }}>
            {['Every laugh','Every adventure','Every quiet moment'].map((t,i)=>(
              <motion.span key={t}
                style={{ padding:'7px 16px', borderRadius:999, border:'1px solid rgba(232,154,179,.4)', fontFamily:'var(--font-body)', fontSize:12, color:'#b07890', background:'rgba(247,198,217,.1)', cursor:'default' }}
                initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.3+i*.08 }}>
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Section divider ───────────────────────────── */
function Divider({ color='#fdf5e9' }: { color?:string }) {
  return (
    <div style={{ lineHeight:0, background:'transparent' }}>
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:28 }}>
        <path d="M0,16 Q120,4 240,14 Q360,24 480,10 Q600,0 720,14 Q840,24 960,10 Q1080,0 1200,16 Q1320,26 1440,16 L1440,28 L0,28Z" fill={color}/>
      </svg>
    </div>
  );
}

/* ─── Custom cursor ─────────────────────────────── */
function Cursor() {
  const big   = useRef<HTMLDivElement>(null);
  const small = useRef<HTMLDivElement>(null);
  const mx=useRef(0), my=useRef(0), cx=useRef(0), cy=useRef(0);
  useEffect(()=>{
    const mv=(e:MouseEvent)=>{ mx.current=e.clientX; my.current=e.clientY; if(small.current){small.current.style.left=mx.current+'px';small.current.style.top=my.current+'px';} };
    document.addEventListener('mousemove',mv);
    let raf:number;
    const tick=()=>{
      cx.current+=(mx.current-cx.current)*.1; cy.current+=(my.current-cy.current)*.1;
      if(big.current){big.current.style.left=cx.current+'px';big.current.style.top=cy.current+'px';}
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return ()=>{ document.removeEventListener('mousemove',mv); cancelAnimationFrame(raf); };
  },[]);
  return (
    <>
      <div ref={big}   style={{ position:'fixed',width:22,height:22,borderRadius:'50%',background:'rgba(232,154,179,.25)',pointerEvents:'none',zIndex:9997,transform:'translate(-50%,-50%)',mixBlendMode:'multiply',transition:'transform .15s' }}/>
      <div ref={small} style={{ position:'fixed',width:5,height:5,borderRadius:'50%',background:'#e89ab3',pointerEvents:'none',zIndex:9998,transform:'translate(-50%,-50%)' }}/>
    </>
  );
}

/* ─── Scroll progress bar ───────────────────────── */
function ScrollBar() {
  const [pct, setPct]=useState(0);
  useEffect(()=>{
    const fn=()=>{ const max=document.documentElement.scrollHeight-window.innerHeight; setPct(max?window.scrollY/max*100:0); };
    window.addEventListener('scroll',fn,{passive:true});
    return ()=>window.removeEventListener('scroll',fn);
  },[]);
  return <motion.div style={{ position:'fixed',top:0,left:0,height:2.5,background:'linear-gradient(to right,#e89ab3,#b04e64)',zIndex:9999,width:`${pct}%`,transformOrigin:'left' }}/>;
}

export default function App() {
  const [cfg, setCfg] = useState<SiteConfig>(defaultConfig);
  useEffect(()=>{
    fetchConfig().then(c=>{ setCfg(c); document.title=`Happy ${c.age}th Birthday, ${c.recipient}! ♡`; });
  },[]);

  return (
    <div style={{ minHeight:'100vh', overflowX:'hidden', cursor:'none', fontFamily:'var(--font-body)' }}>
      <Cursor/>
      <ScrollBar/>

      <HeroSection
        recipient={cfg.recipient} age={cfg.age}
        onCTA={()=>document.getElementById('album')?.scrollIntoView({behavior:'smooth'})}
        musicUrl={cfg.musicUrl}/>

      <StoryIntro recipient={cfg.recipient}/>

      <GallerySection/>

      <BookSection name={cfg.recipient} age={cfg.age}/>

      <LetterSection/>

      <CakeCandleSection age={cfg.age} recipient={cfg.recipient}/>

      <FinalSection recipient={cfg.recipient} sender={cfg.sender}/>
    </div>
  );
}
