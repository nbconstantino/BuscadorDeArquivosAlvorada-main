import React, { useState, useEffect, useMemo, Fragment } from 'react';

// --- CONFIGURAÇÃO ---
const API_BASE = 'https://bunny-proxy.onrender.com/api'; 
const PUBLIC_CDN = 'https://lojasalvorada.b-cdn.net';

// --- ÍCONES SVG INLINE (Garantia de visibilidade total) ---
const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  FileText: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>,
  LogOut: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Folder: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
  Info: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  VideoVertical: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="7" y="2" width="10" height="20" rx="2"></rect></svg>,
  VideoHorizontal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="10" rx="2"></rect></svg>
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
    // Aplica a classe dark no elemento principal (HTML) para Tailwind funcionar em tudo
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
      setError('Erro ao conectar ao servidor.');
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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14] flex items-center justify-center p-4 transition-colors duration-300">
          <div className="w-full max-w-md bg-white dark:bg-[#161b22] p-8 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] shadow-2xl">
            <div className="text-center mb-8">
              <img 
                src={darkMode ? "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" : "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png"} 
                className="h-16 mx-auto mb-4 object-contain" 
                alt="Loja Alvorada" 
              />
              <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Painel Interno</h1>
              <p className="text-gray-500 text-xs font-bold mt-1 uppercase tracking-widest">Acesso Restrito</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Usuário</label>
                <input type="text" placeholder="Seu nome" className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-[#0d1117] dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7]" value={form.user} onChange={e => setForm({...form, user: e.target.value})} required />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block">Senha</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} placeholder="Sua senha"  className="w-full p-4 rounded-2xl bg-gray-100 dark:bg-[#0d1117] dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7]" value={form.pass} onChange={e => setForm({...form, pass: e.target.value})} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-400 hover:text-[#0e75d7]">
                    {showPass ? <Icons.EyeOff /> : <Icons.Eye />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase">Resolva essa conta para provar que não é um robô:</p>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-[#0e75d7] select-none">{captcha.q} =</span>
                  <input type="number" placeholder="sua resposta aqui" className="w-full p-2 rounded-xl bg-white dark:bg-gray-800 dark:text-white border-2 border-blue-100 dark:border-blue-800 text-center font-bold focus:border-[#0e75d7] outline-none shadow-inner" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})} required />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-950 p-2 rounded-lg">{error}</p>}

              <button disabled={loading} className="w-full bg-[#0e75d7] hover:bg-[#0c64b8] text-white font-black py-4 rounded-2xl transition shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50 uppercase text-sm">
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14] text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
        {/* Header Desktop & Mobile */}
        <header className="bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-10">
              <img 
                src={darkMode ? "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" : "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png"} 
                className="h-8 lg:h-10 object-contain" 
                alt="Logo" 
              />
              <nav className="hidden lg:flex gap-2">
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
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl transition hover:scale-110 active:scale-95 text-[#0e75d7]">
                {darkMode ? <Icons.Sun/> : <Icons.Moon/>}
              </button>
              <button onClick={logout} className="p-3 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-2xl transition hover:scale-110 active:scale-95">
                <Icons.LogOut/>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation Bar */}
          <div className="lg:hidden flex border-t border-gray-200 dark:border-gray-800 overflow-x-auto bg-white dark:bg-[#161b22] sticky top-20 z-40 no-scrollbar transition-colors duration-300">
            <button onClick={() => setTab('search')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-black uppercase transition-all min-w-[80px] ${tab === 'search' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
              <Icons.Search/> <span>Busca</span>
            </button>
            {user.role === 'admin' && (
              <button onClick={() => setTab('carnes')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-black uppercase transition-all min-w-[80px] ${tab === 'carnes' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <Icons.FileText/> <span>Carnês</span>
              </button>
            )}
            {['admin', 'editor'].includes(user.role) && (
              <button onClick={() => setTab('upload')} className={`flex-1 py-4 flex flex-col items-center gap-1 text-[10px] font-black uppercase transition-all min-w-[80px] ${tab === 'upload' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <Icons.Upload/> <span>Enviar</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto p-4 lg:p-8 w-full transition-all duration-300">
          {tab === 'search' && <SearchContent user={user} />}
          {tab === 'carnes' && <CarnesContent user={user} />}
          {tab === 'upload' && <UploadContent user={user} />}
        </main>

        <footer className="p-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
           &copy; {new Date().getFullYear()} Lojas Alvorada Sarandi • Uso Interno Reservado
        </footer>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all ${active ? 'bg-blue-50 text-[#0e75d7] dark:bg-blue-900/20 shadow-sm' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
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
          const matches = data.filter(f => f.ObjectName && f.ObjectName.toLowerCase().includes(q.toLowerCase()));
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
      const ext = (f.ObjectName || '').split('.').pop().toLowerCase();
      const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);
      const isVid = ['mp4', 'mov', 'webm'].includes(ext);
      if (filter === 'image') return isImg;
      if (filter === 'video') return isVid;
      return true;
    });
  }, [files, filter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const downloadAll = async () => {
    if (!filtered.length || !confirm(`Baixar os ${filtered.length} arquivos encontrados?`)) return;
    for (const f of filtered) {
      await download(f.ObjectName, f.fullPath.split('/').slice(0,-1).join('/'), user);
      await new Promise(r => setTimeout(r, 600));
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white dark:bg-[#161b22] p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 space-y-4 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-grow relative text-[#0e75d7]">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 opacity-50"><Icons.Search /></div>
            <input className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-[#0d1117] dark:text-white border-none outline-none focus:ring-2 focus:ring-[#0e75d7] transition-all" placeholder="SKU ou nome do produto..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <button onClick={handleSearch} className="bg-[#0e75d7] text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all uppercase text-xs">BUSCAR</button>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {['all', 'image', 'video'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-white dark:bg-gray-700 text-[#0e75d7] shadow-sm' : 'text-gray-400'}`}>
                {f === 'all' ? 'Todos' : f === 'image' ? 'Imagens' : 'Vídeos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-[#0e75d7]">
              <button onClick={() => setViewMode('grid')} title="Modo Galeria" className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400'}`}><Icons.Grid /></button>
              <button onClick={() => setViewMode('list')} title="Modo Lista" className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-400'}`}><Icons.List /></button>
            </div>
            {filtered.length > 0 && <button onClick={downloadAll} className="text-[#0e75d7] font-black text-[10px] uppercase flex items-center gap-1 hover:underline transition-all"><Icons.Download /> Baixar Tudo</button>}
          </div>
        </div>
      </div>

      {loading ? <div className="p-20 text-center animate-pulse text-[#0e75d7] font-black tracking-widest uppercase">PROCURANDO...</div> : (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" : "space-y-2"}>
          {paginated.map((f, i) => <FileCard key={i} file={f} view={viewMode} user={user} />)}
        </div>
      )}

      {filtered.length > perPage && (
        <div className="flex justify-center items-center gap-6 mt-12 bg-white dark:bg-[#161b22] p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg w-fit mx-auto transition-all">
          <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({top:0}); }} className="font-bold disabled:opacity-20 px-4 py-2 hover:text-[#0e75d7] uppercase text-xs">Anterior</button>
          <span className="text-xs font-black text-gray-400 tracking-tighter uppercase">Página {page} de {Math.ceil(filtered.length / perPage)}</span>
          <button disabled={page >= Math.ceil(filtered.length / perPage)} onClick={() => { setPage(p => p + 1); window.scrollTo({top:0}); }} className="font-bold disabled:opacity-20 px-4 py-2 hover:text-[#0e75d7] uppercase text-xs">Próxima</button>
        </div>
      )}
    </div>
  );
}

function FileCard({ file, view, user }) {
  const [showDetail, setShowDetail] = useState(false);
  const ext = (file.ObjectName || '').split('.').pop().toLowerCase();
  const isImg = ['jpg','jpeg','png','webp','gif'].includes(ext);
  const isVid = ['mp4','mov','webm'].includes(ext);
  const url = `${PUBLIC_CDN}/${(file.fullPath || '').split('/').map(encodeURIComponent).join('/')}`;
  const date = file.LastChanged ? new Date(file.LastChanged).toLocaleDateString('pt-BR') : '-';
  const sizeMb = (file.Length / (1024 * 1024)).toFixed(2);

  // Lógica de orientação do vídeo
  const isVideosML = file.fullPath?.includes('Videos ML');
  const isVideosYT = file.fullPath?.includes('Videos YT');

  const VideoThumbnail = () => (
    <div className="w-full h-full relative flex items-center justify-center bg-black">
      <video 
        src={url} 
        className="w-full h-full object-cover opacity-60"
        preload="metadata"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1"><path d="M5 3l14 9-14 9V3z"></path></svg>
        </div>
      </div>
      {/* Indicador de Orientação */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/70 rounded-lg backdrop-blur-md border border-white/10">
        {isVideosML ? (
          <>
            <Icons.VideoVertical />
            <span className="text-[8px] font-black uppercase">Vertical</span>
          </>
        ) : (
          <>
            <Icons.VideoHorizontal />
            <span className="text-[8px] font-black uppercase">Horizontal</span>
          </>
        )}
      </div>
    </div>
  );

  if (view === 'list') {
    return (
      <div className="bg-white dark:bg-[#161b22] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4 hover:border-[#0e75d7] transition-colors duration-300 group fade-in">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 flex items-center justify-center shadow-inner">
            {isImg ? (
              <img src={url} className="w-full h-full object-cover" />
            ) : isVid ? (
              <video src={url} className="w-full h-full object-cover opacity-50" preload="metadata" />
            ) : (
              <div className="text-white opacity-40"><Icons.FileText /></div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black truncate dark:text-white uppercase tracking-tighter">{file.ObjectName}</p>
              {isVid && (
                <div className="text-[#0e75d7] opacity-60">
                  {isVideosML ? <Icons.VideoVertical /> : <Icons.VideoHorizontal />}
                </div>
              )}
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{ext} • {sizeMb} MB • {date}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.open(url, '_blank')} title="Visualizar" className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-[#0e75d7] rounded-xl transition-all duration-300"><Icons.Eye /></button>
           <button onClick={() => download(file.ObjectName, (file.fullPath || '').split('/').slice(0,-1).join('/'), user)} title="Baixar" className="p-3 bg-[#0e75d7] text-white rounded-xl shadow-lg shadow-blue-600/20 active:scale-90 transition-all duration-300"><Icons.Download /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative fade-in">
      <div className="aspect-square bg-gray-100 dark:bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
        {isImg ? (
          <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
        ) : isVid ? (
          <VideoThumbnail />
        ) : (
          <div className="text-gray-400 opacity-20"><Icons.FileText /></div>
        )}
        
        <button onClick={() => setShowDetail(true)} className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-full hover:bg-[#0e75d7] transition-all z-10"><Icons.Info /></button>
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button onClick={() => window.open(url, '_blank')} className="p-3 bg-white text-black rounded-full hover:bg-[#0e75d7] transition-all transform hover:scale-110 shadow-lg"><Icons.Eye /></button>
          <button onClick={() => download(file.ObjectName, (file.fullPath || '').split('/').slice(0,-1).join('/'), user)} className="p-3 bg-white text-black rounded-full hover:bg-[#0e75d7] transition-all transform hover:scale-110 shadow-lg"><Icons.Download /></button>
        </div>
      </div>
      <div className="p-3 text-center transition-colors duration-300">
        <p className="text-[10px] font-black truncate dark:text-gray-300 uppercase tracking-tighter" title={file.ObjectName}>{file.ObjectName}</p>
        <button onClick={() => download(file.ObjectName, (file.fullPath || '').split('/').slice(0,-1).join('/'), user)} className="mt-2 w-full flex items-center justify-center gap-2 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-xl text-[9px] font-black uppercase transition-all active:scale-95 shadow-sm">
           <Icons.Download /> <span>Baixar</span>
        </button>
      </div>
      {showDetail && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#161b22]/98 p-6 flex flex-col justify-center animate-in zoom-in duration-200 z-20">
           <button onClick={() => setShowDetail(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-all font-black uppercase text-xs">✕ Fechar</button>
           <h3 className="text-[10px] font-black uppercase text-[#0e75d7] mb-3 tracking-widest border-b pb-1 text-center">Informações</h3>
           <div className="text-[11px] font-bold text-gray-500 dark:text-gray-300 space-y-2 uppercase tracking-tighter">
              <p>Ficheiro: <span className="text-black dark:text-white break-all text-xs">{file.ObjectName}</span></p>
              <p>Tamanho: <span className="text-black dark:text-white">{sizeMb} MB</span></p>
              <p>Data: <span className="text-black dark:text-white">{date}</span></p>
              {isVid && <p>Orientação: <span className="text-black dark:text-white">{isVideosML ? 'Vertical (ML)' : 'Horizontal (YT)'}</span></p>}
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

  const loadFolder = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(p)}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setPath(p);
    } catch (e) { console.error("Pasta erro"); }
    setLoading(false);
  };

  useEffect(() => { if(user) loadFolder('Carnes'); }, [user]);

  const filtered = items.filter(it => (it.ObjectName || '').toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-select">
        <div className="bg-white dark:bg-[#161b22] px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors duration-300">
          <Icons.Folder />
          {path.split('/').map((p, i, arr) => (
            <Fragment key={i}>
              <button onClick={() => loadFolder(arr.slice(0, i+1).join('/'))} className="text-[10px] font-black uppercase hover:text-[#0e75d7] transition-all tracking-widest">{p}</button>
              {i < arr.length - 1 && <div className="opacity-30 text-[#0e75d7]"><Icons.ChevronRight /></div>}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:max-w-xs text-[#0e75d7]">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"><Icons.Search /></div>
             <input className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0d1117] dark:text-white text-sm outline-none border-none shadow-inner transition-all" placeholder="Procurar nesta pasta..." value={filter} onChange={e => setFilter(e.target.value)} />
           </div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-tighter">{filtered.length} ficheiros encontrados</span>
        </div>
        {loading ? <div className="p-32 text-center text-gray-400 font-black animate-pulse uppercase tracking-widest">CARREGANDO...</div> : (
          <div className="divide-y border-gray-100 dark:divide-gray-800 max-h-[600px] overflow-y-auto custom-scroll">
            {filtered.length === 0 && <div className="p-20 text-center text-gray-400 uppercase text-xs font-bold tracking-widest">Pasta vazia.</div>}
            {filtered.map((it, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer group transition-all duration-300" onClick={() => it.IsDirectory && loadFolder(`${path}/${it.ObjectName}`)}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl transition-all ${it.IsDirectory ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm group-hover:scale-105' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {it.IsDirectory ? <Icons.Folder /> : <Icons.FileText />}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm uppercase dark:text-gray-200 group-hover:text-[#0e75d7] transition-all tracking-tighter">{it.ObjectName}</p>
                    {!it.IsDirectory && <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Documento • {(it.Length / 1024).toFixed(0)} KB</p>}
                  </div>
                </div>
                {!it.IsDirectory && (
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); window.open(`${PUBLIC_CDN}/${path}/${it.ObjectName}`, '_blank'); }} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-[#0e75d7] transition-all"><Icons.Eye /></button>
                    <button onClick={(e) => { e.stopPropagation(); download(it.ObjectName, path, user); }} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-xl hover:bg-[#0e75d7] hover:text-white transition-all shadow-sm"><Icons.Download /></button>
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
      if (progress[i] === 'done') continue;
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
      <div className="bg-white dark:bg-[#161b22] p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
        <div className="flex items-center gap-5 mb-10 border-b border-gray-100 dark:border-gray-800 pb-6 text-[#0e75d7]">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] shadow-lg transition-colors"><Icons.Upload /></div>
          <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white text-gray-900 transition-colors">Central de Envio</h2>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Multi-upload Ativo</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest block uppercase">Pasta de Destino</label>
            <select className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0d1117] dark:text-white border-none outline-none font-bold text-sm focus:ring-2 focus:ring-[#0e75d7] transition-all cursor-pointer shadow-inner" value={target} onChange={e => setTarget(e.target.value)}>
              <option value="Fprodutos">Fotos de Produtos</option>
              <option value="VideosProdutos/Videos YT">Vídeos Youtube</option>
              <option value="VideosProdutos/Videos ML">Vídeos Mercado Livre</option>
            </select>
          </div>

          <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 p-12 rounded-[2.5rem] text-center hover:border-[#0e75d7] transition-all cursor-pointer relative group bg-gray-50/50 dark:bg-[#0d1117] text-[#0e75d7]">
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { setFiles(Array.from(e.target.files)); setProgress({}); }} />
            {files.length > 0 ? (
              <div className="flex flex-col items-center animate-in zoom-in text-[#0e75d7] font-black transition-colors">
                <div className="mb-2"><Icons.Grid /></div>
                <p className="text-sm uppercase tracking-tighter">{files.length} Ficheiro(s) Selecionados</p>
                <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase">Clique para trocar</p>
              </div>
            ) : (
              <div className="opacity-30 group-hover:opacity-100 transition-all transform group-hover:scale-105">
                <div className="mx-auto mb-4 flex justify-center"><Icons.Grid /></div>
                <p className="font-black text-xs uppercase tracking-widest uppercase">Arraste múltiplos arquivos aqui</p>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-3 bg-gray-50 dark:bg-[#0d1117] p-6 rounded-[2rem] max-h-[300px] overflow-y-auto custom-scroll shadow-inner border border-gray-100 dark:border-gray-800 transition-all duration-300">
              {uploading && <div className="text-orange-500 font-black text-[10px] uppercase mb-4 animate-pulse">Não saia desta página até o fim!</div>}
              {files.map((f, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest transition-colors">
                    <span className="truncate max-w-[70%] dark:text-gray-300">{f.name}</span>
                    <span className={progress[i] === 'done' ? 'text-green-500 font-bold' : progress[i] === 'error' ? 'text-red-500' : 'text-[#0e75d7]'}>
                      {progress[i] === 'loading' ? 'ENVIANDO...' : progress[i] === 'done' ? 'CONCLUÍDO' : progress[i] === 'error' ? 'ERRO' : 'PENDENTE'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner transition-colors">
                    <div className={`h-full transition-all duration-700 ${progress[i] === 'done' ? 'bg-green-500' : progress[i] === 'error' ? 'bg-red-500' : progress[i] === 'loading' ? 'bg-[#0e75d7]' : 'bg-transparent'}`} style={{ width: progress[i] === 'done' ? '100%' : progress[i] === 'loading' ? '70%' : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button disabled={!files.length || uploading} onClick={startUpload} className="w-full bg-[#0e75d7] hover:bg-[#0c64b8] text-white font-black py-5 rounded-3xl transition shadow-xl shadow-blue-600/10 disabled:opacity-20 active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
             <span>{uploading ? 'PROCESSANDO...' : 'INICIAR UPLOAD'}</span>
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
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) { console.error("Erro download"); }
}