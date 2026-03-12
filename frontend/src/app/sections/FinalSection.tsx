import { motion } from 'motion/react';

const ROSE  = '#e89ab3';
const BLUSH = '#f7c6d9';

function FloatHeart({ delay, x, size }: { delay:number; x:string; size:number }) {
  return (
    <motion.div style={{ position:'absolute', bottom:-20, left:x, pointerEvents:'none' }}
      animate={{ y:[0,'-110vh'], opacity:[0,.7,.5,0], x:[0,15,-10,8,-5,0] }}
      transition={{ duration:6+delay, delay, repeat:Infinity, ease:'linear' }}>
      <svg viewBox="0 0 14 14" width={size} height={size}>
        <path d="M7,2 C4,2 2,4 2,6.5 C2,9.5 7,13 7,13 C7,13 12,9.5 12,6.5 C12,4 10,2 7,2Z" fill={delay%2===0?ROSE:BLUSH}/>
      </svg>
    </motion.div>
  );
}

interface FinalProps { recipient:string; sender:string }

export function FinalSection({ recipient, sender }: FinalProps) {
  return (
    <section style={{ minHeight:'70vh', padding:'72px 16px 80px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center',
      background:'linear-gradient(160deg,#fdf5e9 0%,#fce8f2 45%,#ede0f8 80%,#e8f0fa 100%)', position:'relative', overflow:'hidden' }}>

      {/* Floating hearts */}
      {Array.from({length:16}).map((_,i)=>(
        <FloatHeart key={i} delay={i*.55} x={`${6+(i*6.1)%88}%`} size={8+i%5*3}/>
      ))}
      {/* Torn paper top */}
      <div style={{ position:'absolute', top:-2, left:0, right:0, lineHeight:0 }}>
        <svg viewBox="0 0 1440 38" preserveAspectRatio="none" style={{ display:'block', width:'100%', height:38 }}>
          <path d="M0,22 Q90,6 180,20 Q270,30 360,12 Q450,0 540,20 Q630,32 720,12 Q810,0 900,22 Q990,34 1080,14 Q1170,0 1260,22 Q1350,36 1440,18 L1440,0 L0,0Z" fill="#f7ede0"/>
        </svg>
      </div>

      <motion.div style={{ position:'relative', zIndex:10 }}
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
        <motion.div animate={{ y:[0,-8,0] }} transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}>
          <svg viewBox="0 0 60 60" width={72} height={72} style={{ marginBottom:16 }}>
            <path d="M30,8 C18,8 8,18 8,28 C8,42 30,56 30,56 C30,56 52,42 52,28 C52,18 42,8 30,8Z" fill={ROSE} opacity=".9"/>
            <path d="M30,14 C22,14 14,20 14,28 C14,39 30,50 30,50 C30,50 46,39 46,28 C46,20 38,14 30,14Z" fill={BLUSH}/>
          </svg>
        </motion.div>

        <motion.p style={{ fontFamily:'var(--font-body)', fontSize:11, letterSpacing:'.35em', textTransform:'uppercase', color:ROSE, marginBottom:10 }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}>
          always and forever
        </motion.p>

        <motion.h2 style={{ fontFamily:'var(--font-handwritten)', fontSize:'clamp(42px,8vw,88px)', color:ROSE, lineHeight:1.1, marginBottom:16 }}
          initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          transition={{ duration:.8, ease:[.34,1.56,.64,1] }}>
          Happy Birthday<br/>{recipient} ♡
        </motion.h2>

        <div style={{ width:120, margin:'12px auto 20px' }}>
          <svg viewBox="0 0 120 14">
            <path d="M2,7 Q60,1 118,7" stroke={ROSE} strokeWidth="1.3" fill="none" opacity=".5"/>
            <circle cx="2"  cy="7" r="2.2" fill={ROSE} opacity=".45"/>
            <circle cx="60" cy="7" r="2.2" fill={ROSE} opacity=".45"/>
            <circle cx="118"cy="7" r="2.2" fill={ROSE} opacity=".45"/>
          </svg>
        </div>

        <motion.p style={{ fontFamily:'var(--font-body)', fontStyle:'italic', color:'#9a6878', fontSize:'clamp(14px,2.2vw,18px)', maxWidth:480, margin:'0 auto', lineHeight:1.8 }}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:.4 }}>
          Here's to every adventure ahead, every laugh we haven't shared yet,<br/>and every ordinary moment that becomes extraordinary with you.
        </motion.p>

        {sender && (
          <motion.p style={{ fontFamily:'var(--font-handwritten)', fontSize:22, color:ROSE, marginTop:20 }}
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:.7 }}>
            With love, {sender}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
