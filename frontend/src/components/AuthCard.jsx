import { useState } from 'react';
import { apiFetch } from '../api/client.js';

const emptyForm = { nome: '', email: '', senha: '' };

export function AuthCard({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, senha: form.senha }
        : form;

      const data = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('token', data.token);
      onAuth(data.usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10">
        <section className="hidden flex-1 lg:block">
          <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200">
             Gerenciamento de Bens pessoais
          </span>
          <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight">
            Controle seus bens sem virar refém de planilha perdida.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Cadastre carros, motos e marcas/itens de roupa em um sistema com autenticação e API protegida
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            {['Cadastro', 'Edição', 'Exclusão'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-xl">
                <p className="text-sm font-bold text-sky-200">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white p-7 text-slate-900 shadow-2xl">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">Acesso</p>
            <h2 className="mt-2 text-3xl font-black">
              {mode === 'login' ? 'Entrar no sistema' : 'Criar cadastro'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Admin padrão: <strong>admin@bens.com</strong> / <strong>Admin@123456</strong>
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Nome</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  value={form.nome}
                  onChange={(event) => updateField('nome', event.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">E-mail</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="voce@email.com"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Senha</span>
              <input
                type="password"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                value={form.senha}
                onChange={(event) => updateField('senha', event.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <button
            type="button"
            className="mt-5 w-full text-sm font-semibold text-sky-700 hover:text-sky-900"
            onClick={() => {
              setMode((current) => (current === 'login' ? 'register' : 'login'));
              setError('');
            }}
          >
            {mode === 'login' ? 'Não tenho conta, quero cadastrar' : 'Já tenho conta, quero entrar'}
          </button>
        </section>
      </div>
    </div>
  );
}
