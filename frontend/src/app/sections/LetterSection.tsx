/**
 * LetterSection — Editable love letter
 * - Fetches saved content from /api/letter
 * - Shows remaining time until next edit if already edited today
 * - In edit mode: name field + rich textarea with lined paper
 * - Typewriter animation in display mode
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ROSE  = '#e89ab3';
const PAPER = '#fdf5e9';
const INK   = '#3d2a22';

const DEFAULT_LETTER = `Today is all about you — a chance to celebrate everything you are and everything you mean to me.

You fill every ordinary moment with something extraordinary. Your laugh, your warmth, the way you see the world... all of it has changed mine forever.

I made this little corner of the internet just for you, because you deserve more than words can hold. But I'll keep trying anyway.

Happy Birthday, my love. Here's to every beautiful chapter ahead.`;

function useTypewriter(text:string, active:boolean, speed=28) {
  const [displayed, setDisplayed] = useState('');
  const [done,      setDone]      = useState(false);
  const i = useRef(0);
  useEffect(()=>{
    if(!active){ setDisplayed(''); i.current=0; setDone(false); return; }
    setDisplayed(''); i.current=0; setDone(false);
    const tick=()=>{
      if(i.current>=text.length){ setDone(true); return; }
      const ch = text[i.current];
      setDisplayed(prev=>prev+ch);
      i.current++;
      const delay = /[.!?]/.test(ch) ? speed*5 : /[,;]/.test(ch) ? speed*2 : speed*(0.8+Math.random()*.7);
      setTimeout(tick, delay);
    };
    tick();
  },[text, active, speed]);
  return { displayed, done };
}

/* ── Countdown until next edit ────────────────────── */
function Countdown({ nextISO }: { nextISO:string }) {
  const [left, setLeft] = useState('');
  useEffect(()=>{
    const calc=()=>{
      const ms = new Date(nextISO).getTime() - Date.now();
      if(ms<=0){ setLeft('Available now'); return; }
      const h=Math.floor(ms/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000);
      setLeft(`${h}h ${m}m ${s}s`);
    };
    calc();
    const t=setInterval(calc,1000);
    return ()=>clearInterval(t);
  },[nextISO]);
  return <span>{left}</span>;
}

interface LetterData { name:string; body:string; canEdit:boolean; nextEditISO:string|null }

export function LetterSection() {
  const [data,    setData]    = useState<LetterData|null>(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [inView,  setInView]  = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(()=>{
    fetch('/api/letter').then(r=>r.json()).then(setData).catch(()=>{});
  },[]);

  useEffect(()=>{
    if(!sectionRef.current) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setInView(true); obs.disconnect(); } },{ threshold:.25 });
    obs.observe(sectionRef.current);
    return ()=>obs.disconnect();
  },[]);

  const letterText = data?.body || DEFAULT_LETTER;
  const recipientName = data?.name || 'My Love';
  const { displayed, done } = useTypewriter(letterText, inView && !editing);

  const startEdit = () => {
    setDraftName(data?.name || '');
    setDraftBody(data?.body || DEFAULT_LETTER);
    setEditing(true);
    setError('');
  };

  const save = async () => {
    setSaving(true); setError('');
    try {
      const r = await fetch('/api/letter',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ name:draftName, body:draftBody }) });
      if (r.status===403){ const d=await r.json(); setError(`You've already edited today. Next edit: `); setData(prev=>prev?{...prev,canEdit:false,nextEditISO:d.nextEditISO}:null); setEditing(false); }
      else { const updated = await fetch('/api/letter').then(x=>x.json()); setData(updated); setEditing(false); }
    } catch(_){ setError('Failed to save. Try again.'); }
    setSaving(false);
  };

  return (
    <section ref={sectionRef} style={{ minHeight:'80vh', padding:'80px 16px 72px', display:'flex', flexDirection:'column', alignItems:'center',
      background:`linear-gradient(160deg,#fdf5e9 0%,#fce8f2 40%,#ede0f8 75%,#fdf5e9 100%)`, position:'relative', overflow:'hidden' }}>

      {/* Ambient blobs */}
      <motion.div style={{ position:'absolute', top:'20%', left:'5%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(247,198,217,.2) 0%,transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} animate={{ scale:[1,1.15,1] }} transition={{ duration:5, repeat:Infinity }}/>
      <motion.div style={{ position:'absolute', bottom:'15%', right:'8%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,198,247,.18) 0%,transparent 70%)', filter:'blur(50px)', pointerEvents:'none' }} animate={{ scale:[1,1.2,1] }} transition={{ duration:7, repeat:Infinity, delay:1.5 }}/>

      {/* Torn paper top */}
      <div style={{ position:'absolute', top:-2, left:0, right:0, lineHeight:0 }}>
        <svg viewBox="0 0 1440 38" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:38 }}>
          <path d="M0,22 Q90,8 180,18 Q270,28 360,12 Q450,0 540,18 Q630,30 720,12 Q810,0 900,20 Q990,32 1080,14 Q1170,2 1260,20 Q1350,34 1440,18 L1440,0 L0,0Z" fill="#f7ede0"/>
        </svg>
      </div>

      {/* Header */}
      <motion.p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.35em', textTransform:'uppercase', color:ROSE, marginBottom:10 }}
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>A Letter For You</motion.p>
      <motion.h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:'clamp(36px,5.5vw,64px)', color:ROSE, textAlign:'center', marginBottom:32 }}
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
        From the Heart
      </motion.h2>

      {/* Letter card */}
      <motion.div style={{ width:'min(680px,96vw)', position:'relative' }}
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>

        {/* Red margin line */}
        <div style={{ position:'absolute', left:54, top:0, bottom:0, width:1.5, background:'rgba(220,80,80,.25)', zIndex:1 }}/>
        {/* Spiral holes */}
        {Array.from({length:7}).map((_,i)=>(
          <div key={i} style={{ position:'absolute', left:14, top:`${8+i*13.5}%`, width:14, height:14, borderRadius:'50%', border:'1.5px solid rgba(180,120,100,.2)', background:'rgba(255,255,255,.6)', zIndex:2 }}/>
        ))}

        {/* Tape decorations on corner */}
        <div style={{ position:'absolute', top:-10, right:18, transform:'rotate(12deg)', width:60, height:20, background:'rgba(247,198,217,.5)', border:'1px solid rgba(255,255,255,.7)', backdropFilter:'blur(3px)', zIndex:3 }}/>
        <div style={{ position:'absolute', top:-10, left:18, transform:'rotate(-8deg)', width:60, height:20, background:'rgba(217,198,247,.5)', border:'1px solid rgba(255,255,255,.7)', backdropFilter:'blur(3px)', zIndex:3 }}/>

        {/* Paper body */}
        <div style={{ background:PAPER, padding:'44px 40px 40px 72px',
          backgroundImage:'repeating-linear-gradient(to bottom,transparent 0,transparent 31px,rgba(180,140,100,.12) 31px,rgba(180,140,100,.12) 32px)',
          boxShadow:'0 20px 60px rgba(80,30,40,.18), 2px 4px 8px rgba(0,0,0,.05)',
          position:'relative' }}>

          <AnimatePresence mode="wait">
            {editing ? (
              /* ── EDIT MODE ── */
              <motion.div key="edit" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                {/* Recipient name input */}
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontFamily:'var(--font-body)', fontSize:11, color:'#b07890', letterSpacing:'.1em', textTransform:'uppercase', display:'block', marginBottom:5 }}>To:</label>
                  <input value={draftName} onChange={e=>setDraftName(e.target.value)} maxLength={100}
                    placeholder="Your girlfriend's name"
                    style={{ width:'100%', fontFamily:'var(--font-handwritten)', fontSize:22, color:ROSE, background:'transparent', border:'none', borderBottom:`2px solid rgba(232,154,179,.4)`, outline:'none', paddingBottom:4, lineHeight:1.2 }}/>
                </div>

                {/* Letter body */}
                <label style={{ fontFamily:'var(--font-body)', fontSize:11, color:'#b07890', letterSpacing:'.1em', textTransform:'uppercase', display:'block', marginBottom:8 }}>Letter:</label>
                <textarea value={draftBody} onChange={e=>setDraftBody(e.target.value)} maxLength={5000}
                  style={{ width:'100%', minHeight:240, resize:'vertical', background:'transparent', border:'none', outline:'none',
                    fontFamily:'var(--font-handwritten)', fontSize:14.5, lineHeight:'32px', color:INK,
                    backgroundImage:'repeating-linear-gradient(to bottom,transparent 0,transparent 31px,rgba(180,140,100,.1) 31px,rgba(180,140,100,.1) 32px)',
                    backgroundAttachment:'local' }}/>

                {error && (
                  <p style={{ fontFamily:'var(--font-body)', fontSize:12, color:'#c82050', marginTop:6, fontStyle:'italic' }}>
                    {error}{data?.nextEditISO && <Countdown nextISO={data.nextEditISO}/>}
                  </p>
                )}

                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                  <motion.button onClick={save} disabled={saving}
                    style={{ padding:'10px 28px', borderRadius:999, background:`linear-gradient(135deg,${ROSE},#b04e64)`, color:'#fff', fontFamily:'var(--font-serif)', fontSize:14, border:'none', cursor:saving?'wait':'pointer', boxShadow:'0 4px 20px rgba(232,154,179,.4)' }}
                    whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}>
                    {saving ? 'Saving…' : 'Save Letter ♡'}
                  </motion.button>
                  <motion.button onClick={()=>setEditing(false)}
                    style={{ padding:'10px 20px', borderRadius:999, background:'transparent', color:'#9a6878', fontFamily:'var(--font-serif)', fontSize:14, border:`1px solid rgba(232,154,179,.4)`, cursor:'pointer' }}
                    whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}>
                    Cancel
                  </motion.button>
                </div>

                <p style={{ marginTop:12, fontFamily:'var(--font-body)', fontStyle:'italic', color:'#b07890', fontSize:11 }}>
                  ⚠ You can only edit this letter once per day.
                </p>
              </motion.div>
            ) : (
              /* ── DISPLAY MODE ── */
              <motion.div key="display" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <p style={{ fontFamily:'var(--font-handwritten)', fontSize:24, color:ROSE, marginBottom:18 }}>
                  Dear {recipientName},
                </p>
                <div style={{ fontFamily:'var(--font-handwritten)', fontSize:15, lineHeight:'32px', color:INK, minHeight:180, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                  {inView ? displayed : letterText}
                  {!done && inView && (
                    <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:.7, repeat:Infinity }} style={{ color:ROSE }}>|</motion.span>
                  )}
                </div>
                {done && (
                  <motion.p style={{ textAlign:'right', fontFamily:'var(--font-handwritten)', fontSize:18, color:ROSE, marginTop:20 }}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}>
                    With all my love ♡
                  </motion.p>
                )}

                {/* Edit button */}
                <div style={{ marginTop:22, display:'flex', alignItems:'center', gap:12, justifyContent:'flex-end' }}>
                  {data?.canEdit ? (
                    <motion.button onClick={startEdit}
                      style={{ padding:'9px 22px', borderRadius:999, background:'transparent', color:ROSE, fontFamily:'var(--font-serif)', fontSize:13, border:`1.5px solid rgba(232,154,179,.5)`, cursor:'pointer' }}
                      whileHover={{ background:ROSE, color:'#fff', scale:1.05 }} whileTap={{ scale:.95 }}>
                      ✎ Edit Letter
                    </motion.button>
                  ) : data?.nextEditISO ? (
                    <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'#c0a0b0', fontSize:12 }}>
                      Next edit available in <Countdown nextISO={data.nextEditISO}/>
                    </p>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
