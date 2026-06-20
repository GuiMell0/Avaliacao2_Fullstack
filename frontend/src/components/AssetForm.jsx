const placeholders = {
  carros: {
    nome: 'Meu carro',
    marca: 'Honda',
    modelo: 'Civic',
    ano: '2020',
    valorEstimado: '95000',
  },
  motos: {
    nome: 'Moto de passeio',
    marca: 'Yamaha',
    modelo: 'Fazer',
    ano: '2022',
    cilindradas: '250',
    valorEstimado: '22000',
  },
  roupas: {
    nome: 'Jaqueta favorita',
    marca: 'Nike',
    tipo: 'jaqueta',
    tamanho: 'M',
    quantidade: '1',
    valorEstimado: '350',
  },
};

export function AssetForm({ type, form, onChange, onSubmit, editing, onCancel }) {
  const current = placeholders[type];

  function input(field, label, inputType = 'text') {
    return (
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <input
          type={inputType}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          value={form[field] || ''}
          placeholder={current[field] || ''}
          onChange={(event) => onChange(field, event.target.value)}
        />
      </label>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-slate-900">
          {editing ? 'Editar bem' : 'Cadastrar bem'}
        </h3>
        {editing && (
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-500 hover:text-red-600">
            Cancelar edição
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {input('nome', 'Nome')}
        {input('marca', 'Marca')}
        {type !== 'roupas' && input('modelo', 'Modelo')}
        {type === 'roupas' && input('tipo', 'Tipo')}
        {type === 'roupas' && input('tamanho', 'Tamanho')}
        {type !== 'roupas' && input('ano', 'Ano', 'number')}
        {type === 'motos' && input('cilindradas', 'Cilindradas', 'number')}
        {type !== 'roupas' && input('placa', 'Placa')}
        {input('cor', 'Cor')}
        {type === 'roupas' && input('quantidade', 'Quantidade', 'number')}
        {input('valorEstimado', 'Valor estimado', 'number')}
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Observações</span>
        <textarea
          className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          value={form.observacoes || ''}
          onChange={(event) => onChange('observacoes', event.target.value)}
          placeholder="Detalhes, estado de conservação, notas..."
        />
      </label>

      <button className="mt-4 rounded-xl bg-sky-600 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-sky-700">
        {editing ? 'Salvar alterações' : 'Cadastrar'}
      </button>
    </form>
  );
}
