/* =====================================================================
   PESTAÑAS DE REPORTES DENTRO DE OFICINA VIRTUAL IA
   1) Tablero de Prospectos  — operativo, tabla filtrable con estudio de
      crédito, score e intensidad (basado en el informe PAI La Quinta).
   2) Informe de Leads e Impresiones — analítico, KPIs + gráficas SVG
      nativas (basado en el informe Integrity 1004950).
   Datos mock representativos. En producción vendrían del backend / Data
   Operativa. Sin librerías externas (gráficas en SVG, PDF por print).
   ===================================================================== */
(function () {
  'use strict';
  const { fmtCOP, toast, el } = window.OficinaVirtual.utils;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = new Intl.NumberFormat('es-CO');
  const fmtN = (n) => nf.format(n);

  /* ---------------------------------------------------------------
     Estado local de los reportes (periodo, negocio, búsqueda, filtros).
     Dispara el re-render a través del store de navegación de Oficina IA.
     --------------------------------------------------------------- */
  let st = { tbNegocio: 'Arriendo', tbBuscar: '', tbResultado: '', tbIntensidad: '', infHoja: 'hist' };
  function setSt(patch) {
    st = { ...st, ...patch };
    const ov = window.OficinaVirtual.secOficinaIA;
    if (ov && ov._refresh) ov._refresh();
  }

  /* ===============================================================
     1) TABLERO DE PROSPECTOS  (operativo)
     =============================================================== */
  // Prospectos con estudio de crédito, score e intensidad de búsqueda.
  const PROSPECTOS = [
    { fecha: '2026-08-16', neg: 'Arriendo', nombre: 'Diana Quimbayo', id: '65786558', tel: '573168714784', ciudad: 'Ibagué', barrio: 'Belén', busca: 'Apartamento', valor: 1800000, cod: 'CC-114253', resultado: 'Aprobado', capacidad: 'Entre 195 y 200 millones', score: 45, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-16', neg: 'Arriendo', nombre: 'Hugo Supelano', id: '79721549', tel: '573107795435', ciudad: 'Ibagué', barrio: 'Villa Café', busca: 'Apartamento', valor: 3000000, cod: 'CC-114225', resultado: 'Aprobado', capacidad: 'Entre 150 y 155 millones', score: 25, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-16', neg: 'Arriendo', nombre: 'Andrés Poeti', id: '1032439265', tel: '573113639685', ciudad: 'Ibagué', barrio: 'Ambikaima', busca: 'Apartamento', valor: 560000, cod: 'CC-114039', resultado: 'Rechazado', capacidad: 'Entre 0 y 5 millones', score: 25, intensidad: 'Media', intereses: 1 },
    { fecha: '2026-08-16', neg: 'Arriendo', nombre: 'Heidi Aguirre', id: '1005754814', tel: '573155704962', ciudad: 'Ibagué', barrio: 'Mirolindo', busca: 'Apartamento', valor: 0, cod: 'CC-114263', resultado: 'Rechazado', capacidad: 'Sin capacidad financiera', score: 15, intensidad: 'Muy alta', intereses: 3 },
    { fecha: '2026-08-16', neg: 'Venta', nombre: 'Manuel Saavedra', id: '74240832', tel: '573184171223', ciudad: 'Fusagasugá', barrio: 'Los Claveles', busca: 'Casa', valor: 200000000, cod: 'CC-214009', resultado: 'Con capacidad financiera', capacidad: 'Entre 295 y 300 millones', score: 50, intensidad: 'Media', intereses: 1 },
    { fecha: '2026-08-16', neg: 'Venta', nombre: 'Santiago Esteban', id: '1032411168', tel: '573134621852', ciudad: 'Ibagué', barrio: 'Vasconia', busca: 'Apartamento', valor: 1000000, cod: 'CC-210500', resultado: 'Sin capacidad financiera', capacidad: 'Sin capacidad financiera', score: 25, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-15', neg: 'Arriendo', nombre: 'Pilar García', id: '65696643', tel: '573114445114', ciudad: 'Ibagué', barrio: 'Los Remansos', busca: 'Lote', valor: 120000000, cod: 'CC-113954', resultado: 'Aprobado', capacidad: 'Entre 0 y 5 millones', score: 35, intensidad: 'Muy alta', intereses: 2 },
    { fecha: '2026-08-15', neg: 'Arriendo', nombre: 'Mariangel Duque', id: '1111123474', tel: '573134243833', ciudad: 'Ibagué', barrio: 'Simón Bolívar', busca: 'Apartamento', valor: 1100000, cod: 'CC-114209', resultado: 'Sin información', capacidad: '', score: 25, intensidad: 'Muy alta', intereses: 2 },
    { fecha: '2026-08-15', neg: 'Venta', nombre: 'Bonifacio López', id: '79230554', tel: '573022403855', ciudad: 'Fusagasugá', barrio: 'Villas de la Pampa', busca: 'Casa', valor: 325000000, cod: 'CC-214086', resultado: 'Con capacidad financiera', capacidad: 'Entre 320 y 325 millones', score: 45, intensidad: 'Muy alta', intereses: 2 },
    { fecha: '2026-08-14', neg: 'Arriendo', nombre: 'Andrea Montoya', id: '41923598', tel: '573114721953', ciudad: 'Ibagué', barrio: 'Belén', busca: 'Apartamento', valor: 1200000, cod: 'CC-114253', resultado: 'Aprobado', capacidad: 'Entre 0 y 5 millones', score: 25, intensidad: 'Muy alta', intereses: 3 },
    { fecha: '2026-08-14', neg: 'Arriendo', nombre: 'Carlos Bernal', id: '13811739', tel: '573102759478', ciudad: 'Ibagué', barrio: 'Altagracia', busca: 'Apartamento', valor: 1572800, cod: 'CC-113967', resultado: 'Aprobado', capacidad: 'Entre 150 y 155 millones', score: 35, intensidad: 'Alta', intereses: 1 },
    { fecha: '2026-08-14', neg: 'Arriendo', nombre: 'Mónica Sánchez', id: '52149831', tel: '573108000678', ciudad: 'Ibagué', barrio: 'Álamos', busca: 'Apartamento', valor: 1400000, cod: 'CC-114188', resultado: 'Aprobado', capacidad: 'Sin capacidad financiera', score: 15, intensidad: 'Muy alta', intereses: 4 },
    { fecha: '2026-08-14', neg: 'Venta', nombre: 'David Torres', id: '1010170470', tel: '573112794515', ciudad: 'Ibagué', barrio: 'Hipódromo', busca: 'Casa', valor: 190000000, cod: 'CC-213940', resultado: 'Sin capacidad financiera', capacidad: 'Sin capacidad financiera', score: 15, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-13', neg: 'Arriendo', nombre: 'Yadid Ordóñez', id: '65777140', tel: '573222705986', ciudad: 'Ibagué', barrio: 'Altagracia', busca: 'Local', valor: 110000000, cod: 'CC-113967', resultado: 'Aprobado', capacidad: 'Entre 110 y 115 millones', score: 25, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-13', neg: 'Venta', nombre: 'Nohora Sánchez', id: '38000000', tel: '573124522557', ciudad: 'Ibagué', barrio: 'Picaleña', busca: 'Casa', valor: 130000000, cod: 'CC-214251', resultado: 'Sin capacidad financiera', capacidad: 'Entre 0 y 5 millones', score: 25, intensidad: 'Media', intereses: 1 },
    { fecha: '2026-08-12', neg: 'Venta', nombre: 'Jacqueline Gómez', id: '38503713', tel: '573503713358', ciudad: 'Ibagué', barrio: 'El Salado', busca: 'Apartamento', valor: 145000000, cod: 'CC-212531', resultado: 'Con capacidad financiera', capacidad: 'Entre 145 y 150 millones', score: 50, intensidad: 'Muy alta', intereses: 2 },
    { fecha: '2026-08-12', neg: 'Arriendo', nombre: 'Alejandra Báez', id: '1010245738', tel: '573212195789', ciudad: 'Fusagasugá', barrio: 'Sector Manila', busca: 'Apartamento', valor: 1477615, cod: 'CC-114234', resultado: 'Aprobado', capacidad: 'Sin capacidad financiera', score: 25, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-12', neg: 'Arriendo', nombre: 'Liseth Charry', id: '1006028441', tel: '573125258249', ciudad: 'Ibagué', barrio: 'Mirolindo', busca: 'Apartamento', valor: 1120000, cod: 'CC-114186', resultado: 'Aprobado', capacidad: 'Sin capacidad financiera', score: 25, intensidad: 'Alta', intereses: 2 },
    { fecha: '2026-08-10', neg: 'Arriendo', nombre: 'Rudys Sierra', id: '93298765', tel: '573172375616', ciudad: 'Ibagué', barrio: 'Altagracia', busca: 'Local', valor: 195000000, cod: 'CC-113967', resultado: 'Aprobado', capacidad: 'Entre 195 y 200 millones', score: 40, intensidad: 'Muy alta', intereses: 1 },
    { fecha: '2026-08-07', neg: 'Venta', nombre: 'Ana Moreno', id: '28534789', tel: '573053245110', ciudad: 'Ibagué', barrio: 'Centro', busca: 'Casa', valor: 650000000, cod: 'CC-213292', resultado: 'Con capacidad financiera', capacidad: 'Más de 500 millones', score: 55, intensidad: 'Muy alta', intereses: 1 }
  ];

  const INTENS_ORD = { 'Muy alta': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };
  const telFmt = (t) => { const s = String(t).replace(/^57/, ''); return s.length === 10 ? `+57 ${s.slice(0,3)} ${s.slice(3,6)} ${s.slice(6)}` : '+' + t; };
  const idMask = (id) => { const s = String(id); return s.length > 4 ? '••••' + s.slice(-4) : s; };

  function resultadoPill(r) {
    const ok = /aprobado|con capacidad|viable/i.test(r);
    const bad = /rechazado|sin capacidad/i.test(r);
    const cls = ok ? 'bg-cc-green/15 text-cc-green700' : bad ? 'bg-red-100 text-cc-red' : 'bg-cc-g100 text-cc-g600';
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}">${esc(r)}</span>`;
  }
  function intensidadPill(i) {
    const map = { 'Muy alta': 'bg-cc-primary/15 text-cc-primary', 'Alta': 'bg-cc-blue/15 text-cc-p700', 'Media': 'bg-cc-amber/20 text-cc-navy', 'Baja': 'bg-cc-g100 text-cc-g500' };
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[i] || 'bg-cc-g100 text-cc-g500'}">${esc(i)}</span>`;
  }
  function scoreBar(v) {
    const col = v >= 45 ? '#277619' : v >= 30 ? '#FF9D21' : '#DC0A0A';
    return `<div class="flex items-center gap-2"><div class="w-12 h-1.5 rounded-full bg-cc-g200 overflow-hidden"><div class="h-full rounded-full" style="width:${v}%;background:${col}"></div></div><span class="text-[11px] font-semibold" style="color:${col}">${v}</span></div>`;
  }

  function tbFiltrados() {
    return PROSPECTOS.filter((p) => {
      if (p.neg !== st.tbNegocio) return false;
      if (st.tbResultado && p.resultado !== st.tbResultado) return false;
      if (st.tbIntensidad && p.intensidad !== st.tbIntensidad) return false;
      if (st.tbBuscar) {
        const q = st.tbBuscar.toLowerCase();
        const hay = (p.nombre + ' ' + p.tel + ' ' + p.barrio + ' ' + p.ciudad + ' ' + p.cod).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function tbKpis(base) {
    const total = base.length;
    const muyAlta = base.filter((p) => p.intensidad === 'Muy alta').length;
    const aprob = base.filter((p) => /aprobado|con capacidad|viable/i.test(p.resultado)).length;
    const scoreProm = total ? Math.round(base.reduce((a, p) => a + p.score, 0) / total) : 0;
    return [
      { l: 'Prospectos', v: fmtN(total) },
      { l: 'Interés muy alto', v: fmtN(muyAlta) },
      { l: 'Aprobados / viables', v: fmtN(aprob) },
      { l: 'Score promedio', v: scoreProm }
    ];
  }

  function renderTablero() {
    const base = PROSPECTOS.filter((p) => p.neg === st.tbNegocio);
    const filas = tbFiltrados();
    const kpis = tbKpis(base);
    const tab = (id, label) => `<button data-tbneg="${id}" class="pb-2 text-sm font-semibold border-b-2 ${st.tbNegocio === id ? 'text-cc-primary border-cc-primary' : 'text-cc-g500 border-transparent hover:text-cc-navy'}">${label} <span class="opacity-70">${PROSPECTOS.filter((p) => p.neg === id).length}</span></button>`;
    const resultados = Array.from(new Set(base.map((p) => p.resultado)));
    return `
      <div id="repTableroRoot">
        <div class="flex items-end justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 class="text-base font-bold text-cc-navy">Tablero de Prospectos</h3>
            <p class="text-sm text-cc-g600 mt-0.5">Prospectos con intención de compra o arriendo, enriquecidos con resultado de preestudio de crédito, score e intensidad de búsqueda.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="tbPdf" class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2"><i class="fa-regular fa-file-pdf"></i> PDF</button>
            <button id="tbCsv" class="text-sm font-semibold px-4 py-2 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white flex items-center gap-2"><i class="fa-solid fa-download"></i> CSV</button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          ${kpis.map((k) => `<div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500 leading-tight">${k.l}</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${k.v}</p></div>`).join('')}
        </div>

        <div class="flex items-center gap-6 border-b border-cc-g200 mb-4">
          ${tab('Arriendo', 'Arriendo')}${tab('Venta', 'Venta')}
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-4">
          <div class="relative flex-1 min-w-[200px]"><i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-cc-g400 text-xs"></i><input id="tbBuscar" value="${esc(st.tbBuscar)}" placeholder="Buscar nombre, celular, barrio o código…" class="w-full text-sm border border-cc-g200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cc-primary"></div>
          <div class="relative"><select id="tbResultado" class="text-sm bg-white border border-cc-g200 rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-cc-primary text-cc-g700"><option value="">Todos los resultados</option>${resultados.map((r) => `<option value="${esc(r)}" ${st.tbResultado === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select><i class="fa-solid fa-chevron-down text-[10px] text-cc-g400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i></div>
          <div class="relative"><select id="tbIntensidad" class="text-sm bg-white border border-cc-g200 rounded-lg pl-3 pr-8 py-2 appearance-none focus:outline-none focus:border-cc-primary text-cc-g700"><option value="">Toda intensidad</option>${['Muy alta','Alta','Media','Baja'].map((i) => `<option value="${i}" ${st.tbIntensidad === i ? 'selected' : ''}>${i}</option>`).join('')}</select><i class="fa-solid fa-chevron-down text-[10px] text-cc-g400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></i></div>
        </div>

        <div class="rounded-xl border border-cc-g200 bg-white overflow-hidden">
          <div class="px-4 py-3 border-b border-cc-g200 flex items-center justify-between">
            <p class="text-sm font-semibold text-cc-navy">Detalle de prospectos</p>
            <p class="text-[12px] text-cc-g500">${filas.length} de ${base.length} ${st.tbNegocio.toLowerCase()}</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-[12px]">
              <thead><tr class="bg-cc-zpBg text-cc-g600 text-left">
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Fecha</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Cliente</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Ciudad / Barrio</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Busca</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Inmueble</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap text-right">Valor</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Resultado</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Capacidad</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Score</th>
                <th class="px-3 py-2 font-semibold whitespace-nowrap">Intensidad</th>
              </tr></thead>
              <tbody>
                ${filas.length ? filas.map((p) => `<tr class="border-t border-cc-g100 hover:bg-cc-blueSoft/40">
                  <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${esc(p.fecha)}</td>
                  <td class="px-3 py-2 whitespace-nowrap"><p class="font-semibold text-cc-navy">${esc(p.nombre)}</p><p class="text-[11px] text-cc-g500">${esc(telFmt(p.tel))} · ${esc(idMask(p.id))}</p></td>
                  <td class="px-3 py-2 whitespace-nowrap text-cc-g700">${esc(p.ciudad)}<br><span class="text-[11px] text-cc-g500">${esc(p.barrio)}</span></td>
                  <td class="px-3 py-2 whitespace-nowrap text-cc-g700">${esc(p.busca)}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${esc(p.cod)}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-right font-semibold text-cc-navy">${p.valor ? fmtCOP(p.valor) : '—'}</td>
                  <td class="px-3 py-2 whitespace-nowrap">${resultadoPill(p.resultado)}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${p.capacidad ? esc(p.capacidad) : '—'}</td>
                  <td class="px-3 py-2 whitespace-nowrap">${scoreBar(p.score)}</td>
                  <td class="px-3 py-2 whitespace-nowrap">${intensidadPill(p.intensidad)}</td>
                </tr>`).join('') : `<tr><td colspan="10" class="px-3 py-8 text-center text-cc-g500">No hay prospectos que coincidan con los filtros.</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
        <p class="text-[11px] text-cc-g500 mt-3"><i class="fa-solid fa-shield-halved text-cc-g400"></i> Contiene datos personales de contacto. Su uso está limitado a la gestión comercial autorizada conforme a la Ley 1581 de 2012 (Habeas Data). La identificación se muestra enmascarada.</p>
      </div>`;
  }

  function bindTablero() {
    document.querySelectorAll('[data-tbneg]').forEach((b) => b.addEventListener('click', () => setSt({ tbNegocio: b.getAttribute('data-tbneg'), tbResultado: '' })));
    const buscar = el('tbBuscar');
    if (buscar) buscar.addEventListener('input', (e) => { st.tbBuscar = e.target.value; aplicarFiltrosTablero(); });
    const res = el('tbResultado'); if (res) res.addEventListener('change', () => setSt({ tbResultado: res.value }));
    const inten = el('tbIntensidad'); if (inten) inten.addEventListener('change', () => setSt({ tbIntensidad: inten.value }));
    el('tbCsv') && el('tbCsv').addEventListener('click', exportTableroCSV);
    el('tbPdf') && el('tbPdf').addEventListener('click', exportTableroPDF);
  }
  // Filtrado en vivo del buscador SIN re-render completo (no pierde el foco del input).
  function aplicarFiltrosTablero() {
    const root = el('repTableroRoot'); if (!root) return;
    const tbody = root.querySelector('tbody'); if (!tbody) return;
    const filas = tbFiltrados();
    const base = PROSPECTOS.filter((p) => p.neg === st.tbNegocio);
    tbody.innerHTML = filas.length ? filas.map((p) => `<tr class="border-t border-cc-g100 hover:bg-cc-blueSoft/40">
        <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${esc(p.fecha)}</td>
        <td class="px-3 py-2 whitespace-nowrap"><p class="font-semibold text-cc-navy">${esc(p.nombre)}</p><p class="text-[11px] text-cc-g500">${esc(telFmt(p.tel))} · ${esc(idMask(p.id))}</p></td>
        <td class="px-3 py-2 whitespace-nowrap text-cc-g700">${esc(p.ciudad)}<br><span class="text-[11px] text-cc-g500">${esc(p.barrio)}</span></td>
        <td class="px-3 py-2 whitespace-nowrap text-cc-g700">${esc(p.busca)}</td>
        <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${esc(p.cod)}</td>
        <td class="px-3 py-2 whitespace-nowrap text-right font-semibold text-cc-navy">${p.valor ? fmtCOP(p.valor) : '—'}</td>
        <td class="px-3 py-2 whitespace-nowrap">${resultadoPill(p.resultado)}</td>
        <td class="px-3 py-2 whitespace-nowrap text-cc-g600">${p.capacidad ? esc(p.capacidad) : '—'}</td>
        <td class="px-3 py-2 whitespace-nowrap">${scoreBar(p.score)}</td>
        <td class="px-3 py-2 whitespace-nowrap">${intensidadPill(p.intensidad)}</td>
      </tr>`).join('') : `<tr><td colspan="10" class="px-3 py-8 text-center text-cc-g500">No hay prospectos que coincidan con los filtros.</td></tr>`;
    const cont = root.querySelector('.rounded-xl .text-\\[12px\\].text-cc-g500');
    if (cont) cont.textContent = `${filas.length} de ${base.length} ${st.tbNegocio.toLowerCase()}`;
  }

  function exportTableroCSV() {
    const filas = tbFiltrados();
    const cols = ['Fecha', 'Nombre', 'Identificación', 'Móvil', 'Ciudad', 'Barrio', 'Busca', 'Inmueble', 'Negocio', 'Valor', 'Resultado', 'Capacidad', 'Score', 'Intensidad'];
    const cell = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const head = cols.map(cell).join(';');
    const body = filas.map((p) => [p.fecha, p.nombre, p.id, p.tel, p.ciudad, p.barrio, p.busca, p.cod, p.neg, p.valor, p.resultado, p.capacidad, p.score, p.intensidad].map(cell).join(';')).join('\r\n');
    const meta = [`"Reporte:";"Tablero de Prospectos"`, `"Negocio:";"${st.tbNegocio}"`, `"Generado:";"${new Date().toLocaleString('es-CO')}"`, ''].join('\r\n');
    descargar(`Ciencuadras_tablero_prospectos_${st.tbNegocio.toLowerCase()}.csv`, meta + '\r\n' + head + '\r\n' + body, 'text/csv');
    toast('Tablero exportado en CSV', 'success');
  }

  function exportTableroPDF() {
    const filas = tbFiltrados();
    const kpis = tbKpis(PROSPECTOS.filter((p) => p.neg === st.tbNegocio));
    const filasHtml = filas.map((p) => `<tr>
      <td>${esc(p.fecha)}</td><td>${esc(p.nombre)}<br><span class="muted">${esc(telFmt(p.tel))} · ${esc(idMask(p.id))}</span></td>
      <td>${esc(p.ciudad)} · ${esc(p.barrio)}</td><td>${esc(p.busca)}</td><td>${esc(p.cod)}</td>
      <td class="r">${p.valor ? fmtCOP(p.valor) : '—'}</td><td>${esc(p.resultado)}</td><td>${esc(p.capacidad || '—')}</td>
      <td class="r">${p.score}</td><td>${esc(p.intensidad)}</td></tr>`).join('');
    const kpisHtml = kpis.map((k) => `<div class="kpi"><span class="l">${k.l}</span><span class="v">${k.v}</span></div>`).join('');
    const cuerpo = `
      <div class="kpis">${kpisHtml}</div>
      <h2>Detalle de prospectos · ${esc(st.tbNegocio)}</h2>
      <table><thead><tr>
        <th>Fecha</th><th>Cliente</th><th>Ciudad / Barrio</th><th>Busca</th><th>Inmueble</th>
        <th class="r">Valor</th><th>Resultado</th><th>Capacidad</th><th class="r">Score</th><th>Intensidad</th>
      </tr></thead><tbody>${filasHtml}</tbody></table>
      <p class="legal">Contiene datos personales de contacto. Uso limitado a la gestión comercial autorizada conforme a la Ley 1581 de 2012 (Habeas Data). Identificación enmascarada.</p>`;
    abrirPDF('Tablero de Prospectos', `Negocio: ${st.tbNegocio} · ${filas.length} prospectos`, cuerpo);
  }

  /* ===============================================================
     2) INFORME DE LEADS E IMPRESIONES  (analítico)
     =============================================================== */
  const INF = {
    kpis: [
      { l: 'Leads totales', v: '5.989', n: '17 meses de historia' },
      { l: 'Leads depurados', v: '5.211', n: 'Sin repetir persona e inmueble' },
      { l: 'Últimos 30 días', v: '1.186', n: '+7,2% vs. 30 días previos' },
      { l: 'Inmuebles con leads', v: '519', n: '277 activos últimos 30 días' },
      { l: 'Personas interesadas', v: '4.427', n: '543 vieron más de un inmueble' }
    ],
    // Evolución mensual (leads por tipo) — subconjunto representativo.
    meses: [
      { m: 'ago 25', venta: 38, arriendo: 18 }, { m: 'sep 25', venta: 45, arriendo: 22 },
      { m: 'oct 25', venta: 52, arriendo: 25 }, { m: 'nov 25', venta: 60, arriendo: 28 },
      { m: 'dic 25', venta: 58, arriendo: 24 }, { m: 'ene 26', venta: 168, arriendo: 88 },
      { m: 'feb 26', venta: 210, arriendo: 120 }, { m: 'mar 26', venta: 240, arriendo: 140 },
      { m: 'abr 26', venta: 300, arriendo: 162 }, { m: 'may 26', venta: 330, arriendo: 180 },
      { m: 'jun 26', venta: 320, arriendo: 185 }, { m: 'jul 26', venta: 560, arriendo: 412 },
      { m: 'ago 26', venta: 640, arriendo: 486 }, { m: 'sep 26', venta: 612, arriendo: 468 }
    ],
    // Leads por día de la semana (acumulado).
    dias: [{ d: 'Lun', v: 980 }, { d: 'Mar', v: 1045 }, { d: 'Mié', v: 1010 }, { d: 'Jue', v: 955 }, { d: 'Vie', v: 902 }, { d: 'Sáb', v: 735 }, { d: 'Dom', v: 712 }],
    // Leads por hora del día (acumulado) — picos artificiales en 6/11/15/20.
    horas: [12,8,5,4,4,6,210,120,140,160,180,420,260,240,260,520,300,280,320,610,520,360,210,90],
    // Mix venta/arriendo.
    mix: { venta: { inm: 406, leads: 4136, x: 10.2 }, arriendo: { inm: 113, leads: 1853, x: 16.4 } },
    // Ciudades.
    ciudades: [{ c: 'Bogotá', v: 4911 }, { c: 'Fusagasugá', v: 479 }, { c: 'Medellín', v: 70 }, { c: 'Otras (25)', v: 181 }],
    // Top inmuebles con más leads.
    top: [
      { cod: 'CC-10136095', neg: 'Arriendo', dir: 'Carrera 106A #154A-12 (Ferrara)', leads: 199, u30: 42, estado: 'Activo' },
      { cod: 'CC-10211959', neg: 'Arriendo', dir: 'Transversal 120A #129-68', leads: 166, u30: 0, estado: 'Sin leads 30 días' },
      { cod: 'CC-6983400', neg: 'Venta', dir: 'Calle 136 #53-46', leads: 133, u30: 18, estado: 'Activo' },
      { cod: 'CC-9835066', neg: 'Arriendo', dir: 'Calle 57H Sur #70-61', leads: 112, u30: 0, estado: 'Sin leads 30 días' },
      { cod: 'CC-10225178', neg: 'Arriendo', dir: 'Calle 187 #9-28, piso 11', leads: 78, u30: 21, estado: 'Activo' },
      { cod: 'CC-10046637', neg: 'Venta', dir: 'Carrera 50 #103B-18', leads: 66, u30: 15, estado: 'Activo' }
    ],
    // Impresiones y conversión.
    impr: { impresiones: 446713, leads: 3032, conv: 6.8, conInmuebles: 727, sinRetorno: 18 }
  };

  // ---- Helpers de gráficas SVG nativas (sin librerías externas) ----
  function barChart(data, opt) {
    // data: [{label, parts:[{v,color}]}] apiladas, o [{label, v, color}]
    const w = 760, h = 240, padL = 40, padB = 34, padT = 10;
    const innerH = h - padB - padT, innerW = w - padL - 8;
    const totals = data.map((d) => d.parts ? d.parts.reduce((a, p) => a + p.v, 0) : d.v);
    const max = Math.max.apply(null, totals.concat([1]));
    const niceMax = Math.ceil(max / 100) * 100 || max;
    const bw = innerW / data.length;
    const barW = Math.min(bw * 0.62, 44);
    const yTicks = 4;
    let grid = '';
    for (let i = 0; i <= yTicks; i++) {
      const yv = (niceMax / yTicks) * i; const y = padT + innerH - (yv / niceMax) * innerH;
      grid += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - 8}" y2="${y.toFixed(1)}" stroke="#EAEFF3" stroke-width="1"/><text x="${padL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="9" fill="#9EADB7">${fmtN(Math.round(yv))}</text>`;
    }
    let bars = '';
    data.forEach((d, i) => {
      const cx = padL + bw * i + (bw - barW) / 2;
      let yCursor = padT + innerH;
      const parts = d.parts || [{ v: d.v, color: d.color || '#097AB2' }];
      parts.forEach((p) => {
        const ph = (p.v / niceMax) * innerH;
        yCursor -= ph;
        bars += `<rect x="${cx.toFixed(1)}" y="${yCursor.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(0, ph).toFixed(1)}" rx="2" fill="${p.color}"><title>${esc(d.label)}: ${fmtN(p.v)}</title></rect>`;
      });
      bars += `<text x="${(cx + barW / 2).toFixed(1)}" y="${h - padB + 14}" text-anchor="middle" font-size="9" fill="#6B7785">${esc(d.label)}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" class="w-full" style="height:auto" role="img">${grid}${bars}</svg>`;
  }

  function donut(parts) {
    // parts: [{label, v, color}]
    const total = parts.reduce((a, p) => a + p.v, 0) || 1;
    const r = 52, cx = 70, cy = 70, sw = 22, C = 2 * Math.PI * r;
    let off = 0; let segs = '';
    parts.forEach((p) => {
      const frac = p.v / total; const len = frac * C;
      segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${sw}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"><title>${esc(p.label)}: ${fmtN(p.v)}</title></circle>`;
      off += len;
    });
    return `<svg viewBox="0 0 140 140" width="140" height="140" role="img">${segs}<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="18" font-weight="800" fill="#00204D">${fmtN(total)}</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="9" fill="#7B8F9D">LEADS</text></svg>`;
  }

  function hBars(data, color) {
    // data: [{label, v}] horizontal
    const max = Math.max.apply(null, data.map((d) => d.v).concat([1]));
    return `<div class="space-y-2">${data.map((d) => `
      <div class="flex items-center gap-2">
        <span class="text-[11px] text-cc-g600 w-24 flex-shrink-0 text-right">${esc(d.label)}</span>
        <div class="flex-1 h-4 rounded bg-cc-g100 overflow-hidden"><div class="h-full rounded" style="width:${((d.v / max) * 100).toFixed(1)}%;background:${color}"></div></div>
        <span class="text-[11px] font-semibold text-cc-navy w-12 flex-shrink-0">${fmtN(d.v)}</span>
      </div>`).join('')}</div>`;
  }

  function panel(title, sub, inner, extra) {
    return `<div class="rounded-xl border border-cc-g200 bg-white p-5 ${extra || ''}">
      <div class="mb-3"><h4 class="text-sm font-bold text-cc-navy">${title}</h4>${sub ? `<p class="text-[12px] text-cc-g500 mt-0.5">${sub}</p>` : ''}</div>
      ${inner}</div>`;
  }
  const legendDot = (c, t) => `<span class="inline-flex items-center gap-1 text-[11px] text-cc-g600"><span class="inline-block w-2.5 h-2.5 rounded-sm" style="background:${c}"></span>${t}</span>`;

  function topEstadoPill(e) {
    const bad = /sin leads/i.test(e);
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${bad ? 'bg-cc-amber/20 text-cc-navy' : 'bg-cc-green/15 text-cc-green700'}">${esc(e)}</span>`;
  }

  function renderInformeHist() {
    const meses = INF.meses.map((m) => ({ label: m.m, parts: [{ v: m.venta, color: '#097AB2' }, { v: m.arriendo, color: '#3E98CC' }] }));
    const dias = INF.dias.map((d) => ({ label: d.d, v: d.v, color: '#097AB2' }));
    const horas = INF.horas.map((v, i) => ({ label: i % 3 === 0 ? i + 'h' : '', v, color: v > 400 ? '#FF9D21' : '#3E98CC' }));
    const mix = INF.mix;
    return `
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-5">
        ${INF.kpis.map((k) => `<div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500 leading-tight">${k.l}</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${k.v}</p><p class="text-[10px] text-cc-g500 mt-0.5">${k.n}</p></div>`).join('')}
      </div>

      ${panel('Evolución mensual de leads', 'Leads por tipo de negocio · ago 2025 a sep 2026', `
        <div class="flex gap-3 mb-2">${legendDot('#097AB2', 'Venta')}${legendDot('#3E98CC', 'Arriendo')}</div>
        ${barChart(meses)}
        <p class="text-[12px] text-cc-g600 mt-2">El volumen se multiplicó por 12 entre el promedio de 2025 y el trimestre jul–sep 2026, con saltos en <b>enero</b> y <b>julio</b> coincidiendo con más inventario publicado.</p>`, 'mb-4')}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        ${panel('Día de la semana', 'Leads por día · acumulado', barChart(dias))}
        ${panel('Hora de registro del lead', 'Picos de 6, 11, 15 y 20 h sugieren cargues programados', barChart(horas))}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        ${panel('Venta vs. arriendo', 'Participación y rendimiento', `
          <div class="flex items-center gap-4">
            ${donut([{ label: 'Venta', v: mix.venta.leads, color: '#097AB2' }, { label: 'Arriendo', v: mix.arriendo.leads, color: '#3E98CC' }])}
            <div class="text-[12px] space-y-2">
              <div>${legendDot('#097AB2', 'Venta')}<p class="text-cc-g600 ml-4">${fmtN(mix.venta.inm)} inmuebles · ${fmtN(mix.venta.leads)} leads · <b>${mix.venta.x}</b>/inm</p></div>
              <div>${legendDot('#3E98CC', 'Arriendo')}<p class="text-cc-g600 ml-4">${fmtN(mix.arriendo.inm)} inmuebles · ${fmtN(mix.arriendo.leads)} leads · <b>${mix.arriendo.x}</b>/inm</p></div>
            </div>
          </div>
          <p class="text-[12px] text-cc-g600 mt-3">Con el 22% de los inmuebles, el arriendo trae el 31% de los leads.</p>`)}
        ${panel('Ciudades', 'Leads por ciudad del inmueble', hBars(INF.ciudades.map((c) => ({ label: c.c, v: c.v })), '#097AB2'), 'lg:col-span-2')}
      </div>

      ${panel('Inmuebles con más leads', 'Estado según los leads de los últimos 30 días', `
        <div class="overflow-x-auto"><table class="w-full text-[12px]">
          <thead><tr class="bg-cc-zpBg text-cc-g600 text-left"><th class="px-3 py-2 font-semibold">Código</th><th class="px-3 py-2 font-semibold">Negocio</th><th class="px-3 py-2 font-semibold">Dirección publicada</th><th class="px-3 py-2 font-semibold text-right">Leads</th><th class="px-3 py-2 font-semibold text-right">Últ. 30 d</th><th class="px-3 py-2 font-semibold">Estado</th></tr></thead>
          <tbody>${INF.top.map((t) => `<tr class="border-t border-cc-g100 hover:bg-cc-blueSoft/40"><td class="px-3 py-2 text-cc-g600">${esc(t.cod)}</td><td class="px-3 py-2">${t.neg === 'Arriendo' ? '<span class="text-cc-p700">Arriendo</span>' : '<span class="text-cc-primary">Venta</span>'}</td><td class="px-3 py-2 text-cc-g700">${esc(t.dir)}</td><td class="px-3 py-2 text-right font-semibold text-cc-navy">${fmtN(t.leads)}</td><td class="px-3 py-2 text-right text-cc-g600">${fmtN(t.u30)}</td><td class="px-3 py-2">${topEstadoPill(t.estado)}</td></tr>`).join('')}</tbody>
        </table></div>
        <p class="text-[12px] text-cc-g600 mt-2">Dos arriendos de alto volumen dejaron de recibir demanda (Calle 57H Sur y Transversal 120A): probablemente ya se arrendaron y conviene depurarlos.</p>`)}
    `;
  }

  function renderInformeImpr() {
    const im = INF.impr;
    const convPct = ((im.conInmuebles - 347) / im.conInmuebles * 100); // 380 con lead ≈ 52%
    return `
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-5">
        <div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500">Impresiones</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${fmtN(im.impresiones)}</p><p class="text-[10px] text-cc-g500 mt-0.5">1 jul a 23 sep 2026</p></div>
        <div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500">Leads del periodo</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${fmtN(im.leads)}</p><p class="text-[10px] text-cc-g500 mt-0.5">Cruzados por inmueble</p></div>
        <div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500">Conversión</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${im.conv} ‰</p><p class="text-[10px] text-cc-g500 mt-0.5">Leads por mil impresiones</p></div>
        <div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500">Inmuebles con impresiones</p><p class="text-xl font-extrabold text-cc-navy mt-0.5">${fmtN(im.conInmuebles)}</p><p class="text-[10px] text-cc-g500 mt-0.5">52% recibió al menos un lead</p></div>
        <div class="rounded-xl border border-cc-g200 bg-white px-4 py-3"><p class="text-[11px] text-cc-g500">Exposición sin retorno</p><p class="text-xl font-extrabold text-cc-amber mt-0.5">${im.sinRetorno}%</p><p class="text-[10px] text-cc-g500 mt-0.5">Fue a inmuebles sin leads</p></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        ${panel('Embudo de exposición', 'De la impresión al lead', `
          <div class="space-y-3">
            <div><div class="flex justify-between text-[12px] mb-1"><span class="text-cc-g600">Impresiones</span><span class="font-semibold text-cc-navy">${fmtN(im.impresiones)}</span></div><div class="h-5 rounded bg-cc-primary" style="width:100%"></div></div>
            <div><div class="flex justify-between text-[12px] mb-1"><span class="text-cc-g600">Inmuebles con impresiones</span><span class="font-semibold text-cc-navy">${fmtN(im.conInmuebles)}</span></div><div class="h-5 rounded bg-cc-blue" style="width:62%"></div></div>
            <div><div class="flex justify-between text-[12px] mb-1"><span class="text-cc-g600">Inmuebles con al menos un lead</span><span class="font-semibold text-cc-navy">380</span></div><div class="h-5 rounded bg-cc-green" style="width:${convPct.toFixed(0)}%"></div></div>
            <div><div class="flex justify-between text-[12px] mb-1"><span class="text-cc-g600">Leads generados</span><span class="font-semibold text-cc-navy">${fmtN(im.leads)}</span></div><div class="h-5 rounded bg-cc-amber" style="width:14%"></div></div>
          </div>
          <p class="text-[12px] text-cc-g600 mt-3">El 18% de las impresiones se fue a 347 inmuebles que no generaron ningún lead. Depurar o mejorar esos avisos libera exposición.</p>`)}
        ${panel('Conversión por segmento', 'Leads por mil impresiones (‰)', hBars([
          { label: 'Arriendo ≤2,5M', v: 13.8 }, { label: 'Venta 300–500M', v: 10.4 }, { label: 'Venta ≤300M', v: 9.8 }, { label: 'Casas', v: 4.8 }, { label: 'Venta >1.200M', v: 1.7 }, { label: 'Arriendo >7M', v: 1.7 }
        ].map((d) => ({ label: d.label, v: d.v })), '#FF9D21'))}
      </div>

      <div class="rounded-xl border border-cc-primary/40 bg-cc-blueSoft p-4 flex items-start gap-3">
        <i class="fa-solid fa-lightbulb text-cc-primary mt-0.5"></i>
        <div><p class="text-sm font-bold text-cc-navy">Lectura rápida</p><p class="text-xs text-cc-g600">El arriendo económico y la venta hasta 500M son los segmentos que mejor convierten. Los inmuebles de precio alto reciben mucha exposición con poco retorno: conviene reasignar destacados hacia los segmentos que sí generan contactos.</p></div>
      </div>`;
  }

  function renderInforme() {
    const hojas = [['hist', 'Histórico y volumen', 'fa-chart-column'], ['impr', 'Impresiones y conversión', 'fa-eye']];
    const h = st.infHoja;
    const body = h === 'impr' ? renderInformeImpr() : renderInformeHist();
    return `
      <div id="repInformeRoot">
        <div class="flex items-end justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 class="text-base font-bold text-cc-navy">Informe de Leads e Impresiones</h3>
            <p class="text-sm text-cc-g600 mt-0.5">Diagnóstico del desempeño de tus publicaciones: volumen de leads, exposición y conversión. Corte 24 sep 2026 · histórico desde may 2025.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="infPdf" class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2"><i class="fa-regular fa-file-pdf"></i> PDF</button>
            <button id="infCsv" class="text-sm font-semibold px-4 py-2 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white flex items-center gap-2"><i class="fa-solid fa-download"></i> CSV</button>
          </div>
        </div>
        <div class="flex items-center gap-2 mb-5 flex-wrap">
          ${hojas.map(([id, label, ico]) => `<button data-infhoja="${id}" class="text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 ${h === id ? 'bg-cc-primary text-white' : 'bg-cc-g100 text-cc-g600 hover:bg-cc-g200'}"><i class="fa-solid ${ico}"></i> ${label}</button>`).join('')}
        </div>
        <div>${body}</div>
      </div>`;
  }

  function bindInforme() {
    document.querySelectorAll('[data-infhoja]').forEach((b) => b.addEventListener('click', () => setSt({ infHoja: b.getAttribute('data-infhoja') })));
    el('infCsv') && el('infCsv').addEventListener('click', exportInformeCSV);
    el('infPdf') && el('infPdf').addEventListener('click', exportInformePDF);
  }

  function exportInformeCSV() {
    let cols, body, nombre;
    if (st.infHoja === 'impr') {
      cols = ['Métrica', 'Valor'];
      const im = INF.impr;
      const rows = [['Impresiones', im.impresiones], ['Leads del periodo', im.leads], ['Conversión (‰)', im.conv], ['Inmuebles con impresiones', im.conInmuebles], ['Exposición sin retorno (%)', im.sinRetorno]];
      body = rows.map((r) => r.map((v) => '"' + v + '"').join(';')).join('\r\n');
      nombre = 'Ciencuadras_informe_impresiones.csv';
    } else {
      cols = ['Mes', 'Venta', 'Arriendo', 'Total'];
      body = INF.meses.map((m) => [m.m, m.venta, m.arriendo, m.venta + m.arriendo].map((v) => '"' + v + '"').join(';')).join('\r\n');
      nombre = 'Ciencuadras_informe_leads_mensual.csv';
    }
    const head = cols.map((c) => '"' + c + '"').join(';');
    const meta = [`"Reporte:";"Informe de Leads e Impresiones"`, `"Hoja:";"${st.infHoja === 'impr' ? 'Impresiones y conversión' : 'Histórico y volumen'}"`, `"Generado:";"${new Date().toLocaleString('es-CO')}"`, ''].join('\r\n');
    descargar(nombre, meta + '\r\n' + head + '\r\n' + body, 'text/csv');
    toast('Informe exportado en CSV', 'success');
  }

  function exportInformePDF() {
    const kpisHtml = INF.kpis.map((k) => `<div class="kpi"><span class="l">${k.l}</span><span class="v">${k.v}</span><span class="n">${k.n}</span></div>`).join('');
    const mesesTbl = INF.meses.map((m) => `<tr><td>${m.m}</td><td class="r">${fmtN(m.venta)}</td><td class="r">${fmtN(m.arriendo)}</td><td class="r">${fmtN(m.venta + m.arriendo)}</td></tr>`).join('');
    const topTbl = INF.top.map((t) => `<tr><td>${esc(t.cod)}</td><td>${esc(t.neg)}</td><td>${esc(t.dir)}</td><td class="r">${fmtN(t.leads)}</td><td class="r">${fmtN(t.u30)}</td><td>${esc(t.estado)}</td></tr>`).join('');
    const im = INF.impr;
    const cuerpo = `
      <div class="kpis">${kpisHtml}</div>
      <h2>Evolución mensual de leads</h2>
      <table><thead><tr><th>Mes</th><th class="r">Venta</th><th class="r">Arriendo</th><th class="r">Total</th></tr></thead><tbody>${mesesTbl}</tbody></table>
      <h2>Impresiones y conversión</h2>
      <table><thead><tr><th>Métrica</th><th class="r">Valor</th></tr></thead><tbody>
        <tr><td>Impresiones</td><td class="r">${fmtN(im.impresiones)}</td></tr>
        <tr><td>Leads del periodo</td><td class="r">${fmtN(im.leads)}</td></tr>
        <tr><td>Conversión (‰)</td><td class="r">${im.conv}</td></tr>
        <tr><td>Inmuebles con impresiones</td><td class="r">${fmtN(im.conInmuebles)}</td></tr>
        <tr><td>Exposición sin retorno</td><td class="r">${im.sinRetorno}%</td></tr>
      </tbody></table>
      <h2>Inmuebles con más leads</h2>
      <table><thead><tr><th>Código</th><th>Negocio</th><th>Dirección</th><th class="r">Leads</th><th class="r">Últ. 30 d</th><th>Estado</th></tr></thead><tbody>${topTbl}</tbody></table>`;
    abrirPDF('Informe de Leads e Impresiones', 'Corte 24 sep 2026 · histórico desde may 2025', cuerpo);
  }

  /* ===============================================================
     Utilidades compartidas: descarga de archivos y PDF por impresión
     =============================================================== */
  function descargar(nombre, contenido, mime) {
    const blob = new Blob(['\ufeff' + contenido], { type: mime + ';charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  // PDF con identidad Ciencuadras vía ventana de impresión (sin librerías externas).
  function abrirPDF(titulo, subtitulo, cuerpoHtml) {
    const win = window.open('', '_blank');
    if (!win) { toast('Permite las ventanas emergentes para generar el PDF', 'warning'); return; }
    const fecha = new Date().toLocaleString('es-CO');
    win.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(titulo)} · Ciencuadras</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box} body{font-family:'Montserrat',Arial,sans-serif;color:#434F5B;margin:0;padding:28px 32px}
        .head{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #097AB2;padding-bottom:14px;margin-bottom:18px}
        .brand{display:flex;align-items:center;gap:10px}
        .brand .logo{width:30px;height:30px;border-radius:7px;background:#097AB2;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
        .brand b{color:#00204D;font-size:17px}
        .brand span{color:#097AB2}
        h1{font-size:19px;color:#00204D;margin:0}
        .sub{color:#7B8F9D;font-size:12px;margin-top:2px}
        .meta{text-align:right;font-size:11px;color:#7B8F9D}
        h2{font-size:14px;color:#00204D;margin:22px 0 8px;border-left:4px solid #097AB2;padding-left:8px}
        .kpis{display:flex;flex-wrap:wrap;gap:10px;margin:4px 0 6px}
        .kpi{flex:1 1 150px;border:1px solid #DFE4E7;border-radius:8px;padding:10px 12px}
        .kpi .l{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:#7B8F9D}
        .kpi .v{display:block;font-size:20px;font-weight:800;color:#00204D}
        .kpi .n{display:block;font-size:10px;color:#9EADB7;margin-top:2px}
        table{width:100%;border-collapse:collapse;font-size:11px;margin-top:4px}
        th{background:#F0F3F4;color:#5D6F7E;text-align:left;padding:7px 8px;border-bottom:1px solid #DFE4E7;font-size:10px;text-transform:uppercase;letter-spacing:.03em}
        td{padding:7px 8px;border-bottom:1px solid #EEF2F4}
        td.r,th.r{text-align:right}
        .muted{color:#9EADB7;font-size:10px}
        .legal{font-size:10px;color:#9EADB7;margin-top:16px;border-top:1px solid #EEF2F4;padding-top:8px}
        .foot{margin-top:22px;text-align:center;font-size:10px;color:#9EADB7}
        @media print{body{padding:0}.noprint{display:none}}
      </style></head><body>
      <div class="head">
        <div>
          <div class="brand"><span class="logo">C</span><b>cien<span>cuadras</span></b></div>
          <h1 style="margin-top:10px">${esc(titulo)}</h1>
          <p class="sub">${esc(subtitulo)}</p>
        </div>
        <div class="meta">Zona Privada · Oficina Virtual IA<br>Generado: ${esc(fecha)}</div>
      </div>
      ${cuerpoHtml}
      <div class="foot">Documento generado desde la Zona Privada de Ciencuadras · Información confidencial</div>
      <script>window.onload=function(){setTimeout(function(){window.print();},350);};<\/script>
      </body></html>`);
    win.document.close();
    toast('Abriendo vista de impresión / PDF…', 'info');
  }

  /* ---- API pública consumida por el módulo Oficina IA ---- */
  function body(tab) { return tab === 'informe' ? renderInforme() : renderTablero(); }
  function bind(tab) { if (tab === 'informe') bindInforme(); else bindTablero(); }
  window.OficinaVirtual.secReportesIA = { body, bind };
})();

/* =====================================================================
   PATCH: integra las pestañas de reportes dentro de Oficina Virtual IA
   sobre la versión base de app-oficina-virtual.js (que expone 2 pestañas).
   No depende de internals del módulo base: observa cuándo la vista
   Oficina IA está activa e inyecta las pestañas Tablero e Informe,
   gestionando su propio cambio de pestaña. Cargar DESPUÉS del script base.
   ===================================================================== */
(function () {
  'use strict';
  var OV = window.OficinaVirtual;
  if (!OV || !OV.secReportesIA) return;
  var el = function (id) { return document.getElementById(id); };
  var view = el('view-oficina-ia');
  if (!view) return;

  var EXTRA = [
    ['tablero', 'Tablero de Prospectos', 'fa-table-columns'],
    ['informe', 'Informe de Leads e Impresiones', 'fa-chart-column']
  ];
  var current = null; // pestaña de reporte activa (null = optimizador/leads del base)

  function barra() { return view.querySelector('.ia-tab') ? view.querySelector('.ia-tab').parentNode : null; }

  function pintarReporte(tab) {
    current = tab;
    var bar = barra();
    // marca visualmente la pestaña activa y desmarca las del base
    view.querySelectorAll('.ia-tab').forEach(function (b) {
      var isActive = b.getAttribute('data-ia') === tab;
      b.classList.toggle('active', isActive);
      if (isActive) { b.classList.remove('text-cc-g500', 'hover:text-cc-navy'); }
      else if (!b.classList.contains('active')) { b.classList.add('text-cc-g500', 'hover:text-cc-navy'); }
    });
    // reemplaza SOLO el contenedor de contenido (último hijo de la vista)
    var cont = view.lastElementChild;
    if (cont) cont.innerHTML = OV.secReportesIA.body(tab);
    OV.secReportesIA.bind(tab);
  }

  function inyectarPestanas() {
    var bar = barra();
    if (!bar) return;
    EXTRA.forEach(function (meta) {
      if (bar.querySelector('[data-ia="' + meta[0] + '"]')) return;
      var btn = document.createElement('button');
      btn.setAttribute('data-ia', meta[0]);
      btn.className = 'ia-tab whitespace-nowrap px-1 pb-3 text-sm font-semibold text-cc-g500 hover:text-cc-navy';
      btn.innerHTML = '<i class="fa-solid ' + meta[1 + 1] + ' mr-1"></i> ' + meta[1];
      btn.addEventListener('click', function () { pintarReporte(meta[0]); });
      bar.appendChild(btn);
    });
    // Las pestañas del base (optimizador/leads) deben limpiar el estado de reporte al pulsarse.
    bar.querySelectorAll('[data-ia="optimizador"],[data-ia="leads"]').forEach(function (b) {
      if (b.__ccHooked) return; b.__ccHooked = true;
      b.addEventListener('click', function () { current = null; });
    });
  }

  // Cada vez que el módulo base re-renderiza la vista, reinyectamos las pestañas.
  var obs = new MutationObserver(function () {
    if (!view.classList.contains('active')) return;
    // Si el usuario estaba en una pestaña de reporte, el base la habrá perdido: la repintamos.
    if (current === 'tablero' || current === 'informe') {
      // Evitar bucle: solo repintar si el contenido no es ya el del reporte.
      if (!el('repTableroRoot') && !el('repInformeRoot')) { pintarReporte(current); return; }
    }
    inyectarPestanas();
  });
  obs.observe(view, { childList: true, subtree: false });

  // Primera inyección si la vista ya está activa.
  if (view.classList.contains('active')) inyectarPestanas();
})();
