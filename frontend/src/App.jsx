import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './api/client.js';
import { AuthCard } from './components/AuthCard.jsx';
import { AssetForm } from './components/AssetForm.jsx';
import { AssetList } from './components/AssetList.jsx';

const resources = {
  carros: { label: 'Carros', path: '/api/carros' },
  motos: { label: 'Motos', path: '/api/motos' },
  roupas: { label: 'Marcas de roupa', path: '/api/marcas-roupa' },
};

const emptyForms = {
  carros: { nome: '', marca: '', modelo: '', ano: '', placa: '', cor: '', valorEstimado: '', observacoes: '' },
  motos: { nome: '', marca: '', modelo: '', ano: '', cilindradas: '', placa: '', cor: '', valorEstimado: '', observacoes: '' },
  roupas: { nome: '', marca: '', tipo: '', tamanho: '', cor: '', quantidade: 1, valorEstimado: '', observacoes: '' },
};

function normalizePayload(type, form) {
  const payload = { ...form };

  ['ano', 'cilindradas', 'quantidade', 'valorEstimado'].forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== '') {
      payload[field] = Number(payload[field]);
    }
  });

  Object.keys(payload).forEach((key) => {
    if (payload[key] === '' || payload[key] === null) {
      delete payload[key];
    }
  });

  if (type === 'roupas' && !payload.quantidade) {
    payload.quantidade = 1;
  }

  return payload;
}

function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('carros');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForms.carros);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const currentResource = useMemo(() => resources[active], [active]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch('/api/auth/me')
      .then((data) => setUser(data.usuario))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      loadItems();
      setForm(emptyForms[active]);
      setEditing(null);
    }
  }, [active, user]);

  async function loadItems() {
    setError('');
    try {
      const data = await apiFetch(currentResource.path);
      setItems(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setItems([]);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const payload = normalizePayload(active, form);
      const path = editing ? `${currentResource.path}/${editing._id}` : currentResource.path;
      const method = editing ? 'PUT' : 'POST';

      await apiFetch(path, {
        method,
        body: JSON.stringify(payload),
      });

      setMessage(editing ? 'Bem atualizado com sucesso.' : 'Bem cadastrado com sucesso.');
      setForm(emptyForms[active]);
      setEditing(null);
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(item) {
    setEditing(item);
    setForm({ ...emptyForms[active], ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Tem certeza que deseja excluir este bem?');
    if (!confirmed) return;

    setError('');
    setMessage('');

    try {
      await apiFetch(`${currentResource.path}/${id}`, { method: 'DELETE' });
      setMessage('Bem excluído com sucesso.');
      await loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  const totalValue = items.reduce((sum, item) => sum + Number(item.valorEstimado || 0), 0);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Carregando sistema...</div>;
  }

  if (!user) {
    return <AuthCard onAuth={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Gerenciamento de bens</p>
            <h1 className="text-3xl font-black text-slate-950">Painel de bens pessoais</h1>
            <p className="mt-1 text-sm text-slate-500">Logado como {user.nome} • Perfil {user.role}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/api-docs" target="_blank" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Swagger
            </a>
            <button onClick={handleLogout} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-red-600">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <Stat label="Itens cadastrados" value={items.length} />
          <Stat label="Valor estimado" value={totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        </section>

        <nav className="mb-6 flex flex-wrap gap-3">
          {Object.entries(resources).map(([key, resource]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
                active === key ? 'bg-sky-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {resource.label}
            </button>
          ))}
        </nav>

        {message && <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{message}</div>}
        {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <AssetForm
            type={active}
            form={form}
            onChange={updateField}
            onSubmit={handleSubmit}
            editing={editing}
            onCancel={() => {
              setEditing(null);
              setForm(emptyForms[active]);
            }}
          />

          <AssetList items={items} type={active} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

export default App;
