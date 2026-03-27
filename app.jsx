import React, { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  List,
  LayoutGrid,
  Info,
  Eye,
  EyeOff,
  Files,
  X
} from 'lucide-react';

const API_BASE = 'https://bunny-proxy.onrender.com/api'; 
const PUBLIC_CDN = 'https://lojasalvorada.b-cdn.net';

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
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('alvorada_session');
      }
    }
    genCaptcha();
  }, []);

  useEffect(() => {
    localStorage.setItem('alvorada_theme', darkMode ? 'dark' : 'light');
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
      if (res.ok) {
        setUser(data);
        localStorage.setItem('alvorada_session', JSON.stringify(data));
      } else {
        setError(data.error || 'Usuário ou senha incorretos.');
        genCaptcha();
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor. Verifique o Render.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alvorada_session');
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border dark:border-gray-800">
            <div className="text-center mb-8">
              <img 
                src={darkMode ? "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" : "https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png"} 
                className="h-16 mx-auto mb-4 object-contain" 
                alt="Loja Alvorada" 
              />
              <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Portal Interno</h1>
              <p className="text-gray-500 text-xs font-bold mt-1">Identifique-se para acessar</p>
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
                    {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2 uppercase tracking-tighter">Resolva para provar que não é um robô:</p>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-[#0e75d7] select-none">{captcha.q} =</span>
                  <input type="number" placeholder="Sua resposta aqui" className="bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 w-full dark:text-white font-bold text-center focus:border-[#0e75d7] outline-none" value={form.cap} onChange={e => setForm({...form, cap: e.target.value})} required />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                  <AlertCircle size={16}/>
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              <button disabled={loading} className="w-full bg-[#0e75d7] hover:bg-[#0c64b8] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto"/> : 'ENTRAR NO SISTEMA'}
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
                <TabBtn active={tab === 'search'} onClick={() => setTab('search')} icon={<Search size={18}/>} label="Consultar" />
                {user.role === 'admin' && <TabBtn active={tab === 'carnes'} onClick={() => setTab('carnes')} icon={<FileText size={18}/>} label="Carnês" />}
                {['admin', 'editor'].includes(user.role) && <TabBtn active={tab === 'upload'} onClick={() => setTab('upload')} icon={<Upload size={18}/>} label="Enviar" />}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right mr-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter block">Bem-vindo, {user.name}</span>
                <span className="text-[9px] font-bold text-[#0e75d7] uppercase">{user.role}</span>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition">
                {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-blue-600"/>}
              </button>
              <button onClick={logout} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition">
                <LogOut size={20}/>
              </button>
            </div>
          </div>
          
          {/* Mobile Bottom Bar ou Nav Secundaria */}
          <div className="md:hidden flex border-t dark:border-gray-800 overflow-x-auto bg-white dark:bg-[#161b22]">
            <button onClick={() => setTab('search')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'search' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
              <Search size={16}/> Consultar
            </button>
            {user.role === 'admin' && (
              <button onClick={() => setTab('carnes')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'carnes' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <FileText size={16}/> Carnês
              </button>
            )}
            {['admin', 'editor'].includes(user.role) && (
              <button onClick={() => setTab('upload')} className={`flex-1 min-w-[80px] py-4 text-[10px] font-black uppercase flex flex-col items-center gap-1 ${tab === 'upload' ? 'text-[#0e75d7] border-b-2 border-[#0e75d7]' : 'text-gray-400'}`}>
                <Upload size={16}/> Enviar
              </button>
            )}
          </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto p-4 lg:p-8 w-full">
          {tab === 'search' && <SearchContent user={user} darkMode={darkMode}/>}
          {tab === 'carnes' && <CarnesContent user={user} />}
          {tab === 'upload' && <UploadContent user={user} />}
        </main>

        <footer className="p-6 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#161b22] border-t dark:border-gray-800">
           &copy; {new Date().getFullYear()} Lojas Alvorada Sarandi • Uso Interno Reservado
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

function SearchContent({ user, darkMode }) {
  const [q, setQ] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [filter, setFilter] = useState('all'); // 'all', 'image', 'video'
  const perPage = 12;

  // Frontend Cache: Evitar buscas repetidas na mesma sessão
  const [searchCache, setSearchCache] = useState({});

  const handleSearch = async () => {
    if (!q) return;
    
    if (searchCache[q]) {
      setFiles(searchCache[q]);
      setPage(1);
      return;
    }

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
      setSearchCache(prev => ({ ...prev, [q]: all }));
      setPage(1);
    } catch (e) { alert("Erro ao buscar arquivos."); }
    setLoading(false);
  };

  const filteredFiles = useMemo(() => {
    if (filter === 'all') return files;
    return files.filter(f => {
      const ext = f.ObjectName.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext);
      const isVideo = ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext);
      return filter === 'image' ? isImage : isVideo;
    });
  }, [files, filter]);

  const paginated = filteredFiles.slice((page - 1) * perPage, page * perPage);

  const downloadAll = async () => {
    if (!filteredFiles.length) return;
    if (!confirm(`Deseja baixar todos os ${filteredFiles.length} resultados encontrados?`)) return;
    
    for (const f of filteredFiles) {
      await download(f.ObjectName, f.fullPath.split('/').slice(0,-1).join('/'), user);
      await new Promise(r => setTimeout(r, 500)); // Delay para não travar o browser
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white dark:bg-[#161b22] p-6 rounded-[2.5rem] shadow-xl border dark:border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input 
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-[#0e75d7] dark:text-white" 
              placeholder="Digite o SKU ou nome do produto..." 
              value={q}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <button onClick={handleSearch} className="bg-[#0e75d7] hover:bg-[#0c64b8] text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
            PESQUISAR
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-t dark:border-gray-800 pt-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#0e75d7]' : 'text-gray-400'}`}>Todos</button>
            <button onClick={() => setFilter('image')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'image' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#0e75d7]' : 'text-gray-400'}`}>Imagens</button>
            <button onClick={() => setFilter('video')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'video' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#0e75d7]' : 'text-gray-400'}`}>Vídeos</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#0e75d7]' : 'text-gray-400'}`}><LayoutGrid size={18}/></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-[#0e75d7]' : 'text-gray-400'}`}><List size={18}/></button>
            </div>
            {filteredFiles.length > 0 && (
              <button onClick={downloadAll} className="flex items-center gap-2 text-[10px] font-black uppercase text-green-600 dark:text-green-400 hover:underline">
                <Download size={14}/> Baixar Tudo
              </button>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-[#0e75d7]" size={48}/></div>}
      
      {/* Container de Resultados */}
      <div className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" : "flex flex-col gap-2"}>
        {paginated.map((f, i) => <FileCard key={i} file={f} user={user} viewMode={viewMode} />)}
      </div>

      {/* Paginação */}
      {filteredFiles.length > perPage && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 bg-white dark:bg-[#161b22] p-4 rounded-3xl border dark:border-gray-800 shadow-lg">
          <button disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo(0,0); }} className="px-6 py-2 border dark:border-gray-700 rounded-xl disabled:opacity-20 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">Anterior</button>
          <span className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">PÁGINA {page} DE {Math.ceil(filteredFiles.length / perPage)}</span>
          <button disabled={page >= Math.ceil(filteredFiles.length / perPage)} onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }} className="px-6 py-2 border dark:border-gray-700 rounded-xl disabled:opacity-20 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">Próxima</button>
        </div>
      )}

      {!loading && filteredFiles.length === 0 && q && (
        <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-tighter animate-pulse">
           Nenhum arquivo encontrado para esta categoria.
        </div>
      )}
    </div>
  );
}

function FileCard({ file, user, viewMode }) {
  const [showInfo, setShowInfo] = useState(false);
  const ext = file.ObjectName.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mov', 'webm'].includes(ext);
  const url = `${PUBLIC_CDN}/${file.fullPath.split('/').map(encodeURIComponent).join('/')}`;
  const sizeMb = (file.Length / 1024 / 1024).toFixed(2);
  const dateStr = new Date(file.LastChanged).toLocaleDateString('pt-BR');

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-[#161b22] p-4 rounded-2xl border dark:border-gray-800 flex items-center justify-between gap-4 hover:border-[#0e75d7] transition-all group">
        <div className="flex items-center gap-4 flex-grow min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0">
             {isVideo ? <Film className="text-white m-auto h-full" size={20}/> : <img src={url} className="w-full h-full object-cover" />}
          </div>
          <div className="min-w-0 flex-grow">
            <p className="text-xs font-black truncate dark:text-gray-200 uppercase tracking-tighter" title={file.ObjectName}>{file.ObjectName}</p>
            <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase">{ext} • {sizeMb} MB • {dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => window.open(url, '_blank')} className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-[#0e75d7] rounded-xl transition shadow-sm"><Eye size={18}/></button>
           <button onClick={() => download(file.ObjectName, file.fullPath.split('/').slice(0,-1).join('/'), user)} className="p-2.5 bg-[#0e75d7] text-white rounded-xl transition shadow-lg shadow-blue-600/20"><Download size={18}/></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161b22] rounded-[2rem] overflow-hidden shadow-sm border dark:border-gray-800 group hover:shadow-2xl hover:-translate-y-1 transition-all relative">
      <div className="aspect-square bg-gray-100 dark:bg-gray-950 flex items-center justify-center relative overflow-hidden">
        {isVideo ? <Film className="text-gray-400" size={32}/> : <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />}
        
        {/* Overlay buttons sempre visiveis em mobile, hover em desktop */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
           <button onClick={() => setShowInfo(!showInfo)} className="p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-[#0e75d7] transition"><Info size={14}/></button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-3 translate-y-full group-hover:translate-y-0 md:translate-y-full transition-transform">
          <button onClick={() => window.open(url, '_blank')} className="p-2 bg-white text-black rounded-full hover:bg-[#0e75d7] hover:text-white transition"><Eye size={18}/></button>
          <button onClick={() => download(file.ObjectName, file.fullPath.split('/').slice(0,-1).join('/'), user)} className="p-2 bg-white text-black rounded-full hover:bg-[#0e75d7] hover:text-white transition"><Download size={18}/></button>
        </div>
      </div>
      
      {/* Botões sempre visíveis abaixo para facilidade mobile */}
      <div className="p-4 space-y-3">
        <p className="text-[10px] font-black truncate dark:text-gray-300 uppercase tracking-tighter" title={file.ObjectName}>{file.ObjectName}</p>
        <div className="grid grid-cols-2 gap-2">
           <button onClick={() => window.open(url, '_blank')} className="flex items-center justify-center gap-1 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-[9px] font-black uppercase text-gray-500"><Eye size={12}/> Ver</button>
           <button onClick={() => download(file.ObjectName, file.fullPath.split('/').slice(0,-1).join('/'), user)} className="flex items-center justify-center gap-1 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[9px] font-black uppercase text-[#0e75d7]"><Download size={12}/> Baixar</button>
        </div>
      </div>

      {showInfo && (
        <div className="absolute inset-0 bg-white/95 dark:bg-[#161b22]/95 p-6 flex flex-col justify-center animate-in zoom-in duration-200">
           <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 text-gray-400"><X size={20}/></button>
           <h3 className="text-[10px] font-black uppercase text-[#0e75d7] mb-2 tracking-widest">Informações do Arquivo</h3>
           <div className="space-y-3 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase">
             <p>Nome: <span className="text-gray-900 dark:text-white break-all">{file.ObjectName}</span></p>
             <p>Formato: <span className="text-gray-900 dark:text-white">{ext}</span></p>
             <p>Tamanho: <span className="text-gray-900 dark:text-white">{sizeMb} MB</span></p>
             <p>Data: <span className="text-gray-900 dark:text-white">{dateStr}</span></p>
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
    } catch (e) { alert("Erro ao abrir pasta."); }
    setLoading(false);
  };

  useEffect(() => { load('Carnes'); }, []);

  const filtered = items.filter(i => i.ObjectName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-2 bg-white dark:bg-[#161b22] px-4 py-2 rounded-2xl border dark:border-gray-800 shadow-sm whitespace-nowrap">
           <Folder size={16} className="text-[#0e75d7]"/>
           {path.split('/').map((p, i, arr) => (
             <React.Fragment key={i}>
               <button className="text-[10px] font-black uppercase hover:text-[#0e75d7] transition-all tracking-tighter" onClick={() => load(arr.slice(0, i+1).join('/'))}>{p}</button>
               {i < arr.length - 1 && <ChevronRight size={12} className="opacity-30 text-gray-400"/>}
             </React.Fragment>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#161b22] rounded-[2.5rem] border dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="p-6 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
             <input className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0b0e14] text-sm border-none outline-none dark:text-white" placeholder="Filtrar nesta pasta (digite ano ou data)..." value={filter} onChange={e => setFilter(e.target.value)} />
           </div>
        </div>
        {loading ? <div className="p-32 text-center text-gray-400 animate-pulse font-black uppercase tracking-widest text-xs">Carregando dados...</div> : (
          <div className="divide-y dark:divide-gray-800">
            {filtered.length === 0 && <div className="p-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">Nenhuma pasta ou arquivo encontrado aqui.</div>}
            {filtered.map((it, i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition group" onClick={() => it.IsDirectory && load(`${path}/${it.ObjectName}`)}>
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${it.IsDirectory ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                    {it.IsDirectory ? <Folder size={22}/> : <FileText size={22}/>}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm dark:text-gray-200 group-hover:text-[#0e75d7] transition uppercase tracking-tighter">{it.ObjectName}</span>
                    {!it.IsDirectory && <p className="text-[9px] font-black uppercase text-gray-400 mt-1 tracking-widest">PDF • {(it.Length/1024).toFixed(1)} KB</p>}
                  </div>
                </div>
                {!it.IsDirectory && (
                   <div className="flex gap-2">
                     <button onClick={(e) => { e.stopPropagation(); window.open(`${PUBLIC_CDN}/${path}/${it.ObjectName}`, '_blank'); }} className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-xl transition"><Eye size={18}/></button>
                     <button onClick={(e) => { e.stopPropagation(); download(it.ObjectName, path, user); }} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-xl transition hover:bg-[#0e75d7] hover:text-white"><Download size={18}/></button>
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
  const [uploads, setUploads] = useState([]); // Array de status: { name: '', progress: 0, status: 'pending'|'loading'|'done'|'error' }
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setUploads(selected.map(f => ({ name: f.name, progress: 0, status: 'pending' })));
  };

  const startUpload = async () => {
    if (!files.length) return;
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      updateUploadStatus(i, { status: 'loading' });

      const form = new FormData();
      form.append('file', file);
      form.append('path', `${target}/${file.name}`);

      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user.token}` },
          body: form
        });

        if (res.ok) {
          updateUploadStatus(i, { status: 'done', progress: 100 });
        } else {
          updateUploadStatus(i, { status: 'error' });
        }
      } catch (e) {
        updateUploadStatus(i, { status: 'error' });
      }
      // Pequeno delay entre uploads para controle visual
      await new Promise(r => setTimeout(r, 400));
    }
    setIsUploading(false);
  };

  const updateUploadStatus = (index, data) => {
    setUploads(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...data };
      return copy;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-white dark:bg-[#161b22] p-10 rounded-[3rem] shadow-2xl border dark:border-gray-800">
        <div className="flex items-center gap-5 mb-10">
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 text-[#0e75d7] rounded-[1.5rem]">
             <Upload size={32}/>
          </div>
          <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter">Central de Upload</h2>
             <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Lojas Alvorada Sarandi</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest block mb-2">Selecione a Pasta de Destino</label>
            <select className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0b0e14] border-none outline-none font-bold text-sm dark:text-white focus:ring-2 focus:ring-[#0e75d7]" value={target} onChange={e => setTarget(e.target.value)}>
              <option value="Fprodutos">Fotos de Produtos</option>
              <option value="VideosProdutos/Videos YT">Vídeos para YouTube</option>
              <option value="VideosProdutos/Videos ML">Vídeos para Mercado Livre</option>
            </select>
          </div>
          
          <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 p-12 rounded-[2.5rem] text-center hover:border-[#0e75d7] transition-all cursor-pointer relative group bg-gray-50/30 dark:bg-gray-800/10">
            <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelection} />
            {files.length > 0 ? (
              <div className="flex flex-col items-center animate-in zoom-in">
                 <Files className="text-[#0e75d7] mb-3" size={48} />
                 <p className="font-extrabold text-sm uppercase tracking-tighter">{files.length} arquivo(s) selecionado(s)</p>
                 <p className="text-[9px] font-black text-gray-400 uppercase mt-2">Clique para alterar a seleção</p>
              </div>
            ) : (
              <div className="opacity-40 group-hover:opacity-100 transition-all transform group-hover:scale-105">
                <ImageIcon className="mx-auto mb-4" size={56} />
                <p className="font-black text-xs uppercase tracking-widest">Selecione um ou mais arquivos</p>
                <p className="text-[9px] font-bold text-gray-500 mt-2 uppercase">Imagens ou Vídeos suportados</p>
              </div>
            )}
          </div>

          {uploads.length > 0 && (
            <div className="space-y-3 bg-gray-50 dark:bg-[#0b0e14] p-6 rounded-[2rem]">
               <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest border-b dark:border-gray-800 pb-2 mb-4">Progresso do Envio</h3>
               {isUploading && <p className="text-xs font-black text-orange-500 animate-pulse mb-4 uppercase">⚠ Não saia desta página até concluir os uploads!</p>}
               
               <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {uploads.map((up, idx) => (
                    <div key={idx} className="space-y-1">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
                          <span className="truncate max-w-[70%] dark:text-gray-300">{up.name}</span>
                          <span className={up.status === 'done' ? 'text-green-500' : up.status === 'error' ? 'text-red-500' : 'text-blue-500'}>
                            {up.status === 'pending' ? 'Pendente' : up.status === 'loading' ? 'Enviando...' : up.status === 'done' ? 'Concluído' : 'Erro'}
                          </span>
                       </div>
                       <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${up.status === 'done' ? 'bg-green-500' : up.status === 'error' ? 'bg-red-500' : 'bg-[#0e75d7]'}`} 
                            style={{ width: `${up.progress}%` }}
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <button 
            disabled={!files.length || isUploading} 
            onClick={startUpload}
            className="w-full bg-black dark:bg-[#0e75d7] text-white font-black py-5 rounded-3xl hover:opacity-90 transition-all shadow-xl shadow-blue-600/10 disabled:opacity-20 active:scale-95 uppercase tracking-widest text-sm"
          >
            {isUploading ? 'PROCESSANDO ENVIOS...' : 'INICIAR UPLOADS'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

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
  } catch (e) { 
    alert("Falha no download. O arquivo pode ter sido removido ou há erro de rede."); 
  }
}

function encodeURIComponentPath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
};;