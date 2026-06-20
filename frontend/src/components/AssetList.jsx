function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function AssetList({ items, type, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Nenhum bem cadastrado ainda. Bora tirar isso do zero.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <article key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">{item.nome}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {item.marca}
                {item.modelo ? ` • ${item.modelo}` : ''}
                {item.tipo ? ` • ${item.tipo}` : ''}
              </p>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
              {type === 'roupas' ? 'roupa' : type.slice(0, -1)}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {item.ano && <Info label="Ano" value={item.ano} />}
            {item.placa && <Info label="Placa" value={item.placa} />}
            {item.cilindradas && <Info label="CC" value={item.cilindradas} />}
            {item.tamanho && <Info label="Tamanho" value={item.tamanho} />}
            {item.cor && <Info label="Cor" value={item.cor} />}
            {item.quantidade && <Info label="Qtd." value={item.quantidade} />}
            <Info label="Valor" value={money(item.valorEstimado)} />
          </dl>

          {item.observacoes && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{item.observacoes}</p>}

          <div className="mt-5 flex gap-3">
            <button onClick={() => onEdit(item)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Editar
            </button>
            <button onClick={() => onDelete(item._id)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">
              Excluir
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 font-bold text-slate-700">{value}</dd>
    </div>
  );
}
