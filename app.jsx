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
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// --- CONFIGURAÇÃO ---
const API_BASE = 'https://bunny-proxy.onrender.com/api'; 
const PUBLIC_CDN = 'https://lojasalvorada.b-cdn.net';

// --- UTILITÁRIOS ---

const encodeURIComponentPath = (path) => {
  if (!path) return '';
  return path.split('/').map(encodeURIComponent).join('/');
};

const downloadFile = async (path, user) => {
  try {
    const res = await fetch(`${API_BASE}/download?path=${encodeURIComponent(path)}`, {
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!res.ok) throw new Error('Falha no download');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path.split('/').pop();
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) { 
    alert("Falha ao realizar o download. Verifique a sua ligação."); 
  }
};

// --- COMPONENTES AUXILIARES ---

const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 font-black text-sm transition-all ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
  >
    {icon} {label}
  </button>
);

const MobileTab = ({ active, onClick, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'}`}
  >
    {label}
  </button>
);

const Pagination = ({ current, total, onChange }) => (
  <div className="flex justify-center items-center gap-6 bg-white dark:bg-gray-900 p-4 rounded-3xl border dark:border-gray-800 shadow-xl w-fit mx-auto mt-10">
     <button disabled={current === 1} onClick={() => onChange(current - 1)} className="font-bold p-2 disabled:opacity-20 transition-opacity">Anterior</button>
     <span className="text-xs font-black uppercase tracking-widest text-gray-400">Página {current} de {total}</span>
     <button disabled={current === total} onClick={() => onChange(current + 1)} className="font-bold p-2 disabled:opacity-20 transition-opacity">Próxima</button>
  </div>
);

const FileCard = ({ file, user }) => {
  const ext = file.ObjectName.split('.').pop().toLowerCase();
  const isVideo = ['mp4', 'mov', 'webm'].includes(ext);
  const mediaUrl = `${PUBLIC_CDN}/${encodeURIComponentPath(file.fullPath)}`;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 group hover:shadow-2xl transition-all duration-500 relative">
      <div className="aspect-square bg-gray-50 dark:bg-gray-950 flex items-center justify-center relative overflow-hidden">
        {isVideo ? (
          <Film className="text-gray-300 group-hover:text-red-600 transition-colors" size={40} />
        ) : (
          <img src={mediaUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" loading="lazy" alt={file.ObjectName} />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
           <button onClick={() => window.open(mediaUrl, '_blank')} className="p-3 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition-all"><ImageIcon size={20}/></button>
           <button onClick={() => downloadFile(file.fullPath, user)} className="p-3 bg-white text-black rounded-full hover:bg-red-600 hover:text-white transition-all"><Download size={20}/></button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[10px] font-bold truncate dark:text-gray-300 uppercase tracking-tighter" title={file.ObjectName}>{file.ObjectName}</p>
      </div>
    </div>
  );
};

// --- ABAS ---

const SearchTab = ({ user }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    let allMatches = [];
    const paths = ['Fprodutos', 'VideosProdutos/Videos YT', 'VideosProdutos/Videos ML'];
    
    try {
      for (const path of paths) {
        const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(path)}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        
        // Verificação de segurança: garantir que data é um array
        if (Array.isArray(data)) {
          const matches = data.filter(f => f.ObjectName.toLowerCase().includes(query.toLowerCase()));
          allMatches = [...allMatches, ...matches.map(f => ({ ...f, fullPath: `${path}/${f.ObjectName}` }))];
        }
      }
      setResults(allMatches);
      setPage(1);
    } catch (e) {
      console.error("Erro na busca:", e);
      alert("Ocorreu um erro ao realizar a busca. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-xl border dark:border-gray-800 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
          <input 
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none outline-none focus:ring-2 focus:ring-red-500 dark:text-white" 
            placeholder="Digite o código SKU ou nome..." 
            value={query}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-red-600/20 active:scale-95">
          {loading ? 'BUSCANDO...' : 'BUSCAR'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {paginatedResults.map((file, idx) => (
          <FileCard key={idx} file={file} user={user} />
        ))}
      </div>

      {results.length > itemsPerPage && (
        <Pagination current={page} total={Math.ceil(results.length / itemsPerPage)} onChange={setPage} />
      )}
      
      {!loading && results.length === 0 && query && (
        <div className="text-center py-20 text-gray-500">
           Nenhum arquivo encontrado para esta pesquisa.
        </div>
      )}
    </div>
  );
};

const CarnesTab = ({ user }) => {
  const [currentPath, setCurrentPath] = useState('Carnes');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFolder = async (path) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/list?path=${encodeURIComponent(path)}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      
      // Verificação de segurança: garantir que data é um array
      setItems(Array.isArray(data) ? data : []);
      setCurrentPath(path);
    } catch (e) {
      console.error("Erro ao carregar pasta:", e);
      alert("Erro ao carregar a pasta.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user) fetchFolder('Carnes'); 
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide text-sm">
        <Folder size={18} className="text-red-500 flex-shrink-0"/>
        {currentPath.split('/').map((p, i, arr) => (
          <React.Fragment key={i}>
            <button 
              className="font-bold hover:text-red-600 whitespace-nowrap transition"
              onClick={() => fetchFolder(arr.slice(0, i + 1).join('/'))}
            >{p}</button>
            {i < arr.length - 1 && <ChevronRight size={14} className="opacity-30"/>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[2rem] border dark:border-gray-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold animate-pulse">Carregando arquivos...</div>
        ) : (
          <div className="divide-y dark:divide-gray-800">
            {items.length === 0 && (
              <div className="p-10 text-center text-gray-500">Pasta vazia.</div>
            )}
            {items.map((item, i) => (
              <div 
                key={i} 
                className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition group"
                onClick={() => item.IsDirectory ? fetchFolder(`${currentPath}/${item.ObjectName}`) : null}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.IsDirectory ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'}`}>
                    {item.IsDirectory ? <Folder size={22}/> : <FileText size={22}/>}
                  </div>
                  <div>
                    <p className="font-bold group-hover:text-red-600 transition">{item.ObjectName}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.IsDirectory ? 'Pasta' : `${(item.Length/1024).toFixed(0)} KB`}</p>
                  </div>
                </div>
                {!item.IsDirectory && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); downloadFile(`${currentPath}/${item.ObjectName}`, user); }} 
                    className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-red-600 hover:text-white rounded-xl transition"
                  >
                    <Download size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UploadTab = ({ user }) => {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState('Fprodutos');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', `${folder}/${file.name}`);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` },
        body: formData
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: 'Arquivo enviado com sucesso para a Bunny.net!' });
        setFile(null);
      } else {
        const data = await res.json();
        setStatus({ type: 'error', msg: data.error || 'Erro ao processar o upload.' });
      }
    } catch (e) {
      setStatus({ type: 'error', msg: 'Falha na conexão com o servidor.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-[3rem] shadow-2xl border dark:border-gray-800 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 mb-10">
         <div className="p-5 bg-red-600 text-white rounded-[1.5rem] shadow-xl shadow-red-600/30">
           <Upload size={32}/>
         </div>
         <div>
           <h2 className="text-2xl font-black">Central de Upload</h2>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Produtos e Vídeos</p>
         </div>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 ml-1">Pasta de Destino</label>
          <select 
            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 outline-none font-bold"
            value={folder}
            onChange={e => setFolder(e.target.value)}
          >
            <option value="Fprodutos">Fotos de Produtos (Fprodutos)</option>
            <option value="VideosProdutos/Videos YT">Vídeos YouTube</option>
            <option value="VideosProdutos/Videos ML">Vídeos Mercado Livre</option>
          </select>
        </div>
        
        <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] p-10 text-center hover:border-red-500 transition-all cursor-pointer relative group bg-gray-50/50 dark:bg-gray-800/20">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files[0])} />
          {file ? (
            <div className="animate-in zoom-in duration-300">
               <CheckCircle className="mx-auto mb-3 text-green-500" size={48}/>
               <p className="font-black text-lg break-all">{file.name}</p>
            </div>
          ) : (
            <div className="text-gray-400 group-hover:text-red-500 transition-colors">
              <ImageIcon className="mx-auto mb-3 opacity-20" size={64}/>
              <p className="font-bold">Clique ou arraste o arquivo aqui</p>
              <p className="text-[10px] font-black uppercase tracking-tighter mt-1">Imagens e Vídeos suportados</p>
            </div>
          )}
        </div>

        {status.msg && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20' : 'bg-red-50 text-red-700 dark:bg-red-900/20'}`}>
            {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {status.msg}
          </div>
        )}

        <button disabled={!file || uploading} className="w-full bg-black dark:bg-red-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-30">
          {uploading ? 'ENVIANDO...' : 'INICIAR UPLOAD'}
        </button>
      </form>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); 
  const [darkMode, setDarkMode] = useState(true);
  
  // Estado de Autenticação
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [loginForm, setLoginForm] = useState({ username: '', password: '', captcha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('alvorada_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('alvorada_session');
      }
    }
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ question: `${n1} + ${n2}`, answer: n1 + n2 });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (parseInt(loginForm.captcha) !== captcha.answer) {
      setError('Verificação de segurança incorreta.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginForm.username, password: loginForm.password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('alvorada_session', JSON.stringify(data));
      } else {
        setError(data.error || 'Erro ao autenticar.');
        generateCaptcha();
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('alvorada_session');
  };

  if (!user) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png" className="h-16 mx-auto mb-4" alt="Alvorada" />
              <h2 className="text-2xl font-black dark:text-white tracking-tight">Sistema Alvorada</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Acesso Restrito</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Usuário" 
                className="w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full p-4 rounded-2xl border dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-all"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
              
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border dark:border-gray-700">
                <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold select-none">{captcha.question} =</span>
                <input 
                  type="number" 
                  placeholder="?" 
                  className="w-full bg-transparent dark:text-white outline-none font-bold text-lg"
                  value={loginForm.captcha}
                  onChange={e => setLoginForm({...loginForm, captcha: e.target.value})}
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm font-bold flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl"><AlertCircle size={16}/> {error}</div>}

              <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-600/30 active:scale-95 disabled:opacity-50">
                {loading ? 'VERIFICANDO...' : 'ENTRAR NO SISTEMA'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
        
        {/* Navbar */}
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-10">
               <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/LOGO%20BRANCA%20COM%20ESCRITA.png" className="h-10 hidden dark:block" alt="Logo" />
               <img src="https://lojasalvorada.b-cdn.net/Logos%20Loja/PNG/MARCA%20COLORIDA.png" className="h-10 dark:hidden" alt="Logo" />
               
               <div className="hidden lg:flex items-center gap-2">
                 <NavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={18}/>} label="Produtos" />
                 {user.role === 'admin' && <NavButton active={activeTab === 'carnes'} onClick={() => setActiveTab('carnes')} icon={<FileText size={18}/>} label="Carnês" />}
                 {['admin', 'editor'].includes(user.role) && <NavButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={<Upload size={18}/>} label="Upload" />}
               </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-black uppercase text-gray-400 tracking-widest">{user.name}</span>
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition focus:outline-none">
                {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-indigo-600"/>}
              </button>
              <button onClick={handleLogout} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition focus:outline-none">
                <LogOut size={20}/>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="lg:hidden flex border-t dark:border-gray-800 bg-white dark:bg-gray-900">
             <MobileTab active={activeTab === 'search'} onClick={() => setActiveTab('search')} label="Produtos" />
             {user.role === 'admin' && <MobileTab active={activeTab === 'carnes'} onClick={() => setActiveTab('carnes')} label="Carnês" />}
             {['admin', 'editor'].includes(user.role) && <MobileTab active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} label="Upload" />}
          </div>
        </nav>

        <main className="flex-grow max-w-7xl mx-auto p-6 sm:p-10 w-full">
           {activeTab === 'search' && <SearchTab user={user} />}
           {activeTab === 'carnes' && <CarnesTab user={user} />}
           {activeTab === 'upload' && <UploadTab user={user} />}
        </main>

        <footer className="p-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
           &copy; {new Date().getFullYear()} Lojas Alvorada • Sistema de Uso Interno
        </footer>
      </div>
    </div>
  );
};

export default App;