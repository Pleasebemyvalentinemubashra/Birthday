import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { TapeDecoration } from '../components/TapeDecoration';
import { CTAButton } from '../components/CTAButton';
import { apiUrl } from '../utils/api';

const ROSE  = '#e89ab3';
const CREAM = '#fff6f2';

interface Memory {
  id: number;
  title: string;
  message: string;
  author: string;
  photo_name: string | null;
  created_at: string;
}

const ROTATIONS = [3, -2, 2, -3, 1, -1, 2.5, -1.5];

export function MemoryWallSection() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading,  setLoading]  = useState(true);

  // Form state
  const [title,    setTitle]   = useState('');
  const [message,  setMessage] = useState('');
  const [author,   setAuthor]  = useState('');
  const [file,     setFile]    = useState<File | null>(null);
  const [preview,  setPreview] = useState<string | null>(null);
  const [saving,   setSaving]  = useState(false);
  const [saved,    setSaved]   = useState(false);
  const [dragging, setDragging]= useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch(apiUrl('/api/memories'));
      setMemories(await r.json());
    } catch { /* offline */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('message', message.trim());
    fd.append('author', author.trim() || 'Anonymous');
    if (file) fd.append('photo', file);
    try {
      const r = await fetch(apiUrl('/api/memories'), { method: 'POST', body: fd });
      if ((await r.json()).id) {
        setTitle(''); setMessage(''); setAuthor(''); setFile(null); setPreview(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        load();
      }
    } catch { /* handle */ }
    setSaving(false);
  };

  return (
    <section id="memories" className="py-20 px-4"
      style={{ background: `linear-gradient(180deg,${CREAM} 0%,#fde8f5 50%,${CREAM} 100%)` }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm tracking-[.2em] uppercase mb-2" style={{ fontFamily: 'var(--font-serif)', color: ROSE }}>A Timeless Album</p>
          <h2 className="text-5xl mb-3" style={{ fontFamily: 'var(--font-handwritten)', color: ROSE }}>Leave a Memory</h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#9a6878' }}>
            Upload a photo and a note — it lives here forever ♡
          </p>
        </motion.div>

        {/* Upload form — paper card */}
        <motion.div
          className="mx-auto mb-14 relative rounded-lg px-8 py-8 max-w-xl"
          style={{ background: '#fefaf4', boxShadow: '0 20px 60px rgba(80,40,30,.18),inset 0 0 0 1px rgba(255,255,255,.6)', backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0,transparent 27px,rgba(200,170,140,.1) 27px,rgba(200,170,140,.1) 28px)' }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

          {/* Red margin line */}
          <div className="absolute left-14 top-6 bottom-4 w-px" style={{ background: 'rgba(220,100,100,.12)' }} />

          <h3 className="text-3xl mb-1" style={{ fontFamily: 'var(--font-handwritten)', color: ROSE }}>Add Your Memory</h3>
          <p className="text-xs mb-6" style={{ fontFamily: 'var(--font-serif)', color: '#b07890' }}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Title *">
              <input value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none transition-colors"
                style={{ background: 'rgba(253,248,242,.8)', border: '1.5px solid rgba(212,104,126,.2)', fontFamily: 'var(--font-serif)', color: '#3d2a22' }}
                placeholder="e.g. That road trip in June…" maxLength={120} required />
            </Field>

            <Field label="Your message">
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm outline-none transition-colors resize-none"
                style={{ background: 'rgba(253,248,242,.8)', border: '1.5px solid rgba(212,104,126,.2)', fontFamily: 'var(--font-serif)', color: '#3d2a22', height: 72 }}
                placeholder="What made this moment special?" maxLength={600} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Your name">
                <input value={author} onChange={e => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-md text-sm outline-none"
                  style={{ background: 'rgba(253,248,242,.8)', border: '1.5px solid rgba(212,104,126,.2)', fontFamily: 'var(--font-serif)', color: '#3d2a22' }}
                  placeholder="Anonymous" maxLength={60} />
              </Field>

              <Field label="Photo (optional)">
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                  className="w-full h-[72px] rounded-md flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-all"
                  style={{ border: `2px dashed ${dragging ? ROSE : 'rgba(212,104,126,.3)'}`, background: preview ? 'none' : 'rgba(253,240,245,.4)' }}
                >
                  {preview
                    ? <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-md" alt="preview" />
                    : <><span className="text-xl">📷</span><span className="text-xs mt-1" style={{ fontFamily: 'var(--font-serif)', color: '#b07890' }}>click or drag</span></>
                  }
                  {preview && (
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}
                      className="absolute top-1 right-1 bg-white/80 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      style={{ color: ROSE, border: `1px solid ${ROSE}` }}>✕</button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
              </Field>
            </div>

            <CTAButton onClick={() => {}} variant={saved ? 'secondary' : 'primary'}>
              {saved ? '✓ Memory saved!' : saving ? 'Saving… ♡' : 'Save Memory ♡'}
            </CTAButton>
          </form>

          {/* Wax seal */}
          <div className="absolute -bottom-5 right-8 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
            style={{ background: 'radial-gradient(circle,#b04e64,#8b3349)' }}>♡</div>
        </motion.div>

        {/* Memory grid */}
        <div className="text-center mb-8">
          <h3 className="text-4xl" style={{ fontFamily: 'var(--font-handwritten)', color: ROSE }}>
            {memories.length > 0 ? `${memories.length} Memories` : 'All Memories'}
          </h3>
        </div>

        {loading && (
          <p className="text-center" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#c090a0' }}>loading memories…</p>
        )}

        {!loading && memories.length === 0 && (
          <p className="text-center" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#c090a0' }}>
            Be the first to add a memory ✿
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {memories.map((m, i) => (
            <MemoryCard key={m.id} memory={m} rotation={ROTATIONS[i % ROTATIONS.length]} index={i} onDelete={load} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs mb-1.5" style={{ fontFamily: 'var(--font-serif)', color: '#b07890' }}>{label}</label>
      {children}
    </div>
  );
}

function MemoryCard({ memory, rotation, index, onDelete }: { memory: Memory; rotation: number; index: number; onDelete: () => void }) {
  const handleDelete = async (e: React.MouseEvent) => {
    if (!e.shiftKey) return;
    const key = prompt('Admin key to delete:');
    if (!key || !confirm('Delete permanently?')) return;
    await fetch(apiUrl(`/api/memories/${memory.id}`), { method: 'DELETE', headers: { 'x-admin-key': key } });
    onDelete();
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: .6, delay: index * .08 }}
      whileHover={{ y: -10, rotate: 0, transition: { duration: .3 } }}
      style={{ rotate: rotation }}
      onClick={handleDelete}
    >
      <div className="bg-white p-2.5 pb-10 shadow-xl relative">
        <TapeDecoration className="-top-2 left-1/2 -translate-x-1/2" rotation={-6} />
        {memory.photo_name
          ? <img src={`/uploads/${memory.photo_name}`} alt={memory.title} className="w-full object-cover" style={{ height: 160 }} loading="lazy" />
          : <div className="w-full flex items-center justify-center text-4xl" style={{ height: 160, background: 'linear-gradient(135deg,#fce4ef,#f8c0d0)' }}>✿</div>
        }
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-handwritten)', color: '#3d2a22' }}>{memory.title}</p>
          {memory.message && <p className="text-xs truncate mt-0.5" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#888' }}>{memory.message}</p>}
          <p className="text-xs mt-0.5" style={{ fontFamily: 'var(--font-handwritten)', color: ROSE }}>— {memory.author}</p>
        </div>
      </div>
    </motion.div>
  );
}
