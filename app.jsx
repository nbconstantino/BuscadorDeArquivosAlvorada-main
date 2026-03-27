import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Upload, 
  FileText, 
  LogOut, 
  Moon, 
  Sun, 
  Folder, 
  ChevronRight, 
  Download, 
  Image as ImageIcon,
  Film,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const API_BASE = 'https://bunny-proxy.onrender.com/api'; 
const PUBLIC_CDN = 'https://lojasalvorada.b-cdn.net';

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('search');
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [form, setForm] = useState({ user: '', pass: '', cap: '' });

  useEffect(() => {
    const session = localStorage.getItem('alvorada_session');
    if (session) setUser(JSON.parse(session));
    genCaptcha();
  }, []);

  const genCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (parseInt(form.cap) !== captcha.a) {
      setError('Captcha incorreto');
      genCaptcha();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.user, password: form.pass })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('alvorada_session', JSON.stringify(data));
      } else {
        setError(data.error);
        genCaptcha();
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-10 border dark:border-gray-800">
            <div className="text-center mb-10">
              <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png" className="h-16 mx-auto mb-4" alt="Loja Alvorada" />
              <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Painel Interno</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" placeholder="Usuário" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-red-500" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required />
              <input type="password" placeholder="Senha" className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-red-500" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                <span className="font-black text-red-600 dark:text-red-400">{captcha.q} =</span>
                <input type="number" placeholder="?" className="bg-transparent border-none outline-none w-full dark:text-white font-bold" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})} required />
              </div>
              {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}
              <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-red-600/20 active:scale-95">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : 'ENTRAR'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png" className="h-10 dark:hidden" />
              <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" className="h-10 hidden dark:block" />
              <nav className="hidden md:flex gap-4">
                <TabBtn active={tab === 'search'} onClick={() => setTab('search')} icon={<Search size={18}/>} label="Consultar" />
                {user.role === 'admin' && <TabBtn active={tab === 'carnes'} onClick={() => setTab('carnes')} icon={<FileText size={18}/>} label="Carnês" />}
                {['admin', 'editor'].includes(user.role) && <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')} icon={<Upload size={18}/>} label="Enviar" />}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-black text-gray-400 uppercase">{user.name}</span>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition">
                {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
              </button>
              <button onClick={() => { setUser(null); localStorage.removeItem('alvorada_session'); }} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition">
                <LogOut size={20}/>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6 lg:p-10">
          {tab === 'search' && <SearchContent user={user} />}
          {tab === 'carnes' && <CarnesContent user={user} />}
          {tab === 'upload' && <UploadContent user={user} />}
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function SearchContent({ user }) {
  const [q, setQ] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const search = async () => {
    if (!q) return;
    setLoading(true);
    let all = [];
    const paths = ['Fprodutos', 'VideosProdutos/Videos YT', 'VideosProdutos/Videos ML'];
    try {
      for (const p of paths) {
        const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(p)}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        const matches = Array.isArray(data) ? data.filter(f => f.ObjectName.toLowerCase().includes(q.toLowerCase())) : [];
        all = [...all, ...matches.map(f => ({ ...f, fullPath: `${p}/${f.ObjectName}` }))];
      }
      setFiles(all);
      setPage(1);
    } catch (e) { alert("Erro ao buscar."); }
    setLoading(false);
  };

  const paginated = files.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border dark:border-gray-800">
        <input className="flex-grow p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500" placeholder="SKU ou nome do produto..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
        <button onClick={search} className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-red-600/20">BUSCAR</button>
      </div>

      {loading && <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-red-600" size={48}/></div>}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {paginated.map((f, i) => <FileCard key={i} file={f} user={user} />)}
      </div>

      {files.length > perPage && (
        <div className="flex justify-center gap-4 mt-10">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-xl disabled:opacity-20 font-bold">Anterior</button>
          <span className="py-2 text-xs font-black text-gray-400">PÁGINA {page} DE {Math.ceil(files.length / perPage)}</span>
          <button disabled={page >= Math.ceil(files.length / perPage)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-xl disabled:opacity-20 font-bold">Próxima</button>
        </div>
      )}
    </div>
  );
}

function CarnesContent({ user }) {
  const [path, setPath] = useState('Carnes');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  const load = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(p)}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setPath(p);
    } catch (e) { alert("Erro ao abrir pasta."); }
    setLoading(false);
  };

  useEffect(() => { load('Carnes'); }, []);

  const filtered = items.filter(i => i.ObjectName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide text-sm">
        <Folder size={16} className="text-red-500"/>
        {path.split('/').map((p, i, arr) => (
          <React.Fragment key={i}>
            <button className="font-bold hover:underline" onClick={() => load(arr.slice(0, i+1).join('/'))}>{p}</button>
            {i < arr.length - 1 && <ChevronRight size={14} className="opacity-20"/>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border dark:border-gray-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b dark:border-gray-800">
          <input className="w-full p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm border-none outline-none" placeholder="Filtrar nesta pasta (datas, anos)..." value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        {loading ? <div className="p-20 text-center text-gray-400">Carregando...</div> : (
          <div className="divide-y dark:divide-gray-800">
            {filtered.map((it, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition" onClick={() => it.IsDirectory && load(`${path}/${it.ObjectName}`)}>
                <div className="flex items-center gap-3">
                  {it.IsDirectory ? <Folder className="text-yellow-500" /> : <FileText className="text-blue-500" />}
                  <span className="font-bold text-sm">{it.ObjectName}</span>
                </div>
                {!it.IsDirectory && <button onClick={(e) => { e.stopPropagation(); download(it.ObjectName, path, user); }} className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition"><Download size={18}/></button>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadContent({ user }) {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState('Fprodutos');
  const [up, setUp] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleUp = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUp(true);
    const form = new FormData();
    form.append('file', file);
    form.append('path', `${target}/${file.name}`);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: form
      });
      if (res.ok) { setMsg('Sucesso!'); setFile(null); }
      else setMsg('Erro no envio.');
    } catch (e) { setMsg('Erro de conexão.'); }
    setUp(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border dark:border-gray-800">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Upload className="text-red-600"/> Enviar Arquivo</h2>
      <form onSubmit={handleUp} className="space-y-6">
        <div>
          <label className="text-xs font-black uppercase text-gray-400 block mb-2 ml-1">Pasta de Destino</label>
          <select className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none font-bold" value={target} onChange={e => setTarget(e.target.value)}>
            <option value="Fprodutos">Fprodutos (Fotos)</option>
            <option value="VideosProdutos/Videos YT">Vídeos YT</option>
            <option value="VideosProdutos/Videos ML">Vídeos ML</option>
          </select>
        </div>
        <div className="border-4 border-dashed dark:border-gray-800 p-10 rounded-3xl text-center hover:border-red-500 transition cursor-pointer relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
          {file ? <p className="font-bold text-green-600">{file.name}</p> : <p className="text-gray-400">Arraste ou clique para selecionar</p>}
        </div>
        {msg && <p className="text-center font-bold text-red-500">{msg}</p>}
        <button disabled={!file || up} className="w-full bg-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-20">
          {up ? 'ENVIANDO...' : 'REALIZAR UPLOAD'}
        </button>
      </form>
    </div>
  );
}

function FileCard({ file, user }) {
  const url = `${PUBLIC_CDN}/${file.fullPath.split('/').map(encodeURIComponent).join('/')}`;
  const isVideo = ['mp4', 'mov'].includes(file.ObjectName.split('.').pop().toLowerCase());

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border dark:border-gray-800 group hover:shadow-xl transition relative">
      <div className="aspect-square bg-gray-100 dark:bg-gray-950 flex items-center justify-center relative overflow-hidden">
        {isVideo ? <Film className="text-gray-400" size={32}/> : <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
          <button onClick={() => window.open(url, '_blank')} className="p-2 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition"><ImageIcon size={18}/></button>
          <button onClick={() => download(file.ObjectName, file.fullPath.split('/').slice(0,-1).join('/'), user)} className="p-2 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition"><Download size={18}/></button>
        </div>
      </div>
      <p className="p-2 text-[10px] font-bold truncate dark:text-gray-400">{file.ObjectName}</p>
    </div>
  );
}

async function download(name, path, user) {
  try {
    const res = await fetch(`${API_BASE}/download?path=${encodeURIComponent(path + '/' + name)}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  } catch (e) { alert("Falha no download."); }
}