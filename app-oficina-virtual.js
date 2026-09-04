/* =====================================================================
   Oficina Virtual Ciencuadras — Prototipo interactivo (SPA vanilla JS)
   ===================================================================== */
(function () {
  'use strict';

  const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const fmtCOP = (n) => COP.format(Math.round(n));
  const fmtNum = (n) => new Intl.NumberFormat('es-CO').format(Math.round(n));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const el = (id) => document.getElementById(id);

  function toast(msg, type = 'info') {
    const host = el('toastHost');
    const colors = { info: 'bg-cc-navy', success: 'bg-green-600', warning: 'bg-cc-amber text-cc-navy', error: 'bg-cc-red' };
    const t = document.createElement('div');
    t.className = `toast ${colors[type] || colors.info} text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs`;
    t.textContent = msg;
    host.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }

  function probBadge(level) {
    const map = { Alta: 'bg-green-100 text-green-700', Media: 'bg-cc-amber/25 text-cc-navy', Baja: 'bg-red-100 text-red-700' };
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[level] || 'bg-gray-100 text-gray-600'}">${level}</span>`;
  }

  function createStore(initial) {
    let state = initial;
    const subs = [];
    return {
      get: () => state,
      set: (patch) => { state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }; subs.forEach((fn) => fn(state)); },
      subscribe: (fn) => { subs.push(fn); return () => subs.splice(subs.indexOf(fn), 1); }
    };
  }

  /* MODULO 1 — OPTIMIZADOR DE ANUNCIO IA */
  const modOptimizador = (function () {
    const store = createStore({
      titulo: 'Apartamento en arriendo — Cedritos, Bogotá',
      descripcion: 'Apartamento de 2 habitaciones, 1 baño, cocina integral. Zona tranquila y bien ubicada cerca de transporte.',
      precio: 2400000, zonaPrecioMin: 2100000, zonaPrecioMax: 3200000, fotosMejoradas: false,
      atributos: { parqueaderoVisitantes: false, administracionIncluida: false, gimnasio: false, petFriendly: false, deposito: false }
    });

    function computeScore(s) {
      let score = 0;
      score += s.fotosMejoradas ? 30 : 15;
      const desc = s.descripcion.trim();
      const words = desc ? desc.split(/\s+/).length : 0;
      let descScore = clamp(Math.round((words / 60) * 22), 0, 22);
      const kw = ['parqueadero', 'administración', 'administracion', 'gimnasio', 'iluminado', 'remodelado', 'transporte'];
      const hits = kw.filter((k) => desc.toLowerCase().includes(k)).length;
      descScore += Math.min(hits * 2, 8);
      score += Math.min(descScore, 30);
      const attrCount = Object.values(s.atributos).filter(Boolean).length;
      score += attrCount * 5;
      if (s.precio >= s.zonaPrecioMin && s.precio <= s.zonaPrecioMax) score += 15;
      else { const mid = (s.zonaPrecioMin + s.zonaPrecioMax) / 2; const dev = Math.abs(s.precio - mid) / mid; score += clamp(Math.round(15 - dev * 30), 0, 15); }
      return clamp(Math.round(score), 0, 100);
    }

    const attrLabels = {
      parqueaderoVisitantes: 'Parqueadero de visitantes', administracionIncluida: 'Administración incluida',
      gimnasio: 'Gimnasio / zona húmeda', petFriendly: 'Pet friendly', deposito: 'Depósito / bodega'
    };

    function scoreColor(score) { if (score >= 85) return '#277619'; if (score >= 60) return '#FF9D21'; return '#DC0A0A'; }

    function render() {
      const s = store.get();
      const score = computeScore(s);
      const strong = score >= 85;
      const color = scoreColor(score);
      const circ = 2 * Math.PI * 52;
      const offset = circ - (score / 100) * circ;
      const range = s.zonaPrecioMax - s.zonaPrecioMin;
      const posPct = clamp(((s.precio - s.zonaPrecioMin) / range) * 100, 0, 100);
      const inRange = s.precio >= s.zonaPrecioMin && s.precio <= s.zonaPrecioMax;
      const photoBadge = s.fotosMejoradas
        ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">Óptimas</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">Baja luz / resolución</span>';

      el('view-optimizador').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6 flex items-center gap-5">
            <div class="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 120 120" class="w-32 h-32 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" stroke-width="12"/>
                <circle class="score-ring" cx="60" cy="60" r="52" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-3xl font-extrabold" style="color:${color}">${score}</span>
                <span class="text-[10px] text-gray-400 uppercase tracking-wide">/ 100</span>
              </div>
            </div>
            <div>
              <p class="text-xs font-semibold text-cc-text uppercase">Score de Calidad IA</p>
              <p class="text-sm text-cc-navy font-bold mt-1">${strong ? 'Anuncio destacado' : score >= 60 ? 'Mejorable' : 'Requiere atención'}</p>
              <p class="text-xs text-gray-500 mt-2 leading-relaxed">La IA evalúa fotos, descripción, atributos y precio frente a la competencia.</p>
            </div>
          </div>
          <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="card rounded-xl border shadow-sm p-6 ${strong ? 'bg-green-50 border-green-200' : 'bg-white border-cc-border'}">
              <div class="flex items-center justify-between"><span class="text-xs font-semibold text-cc-text uppercase">Visualizaciones estimadas</span>${strong ? '<span class="text-green-600 text-xs font-bold">activo</span>' : '<span class="text-gray-400 text-xs">bloqueado</span>'}</div>
              <p class="text-3xl font-extrabold mt-2 ${strong ? 'text-green-600' : 'text-gray-300'}">${strong ? '+115%' : '—'}</p>
              <p class="text-xs text-gray-500 mt-1">${strong ? 'Al superar 85/100 tu anuncio entra a resultados destacados.' : 'Alcanza 85+ para desbloquear el impulso.'}</p>
            </div>
            <div class="card rounded-xl border shadow-sm p-6 ${strong ? 'bg-green-50 border-green-200' : 'bg-white border-cc-border'}">
              <div class="flex items-center justify-between"><span class="text-xs font-semibold text-cc-text uppercase">Leads cualificados</span>${strong ? '<span class="text-green-600 text-xs font-bold">activo</span>' : '<span class="text-gray-400 text-xs">bloqueado</span>'}</div>
              <p class="text-3xl font-extrabold mt-2 ${strong ? 'text-green-600' : 'text-gray-300'}">${strong ? '+42%' : '—'}</p>
              <p class="text-xs text-gray-500 mt-1">${strong ? 'Mejores fotos y datos completos atraen leads con intención real.' : 'Completa el diagnóstico para proyectar leads.'}</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Calidad de fotos</h3>${photoBadge}</div>
            <div class="flex gap-2 mb-4">
              ${[1, 2, 3, 4].map(() => `<div class="flex-1 aspect-video rounded-lg border ${s.fotosMejoradas ? 'border-green-300' : 'border-cc-border'} relative overflow-hidden" style="background:${s.fotosMejoradas ? 'linear-gradient(135deg,#e8f5ee,#cfeede)' : 'linear-gradient(135deg,#3a3a3a,#5a5a5a)'}"><span class="absolute bottom-1 right-1 text-[9px] px-1 rounded ${s.fotosMejoradas ? 'bg-green-600 text-white' : 'bg-black/60 text-white'}">${s.fotosMejoradas ? 'HD' : 'oscura'}</span></div>`).join('')}
            </div>
            <button id="btnFotos" class="w-full text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 ${s.fotosMejoradas ? 'bg-green-100 text-green-700 cursor-default' : 'bg-cc-navy text-white hover:bg-cc-navy2'}">
              ${s.fotosMejoradas ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Fotos optimizadas (+15 aplicado)' : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m0 16v1m8-9h1M3 12h1"/></svg> Mejorar fotos con IA'}
            </button>
          </div>
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <div class="flex items-center justify-between mb-1"><h3 class="text-sm font-bold text-cc-navy">Benchmark de precio</h3><span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${inRange ? 'bg-green-100 text-green-700' : 'bg-cc-amber/25 text-cc-navy'}">${inRange ? 'En rango ideal' : 'Fuera de rango'}</span></div>
            <p class="text-xs text-gray-500 mb-4">Inmuebles similares en Cedritos: ${fmtCOP(s.zonaPrecioMin)} – ${fmtCOP(s.zonaPrecioMax)}</p>
            <div class="relative h-3 rounded-full bg-gradient-to-r from-cc-blue via-green-400 to-cc-red mb-2"><div class="absolute -top-1.5 w-6 h-6 rounded-full bg-white border-2 border-cc-navy shadow -ml-3" style="left:${posPct}%"></div></div>
            <div class="flex justify-between text-[10px] text-gray-400 mb-4"><span>${fmtCOP(s.zonaPrecioMin)}</span><span>${fmtCOP(s.zonaPrecioMax)}</span></div>
            <label class="text-xs font-semibold text-cc-text">Tu precio: <span class="text-cc-navy font-bold">${fmtCOP(s.precio)}</span> / mes</label>
            <input id="inpPrecio" type="range" class="cc-range w-full mt-2" min="${s.zonaPrecioMin - 500000}" max="${s.zonaPrecioMax + 500000}" step="50000" value="${s.precio}">
          </div>
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Descripción & título</h3><span class="text-[11px] text-gray-400" id="wordCount"></span></div>
            <input id="inpTitulo" class="w-full text-sm border border-cc-border rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-cc-blue" value="${s.titulo.replace(/"/g, '&quot;')}">
            <textarea id="inpDesc" rows="4" class="w-full text-sm border border-cc-border rounded-lg px-3 py-2 focus:outline-none focus:border-cc-blue resize-none">${s.descripcion}</textarea>
            <p class="text-[11px] text-gray-500 mt-2">El score se recalcula en vivo mientras editas.</p>
          </div>
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <h3 class="text-sm font-bold text-cc-navy mb-1">Atributos & recomendaciones IA</h3>
            <div class="bg-cc-blue/10 border border-cc-blue/30 rounded-lg px-3 py-2 mb-3 flex gap-2">
              <svg class="w-4 h-4 text-cc-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="text-[11px] text-cc-navy leading-snug">Recomendación IA: agrega si incluye <b>parqueadero de visitantes</b> y <b>administración</b>, son los filtros más usados en esta zona.</p>
            </div>
            <div class="space-y-2">
              ${Object.keys(attrLabels).map((k) => `<label class="flex items-center justify-between text-sm cursor-pointer"><span>${attrLabels[k]}</span><input type="checkbox" data-attr="${k}" ${s.atributos[k] ? 'checked' : ''} class="attr-check w-4 h-4 accent-cc-navy"></label>`).join('')}
            </div>
          </div>
        </div>`;

      const wc = s.descripcion.trim() ? s.descripcion.trim().split(/\s+/).length : 0;
      const wcEl = el('wordCount');
      if (wcEl) wcEl.textContent = `${wc} palabras`;
      bind();
    }

    function bind() {
      const btn = el('btnFotos');
      if (btn && !store.get().fotosMejoradas) {
        btn.addEventListener('click', () => {
          btn.disabled = true;
          btn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Retocando con IA…';
          setTimeout(() => { store.set({ fotosMejoradas: true }); toast('Fotos retocadas con IA · Score +15', 'success'); }, 1100);
        });
      }
      const precio = el('inpPrecio');
      if (precio) precio.addEventListener('input', (e) => store.set({ precio: Number(e.target.value) }));
      const desc = el('inpDesc');
      if (desc) desc.addEventListener('input', (e) => store.set({ descripcion: e.target.value }));
      const titulo = el('inpTitulo');
      if (titulo) titulo.addEventListener('input', (e) => store.set({ titulo: e.target.value }));
      document.querySelectorAll('.attr-check').forEach((c) => {
        c.addEventListener('change', (e) => { const key = e.target.getAttribute('data-attr'); store.set((st) => ({ atributos: { ...st.atributos, [key]: e.target.checked } })); });
      });
    }

    let lastFocus = null;
    store.subscribe(() => {
      lastFocus = document.activeElement ? document.activeElement.id : null;
      render();
      if (lastFocus === 'inpDesc' || lastFocus === 'inpTitulo') {
        const node = el(lastFocus);
        if (node) { node.focus(); const len = node.value.length; node.setSelectionRange(len, len); }
      }
    });

    return { render };
  })();

  window.OficinaVirtual = { modOptimizador, utils: { fmtCOP, fmtNum, probBadge, toast, createStore, clamp, el } };
})();

/* MODULO 2 — LEAD 360 & SIGUIENTE MEJOR ACCION */
(function () {
  'use strict';
  const { fmtCOP, probBadge, toast, createStore, el } = window.OficinaVirtual.utils;

  const LEADS = [
    { id: 'L-1042', nombre: 'Laura Gómez', prob: 'Alta', avatar: 'LG', inmueble: 'Apto arriendo · Cedritos, Bogotá', telefono: '573001234567', presupuesto: 2600000, presupuestoValidado: true, zonas: ['Cedritos', 'Contador', 'Toberín'], creditosPrevios: 2, ultimaVisita: 'hace 2 h', tipo: 'Arriendo', comportamiento: 'Simuló crédito y comparó 3 aptos de 2 hab en la última semana.', nba: { inmueble: 'Apto 2 hab · Contador — 2.500.000/mes (con parqueadero)', pitch: 'Hola Laura, vi que buscas 2 habitaciones en Cedritos. Tengo uno en Contador dentro de tu presupuesto, con parqueadero y administración incluida. ¿Te agendo una visita mañana?' } },
    { id: 'L-1043', nombre: 'Andrés Restrepo', prob: 'Media', avatar: 'AR', inmueble: 'Casa venta · Envigado, Medellín', telefono: '573109876543', presupuesto: 620000000, presupuestoValidado: true, zonas: ['Envigado', 'El Poblado'], creditosPrevios: 1, ultimaVisita: 'ayer', tipo: 'Venta', comportamiento: 'Revisó casas en El Poblado pero abandonó por precio. Sensible al valor.', nba: { inmueble: 'Casa 3 hab · Envigado — 590.000.000 (opción compra de cartera)', pitch: 'Hola Andrés, encontré una casa en Envigado por debajo de tu tope. Además podemos evaluar compra de cartera para bajar tu cuota. ¿Hablamos hoy?' } },
    { id: 'L-1044', nombre: 'Valentina Ríos', prob: 'Alta', avatar: 'VR', inmueble: 'Apto venta · Laureles, Medellín', telefono: '573155551212', presupuesto: 340000000, presupuestoValidado: true, zonas: ['Laureles', 'Estadio'], creditosPrevios: 3, ultimaVisita: 'hace 40 min', tipo: 'Venta', comportamiento: 'Alta intención: descargó 2 fichas y solicitó info de crédito hipotecario.', nba: { inmueble: 'Apto 3 hab · Laureles — 335.000.000 (pre-aprobado Davivienda)', pitch: 'Hola Valentina, tengo el apto en Laureles que buscabas y ya tienes pre-aprobación Davivienda. Podemos dejar la oferta formal lista hoy mismo. ¿Te llamo?' } },
    { id: 'L-1045', nombre: 'Carlos Méndez', prob: 'Baja', avatar: 'CM', inmueble: 'Apto arriendo · Chapinero, Bogotá', telefono: '573201119988', presupuesto: 1800000, presupuestoValidado: false, zonas: ['Chapinero'], creditosPrevios: 0, ultimaVisita: 'hace 5 días', tipo: 'Arriendo', comportamiento: 'Una sola visita, sin presupuesto validado. Requiere calificación.', nba: { inmueble: 'Apto 1 hab · Chapinero — 1.750.000/mes (con póliza de arriendo)', pitch: 'Hola Carlos, ¿sigues buscando en Chapinero? Tengo una opción dentro de tu rango con póliza de arrendamiento incluida para agilizar el proceso. ¿Te comparto la ficha?' } }
  ];

  const store = createStore({ selectedId: LEADS[0].id });

  function renderList(s) {
    return LEADS.map((l) => {
      const active = l.id === s.selectedId;
      return `<button data-lead="${l.id}" class="w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${active ? 'border-cc-blue bg-cc-blue/10' : 'border-cc-border bg-white hover:border-cc-blue/50'}"><div class="w-9 h-9 rounded-full bg-cc-navy text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">${l.avatar}</div><div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><span class="text-sm font-semibold text-cc-navy truncate">${l.nombre}</span>${probBadge(l.prob)}</div><p class="text-[11px] text-gray-500 truncate">${l.inmueble}</p></div></button>`;
    }).join('');
  }

  function renderDetail(l) {
    return `
      <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
        <div class="flex items-center gap-4 mb-5">
          <div class="w-14 h-14 rounded-full bg-cc-navy text-white flex items-center justify-center text-lg font-bold">${l.avatar}</div>
          <div class="flex-1"><div class="flex items-center gap-2 flex-wrap"><h3 class="text-lg font-bold text-cc-navy">${l.nombre}</h3>${probBadge(l.prob)}<span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">${l.tipo}</span></div><p class="text-xs text-gray-500">${l.id} · Interesado en ${l.inmueble} · Últ. actividad ${l.ultimaVisita}</p></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div class="rounded-lg bg-cc-bg p-3"><p class="text-[10px] uppercase text-gray-500">Presupuesto</p><p class="text-sm font-bold text-cc-navy">${fmtCOP(l.presupuesto)}</p><p class="text-[10px] ${l.presupuestoValidado ? 'text-green-600' : 'text-cc-red'}">${l.presupuestoValidado ? '✓ validado' : '⚠ sin validar'}</p></div>
          <div class="rounded-lg bg-cc-bg p-3"><p class="text-[10px] uppercase text-gray-500">Créditos simulados</p><p class="text-sm font-bold text-cc-navy">${l.creditosPrevios}</p><p class="text-[10px] text-gray-400">previos</p></div>
          <div class="rounded-lg bg-cc-bg p-3 col-span-2"><p class="text-[10px] uppercase text-gray-500">Zonas de interés exploradas</p><p class="text-sm font-semibold text-cc-navy leading-tight">${l.zonas.join(' · ')}</p></div>
        </div>
        <div class="rounded-lg border border-cc-border p-3 mb-5"><p class="text-[10px] uppercase text-gray-500 mb-1">Comportamiento detectado</p><p class="text-sm text-cc-text">${l.comportamiento}</p></div>
        <div class="rounded-xl border-2 border-cc-amber bg-cc-amber/10 p-5">
          <div class="flex items-center gap-2 mb-3"><svg class="w-5 h-5 text-cc-amber" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 002 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg><h4 class="text-sm font-bold text-cc-navy">Siguiente Mejor Acción (IA)</h4></div>
          <div class="bg-white rounded-lg p-3 mb-3"><p class="text-[10px] uppercase text-gray-500">Inmueble alternativo sugerido</p><p class="text-sm font-semibold text-cc-navy">${l.nba.inmueble}</p></div>
          <div class="bg-white rounded-lg p-3 mb-4"><p class="text-[10px] uppercase text-gray-500 mb-1">Script de abordaje personalizado</p><p id="pitchText" class="text-sm text-cc-text italic">"${l.nba.pitch}"</p></div>
          <div class="flex flex-wrap gap-2">
            <button id="btnWhatsapp" class="text-sm font-semibold px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.593 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.599 5.317l-1.005 3.667 3.907-1.021z"/></svg>Contactar por WhatsApp</button>
            <button id="btnCopy" class="text-sm font-semibold px-4 py-2.5 rounded-lg border border-cc-border text-cc-navy hover:bg-cc-bg flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copiar script</button>
          </div>
        </div>
      </div>`;
  }

  function render() {
    const s = store.get();
    const lead = LEADS.find((l) => l.id === s.selectedId);
    el('view-leads').innerHTML = `<div class="grid grid-cols-1 lg:grid-cols-3 gap-5"><div class="lg:col-span-1"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Leads recibidos</h3><span class="text-[11px] text-gray-400">${LEADS.length} activos</span></div><div class="space-y-2">${renderList(s)}</div></div><div class="lg:col-span-2">${renderDetail(lead)}</div></div>`;
    bind(lead);
  }

  function bind(lead) {
    document.querySelectorAll('[data-lead]').forEach((b) => { b.addEventListener('click', () => store.set({ selectedId: b.getAttribute('data-lead') })); });
    const copy = el('btnCopy');
    if (copy) copy.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(lead.nba.pitch).catch(() => {}); toast('Script copiado al portapapeles', 'success'); });
    const wa = el('btnWhatsapp');
    if (wa) wa.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(lead.nba.pitch).catch(() => {}); const url = `https://wa.me/${lead.telefono}?text=${encodeURIComponent(lead.nba.pitch)}`; window.open(url, '_blank', 'noopener'); toast('Abriendo WhatsApp · script copiado', 'success'); });
  }

  store.subscribe(render);
  window.OficinaVirtual.modLeads = { render };
})();

/* MODULO 3 — ACELERADOR TRANSACCIONAL GRUPO BOLIVAR */
(function () {
  'use strict';
  const { fmtCOP, toast, createStore, clamp, el } = window.OficinaVirtual.utils;

  const store = createStore({
    cliente: 'Valentina Ríos', valorInmueble: 335000000, cuotaInicialPct: 30, plazoAnios: 15, tasaEA: 11.5,
    compraCartera: false, saldoCartera: 90000000, tasaCarteraActual: 18.0,
    preAprobadoConsultado: false, preAprobado: false, montoPreAprobado: 0,
    seguros: { arrendamiento: false, hogar: false, vida: false }
  });

  function cuotaMensual(monto, tasaEA, plazoAnios) {
    if (monto <= 0) return 0;
    const im = Math.pow(1 + tasaEA / 100, 1 / 12) - 1;
    const n = plazoAnios * 12;
    if (im === 0) return monto / n;
    return (monto * im) / (1 - Math.pow(1 + im, -n));
  }

  const PRIMAS = { arrendamiento: 85000, hogar: 42000, vida: 28000 };

  function render() {
    const s = store.get();
    const cuotaInicial = s.valorInmueble * (s.cuotaInicialPct / 100);
    const montoFinanciar = s.valorInmueble - cuotaInicial;
    const cuota = cuotaMensual(montoFinanciar, s.tasaEA, s.plazoAnios);
    const cuotaCarteraActual = cuotaMensual(s.saldoCartera, s.tasaCarteraActual, 5);
    const cuotaCarteraNueva = cuotaMensual(s.saldoCartera, s.tasaEA, 5);
    const ahorroCartera = Math.max(0, cuotaCarteraActual - cuotaCarteraNueva);
    const primaSeguros = Object.keys(s.seguros).reduce((a, k) => a + (s.seguros[k] ? PRIMAS[k] : 0), 0);
    const pagoTotalMes = cuota + primaSeguros + (s.compraCartera ? cuotaCarteraNueva : 0);

    el('view-acelerador').innerHTML = `
      <div class="mb-5 rounded-xl bg-gradient-to-r from-cc-navy to-cc-navy2 text-white p-5 flex items-center justify-between flex-wrap gap-3">
        <div><p class="text-xs text-cc-blue uppercase tracking-wide">Diferenciador único · Grupo Bolívar</p><h3 class="text-lg font-bold">Cierre transaccional para ${s.cliente}</h3></div>
        <span class="text-[11px] bg-white/10 px-3 py-1 rounded-full">Davivienda · Seguros Bolívar</span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 space-y-5">
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Estado de bancarización</h3>${s.preAprobadoConsultado ? (s.preAprobado ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">Pre-aprobado</span>' : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">En estudio</span>') : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">Sin consultar</span>'}</div>
            ${s.preAprobadoConsultado && s.preAprobado ? `<div class="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center justify-between flex-wrap gap-2"><div><p class="text-[11px] text-gray-500">Monto pre-aprobado (tiempo real)</p><p class="text-xl font-extrabold text-green-700">${fmtCOP(s.montoPreAprobado)}</p></div><div class="text-right"><p class="text-[11px] text-gray-500">Tasa hipotecaria</p><p class="text-sm font-bold text-cc-navy">${s.tasaEA}% E.A.</p></div></div>` : `<p class="text-xs text-gray-500 mb-3">Consulta en tiempo real la bancarización y pre-aprobación financiera del cliente con Davivienda.</p>`}
            <button id="btnPreAprob" class="mt-3 w-full text-sm font-semibold px-4 py-2.5 rounded-lg ${s.preAprobado ? 'bg-green-100 text-green-700 cursor-default' : 'bg-cc-red hover:brightness-95 text-white'} flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>${s.preAprobado ? 'Cliente pre-aprobado Davivienda' : 'Consultar Pre-aprobado Davivienda'}</button>
          </div>
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <h3 class="text-sm font-bold text-cc-navy mb-4">Simulador de Crédito de Vivienda</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label class="text-xs font-semibold">Valor del inmueble: <span class="text-cc-navy font-bold">${fmtCOP(s.valorInmueble)}</span></label><input id="inpValor" type="range" class="cc-range w-full mt-2" min="120000000" max="900000000" step="5000000" value="${s.valorInmueble}"></div>
              <div><label class="text-xs font-semibold">Cuota inicial: <span class="text-cc-navy font-bold">${s.cuotaInicialPct}%</span> (${fmtCOP(cuotaInicial)})</label><input id="inpInicial" type="range" class="cc-range w-full mt-2" min="20" max="70" step="1" value="${s.cuotaInicialPct}"></div>
              <div><label class="text-xs font-semibold">Plazo: <span class="text-cc-navy font-bold">${s.plazoAnios} años</span></label><input id="inpPlazo" type="range" class="cc-range w-full mt-2" min="5" max="30" step="1" value="${s.plazoAnios}"></div>
              <div><label class="text-xs font-semibold">Tasa: <span class="text-cc-navy font-bold">${s.tasaEA}% E.A.</span></label><input id="inpTasa" type="range" class="cc-range w-full mt-2" min="9" max="16" step="0.1" value="${s.tasaEA}"></div>
            </div>
            <div class="mt-4 rounded-lg bg-cc-bg p-4 flex items-center justify-between flex-wrap gap-2"><div><p class="text-[11px] text-gray-500">Monto a financiar</p><p class="text-sm font-bold text-cc-navy">${fmtCOP(montoFinanciar)}</p></div><div class="text-right"><p class="text-[11px] text-gray-500">Cuota mensual estimada</p><p class="text-xl font-extrabold text-cc-navy">${fmtCOP(cuota)}</p></div></div>
            <label class="flex items-center justify-between mt-4 cursor-pointer"><span class="text-sm font-semibold text-cc-navy">Incluir Compra de Cartera</span><input id="chkCartera" type="checkbox" ${s.compraCartera ? 'checked' : ''} class="w-4 h-4 accent-cc-navy"></label>
            ${s.compraCartera ? `<div class="mt-3 rounded-lg border border-cc-blue/30 bg-cc-blue/5 p-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2"><div><label class="text-[11px] font-semibold">Saldo cartera actual: <span class="text-cc-navy font-bold">${fmtCOP(s.saldoCartera)}</span></label><input id="inpSaldo" type="range" class="cc-range w-full mt-1" min="10000000" max="300000000" step="5000000" value="${s.saldoCartera}"></div><div><label class="text-[11px] font-semibold">Tasa actual del cliente: <span class="text-cc-navy font-bold">${s.tasaCarteraActual}% E.A.</span></label><input id="inpTasaCartera" type="range" class="cc-range w-full mt-1" min="12" max="30" step="0.5" value="${s.tasaCarteraActual}"></div></div><p class="text-sm text-green-700 font-semibold">Ahorro estimado: ${fmtCOP(ahorroCartera)} / mes al migrar a ${s.tasaEA}% E.A.</p></div>` : ''}
          </div>
        </div>
        <div class="space-y-5">
          <div class="card bg-white rounded-xl border border-cc-border shadow-sm p-6">
            <h3 class="text-sm font-bold text-cc-navy mb-1">Seguros Bolívar</h3>
            <p class="text-[11px] text-gray-500 mb-3">Precargados en la oferta según el tipo de negocio.</p>
            ${[['arrendamiento', 'Póliza de arrendamiento', PRIMAS.arrendamiento], ['hogar', 'Seguro de hogar', PRIMAS.hogar], ['vida', 'Seguro de vida deudor', PRIMAS.vida]].map(([k, label, prima]) => `<label class="flex items-center justify-between py-2 border-b border-cc-border last:border-0 cursor-pointer"><span class="text-sm">${label}<br><span class="text-[11px] text-gray-400">${fmtCOP(prima)}/mes</span></span><input type="checkbox" data-seguro="${k}" ${s.seguros[k] ? 'checked' : ''} class="seg-check w-4 h-4 accent-cc-navy"></label>`).join('')}
          </div>
          <div class="card bg-cc-navy text-white rounded-xl shadow-sm p-6">
            <h3 class="text-sm font-bold mb-3">Oferta formal</h3>
            <div class="space-y-1.5 text-sm">
              <div class="flex justify-between"><span class="text-cc-blue">Cuota crédito</span><span class="font-semibold">${fmtCOP(cuota)}</span></div>
              ${s.compraCartera ? `<div class="flex justify-between"><span class="text-cc-blue">Cuota cartera</span><span class="font-semibold">${fmtCOP(cuotaCarteraNueva)}</span></div>` : ''}
              <div class="flex justify-between"><span class="text-cc-blue">Seguros</span><span class="font-semibold">${fmtCOP(primaSeguros)}</span></div>
              <div class="border-t border-white/20 my-2"></div>
              <div class="flex justify-between text-base"><span class="font-bold">Total mensual</span><span class="font-extrabold text-cc-amber">${fmtCOP(pagoTotalMes)}</span></div>
            </div>
            <button id="btnPropuesta" class="mt-4 w-full text-sm font-bold px-4 py-3 rounded-lg bg-cc-amber text-cc-navy hover:brightness-95 flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Enviar propuesta en 1 clic</button>
          </div>
        </div>
      </div>`;
    bind();
  }

  function bind() {
    const s = store.get();
    const btnPre = el('btnPreAprob');
    if (btnPre && !s.preAprobado) {
      btnPre.addEventListener('click', () => {
        btnPre.disabled = true;
        btnPre.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/><path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg> Consultando Davivienda…';
        setTimeout(() => { const monto = Math.round(store.get().valorInmueble * 0.72 / 1000000) * 1000000; store.set({ preAprobadoConsultado: true, preAprobado: true, montoPreAprobado: monto }); toast('Cliente pre-aprobado por Davivienda', 'success'); }, 1200);
      });
    }
    const bindRange = (id, key, cast = Number) => { const n = el(id); if (n) n.addEventListener('input', (e) => store.set({ [key]: cast(e.target.value) })); };
    bindRange('inpValor', 'valorInmueble');
    bindRange('inpInicial', 'cuotaInicialPct');
    bindRange('inpPlazo', 'plazoAnios');
    bindRange('inpTasa', 'tasaEA', (v) => parseFloat(v));
    bindRange('inpSaldo', 'saldoCartera');
    bindRange('inpTasaCartera', 'tasaCarteraActual', (v) => parseFloat(v));
    const chk = el('chkCartera');
    if (chk) chk.addEventListener('change', (e) => store.set({ compraCartera: e.target.checked }));
    document.querySelectorAll('.seg-check').forEach((c) => { c.addEventListener('change', (e) => { const key = e.target.getAttribute('data-seguro'); store.set((st) => ({ seguros: { ...st.seguros, [key]: e.target.checked } })); }); });
    const prop = el('btnPropuesta');
    if (prop) prop.addEventListener('click', () => { if (!store.get().preAprobado) { toast('Consulta primero el pre-aprobado Davivienda', 'warning'); return; } toast('Propuesta formal enviada al cliente ✓', 'success'); });
  }

  store.subscribe(render);
  window.OficinaVirtual.modAcelerador = { render };
})();

/* ROUTER */
(function () {
  'use strict';
  const OV = window.OficinaVirtual;
  const META = {
    optimizador: { title: 'Optimizador de Anuncio IA', sub: 'Sube la calidad de tu anuncio con IA y gana más visibilidad', render: OV.modOptimizador.render },
    leads:       { title: 'Lead 360° & Siguiente Mejor Acción', sub: 'Enriquece cada lead y actúa con recomendaciones de IA', render: OV.modLeads.render },
    acelerador:  { title: 'Acelerador Transaccional Grupo Bolívar', sub: 'Crédito, compra de cartera y seguros integrados en el cierre', render: OV.modAcelerador.render }
  };

  function activate(view) {
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    document.getElementById('view-' + view).classList.add('active');
    document.querySelectorAll('.nav-link').forEach((b) => {
      const on = b.getAttribute('data-view') === view;
      b.classList.toggle('active', on);
      b.classList.toggle('text-cc-blue', !on);
      b.classList.toggle('text-white', on);
    });
    const meta = META[view];
    document.getElementById('viewTitle').textContent = meta.title;
    document.getElementById('viewSubtitle').textContent = meta.sub;
    meta.render();
    closeSidebar();
  }

  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  function openSidebar() { sidebar.classList.remove('-translate-x-full'); backdrop.classList.remove('hidden'); }
  function closeSidebar() { if (window.innerWidth < 768) { sidebar.classList.add('-translate-x-full'); backdrop.classList.add('hidden'); } }

  document.getElementById('menuBtn').addEventListener('click', openSidebar);
  backdrop.addEventListener('click', closeSidebar);
  document.querySelectorAll('.nav-link').forEach((b) => { b.addEventListener('click', () => activate(b.getAttribute('data-view'))); });

  activate('optimizador');
})();
