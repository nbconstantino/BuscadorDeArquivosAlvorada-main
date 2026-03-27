import React, { useState, useEffect, useMemo } from 'react';

// --- CONFIGURAÇÃO ---
const API_BASE = 'https://bunny-proxy.onrender.com/api'; 
const PUBLIC_CDN = 'https://lojasalvorada.b-cdn.net';

// --- ÍCONES SVG INLINE (Garante que sempre apareçam) ---
const Icons = {
  Search: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Upload: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  FileText: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  LogOut: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Moon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Sun: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Download: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Folder: () => <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  Info: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Eye: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
  LayoutGrid: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  List: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  ChevronRight: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('search');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('alvorada_theme');
    return saved ? saved === 'dark' : true;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Login State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [form, setForm] = useState({ user: '', pass: '', cap: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('alvorada_session');
    if (session) {
      try { setUser(JSON.parse(session)); } catch (e) { localStorage.removeItem('alvorada_session'); }
    }
    genCaptcha();
  }, []);

  useEffect(() => {
    localStorage.setItem('alvorada_theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const genCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ q: `${n1} + ${n2}`, a: n1 + n2 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (parseInt(form.cap) !== captcha.a) {
      setError('A soma está incorreta. Tente novamente.');
      genCaptcha();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.user, password: form.pass })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setUser(data);
        localStorage.setItem('alvorada_session', JSON.stringify(data));
      } else {
        setError(data.error || 'Usuário ou senha incorretos.');
        genCaptcha();
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor. Verifique se o Render está ativo.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alvorada_session');
    setTab('search');
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 border dark:border-gray-800">
            <div className="text-center mb-8">
              <img 
                src={darkMode ? "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" : "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png"} 
                className="h-16 mx-auto mb-4 object-contain" 
                alt="Loja Alvorada" 
              />
              <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Portal Interno</h1>
              <p className="text-gray-500 text-xs font-bold mt-1">Lojas Alvorada Sarandi</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Usuário</label>
                <input type="text" placeholder="Digite seu nome" className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7]" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Senha</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="Sua senha secreta" className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7]" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-400 hover:text-[#0e75d7]">
                    {showPass ? <Icons.EyeOff/> : <Icons.Eye/>}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-tighter">Resolva esta conta para provar que não é um robô:</p>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-[#0e75d7] select-none">{captcha.q} =</span>
                  <input type="number" placeholder="Sua resposta aqui" className="bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 w-full dark:text-white font-bold text-center focus:border-[#0e75d7] outline-none" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})} required />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <button disabled={loading} className="w-full bg-[#0e75d7] hover:bg-[#0c64b8] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50">
                {loading ? 'CARREGANDO...' : 'ENTRAR NO SISTEMA'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14] text-gray-900 dark:text-gray-100 transition-colors flex flex-col">
        {/* Header Desktop & Mobile */}
        <header className="bg-white dark:bg-[#161b22] border-b dark:border-gray-800 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-10">
              <img 
                src={darkMode ? "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" : "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png"} 
                className="h-8 lg:h-10 object-contain" 
                alt="Logo" 
              />
              <nav className="hidden md:flex gap-2">
                <TabBtn active={tab === 'search'} onClick={() => setTab('search')} icon={<Icons.Search/>} label="Consultar" />
                {user.role === 'admin' && <TabBtn active={tab === 'carnes'} onClick={() => setTab('carnes')} icon={<Icons.FileText/>} label="Carnês" />}
                {['admin', 'editor'].includes(user.role) && <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')} icon={<Icons.Upload/>} label="Enviar" />}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right mr-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter block">Olá, {user.name}</span>
                <span className="text-[9px] font-bold text-[#0e75d7] uppercase">{user.role}</span>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition">
                {darkMode ? <Icons.Sun/> : <Icons.Moon/>}
              </button>
              <button onClick={logout} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition">
                <Icons.LogOut/>
              </button>
            </div>
          </div>
          
          {/* Mobile Bottom Bar */}
          <div className="md:hidden flex border-t dark:border-gray-800 overflow-x-auto bg-white dark:bg-[#161b22] sticky top-20 z-40">
            <button onClick={() => setTab('search')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'search' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
              <Icons.Search/> Consultar
            </button>
            {user.role === 'admin' && (
              <button onClick={() => setTab('carnes')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'carnes' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <Icons.FileText/> Carnês
              </button>
            )}
            {['admin', 'editor'].includes(user.role) && (
              <button onClick={() => setTab('upload')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'upload' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <Icons.Upload/> Enviar
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto p-4 lg:p-8 w-full">
          {tab === 'search' && <SearchContent user={user} />}
          {tab === 'carnes' && <CarnesContent user={user} />}
          {tab === 'upload' && <UploadContent user={user} />}
        </main>

        <footer className="p-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#161b22] border-t dark:border-gray-800">
           &copy; {new Date().getFullYear()} Lojas Alvorada • Sarandi • Uso Reservado
        </footer>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${active ? 'bg-blue-50 text-[#0e75d7] dark:bg-blue-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      {icon} <span className="uppercase text-xs tracking-tighter">{label}</span>
    </button>
  );
}

function SearchContent({ user }) {
  const [q, setQ] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const perPage = 12;

  // Cache simples
  const [cache, setCache] = useState({});

  const handleSearch = async () => {
    if (!q) return;
    if (cache[q]) { setFiles(cache[q]); setPage(1); return; }

    setLoading(true);
    let all = [];
    const paths = ['Fprodutos', 'VideosProdutos/Videos YT', 'VideosProdutos/Videos ML'];
    try {
      for (const p of paths) {
        const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(p)}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const matches = data.filter(f => f.ObjectName?.toLowerCase().includes(q.toLowerCase()));
          all = [...all, ...matches.map(f => ({ ...f, fullPath: `${p}/${f.ObjectName}` }))];
        }
      }
      setFiles(all);
      setCache(prev => ({ ...prev, [q]: all }));
      setPage(1);
    } catch (e) { console.error("Busca falhou"); }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(files)) return [];
    return files.filter(f => {
      const ext = f.ObjectName?.split('.').pop().toLowerCase();
      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const isVid = ['mp4', 'mov', 'webm'].includes(ext);
      if (filter === 'image') return isImg;
      if (filter === 'video') return isVid;
      return true;
    });
  }, [files, filter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const downloadAll = async () => {
    if (!filtered.length || !confirm(`Baixar os ${filtered.length} arquivos?`)) return;
    for (const f of filtered) {
      await download(f.ObjectName, f.fullPath.split('/').slice(0,-1).join('/'), user);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white dark:bg-[#161b22] p-6 rounded-[2.5rem] shadow-xl border dark:border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search/></div>
            <input className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-[#0d1117] dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7]" placeholder="SKU ou nome do produto..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <button onClick={handleSearch} className="bg-[#0e75d7] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 active:scale-95 transition">PESQUISAR</button>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t dark:border-gray-800">
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {['all', 'image', 'video'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${filter === f ? 'bg-white dark:bg-gray-700 text-[#0e75d7] shadow-sm' : 'text-gray-400'}`}>
                {f === 'all' ? 'Todos' : f === 'image' ? 'Imagens' : 'Vídeos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-[#0e75d7]' : 'text-gray-400'}`}><Icons.LayoutGrid/></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-[#0e75d7]' : 'text-gray-400'}`}><Icons.List/></button>
            </div>
            {filtered.length > 0 && <button onClick={downloadAll} className="text-[#0e75d7] font-black text-[10px] uppercase flex items-center gap-1 hover:underline"><Icons.Download/> Baixar Tudo</button>}
          </div>
        </div>
      </div>

      {loading ? <div className="p-20 text-center animate-pulse text-[#0e75d7] font-black">BUSCANDO...</div> : (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" : "space-y-2"}>
          {paginated.map((f, i) => <FileCard key={i} file={f} view={viewMode} user={user} />)}
        </div>
      )}

      {filtered.length > perPage && (
        <div className="flex justify-center items-center gap-6 mt-12 bg-white dark:bg-[#161b22] p-4 rounded-3xl border dark:border-gray-800 shadow-lg w-fit mx-auto">
          <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({top:0}); }} className="font-bold disabled:opacity-20 px-4 py-2 hover:text-[#0e75d7]">Anterior</button>
          <span className="text-xs font-black text-gray-400">PÁGINA {page} DE {Math.ceil(filtered.length / perPage)}</span>
          <button disabled={page >= Math.ceil(filtered.length / perPage)} onClick={() => { setPage(p => p + 1); window.scrollTo({top:0}); }} className="font-bold disabled:opacity-20 px-4 py-2 hover:text-[#0e75d7]">Próxima</button>
        </div>
      )}
    </div>
  );
}

function FileCard({ file, view, user }) {
  const [showDetail, setShowDetail] = useState(false);
  const ext = file.ObjectName?.split('.').pop().toLowerCase();
  const isImg = ['jpg','jpeg','png','webp','gif'].includes(ext);
  const url = `${PUBLIC_CDN}/${file.fullPath?.split('/').map(encodeURIComponent).join('/')}`;
  const sizeMb = (file.Length / (1024 * 1024)).toFixed(2);
  const date = new Date(file.LastChanged).toLocaleDateString('pt-BR');

  if (view === 'list') {
    return (
      <div className="bg-white dark:bg-[#161b22] p-4 rounded-2xl border dark:border-gray-800 flex items-center justify-between gap-4 hover:border-[#0e75d7] transition group">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
            {isImg ? <img src={url} className="w-full h-full object-cover" /> : <div className="text-white"><Icons.FileText/></div>}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black truncate dark:text-white uppercase">{file.ObjectName}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{ext} • {sizeMb} MB • {date}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.open(url, '_blank')} className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl hover:text-[#0e75d7]"><Icons.Eye/></button>
           <button onClick={() => download(file.ObjectName, file.fullPath?.split('/').slice(0,-1).join('/'), user)} className="p-3 bg-[#0e75d7] text-white rounded-xl"><Icons.Download/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-[2rem] overflow-hidden shadow-sm border dark:border-gray-800 group hover:shadow-2xl hover:-translate-y-1 transition-all relative">
      <div className="aspect-square bg-gray-100 dark:bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
        {isImg ? <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" /> : <Icons.FileText/>}
        <button onClick={() => setShowDetail(true)} className="absolute top-2 right-2 p-2 bg-black/40 text-white rounded-full hover:bg-[#0e75d7]"><Icons.Info/></button>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button onClick={() => window.open(url, '_blank')} className="p-3 bg-white text-black rounded-full hover:bg-[#0e75d7]"><Icons.Eye/></button>
          <button onClick={() => download(file.ObjectName, file.fullPath?.split('/').slice(0,-1).join('/'), user)} className="p-3 bg-white text-black rounded-full hover:bg-[#0e75d7]"><Icons.Download/></button>
        </div>
      </div>
      <div className="p-3 text-center">
        <p className="text-[10px] font-black truncate dark:text-gray-300 uppercase">{file.ObjectName}</p>
        <button onClick={() => download(file.ObjectName, file.fullPath?.split('/').slice(0,-1).join('/'), user)} className="mt-2 w-full flex items-center justify-center gap-1 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-xl text-[9px] font-black uppercase">
           <Icons.Download/> Baixar
        </button>
      </div>
      {showDetail && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#161b22]/98 p-6 flex flex-col justify-center animate-in zoom-in duration-200">
           <button onClick={() => setShowDetail(false)} className="absolute top-4 right-4 text-gray-400">✖</button>
           <h3 className="text-[10px] font-black uppercase text-[#0e75d7] mb-3">Detalhes</h3>
           <div className="text-[11px] font-bold text-gray-500 space-y-2 uppercase">
              <p>Nome: <span className="text-black dark:text-white break-all">{file.ObjectName}</span></p>
              <p>Tamanho: <span className="text-black dark:text-white">{sizeMb} MB</span></p>
              <p>Data: <span className="text-black dark:text-white">{date}</span></p>
           </div>
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
    } catch (e) { console.error("Pasta vazia ou erro"); }
    setLoading(false);
  };

  useEffect(() => { load('Carnes'); }, []);

  const filtered = items.filter(it => it.ObjectName?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
        <div className="bg-white dark:bg-[#161b22] px-4 py-2 rounded-2xl border dark:border-gray-800 flex items-center gap-2 whitespace-nowrap">
          <Icons.Folder/>
          {path.split('/').map((p, i, arr) => (
            <React.Fragment key={i}>
              <button onClick={() => load(arr.slice(0, i+1).join('/'))} className="text-[10px] font-black uppercase hover:text-[#0e75d7]">{p}</button>
              {i < arr.length - 1 && <Icons.ChevronRight/>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-[2.5rem] border dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
           <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search/></div>
             <input className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0d1117] dark:text-white text-sm outline-none border-none" placeholder="Pesquisar nesta pasta..." value={filter} onChange={e => setFilter(e.target.value)} />
           </div>
        </div>
        {loading ? <div className="p-32 text-center text-gray-400 font-black animate-pulse">CARREGANDO...</div> : (
          <div className="divide-y dark:divide-gray-800 max-h-[600px] overflow-y-auto custom-scroll">
            {filtered.length === 0 && <div className="p-20 text-center text-gray-400">Vazio.</div>}
            {filtered.map((it, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group" onClick={() => it.IsDirectory && load(`${path}/${it.ObjectName}`)}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${it.IsDirectory ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {it.IsDirectory ? <Icons.Folder/> : <Icons.FileText/>}
                  </div>
                  <span className="font-extrabold text-sm uppercase dark:text-gray-200 group-hover:text-[#0e75d7]">{it.ObjectName}</span>
                </div>
                {!it.IsDirectory && (
                   <div className="flex gap-2">
                     <button onClick={(e) => { e.stopPropagation(); window.open(`${PUBLIC_CDN}/${path}/${it.ObjectName}`, '_blank'); }} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl"><Icons.Eye/></button>
                     <button onClick={(e) => { e.stopPropagation(); download(it.ObjectName, path, user); }} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-xl"><Icons.Download/></button>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UploadContent({ user }) {
  const [files, setFiles] = useState([]);
  const [target, setTarget] = useState('Fprodutos');
  const [progress, setProgress] = useState({}); 
  const [uploading, setUploading] = useState(false);

  const startUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      setProgress(prev => ({ ...prev, [i]: 'loading' }));
      const form = new FormData();
      form.append('file', files[i]);
      form.append('path', `${target}/${files[i].name}`);
      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.token}` },
          body: form
        });
        setProgress(prev => ({ ...prev, [i]: res.ok ? 'done' : 'error' }));
      } catch (e) { setProgress(prev => ({ ...prev, [i]: 'error' })); }
      await new Promise(r => setTimeout(r, 400));
    }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div className="bg-white dark:bg-[#161b22] p-8 sm:p-12 rounded-[3rem] shadow-2xl border dark:border-gray-800">
        <div className="flex items-center gap-5 mb-10">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-[1.5rem]"><Icons.Upload/></div>
          <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter">Central de Envio</h2>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Múltiplos Arquivos</p>
          </div>
        </div>

        <div className="space-y-6">
          <select className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0d1117] dark:text-white border-none outline-none font-bold text-sm focus:ring-2 focus:ring-[#0e75d7]" value={target} onChange={e => setTarget(e.target.value)}>
            <option value="Fprodutos">Fotos de Produtos</option>
            <option value="VideosProdutos/Videos YT">Videos Youtube</option>
            <option value="VideosProdutos/Videos ML">Videos Mercado Livre</option>
          </select>

          <div className="border-4 border-dashed dark:border-gray-800 p-12 rounded-[2.5rem] text-center hover:border-[#0e75d7] transition cursor-pointer relative group bg-gray-50/50 dark:bg-gray-800/10">
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles(Array.from(e.target.files))} />
            {files.length > 0 ? (
              <p className="font-black text-sm uppercase">{files.length} arquivo(s) selecionados</p>
            ) : (
              <p className="font-black text-xs uppercase tracking-widest">Arraste ou clique para selecionar</p>
            )}
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scroll">
            {uploading && <p className="text-orange-500 font-black text-[10px] mb-2">⚠ NÃO SAIA DA PÁGINA!</p>}
            {files.map((f, i) => (
              <div key={i} className="bg-gray-100 dark:bg-[#0d1117] p-3 rounded-xl flex justify-between items-center text-[10px] font-bold">
                <span className="truncate max-w-[70%]">{f.name}</span>
                <span className={progress[i] === 'done' ? 'text-green-500' : progress[i] === 'error' ? 'text-red-500' : 'text-[#0e75d7]'}>
                  {progress[i] === 'loading' ? 'ENVIANDO...' : progress[i] === 'done' ? 'OK' : progress[i] === 'error' ? 'ERRO' : 'PENDENTE'}
                </span>
              </div>
            ))}
          </div>

          <button disabled={!files.length || uploading} onClick={startUpload} className="w-full bg-[#0e75d7] text-white font-black py-5 rounded-3xl transition shadow-xl disabled:opacity-20 active:scale-95 uppercase">
            {uploading ? 'ENVIANDO...' : 'INICIAR UPLOAD'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HELPER DOWNLOAD ---
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
    window.URL.revokeObjectURL(url);
  } catch (e) { console.error("Erro download"); }
}