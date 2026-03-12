/**
 * GallerySection — Catalog / Memory Grid
 * Inspired by the Figma template catalog layout.
 * Shows all uploaded album photos in an editorial masonry grid.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { apiUrl } from '../utils/api';

interface Slot { slot_key:string; photo_name:string|null; caption:string }

const ROTS = [-3.2, 2.1, -1.4, 3.5, -2.6, 1.2, -2.1, 2.8, -0.8, 3.2];
const PLACEHOLDER_CAPS = [
  'Your first memory here ✿','A moment waiting to be added ♡','Something beautiful goes here',
  'Click the album above to add photos','A story worth telling','Your adventure here',
  'A memory to cherish','Your smile goes here ♡','Another chapter','Keep adding memories',
];

/* ── Lightbox ────────────────────────────────────── */
function Lightbox({ src, caption, onClose }: { src:string; caption:string; onClose:()=>void }) {
  return (
    <motion.div style={{ position:'fixed', inset:0, background:'rgba(20,8,12,.88)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)' }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}>
      <motion.div onClick={e=>e.stopPropagation()}
        style={{ background:'#fff', padding:12, paddingBottom:52, maxWidth:'min(88vw,720px)', boxShadow:'0 60px 120px rgba(0,0,0,.5)', position:'relative' }}
        initial={{ scale:.8, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:.8, opacity:0 }}
        transition={{ type:'spring', stiffness:240, damping:22 }}>
        <img src={src} alt={caption} style={{ display:'block', maxWidth:'100%', maxHeight:'75vh', objectFit:'contain' }}/>
        {caption && <p style={{ position:'absolute', bottom:14, left:0, right:0, textAlign:'center', fontFamily:'var(--font-handwritten)', fontSize:16, color:'#6a4050' }}>{caption}</p>}
        <button onClick={onClose} style={{ position:'absolute', top:8, right:12, background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#9a6878' }}>✕</button>
      </motion.div>
    </motion.div>
  );
}

export function GallerySection() {
  const [slots,    setSlots]   = useState<Slot[]>([]);
  const [lightbox, setLightbox]= useState<Slot|null>(null);

  useEffect(() => {
    fetch(apiUrl('/api/album')).then(r=>r.json()).then(setSlots).catch(()=>{});
  }, []);

  const real  = slots.filter(s => s.photo_name);
  const pads  = Math.max(0, 10 - real.length);
  const cards: {slot:Slot; isPlaceholder:boolean}[] = [
    ...real.map(s=>({slot:s,isPlaceholder:false})),
    ...Array.from({length:pads},(_,i)=>({ slot:{slot_key:`ph-${i}`,photo_name:null,caption:''},isPlaceholder:true })),
  ];

  return (
    <section style={{ padding:'72px 0 56px', background:'linear-gradient(180deg,#fdf5e9 0%,#fce8f2 45%,#fdf5e9 100%)', position:'relative', overflow:'hidden' }}>
      {/* Top torn edge */}
      <div style={{ position:'absolute', top:-2, left:0, right:0, lineHeight:0 }}>
        <svg viewBox="0 0 1440 32" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:32 }}>
          <path d="M0,16 Q90,4 180,16 Q270,26 360,10 Q450,0 540,16 Q630,28 720,10 Q810,0 900,16 Q990,28 1080,12 Q1170,0 1260,18 Q1350,30 1440,16 L1440,0 L0,0Z" fill="#fdf5e9"/>
        </svg>
      </div>
      {/* Ambient glow */}
      <motion.div style={{ position:'absolute', top:'40%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:500, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(232,154,179,.1) 0%,transparent 70%)', pointerEvents:'none' }}
        animate={{ scale:[1,1.2,1] }} transition={{ duration:5, repeat:Infinity }}/>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
        {/* Header */}
        <motion.div style={{ textAlign:'center', marginBottom:52 }}
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.35em', textTransform:'uppercase', color:'#b07890', marginBottom:8 }}>Our Collection</p>
          <h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:'clamp(38px,6vw,70px)', color:'#e89ab3', lineHeight:1.1, marginBottom:10 }}>Captured Moments</h2>
          <p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'#9a6878', fontSize:15, maxWidth:480, margin:'0 auto 16px' }}>A glimpse into our memory collection — photos you add to the album appear here</p>
          <svg viewBox="0 0 120 14" style={{ width:120 }}>
            <path d="M2,7 Q60,1 118,7" stroke="#e89ab3" strokeWidth="1.3" fill="none" opacity=".5"/>
            <circle cx="2"  cy="7" r="2.2" fill="#e89ab3" opacity=".45"/>
            <circle cx="60" cy="7" r="2.2" fill="#e89ab3" opacity=".45"/>
            <circle cx="118"cy="7" r="2.2" fill="#e89ab3" opacity=".45"/>
          </svg>
        </motion.div>

        {/* Masonry columns */}
        <div style={{ columns:'2 200px', columnGap:10, orphans:1, widows:1 }}>
          {cards.map(({slot,isPlaceholder},i) => (
            <div key={slot.slot_key+i} style={{ breakInside:'avoid', marginBottom:10 }}>
              <motion.div
                style={{ cursor:isPlaceholder?'default':'zoom-in' }}
                initial={{ opacity:0, y:48, rotate:ROTS[i%ROTS.length] }}
                whileInView={{ opacity:1, y:0, rotate:ROTS[i%ROTS.length] }}
                viewport={{ once:true, margin:'-50px' }}
                transition={{ duration:.7, delay:(i%4)*.07, ease:[.22,1,.36,1] }}
                whileHover={ !isPlaceholder ? { y:-14, rotate:0, transition:{duration:.3} } : {}}
                onClick={() => !isPlaceholder && slot.photo_name && setLightbox(slot)}>
                <div style={{ background:'#fff', padding:'7px 7px 0',
                  boxShadow: isPlaceholder ? '1px 3px 12px rgba(0,0,0,.06)' : '3px 8px 28px rgba(80,20,40,.2)',
                  position:'relative' }}>
                  {/* tape */}
                  <div style={{ position:'absolute', top:-9, left:'50%', transform:`translateX(-50%) rotate(${-7+(i%3)*5}deg)`, width:52, height:18, background:['rgba(255,255,255,.52)','rgba(247,198,217,.5)','rgba(217,198,247,.5)'][i%3], border:'1px solid rgba(255,255,255,.7)', backdropFilter:'blur(2px)' }}/>
                  {/* image */}
                  {!isPlaceholder && slot.photo_name ? (
                    <img src={`/uploads/${slot.photo_name}`} alt={slot.caption} loading="lazy"
                      style={{ display:'block', width:'100%', height: i%7===0?210:160, objectFit:'cover' }}/>
                  ) : (
                    <div style={{ width:'100%', height:i%7===0?210:160, background:isPlaceholder?'linear-gradient(135deg,rgba(247,198,217,.25),rgba(253,245,233,.8))':'linear-gradient(135deg,#fce4ef,#f8c0d4)',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5,
                      border:isPlaceholder?'1.5px dashed rgba(232,154,179,.28)':'none' }}>
                      <span style={{ fontSize:22, opacity:.35 }}>📷</span>
                    </div>
                  )}
                  {/* caption */}
                  <div style={{ height:38, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 6px' }}>
                    <p style={{ fontFamily:'var(--font-handwritten)', fontSize:11, color:'#7a5060', textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%', margin:0 }}>
                      {isPlaceholder ? PLACEHOLDER_CAPS[i%PLACEHOLDER_CAPS.length] : (slot.caption || 'untitled memory')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {real.length > 0 && (
          <motion.p style={{ textAlign:'center', marginTop:28, fontFamily:'var(--font-body)', fontStyle:'italic', color:'#b07890', fontSize:14 }}
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
            {real.length} memor{real.length===1?'y':'ies'} and counting ♡
          </motion.p>
        )}
      </div>

      {/* Bottom torn edge */}
      <div style={{ position:'absolute', bottom:-2, left:0, right:0, lineHeight:0 }}>
        <svg viewBox="0 0 1440 36" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:36 }}>
          <path d="M0,20 Q100,6 200,18 Q300,28 400,12 Q500,0 600,18 Q700,32 800,14 Q900,0 1000,20 Q1100,32 1200,14 Q1300,0 1440,20 L1440,36 L0,36Z" fill="#f7ede0"/>
        </svg>
      </div>

      <AnimatePresence>
        {lightbox && lightbox.photo_name && (
          <Lightbox src={`/uploads/${lightbox.photo_name}`} caption={lightbox.caption} onClose={()=>setLightbox(null)}/>
        )}
      </AnimatePresence>
    </section>
  );
}
