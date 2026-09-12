import React, { useState } from 'react';
import { 
  ShoppingCart, 
  X, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Plus, 
  DollarSign, 
  Package, 
  Layers,
  ExternalLink
} from 'lucide-react';

export default function BOMCartModal({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddItem
}) {
  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemCost, setNewItemCost] = useState(1.5);

  if (!isOpen) return null;

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filterText.toLowerCase()) ||
    (item.projectTitle && item.projectTitle.toLowerCase().includes(filterText.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(filterText.toLowerCase()))
  );

  const totalCost = items.reduce((acc, item) => acc + (item.unitCost * item.quantity), 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleExportCSV = () => {
    const headers = ['Componente', 'Cantidad', 'Coste Unitario ($)', 'Coste Subtotal ($)', 'Proyecto / Origen', 'Categoria'];
    const rows = items.map(item => [
      `"${(item.name || '').replace(/"/g, '""')}"`,
      item.quantity,
      item.unitCost.toFixed(2),
      (item.unitCost * item.quantity).toFixed(2),
      `"${(item.projectTitle || 'Personalizado').replace(/"/g, '""')}"`,
      `"${(item.category || 'General').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BOM_Consolidada_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyClipboard = () => {
    const text = items.map(i => `${i.quantity}x ${i.name} ($${(i.unitCost * i.quantity).toFixed(2)}) [${i.projectTitle || 'BOM'}]`).join('\n') + 
      `\n\nTOTAL: $${totalCost.toFixed(2)} (${items.length} componentes ?nicos)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem({
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      quantity: Math.max(1, parseInt(newItemQty) || 1),
      unitCost: Math.max(0, parseFloat(newItemCost) || 0),
      projectTitle: 'Personalizado',
      category: 'Manual'
    });
    setNewItemName('');
    setNewItemQty(1);
    setNewItemCost(1.5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Cesta BOM Consolidada
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
                  {items.length} componentes ? {totalItemsCount} unidades
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gestor global de compras de componentes electr?nicos para tus proyectos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <>
                <button
                  onClick={handleCopyClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                  title="Copiar lista como texto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-all"
                  title="Descargar archivo CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV
                </button>

                <button
                  onClick={onClearCart}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/80 transition-all"
                  title="Vaciar cesta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add custom item form */}
          <form onSubmit={handleAddNewItem} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              A?adir componente extra:
            </span>
            <input
              type="text"
              placeholder="Nombre del componente (ej. Resistencia 4.7k 1/4W)..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1 min-w-[200px] bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Cant:</span>
              <input
                type="number"
                min="1"
                max="999"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 text-center focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">P. Unit ($):</span>
              <input
                type="number"
                step="0.05"
                min="0"
                value={newItemCost}
                onChange={(e) => setNewItemCost(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 text-center focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow"
            >
              A?adir
            </button>
          </form>

          {/* Search Filter */}
          {items.length > 0 && (
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Filtrar componentes por nombre o proyecto..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-72 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Presupuesto Estimado: <strong className="text-emerald-400 font-mono text-sm">${totalCost.toFixed(2)} USD</strong></span>
              </div>
            </div>
          )}

          {/* Items Table */}
          {items.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <Package className="w-12 h-12 mx-auto text-slate-600 stroke-1" />
              <p className="text-base text-slate-300 font-semibold">Tu Cesta BOM est? vac?a</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                A?ade listas de componentes desde los detalles de cada proyecto o a?ade componentes personalizados arriba para consolidar tu pedido de electr?nica (Mouser, DigiKey, LCSC, AliExpress).
              </p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Componente</th>
                    <th className="px-4 py-3 font-semibold">Origen / Proyecto</th>
                    <th className="px-4 py-3 font-semibold text-center">Cantidad</th>
                    <th className="px-4 py-3 font-semibold text-right">P. Unitario</th>
                    <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                    <th className="px-4 py-3 text-center">Acci?n</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {item.name}
                        {item.category && (
                          <span className="block text-[10px] text-cyan-400 font-mono">
                            {item.category}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 max-w-[180px] truncate">
                        {item.projectTitle || 'General'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-semibold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-400">
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                        ${(item.unitCost * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Eliminar item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>
              Total Componentes: <strong className="text-white font-mono">{items.length}</strong>
            </span>
            <span>
              Unidades Totales: <strong className="text-white font-mono">{totalItemsCount}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Presupuesto Estimado</span>
              <span className="text-xl font-bold font-mono text-emerald-400">${totalCost.toFixed(2)} USD</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
