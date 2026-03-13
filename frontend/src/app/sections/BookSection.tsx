/**
 * BookSection — 3D Flip-Book with real page-curl physics
 *
 * The curl effect works by:
 *  1. rotateY driven by a motion value (0 → -180)
 *  2. A gradient shadow on the FRONT face that PEAKS at -90° (max opacity)
 *     simulating the paper bending away from the light source
 *  3. A matching gradient on the BACK face peaking at -90° from the other side
 *  4. A thin "page edge" strip that's opaque during mid-flip only
 *
 * Photo upload: each polaroid slot is a <label> wrapping a hidden <input type="file">
 * Diary: right page, auto-saves to /api/diary/:pageId every 1.2s after last keystroke
 */
import { useState, useRef, useCallback, useEffect, useId } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'motion/react';
import { apiUrl, getApiBase } from '../utils/api';

const ROSE  = '#e89ab3';
const BLUSH = '#f7c6d9';
const CREAM = '#fdf5e9';
const PAPER = '#fefaf4';
const PAPER2= '#f5ead8';

interface AlbumSlot { slot_key:string; photo_name:string|null; caption:string }

/* ─── Tape strip ─────────────────────────────────── */
const Tape = ({ rot=0, col='rgba(255,255,255,.52)' }: { rot?:number; col?:string }) => (
  <div style={{ position:'absolute', top:-9, left:'50%', transform:`translateX(-50%) rotate(${rot}deg)`, width:52, height:18, background:col, border:'1px solid rgba(255,255,255,.7)', backdropFilter:'blur(2px)', zIndex:4 }}/>
);

/* ─── Single polaroid upload slot ───────────────── */
function PolaroidSlot({ slotKey, slot, onSaved, onDeleted }: {
  slotKey:string; slot:AlbumSlot|null;
  onSaved:(key:string,pn:string,cap:string)=>void;
  onDeleted:(key:string)=>void;
}) {
  const uid       = useId();
  const [drag,  setDrag]  = useState(false);
  const [busy,  setBusy]  = useState(false);
  const [hover, setHover] = useState(false);
  const [cap,   setCap]   = useState(slot?.caption ?? '');
  const [editCap,setEditCap]=useState(false);
  useEffect(()=>{ setCap(slot?.caption??''); },[slot]);

  const idx = parseInt(slotKey.split(':')[1]??'0');
  const rot = [-3,2,-1.5,3,-2][idx%5];

  async function upload(file:File) {
    if (!file.type.startsWith('image/')) return;
    setBusy(true);
    const fd = new FormData();
    fd.append('photo', file);
    fd.append('caption', cap);
    try {
      const r = await fetch(apiUrl(`/api/album/${encodeURIComponent(slotKey)}`), { method:'POST', body:fd });
      const d = await r.json();
      if (d.ok) onSaved(slotKey, d.photoName, cap);
    } catch(_) {}
    setBusy(false);
  }

  async function saveCaption(v:string) {
    setCap(v);
    if (!slot) return;
    try {
      await fetch(apiUrl(`/api/album/${encodeURIComponent(slotKey)}/caption`), {
        method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({caption:v})
      });
      onSaved(slotKey, slot.photo_name!, v);
    } catch(_) {}
  }

  async function del() {
    if (!confirm('Remove this photo?')) return;
    try { await fetch(apiUrl(`/api/album/${encodeURIComponent(slotKey)}`), { method:'DELETE' }); onDeleted(slotKey); } catch(_){}
  }

  const hasPhoto = !!slot?.photo_name;

  return (
    <div style={{ position:'relative', transform:`rotate(${rot}deg)`, transition:'transform .3s' }}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <Tape rot={-6+idx*3.5}/>
      {/* Delete × */}
      <AnimatePresence>
        {hover && hasPhoto && (
          <motion.button initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.7}}
            style={{ position:'absolute', top:-11, right:-11, zIndex:10, width:22, height:22, borderRadius:'50%', background:'#c82050', border:'none', color:'#fff', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.3)' }}
            onClick={del}>✕</motion.button>
        )}
      </AnimatePresence>

      <label htmlFor={uid} style={{ cursor:busy?'wait':'pointer', display:'block' }}>
        <div style={{ background:'#fff', padding:'5px 5px 0', boxShadow:hasPhoto?'3px 6px 22px rgba(80,30,40,.2)':'1px 3px 10px rgba(0,0,0,.07)', transition:'box-shadow .3s' }}>
          {hasPhoto ? (
            <div style={{ position:'relative', overflow:'hidden' }}>
              <img src={`${getApiBase()}/uploads/${slot!.photo_name}`} alt={cap} loading="lazy"
                style={{ display:'block', width:'100%', height:88, objectFit:'cover', transition:'filter .3s' }}/>
              {/* hover overlay — "replace" */}
              <motion.div style={{ position:'absolute', inset:0, background:'rgba(50,10,20,.48)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0 }}
                whileHover={{ opacity:1 }}>
                <span style={{ color:'#fff', fontFamily:'var(--font-body)', fontSize:10, letterSpacing:'.12em' }}>replace ↑</span>
              </motion.div>
            </div>
          ) : (
            <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)upload(f);}}
              style={{ width:'100%', height:88, background:drag?`rgba(232,154,179,.15)`:`rgba(247,198,217,.07)`, border:`1.5px dashed ${drag?ROSE:'rgba(232,154,179,.3)'}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, transition:'all .2s' }}>
              {busy
                ? <motion.span style={{ fontSize:16, color:ROSE }} animate={{ rotate:360 }} transition={{ duration:.9, repeat:Infinity, ease:'linear' }}>◌</motion.span>
                : <><span style={{ fontSize:16, opacity:.3 }}>📷</span><span style={{ fontFamily:'var(--font-body)', fontSize:9, color:'#c0a0b0' }}>click to add</span></>
              }
            </div>
          )}
          <div style={{ height:27, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px' }}
            onClick={e=>{ if(hasPhoto){ e.preventDefault(); setEditCap(true); }}}>
            {editCap
              ? <input autoFocus value={cap} maxLength={80} style={{ width:'100%', border:'none', outline:'none', textAlign:'center', fontFamily:'var(--font-handwritten)', fontSize:10, color:'#6a4050', background:'transparent', borderBottom:'1px solid rgba(232,154,179,.4)' }}
                  onChange={e=>setCap(e.target.value)} onBlur={()=>{setEditCap(false);saveCaption(cap);}} onKeyDown={e=>{if(e.key==='Enter'){setEditCap(false);saveCaption(cap);}}}/>
              : <p style={{ fontFamily:'var(--font-handwritten)', fontSize:10, color:'#6a4050', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%', margin:0, cursor:hasPhoto?'text':'default' }}>
                  {cap||(hasPhoto?'— add caption —':'')}
                </p>
            }
          </div>
        </div>
      </label>
      <input id={uid} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{const f=e.target.files?.[0];if(f)upload(f);e.target.value='';}}/>
    </div>
  );
}

/* ─── Left page: 5 photo slots ──────────────────── */
function PhotoPage({ pi, slots, onSaved, onDeleted }: {
  pi:number; slots:Record<string,AlbumSlot>;
  onSaved:(k:string,p:string,c:string)=>void; onDeleted:(k:string)=>void
}) {
  const keys = Array.from({length:5},(_,i)=>`${pi}:${i}`);
  return (
    <div style={{ width:'100%', height:'100%', padding:'17px 13px 10px', background:PAPER,
      backgroundImage:'repeating-linear-gradient(to bottom,transparent 0,transparent 27px,rgba(200,170,140,.1) 27px,rgba(200,170,140,.1) 28px)', position:'relative', overflow:'hidden' }}>
      <div style={{ fontFamily:'var(--font-handwritten)', fontSize:11, color:ROSE, borderBottom:'1px dashed rgba(212,104,126,.18)', paddingBottom:4, marginBottom:9 }}>
        Memories {pi*5+1}–{pi*5+5}
      </div>
      <div style={{ marginBottom:7 }}>
        <PolaroidSlot slotKey={keys[0]} slot={slots[keys[0]]??null} onSaved={onSaved} onDeleted={onDeleted}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        {keys.slice(1).map(k=>(
          <PolaroidSlot key={k} slotKey={k} slot={slots[k]??null} onSaved={onSaved} onDeleted={onDeleted}/>
        ))}
      </div>
      <span style={{ position:'absolute', bottom:5, left:11, fontFamily:'var(--font-body)', fontSize:9, color:'#aaa', opacity:.5 }}>p.{String(pi*2+1).padStart(2,'0')}</span>
    </div>
  );
}

/* ─── Right page: diary ──────────────────────────── */
function DiaryPage({ pi }: { pi:number }) {
  const pid = `page-${pi}`;
  const [text,  setText] = useState('');
  const [saving,setSaving]=useState(false);
  const [saved, setSaved] =useState(false);
  const timer  = useRef<ReturnType<typeof setTimeout>>();
  const loaded = useRef(false);
  useEffect(()=>{
    if(loaded.current) return; loaded.current=true;
    fetch(apiUrl(`/api/diary/${pid}`)).then(r=>r.json()).then(d=>setText(d.body||'')).catch(()=>{});
  },[pid]);
  const change=(v:string)=>{
    setText(v); setSaved(false); clearTimeout(timer.current);
    timer.current=setTimeout(async()=>{
      setSaving(true);
      try{ await fetch(apiUrl(`/api/diary/${pid}`),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({body:v})}); setSaved(true); setTimeout(()=>setSaved(false),2200); }catch(_){}
      setSaving(false);
    },1200);
  };
  return (
    <div style={{ width:'100%', height:'100%', padding:'17px 15px 10px', background:PAPER2, position:'relative' }}>
      <div style={{ position:'absolute', top:11, left:0, right:0, height:13, opacity:.48, background:'repeating-linear-gradient(90deg,#f9a0bb 0,#f9a0bb 5px,#fcc8d8 5px,#fcc8d8 10px)' }}/>
      <div style={{ marginTop:18 }}>
        <div style={{ fontFamily:'var(--font-handwritten)', fontSize:13, color:ROSE, marginBottom:4 }}>Dear Diary ♡</div>
        <div style={{ fontFamily:'var(--font-body)', fontSize:9.5, color:'#b07890', marginBottom:8, fontStyle:'italic' }}>
          {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
        </div>
        <textarea value={text} onChange={e=>change(e.target.value)} maxLength={4000}
          placeholder={"Write your thoughts here...\n\nThis page is just for you."}
          style={{ width:'100%', height:285, resize:'none', border:'none', outline:'none', background:'transparent',
            fontFamily:'var(--font-handwritten)', fontSize:12.5, lineHeight:'27px', color:'#3d2a22',
            backgroundImage:'repeating-linear-gradient(to bottom,transparent 0,transparent 26px,rgba(200,170,140,.18) 26px,rgba(200,170,140,.18) 27px)',
            backgroundAttachment:'local', padding:'1px 0' }}/>
        <div style={{ fontFamily:'var(--font-body)', fontSize:9, color:saved?ROSE:'#cca0b0', textAlign:'right', fontStyle:'italic', transition:'color .4s', opacity:(saving||saved)?1:0, marginTop:2 }}>
          {saving?'saving…':saved?'✓ saved':''}
        </div>
      </div>
      <span style={{ position:'absolute', bottom:5, right:11, fontFamily:'var(--font-body)', fontSize:9, color:'#aaa', opacity:.5 }}>p.{String(pi*2+2).padStart(2,'0')}</span>
    </div>
  );
}

/* ─── Cover spread ───────────────────────────────── */
function CoverL({ name, age }: { name:string; age:number }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:24, background:`radial-gradient(ellipse at 50% 50%,#fff 0%,${CREAM} 100%)` }}>
      <div style={{ fontSize:26, color:ROSE, marginBottom:8 }}>✿</div>
      <p style={{ fontFamily:'var(--font-body)', fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'#b07090', margin:'0 0 8px' }}>A Memory Book</p>
      <h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:30, color:ROSE, lineHeight:1.1, margin:'0 0 8px' }}>For {name}</h2>
      <div style={{ width:40, height:1.5, background:'linear-gradient(to right,transparent,#c8a05a,transparent)', margin:'8px auto' }}/>
      <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', fontSize:11, color:'#8a6070', lineHeight:1.6, maxWidth:140 }}>every memory, every moment, all of it</p>
      <p style={{ fontSize:14, color:BLUSH, marginTop:12, letterSpacing:'.4em' }}>✾ ✾ ✾</p>
    </div>
  );
}
function CoverR({ age }: { age:number }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:24,
      background:'linear-gradient(140deg,#6a2840 0%,#943858 45%,#6a2840 100%)', position:'relative' }}>
      <div style={{ position:'absolute', inset:8, border:'1px solid rgba(255,255,255,.18)', borderRadius:4, pointerEvents:'none' }}/>
      <p style={{ fontFamily:'var(--font-body)', color:'rgba(255,255,255,.4)', fontSize:11, letterSpacing:'.3em', margin:'0 0 8px' }}>✿ ❀ ✾</p>
      <h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:40, color:'#fff', textShadow:'0 2px 12px rgba(0,0,0,.22)', lineHeight:1.05, margin:'0 0 6px' }}>Our Story</h2>
      <div style={{ width:44, height:1, background:'rgba(200,160,90,.55)', margin:'6px auto 10px' }}/>
      <p style={{ fontFamily:'var(--font-body)', color:'rgba(255,255,255,.7)', fontSize:12 }}>For Your {age}th Birthday</p>
      <motion.p style={{ fontFamily:'var(--font-body)', color:'rgba(255,255,255,.28)', fontSize:10, marginTop:20, letterSpacing:'.05em' }}
        animate={{ opacity:[.28,.8,.28] }} transition={{ duration:2, repeat:Infinity }}>turn the page →</motion.p>
    </div>
  );
}

/* ─── BOOK ──────────────────────────────────────── */
interface BookProps { name:string; age:number }

export function BookSection({ name, age }: BookProps) {
  const [slots,  setSlots] = useState<Record<string,AlbumSlot>>({});
  const [cur,    setCur]   = useState(0);
  const [busy,   setBusy]  = useState(false);
  const [dir,    setDir]   = useState<'fwd'|'back'>('fwd');
  const [curContent, setCurContent] = useState<{fl:React.ReactNode;fr:React.ReactNode;bl:React.ReactNode;br:React.ReactNode}|null>(null);
  const touchX = useRef(0);
  const flipY  = useMotionValue(0); // 0 = closed, -180 = fully flipped

  useEffect(()=>{
    fetch(apiUrl('/api/album')).then(r=>r.json()).then((arr:AlbumSlot[])=>{
      const m:Record<string,AlbumSlot>={};
      arr.forEach(s=>{ m[s.slot_key]=s; });
      setSlots(m);
    }).catch(()=>{});
  },[]);

  // Dynamic total spreads
  const maxPageIdx = Object.keys(slots).reduce((acc,k)=>{
    const pi=parseInt(k.split(':')[0]);
    return isNaN(pi)?acc:Math.max(acc,pi);
  },-1);
  const totalPages = maxPageIdx+2; // at least 1 blank spread beyond last filled
  const total = 1 + totalPages;   // +1 for cover

  /* shadow opacity peaks at 90° of rotation:
     flipY 0 → shadow 0
     flipY -90 → shadow 0.55 (paper bent away from light)
     flipY -180 → shadow 0                                 */
  const frontShadow = useTransform(flipY,
    [0, -45, -90, -135, -180],
    [0,  0.3, 0.55,  0.3,    0]
  );
  const backShadow  = useTransform(flipY,
    [-180, -135, -90, -45, 0],
    [0,     0.3, 0.55,  0.3, 0]
  );
  const edgeOp = useTransform(flipY,
    [0, -8, -80, -100, -172, -180],
    [0,  0.8,  0.8,  0.8,  0.8,    0]
  );

  const L = useCallback((i:number)=>{
    if(i===0) return <CoverL name={name} age={age}/>;
    return <PhotoPage pi={i-1} slots={slots}
      onSaved={(k,p,c)=>setSlots(prev=>({...prev,[k]:{slot_key:k,photo_name:p,caption:c}}))}
      onDeleted={k=>setSlots(prev=>{const n={...prev};delete n[k];return n;})}/>;
  },[name,age,slots]);
  const R = useCallback((i:number)=>{
    if(i===0) return <CoverR age={age}/>;
    return <DiaryPage pi={i-1}/>;
  },[age]);

  const CUBIC:[number,number,number,number] = [0.645,0.045,0.355,1.0];

  const flip = useCallback((d:'fwd'|'back')=>{
    if(busy) return;
    if(d==='fwd' && cur>=total-1) return;
    if(d==='back'&& cur<=0)       return;
    setBusy(true); setDir(d);
    const next = d==='fwd' ? cur+1 : cur-1;

    if(d==='fwd'){
      // front = current right page, back = next left page
      setCurContent({ fl:L(cur), fr:R(cur), bl:L(next), br:R(next) });
      flipY.set(0);
      animate(flipY,-180,{ duration:.92, ease:CUBIC }).then(()=>{
        setCur(next); flipY.set(0); setCurContent(null); setBusy(false);
      });
    } else {
      // backward — flipper starts fully rotated
      setCurContent({ fl:L(cur), fr:R(cur), bl:L(next), br:R(next) });
      flipY.set(-180);
      requestAnimationFrame(()=>{
        animate(flipY,0,{ duration:.92, ease:CUBIC }).then(()=>{
          setCur(next); flipY.set(0); setCurContent(null); setBusy(false);
        });
      });
    }
  },[busy,cur,total,flipY,L,R]);

  const BOOK_H = 490;

  return (
    <section id="album" style={{ minHeight:'100vh', padding:'72px 16px 60px', display:'flex', flexDirection:'column', alignItems:'center',
      background:`linear-gradient(180deg,#f7ede0 0%,${BLUSH} 55%,#f7ede0 100%)` }}>

      <motion.p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.32em', textTransform:'uppercase', color:ROSE, marginBottom:8 }}
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>Our Memory Book</motion.p>
      <motion.h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:'clamp(34px,5.5vw,62px)', color:ROSE, textAlign:'center', marginBottom:6 }}
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>The Album</motion.h2>
      <motion.p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'#c090a0', fontSize:13, textAlign:'center', marginBottom:30 }}
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
        Click any polaroid frame to add your photo · write in the diary on the right
      </motion.p>

      <div style={{ perspective:'2800px', width:'min(840px,96vw)', position:'relative' }}
        onTouchStart={e=>{ touchX.current=e.touches[0].clientX; }}
        onTouchEnd={e=>{ const dx=e.changedTouches[0].clientX-touchX.current; if(Math.abs(dx)>55) flip(dx<0?'fwd':'back'); }}>

        {/* Leather cover shadow */}
        <div style={{ position:'absolute', inset:'-10px -18px -12px -22px', borderRadius:12,
          background:'linear-gradient(145deg,#5e2234 0%,#8a3450 40%,#5e2234 100%)',
          boxShadow:'-12px 0 30px rgba(0,0,0,.38),14px 14px 55px rgba(70,18,28,.38)', zIndex:0, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:.07,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:'110px' }}/>
          <div style={{ position:'absolute', inset:9, border:'1px solid rgba(255,255,255,.1)', borderRadius:7 }}/>
          <div style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%) rotate(-90deg)', fontFamily:'var(--font-handwritten)', fontSize:11, color:'rgba(255,255,255,.25)', whiteSpace:'nowrap', letterSpacing:'.1em' }}>Our Story ♡</div>
        </div>

        {/* Paper stack edge */}
        <div style={{ position:'absolute', bottom:-6, left:'2%', right:'2%', height:6, zIndex:1, borderRadius:'0 0 2px 2px', background:'repeating-linear-gradient(to right,#ddc8b0 0,#ddc8b0 1.5px,#f0e0d0 1.5px,#f0e0d0 3px)' }}/>

        {/* Book face */}
        <div style={{ position:'relative', zIndex:10, display:'flex', height:BOOK_H, borderRadius:4, boxShadow:'0 10px 44px rgba(0,0,0,.2)' }}>

          {/* LEFT static — hidden while flipper is showing the back face */}
          <div style={{ flex:1, maxWidth:'calc(50% - 15px)', overflow:'hidden', borderRadius:'4px 0 0 4px',
            visibility: (curContent && dir==='back') ? 'hidden' : 'visible' }}>
            {curContent ? L(cur) : L(cur)}
          </div>

          {/* SPINE */}
          <div style={{ flexShrink:0, width:30, zIndex:30,
            background:'linear-gradient(to right,#5e2234 0%,#8a3450 30%,#b08090 50%,#8a3450 70%,#5e2234 100%)',
            boxShadow:'3px 0 14px rgba(0,0,0,.22),-3px 0 14px rgba(0,0,0,.18)' }}>
            <div style={{ position:'absolute', left:0, right:0, height:1, top:'50%', background:'linear-gradient(to right,transparent,rgba(200,160,90,.5),transparent)' }}/>
          </div>

          {/* RIGHT side */}
          <div style={{ position:'relative', flex:1, maxWidth:'calc(50% - 15px)', borderRadius:'0 4px 4px 0', overflow:'visible' }}>
            {/* Background peek — next page */}
            <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'0 4px 4px 0', zIndex:1 }}>
              {cur<total-1 ? R(cur+1) : <div style={{ width:'100%', height:'100%', background:PAPER2 }}/>}
            </div>

            {/* Flipper */}
            {curContent && (
              <motion.div style={{ position:'absolute', inset:0, transformOrigin:'left center', transformStyle:'preserve-3d', rotateY:flipY, zIndex:20 }}>
                {/* FRONT — current right page */}
                <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', overflow:'hidden', borderRadius:'0 4px 4px 0' }}>
                  {curContent.fr}
                  {/* Curl shadow gradient — darkens as page bends away */}
                  <motion.div style={{ position:'absolute', inset:0, background:'linear-gradient(to left, rgba(0,0,0,.62) 0%, rgba(0,0,0,.28) 30%, transparent 65%)', opacity:frontShadow, pointerEvents:'none' }}/>
                  {/* Thin bright edge strip at fold */}
                  <motion.div style={{ position:'absolute', top:0, bottom:0, left:0, width:4, background:'linear-gradient(to right,rgba(240,210,180,.9),transparent)', opacity:edgeOp, pointerEvents:'none' }}/>
                </div>
                {/* BACK — next left page (mirrored) */}
                <div style={{ position:'absolute', inset:0, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', overflow:'hidden', borderRadius:'4px 0 0 4px' }}>
                  {curContent.bl}
                  {/* Curl shadow on back */}
                  <motion.div style={{ position:'absolute', inset:0, background:'linear-gradient(to right, rgba(0,0,0,.62) 0%, rgba(0,0,0,.28) 30%, transparent 65%)', opacity:backShadow, pointerEvents:'none' }}/>
                  <motion.div style={{ position:'absolute', top:0, bottom:0, right:0, width:4, background:'linear-gradient(to left,rgba(240,210,180,.9),transparent)', opacity:edgeOp, pointerEvents:'none' }}/>
                </div>
              </motion.div>
            )}

            {/* Static right page (idle state) */}
            {!curContent && (
              <div style={{ position:'absolute', inset:0, borderRadius:'0 4px 4px 0', overflow:'hidden', zIndex:10 }}>
                {R(cur)}
                {/* Page-curl hint */}
                <div style={{ position:'absolute', bottom:0, right:0, width:30, height:30, pointerEvents:'none', background:'radial-gradient(ellipse at 100% 100%,rgba(0,0,0,.1) 0%,transparent 70%)', borderRadius:'0 0 4px 0' }}/>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', alignItems:'center', gap:18, marginTop:18 }}>
        <NavBtn disabled={cur===0}      onClick={()=>flip('back')}>‹</NavBtn>
        <div style={{ display:'flex', gap:7 }}>
          {Array.from({length:total}).map((_,i)=>(
            <motion.div key={i} animate={{ scale:i===cur?1.35:1 }}
              style={{ width:8, height:8, borderRadius:'50%', background:i===cur?ROSE:BLUSH, cursor:'pointer' }}
              onClick={()=>!busy&&i!==cur&&flip(i>cur?'fwd':'back')}/>
          ))}
        </div>
        <NavBtn disabled={cur===total-1} onClick={()=>flip('fwd')}>›</NavBtn>
      </div>
      <p style={{ marginTop:10, fontFamily:'var(--font-body)', fontStyle:'italic', color:'#d4a0b0', fontSize:12, textAlign:'center' }}>
        Swipe on mobile · click dots to jump pages
      </p>
    </section>
  );
}

function NavBtn({ children,onClick,disabled }: { children:React.ReactNode; onClick:()=>void; disabled:boolean }) {
  return (
    <motion.button onClick={onClick} disabled={disabled}
      style={{ width:40, height:40, borderRadius:'50%', border:`2px solid ${ROSE}`, color:ROSE, background:CREAM, fontSize:20, fontWeight:'bold', display:'flex', alignItems:'center', justifyContent:'center', cursor:disabled?'not-allowed':'pointer', opacity:disabled?.2:1 }}
      whileHover={!disabled?{ background:ROSE, color:'#fff', scale:1.1 }:{}}
      whileTap={!disabled?{ scale:.92 }:{}}>
      {children}
    </motion.button>
  );
}
