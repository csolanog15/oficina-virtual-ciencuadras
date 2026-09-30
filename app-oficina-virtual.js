/* =====================================================================
   Zona Privada Ciencuadras — Prototipo interactivo (SPA vanilla JS)
   Look fiel a la zona privada real (Publicaciones, plan Impulsa, banners).
   Datos simulados (mock) — mercado colombiano (COP, Bogotá/Medellín).
   ===================================================================== */
(function () {
  'use strict';
  const COP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const fmtCOP = (n) => COP.format(Math.round(n));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const el = (id) => document.getElementById(id);

  function toast(msg, type = 'info') {
    const host = el('toastHost');
    const colors = { info: 'bg-cc-navy', success: 'bg-cc-green700', warning: 'bg-cc-amber text-cc-navy', error: 'bg-cc-red' };
    const t = document.createElement('div');
    t.className = `toast ${colors[type] || colors.info} text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-xs flex items-center gap-2`;
    t.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'warning' ? 'fa-triangle-exclamation' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i><span>${msg}</span>`;
    host.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }
  function probBadge(level) {
    const map = { Alta: 'bg-cc-green/15 text-cc-green700', Media: 'bg-cc-amber/20 text-cc-navy', Baja: 'bg-red-100 text-cc-red' };
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[level] || 'bg-gray-100 text-gray-600'}">${level}</span>`;
  }
  function createStore(initial) {
    let state = initial; const subs = [];
    return { get: () => state, set: (patch) => { state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }; subs.forEach((fn) => fn(state)); }, subscribe: (fn) => { subs.push(fn); } };
  }
  function sectionHead(title, desc, right = '') {
    return `<div class="flex items-end justify-between flex-wrap gap-3 mb-4"><div><h2 class="text-lg font-bold text-cc-navy">${title}</h2><p class="text-sm text-cc-g600 mt-0.5">${desc}</p></div>${right}</div>`;
  }
  function bannerColumn() {
    return `<aside class="hidden xl:block w-64 flex-shrink-0">
      <div class="rounded-xl bg-cc-zpBanner border border-cc-g200 p-5 text-center">
        <div class="h-8 flex items-center justify-center mb-3"><span class="text-cc-navy font-extrabold">davi<span class="text-cc-red">vienda</span></span></div>
        <p class="text-xs text-cc-g600 leading-snug mb-4">Gestiona aquí, con más de 8 bancos el crédito para tu cliente. Comisión 0,3%</p>
        <button class="w-full text-sm font-semibold px-4 py-2 rounded-lg bg-cc-amber text-white hover:brightness-95">Iniciar solicitud</button>
      </div>
    </aside>`;
  }
  window.OficinaVirtual = { utils: { fmtCOP, probBadge, toast, createStore, clamp, el, sectionHead, bannerColumn } };
})();

/* =====================================================================
   SECCIÓN: PUBLICACIONES  (vista principal, fiel a la real)
   ===================================================================== */
(function () {
  'use strict';
  const { fmtCOP, toast, createStore, el, bannerColumn } = window.OficinaVirtual.utils;

  const PROPS = [
    { code: 'CC-84213', tipo: 'Apartamento', tx: 'Arriendo', precio: 2400000, ciudad: 'Bogotá', barrio: 'Cedritos', hab: 2, banos: 1, area: 62, dias: 21, leads: 8, activo: true, foto: 'linear-gradient(135deg,#3E98CC,#006098)' },
    { code: 'CC-84090', tipo: 'Apartamento', tx: 'Venta', precio: 335000000, ciudad: 'Medellín', barrio: 'Laureles', hab: 3, banos: 2, area: 88, dias: 12, leads: 14, activo: true, destacado: true, foto: 'linear-gradient(135deg,#53A532,#277619)' },
    { code: 'CC-83771', tipo: 'Casa', tx: 'Venta', precio: 620000000, ciudad: 'Medellín', barrio: 'Envigado', hab: 4, banos: 3, area: 180, dias: 5, leads: 3, activo: true, foto: 'linear-gradient(135deg,#FF9D21,#DB7C18)' },
    { code: 'CC-83540', tipo: 'Apartaestudio', tx: 'Arriendo', precio: 1750000, ciudad: 'Bogotá', barrio: 'Chapinero', hab: 1, banos: 1, area: 34, dias: 0, leads: 0, activo: false, foto: 'linear-gradient(135deg,#7B8F9D,#5D6F7E)' }
  ];
  const store = createStore({ tab: 'activas', filtro: '', planOpen: true });

  function planPanel(open) {
    const prod = [
      ['fa-star', 'Inmuebles destacados', 9, 394],
      ['fa-arrow-up-wide-short', 'Inmuebles Ascendidos', 14, 389],
      ['fa-bullhorn', 'Inmuebles pautados', 3, 0]
    ];
    return `
      <div class="rounded-xl border border-cc-g200 bg-white mb-5">
        <button id="planToggle" class="w-full flex items-center justify-between px-5 pt-4 pb-2 text-left">
          <p class="text-sm text-cc-g700">Tu plan actual es: <b class="text-cc-navy">Plan Impulsa</b></p>
          <i class="fa-solid fa-chevron-${open ? 'up' : 'down'} text-cc-g400"></i>
        </button>
        ${open ? `
        <div class="px-5 pb-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            <div class="flex items-start gap-2">
              <i class="fa-regular fa-calendar text-cc-primary mt-0.5"></i>
              <div><p class="text-xs font-semibold text-cc-navy">Días disponibles: 19</p><p class="text-[11px] text-cc-g500">Vence: 2026-10-10</p></div>
            </div>
            ${prod.map(([ico, t, uso, disp]) => `
              <div class="flex items-start gap-2">
                <i class="fa-solid ${ico} text-cc-primary mt-0.5"></i>
                <div><p class="text-xs font-semibold text-cc-navy">${t}</p><p class="text-[11px] text-cc-g500">${uso} En uso · ${disp} Disponibles</p></div>
              </div>`).join('')}
          </div>
          <div class="text-right mt-3"><button id="adqProd" class="text-sm font-semibold text-cc-primary hover:underline">Adquirir productos</button></div>
        </div>` : ''}
      </div>`;
  }

  function propCard(p) {
    const precioLabel = p.tx === 'Arriendo' ? 'Valor Arriendo' : 'Valor Venta';
    return `
      <article class="card bg-white rounded-xl border border-cc-g200 overflow-hidden">
        <div class="flex flex-col sm:flex-row">
          <div class="relative sm:w-52 h-36 sm:h-auto flex-shrink-0" style="background:${p.foto}">
            ${p.destacado ? '<span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cc-amber text-white"><i class="fa-solid fa-star"></i> Destacado</span>' : ''}
            ${!p.activo ? '<span class="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs font-semibold"><i class="fa-solid fa-eye mr-1"></i> Inactivo</span>' : ''}
          </div>
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="text-[11px] text-cc-g500">${precioLabel}</p>
                <p class="text-lg font-extrabold text-cc-navy">${fmtCOP(p.precio)}${p.tx === 'Arriendo' ? '<span class="text-xs font-medium text-cc-g500">/mes</span>' : ''}</p>
                <p class="text-sm text-cc-g700 mt-0.5">${p.tipo} en ${p.tx.toLowerCase()}</p>
                <p class="text-[12px] text-cc-g600"><i class="fa-solid fa-location-dot text-cc-primary"></i> ${p.barrio}, ${p.ciudad}</p>
              </div>
              <span class="text-[11px] px-2 py-0.5 rounded-full ${p.activo ? 'bg-cc-green/15 text-cc-green700' : 'bg-gray-100 text-gray-500'}">${p.activo ? 'Activa' : 'Inactiva'}</span>
            </div>
            <div class="flex items-center gap-4 text-[12px] text-cc-g600 mt-3">
              <span><i class="fa-solid fa-bed text-cc-g400"></i> ${p.hab}</span>
              <span><i class="fa-solid fa-toilet text-cc-g400"></i> ${p.banos}</span>
              <span><i class="fa-solid fa-ruler-combined text-cc-g400"></i> ${p.area} m²</span>
              <span class="ml-auto text-cc-g500">Código: ${p.code}</span>
            </div>
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-cc-g200">
              <div class="flex items-center gap-3 text-[12px]">
                <span class="text-cc-g600"><i class="fa-regular fa-clock"></i> ${p.dias} días</span>
                <span class="font-semibold text-cc-navy"><i class="fa-solid fa-users text-cc-primary"></i> ${p.leads} leads</span>
              </div>
              <div class="flex items-center gap-1">
                <button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-g500" title="Compartir"><i class="fa-solid fa-share-nodes"></i></button>
                <button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-g500" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button>
                <button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-red" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const s = store.get();
    const activas = PROPS.filter((p) => p.activo);
    const inactivas = PROPS.filter((p) => !p.activo);
    let list = s.tab === 'activas' ? activas : s.tab === 'inactivas' ? inactivas : PROPS;
    if (s.filtro) list = list.filter((p) => (p.code + ' ' + p.barrio + ' ' + p.ciudad + ' ' + p.tipo).toLowerCase().includes(s.filtro.toLowerCase()));
    const tab = (id, label, n) => `<button data-tab="${id}" class="pb-2 text-sm font-semibold border-b-2 ${s.tab === id ? 'text-cc-primary border-cc-primary' : 'text-cc-g500 border-transparent hover:text-cc-navy'}">${label} <span class="opacity-80">${n}</span></button>`;

    el('view-publicaciones').innerHTML = `
      <div class="flex gap-6">
        <div class="flex-1 min-w-0">
          <div class="mb-4">
            <h2 class="text-lg font-bold text-cc-navy">Publicaciones</h2>
            <p class="text-sm text-cc-g600 mt-0.5">Lleva el control de tu plan y tus servicios disponibles, actualízalo cuando sea necesario. También puedes publicar un inmueble, editarlo, aplicarle servicios, compartirlo y desactivarlo.</p>
          </div>
          ${planPanel(s.planOpen)}

          <div class="flex items-center justify-between flex-wrap gap-3 mb-5">
            <div class="flex items-center gap-3">
              <button class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2"><i class="fa-solid fa-plus"></i> Publicar</button>
              <button class="text-sm font-semibold px-4 py-2 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white">Comprar plan</button>
            </div>
            <button id="exportXls" class="text-sm font-semibold text-cc-primary hover:underline flex items-center gap-2">Exportar Excel <i class="fa-solid fa-download"></i></button>
          </div>

          <div class="rounded-xl border border-cc-primary/40 bg-cc-blueSoft p-4 mb-5 flex items-start gap-3">
            <i class="fa-solid fa-circle-info text-cc-primary mt-0.5"></i>
            <div class="flex-1">
              <p class="text-sm font-bold text-cc-navy">Estás a pocos pasos de publicar tu inmueble</p>
              <p class="text-xs text-cc-g600">Tienes una publicación guardada y pendiente por terminar. Retómala desde aquí para empezar a impulsarla.</p>
            </div>
            <button id="continuar" class="text-sm font-semibold text-cc-primary hover:underline whitespace-nowrap flex items-center gap-1">Continuar <i class="fa-solid fa-chevron-right text-[10px]"></i></button>
          </div>

          <div class="rounded-xl border border-cc-g200 bg-white p-4 mb-5 text-center">
            <p class="text-sm text-cc-g700">Configura los horarios de visita a tus inmuebles</p>
            <button id="agenda" class="text-sm font-semibold text-cc-primary hover:underline mt-1">Agendamiento</button>
          </div>

          <div class="flex items-center gap-6 border-b border-cc-g200 mb-4">
            ${tab('activas', 'Activas', activas.length)}
            ${tab('inactivas', 'Inactivas', inactivas.length)}
            ${tab('publicadas', 'Publicadas', PROPS.length)}
          </div>
          <div class="space-y-4">
            ${list.length ? list.map(propCard).join('') : '<div class="rounded-xl border border-dashed border-cc-g300 bg-white p-10 text-center text-cc-g500 text-sm">Aún no tienes información en esta categoría</div>'}
          </div>
        </div>
        ${bannerColumn()}
      </div>`;

    el('planToggle') && el('planToggle').addEventListener('click', () => store.set({ planOpen: !store.get().planOpen }));
    document.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => store.set({ tab: b.getAttribute('data-tab') })));
    document.querySelectorAll('.prop-act').forEach((b) => b.addEventListener('click', () => toast('Acción de demo (' + (b.title || 'acción') + ')', 'info')));
    el('exportXls') && el('exportXls').addEventListener('click', () => toast('Exportando inmuebles a Excel…', 'success'));
    el('continuar') && el('continuar').addEventListener('click', () => toast('Retomando publicación guardada…', 'info'));
    el('agenda') && el('agenda').addEventListener('click', () => toast('Abriendo agendamiento de visitas…', 'info'));
    el('adqProd') && el('adqProd').addEventListener('click', () => toast('Ir a adquirir productos', 'info'));
  }
  store.subscribe(render);
  window.OficinaVirtual.secPublicaciones = { render };
})();

/* =====================================================================
   SECCIÓN: MIS LEADS (tabla de contactos con descarga)
   ===================================================================== */
(function () {
  'use strict';
  const { toast, el, sectionHead, bannerColumn } = window.OficinaVirtual.utils;
  const CONTACTS = [
    { code: 'CC-84090', inmueble: 'Apto · Laureles, Medellín', nombre: 'Valentina Ríos', tel: '+57 315 555 1212', canal: 'WhatsApp', fecha: '04/09/2026', tipo: 'Formulario' },
    { code: 'CC-84213', inmueble: 'Apto · Cedritos, Bogotá', nombre: 'Laura Gómez', tel: '+57 300 123 4567', canal: 'Teléfono', fecha: '04/09/2026', tipo: 'Llamada' },
    { code: 'CC-83771', inmueble: 'Casa · Envigado, Medellín', nombre: 'Andrés Restrepo', tel: '+57 310 987 6543', canal: 'WhatsApp', fecha: '03/09/2026', tipo: 'Formulario' },
    { code: 'CC-84090', inmueble: 'Apto · Laureles, Medellín', nombre: 'Camilo Duarte', tel: '+57 320 445 8890', canal: 'Email', fecha: '02/09/2026', tipo: 'Formulario' },
    { code: 'CC-84213', inmueble: 'Apto · Cedritos, Bogotá', nombre: 'Daniela Peña', tel: '+57 301 778 2211', canal: 'WhatsApp', fecha: '01/09/2026', tipo: 'Formulario' }
  ];
  const canalBadge = (c) => {
    const map = { WhatsApp: 'bg-cc-green/15 text-cc-green700', 'Teléfono': 'bg-cc-blue/15 text-cc-p700', Email: 'bg-cc-amber/20 text-cc-navy' };
    const ico = { WhatsApp: 'fa-whatsapp', 'Teléfono': 'fa-phone', Email: 'fa-envelope' };
    const brand = c === 'WhatsApp' ? 'fa-brands' : 'fa-solid';
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[c] || 'bg-gray-100'}"><i class="${brand} ${ico[c]}"></i> ${c}</span>`;
  };
  function render() {
    el('view-leads').innerHTML = `
      <div class="flex gap-6">
        <div class="flex-1 min-w-0">
          ${sectionHead('Mis leads', 'Contactos generados por tus inmuebles publicados',
            '<button id="dlContacts" class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2">Exportar Excel <i class="fa-solid fa-download"></i></button>')}
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Total leads</p><p class="text-2xl font-extrabold text-cc-navy">${CONTACTS.length}</p></div>
            <div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Por WhatsApp</p><p class="text-2xl font-extrabold text-cc-green700">${CONTACTS.filter(c=>c.canal==='WhatsApp').length}</p></div>
            <div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Inmuebles con leads</p><p class="text-2xl font-extrabold text-cc-navy">3</p></div>
            <div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Últimos 7 días</p><p class="text-2xl font-extrabold text-cc-navy">${CONTACTS.length}</p></div>
          </div>
          <div class="rounded-xl border border-cc-g200 bg-white overflow-hidden">
            <div class="overflow-x-auto"><table class="w-full text-sm">
              <thead class="bg-cc-g100 text-cc-g600"><tr>
                <th class="text-left font-semibold px-4 py-3">Contacto</th><th class="text-left font-semibold px-4 py-3">Inmueble</th>
                <th class="text-left font-semibold px-4 py-3">Canal</th><th class="text-left font-semibold px-4 py-3">Tipo</th>
                <th class="text-left font-semibold px-4 py-3">Fecha</th><th class="text-right font-semibold px-4 py-3">Acción</th>
              </tr></thead>
              <tbody class="divide-y divide-cc-g200">
                ${CONTACTS.map((c) => `<tr class="hover:bg-cc-zpBg">
                  <td class="px-4 py-3"><p class="font-semibold text-cc-navy">${c.nombre}</p><p class="text-[11px] text-cc-g500">${c.tel}</p></td>
                  <td class="px-4 py-3 text-cc-g700"><span class="text-[11px] text-cc-g500">${c.code}</span><br>${c.inmueble}</td>
                  <td class="px-4 py-3">${canalBadge(c.canal)}</td><td class="px-4 py-3 text-cc-g600">${c.tipo}</td>
                  <td class="px-4 py-3 text-cc-g600">${c.fecha}</td>
                  <td class="px-4 py-3 text-right"><button class="ct-wa w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-green700" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></button><button class="ct-view w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-primary" title="Ver detalle"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td>
                </tr>`).join('')}
              </tbody>
            </table></div>
          </div>
        </div>
        ${bannerColumn()}
      </div>`;
    el('dlContacts') && el('dlContacts').addEventListener('click', () => toast('Generando reporte de leads (.xlsx)…', 'success'));
    document.querySelectorAll('.ct-wa').forEach((b) => b.addEventListener('click', () => toast('Abriendo WhatsApp con el contacto', 'success')));
    document.querySelectorAll('.ct-view').forEach((b) => b.addEventListener('click', () => toast('Detalle del lead (demo)', 'info')));
  }
  window.OficinaVirtual.secLeads = { render };
})();

/* =====================================================================
   SECCIÓN: PRODUCTOS Y SERVICIOS (planes)
   ===================================================================== */
(function () {
  'use strict';
  const { fmtCOP, el, sectionHead, toast, bannerColumn } = window.OficinaVirtual.utils;
  const PLANS = [
    { name: 'Plan Básico', price: 89000, feats: ['Hasta 10 inmuebles', 'Estadísticas básicas', 'Soporte por correo'], color: 'border-cc-g200' },
    { name: 'Plan Impulsa', price: 189000, feats: ['Hasta 50 inmuebles', '5 destacados/mes', 'Oficina Virtual IA', 'Soporte prioritario'], color: 'border-cc-primary', current: true },
    { name: 'Plan Constructora', price: 349000, feats: ['Inmuebles ilimitados', 'Proyectos y salas de venta', 'Reportes avanzados', 'Ejecutivo dedicado'], color: 'border-cc-g200' }
  ];
  function render() {
    el('view-productos').innerHTML = `
      <div class="flex gap-6"><div class="flex-1 min-w-0">
        ${sectionHead('Productos y servicios', 'Adquiere alguno de nuestros planes para impulsar el potencial de tus inmuebles.')}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${PLANS.map((p) => `
            <div class="card rounded-xl border-2 ${p.color} bg-white p-5 relative">
              ${p.current ? '<span class="absolute -top-2 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cc-primary text-white">Tu plan actual</span>' : ''}
              <p class="text-sm font-bold text-cc-navy">${p.name}</p>
              <p class="mt-2"><span class="text-2xl font-extrabold text-cc-navy">${fmtCOP(p.price)}</span><span class="text-xs text-cc-g500">/mes</span></p>
              <ul class="mt-4 space-y-2">${p.feats.map((f) => `<li class="text-sm text-cc-g700 flex items-center gap-2"><i class="fa-solid fa-check text-cc-green700"></i> ${f}</li>`).join('')}</ul>
              <button data-plan="${p.name}" class="plan-btn mt-5 w-full text-sm font-semibold px-4 py-2.5 rounded-lg ${p.current ? 'bg-cc-g100 text-cc-g600 cursor-default' : 'bg-cc-primary hover:bg-cc-p600 text-white'}">${p.current ? 'Plan activo' : 'Adquirir plan'}</button>
            </div>`).join('')}
        </div>
      </div>${bannerColumn()}</div>`;
    document.querySelectorAll('.plan-btn').forEach((b) => b.addEventListener('click', () => { if (!/actual|activo/i.test(b.textContent)) toast('Iniciando compra: ' + b.getAttribute('data-plan'), 'success'); }));
  }
  window.OficinaVirtual.secProductos = { render };
})();

/* =====================================================================
   SECCIÓN: MIS DATOS + DATOS FACTURACIÓN
   ===================================================================== */
(function () {
  'use strict';
  const { el, sectionHead, toast, bannerColumn } = window.OficinaVirtual.utils;
  function field(label, value, ico) {
    return `<div><label class="text-[11px] uppercase text-cc-g500">${label}</label><div class="mt-1 relative"><i class="fa-solid ${ico} absolute left-3 top-1/2 -translate-y-1/2 text-cc-g400"></i><input class="w-full text-sm border border-cc-g200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cc-primary" value="${value}"></div></div>`;
  }
  function card(title, desc, fields, saveId) {
    return `<div class="flex gap-6"><div class="flex-1 min-w-0">
      ${sectionHead(title, desc)}
      <div class="rounded-xl border border-cc-g200 bg-white p-6 max-w-3xl">
        <div class="flex items-center gap-4 mb-6"><div class="w-16 h-16 rounded-full bg-cc-primary text-white flex items-center justify-center text-xl font-bold">IB</div><div><p class="font-bold text-cc-navy">Inmobiliaria Bolívar</p><p class="text-xs text-cc-g500">NIT 900.123.456-7 · Plan Impulsa</p></div></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${fields}</div>
        <button id="${saveId}" class="mt-6 text-sm font-semibold px-5 py-2.5 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
      </div>
    </div>${bannerColumn()}</div>`;
  }
  function renderPerfil() {
    el('view-perfil').innerHTML = card('Mis datos', 'Información de tu inmobiliaria',
      field('Razón social', 'Inmobiliaria Bolívar S.A.S', 'fa-building') + field('Correo', 'contacto@inmobolivar.co', 'fa-envelope') + field('Teléfono', '+57 601 555 4433', 'fa-phone') + field('Ciudad', 'Bogotá D.C.', 'fa-location-dot'), 'savePerfil');
    el('savePerfil') && el('savePerfil').addEventListener('click', () => toast('Datos actualizados', 'success'));
  }
  function renderFacturacion() {
    el('view-facturacion').innerHTML = card('Datos Facturación', 'Información para la facturación de tus servicios',
      field('Razón social', 'Inmobiliaria Bolívar S.A.S', 'fa-building') + field('NIT', '900.123.456-7', 'fa-id-card') + field('Dirección', 'Cra 7 # 71-52, Bogotá', 'fa-location-dot') + field('Correo facturación', 'facturacion@inmobolivar.co', 'fa-envelope'), 'saveFact');
    el('saveFact') && el('saveFact').addEventListener('click', () => toast('Datos de facturación actualizados', 'success'));
  }
  window.OficinaVirtual.secPerfil = { render: renderPerfil };
  window.OficinaVirtual.secFacturacion = { render: renderFacturacion };
})();

/* =====================================================================
   SECCIÓN: OFICINA VIRTUAL IA  (2 módulos con sub-tabs)
   ===================================================================== */
(function () {
  'use strict';
  const { fmtCOP, probBadge, toast, createStore, clamp, el } = window.OficinaVirtual.utils;
  const nav = createStore({ tab: 'optimizador' });

  /* Módulo 1: Optimizador */
  const optim = createStore({ titulo: 'Apartamento en arriendo — Cedritos, Bogotá', descripcion: 'Apartamento de 2 habitaciones, 1 baño, cocina integral. Zona tranquila y bien ubicada cerca de transporte.', precio: 2400000, zMin: 2100000, zMax: 3200000, fotos: false, descIA: false, periodo: 7, attrs: { parqueadero: false, admin: false, gym: false, pet: false, deposito: false } });
  const VIEWS_30 = [9,7,11,13,10,8,12,14,11,9,15,12,16,13,11,10,17,14,13,15,12,11,18,16,14,19,17,15,21,18];
  const LEADS_30 = [0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0];
  const FAVS_30  = [0,1,0,1,0,0,1,0,1,1,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,1,0];
  function metricas(dias) {
    const sum = (a) => a.reduce((x, y) => x + y, 0);
    const vistas = VIEWS_30.slice(-dias); const leads = LEADS_30.slice(-dias); const favs = FAVS_30.slice(-dias);
    const totV = sum(vistas), totL = sum(leads), totF = sum(favs);
    const prevV = sum(VIEWS_30.slice(-dias * 2, -dias)) || totV;
    const deltaV = Math.round(((totV - prevV) / (prevV || 1)) * 100);
    const conv = totV ? (totL / totV) * 100 : 0;
    return { vistas, leads, favs, totV, totL, totF, deltaV, conv };
  }
  const sparkline = (arr, color) => {
    const max = Math.max.apply(null, arr.concat([1])); const w = 100, h = 28;
    const step = arr.length > 1 ? w / (arr.length - 1) : w;
    const pts = arr.map((val, i) => (i * step).toFixed(1) + ',' + (h - (val / max) * (h - 4) - 2).toFixed(1)).join(' ');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" class="w-full h-7"><polyline fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="' + pts + '"/></svg>';
  };
  const DESC_IA = {
    titulo: 'Amplio apartamento remodelado en arriendo — Cedritos, Bogotá',
    descripcion: 'Apartamento de 2 habitaciones y 1 baño con cocina integral, totalmente remodelado e iluminado con luz natural. Ubicado en zona tranquila y segura de Cedritos, a pocos minutos de transporte público, centros comerciales y parques. Cuenta con administración incluida y parqueadero de visitantes. Ideal para quienes buscan comodidad, buena ubicación y excelente valorización.'
  };
  const ATTR = { parqueadero: 'Parqueadero de visitantes', admin: 'Administración incluida', gym: 'Gimnasio / zona húmeda', pet: 'Pet friendly', deposito: 'Depósito / bodega' };
  function score(s) {
    let sc = s.fotos ? 30 : 15;
    const d = s.descripcion.trim(); const w = d ? d.split(/\s+/).length : 0;
    let ds = clamp(Math.round((w / 60) * 22), 0, 22);
    const kw = ['parqueadero','administración','administracion','gimnasio','iluminado','remodelado','transporte'];
    ds += Math.min(kw.filter((k) => d.toLowerCase().includes(k)).length * 2, 8);
    sc += Math.min(ds, 30);
    sc += Object.values(s.attrs).filter(Boolean).length * 5;
    if (s.precio >= s.zMin && s.precio <= s.zMax) sc += 15;
    else { const m = (s.zMin + s.zMax) / 2; sc += clamp(Math.round(15 - (Math.abs(s.precio - m) / m) * 30), 0, 15); }
    return clamp(Math.round(sc), 0, 100);
  }
  const scColor = (v) => v >= 85 ? '#277619' : v >= 60 ? '#FF9D21' : '#DC0A0A';
  function renderOptim() {
    const s = optim.get(); const v = score(s); const strong = v >= 85; const col = scColor(v);
    const circ = 2 * Math.PI * 52; const off = circ - (v / 100) * circ;
    const range = s.zMax - s.zMin; const pos = clamp(((s.precio - s.zMin) / range) * 100, 0, 100);
    const inR = s.precio >= s.zMin && s.precio <= s.zMax;
    const m = metricas(s.periodo);
    const convBench = 1.5;
    const convOk = m.conv >= convBench;
    const convCol = m.conv >= convBench ? '#277619' : m.conv >= convBench * 0.6 ? '#FF9D21' : '#DC0A0A';
    const convMsg = convOk
      ? 'Buena conversion: los usuarios que te ven dejan contacto.'
      : (m.totV >= 40 ? 'Tienes trafico pero pocos leads. Mejora fotos y precio para convertir mas.' : 'Aun con poco trafico. Sube tu score para ganar visibilidad.');
    const seg = (n) => `<button data-per="${n}" class="px-2.5 py-1 rounded-md text-[11px] font-semibold ${s.periodo === n ? 'bg-cc-primary text-white' : 'bg-cc-g100 text-cc-g600 hover:bg-cc-g200'}">${n} dias</button>`;
    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div class="card bg-white rounded-xl border border-cc-g200 p-6 flex items-center gap-5">
          <div class="relative w-32 h-32 flex-shrink-0"><svg viewBox="0 0 120 120" class="w-32 h-32 -rotate-90"><circle cx="60" cy="60" r="52" fill="none" stroke="#E9ECEF" stroke-width="12"/><circle class="score-ring" cx="60" cy="60" r="52" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-3xl font-extrabold" style="color:${col}">${v}</span><span class="text-[10px] text-cc-g500 uppercase">/ 100</span></div></div>
          <div><p class="text-xs font-semibold text-cc-g600 uppercase">Score de Calidad IA</p><p class="text-sm text-cc-navy font-bold mt-1">${strong ? 'Anuncio destacado' : v >= 60 ? 'Mejorable' : 'Requiere atención'}</p><p class="text-xs text-cc-g500 mt-2 leading-relaxed">La IA evalúa fotos, descripción, atributos y precio frente a la competencia.</p></div>
        </div>
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="card rounded-xl border border-cc-g200 bg-white p-5 flex flex-col">
            <div class="flex items-center justify-between mb-1"><span class="text-xs font-semibold text-cc-g600 uppercase">Vistas del inmueble</span><span class="text-[10px] px-2 py-0.5 rounded-full bg-cc-blueSoft text-cc-primary font-semibold"><i class="fa-brands fa-google mr-1"></i>GA4</span></div>
            <div class="flex items-end gap-2 mt-1"><span class="text-3xl font-extrabold text-cc-navy">${m.totV.toLocaleString('es-CO')}</span><span class="text-xs font-semibold mb-1 ${m.deltaV >= 0 ? 'text-cc-green700' : 'text-cc-red'}"><i class="fa-solid fa-arrow-trend-${m.deltaV >= 0 ? 'up' : 'down'}"></i> ${m.deltaV >= 0 ? '+' : ''}${m.deltaV}%</span></div>
            <p class="text-[11px] text-cc-g500 mb-2">Ultimos ${s.periodo} dias · vs. periodo anterior</p>
            <div class="mt-auto">${sparkline(m.vistas, '#097AB2')}</div>
            <div class="flex items-center gap-2 mt-3">${seg(7)}${seg(30)}<span class="ml-auto text-[11px] text-cc-g500"><i class="fa-regular fa-heart text-cc-red"></i> ${m.totF} guardados</span></div>
          </div>
          <div class="card rounded-xl border p-5 flex flex-col" style="border-color:${convCol}33;background:${convCol}0d">
            <div class="flex items-center justify-between mb-1"><span class="text-xs font-semibold text-cc-g600 uppercase">Conversion vista -> lead</span><span class="text-xs font-bold" style="color:${convCol}">${convOk ? 'saludable' : 'por mejorar'}</span></div>
            <div class="flex items-end gap-2 mt-1"><span class="text-3xl font-extrabold" style="color:${convCol}">${m.conv.toFixed(1)}%</span><span class="text-xs text-cc-g600 mb-1">${m.totL} leads / ${m.totV} vistas</span></div>
            <p class="text-[11px] text-cc-g500 mb-2">Referencia zona: ${convBench}% · Cedritos</p>
            <div class="w-full h-2 rounded-full bg-cc-g200 overflow-hidden mb-1"><div class="h-full rounded-full" style="width:${clamp((m.conv / (convBench * 2)) * 100, 4, 100)}%;background:${convCol}"></div></div>
            <p class="text-xs text-cc-g600 mt-2 leading-snug">${convMsg}</p>
            ${!convOk && m.totV >= 40 ? '<button id="oGoScore" class="mt-3 text-xs font-semibold text-cc-primary hover:underline text-left"><i class="fa-solid fa-wand-magic-sparkles"></i> Optimizar anuncio para convertir mas</button>' : ''}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="card bg-white rounded-xl border border-cc-g200 p-6">
          <div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Calidad de fotos</h3>${s.fotos ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cc-green/15 text-cc-green700">Óptimas</span>' : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-cc-red">Baja luz / resolución</span>'}</div>
          <div class="flex gap-2 mb-4">${[1,2,3,4].map(() => `<div class="flex-1 aspect-video rounded-lg border ${s.fotos ? 'border-cc-green/40' : 'border-cc-g200'} relative overflow-hidden" style="background:${s.fotos ? 'linear-gradient(135deg,#e8f5ee,#cfeede)' : 'linear-gradient(135deg,#3a3a3a,#5a5a5a)'}"><span class="absolute bottom-1 right-1 text-[9px] px-1 rounded ${s.fotos ? 'bg-cc-green700 text-white' : 'bg-black/60 text-white'}">${s.fotos ? 'HD' : 'oscura'}</span></div>`).join('')}</div>
          <button id="oBtnFotos" class="w-full text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 ${s.fotos ? 'bg-cc-green/15 text-cc-green700 cursor-default' : 'bg-cc-primary hover:bg-cc-p600 text-white'}">${s.fotos ? '<i class="fa-solid fa-check"></i> Fotos optimizadas (+15 aplicado)' : '<i class="fa-solid fa-wand-magic-sparkles"></i> Mejorar fotos con IA'}</button>
        </div>
        <div class="card bg-white rounded-xl border border-cc-g200 p-6">
          <div class="flex items-center justify-between mb-1"><h3 class="text-sm font-bold text-cc-navy">Benchmark de precio</h3><span id="oRangeBadge" class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${inR ? 'bg-cc-green/15 text-cc-green700' : 'bg-cc-amber/20 text-cc-navy'}">${inR ? 'En rango ideal' : 'Fuera de rango'}</span></div>
          <p class="text-xs text-cc-g500 mb-4">Similares en Cedritos: ${fmtCOP(s.zMin)} – ${fmtCOP(s.zMax)}</p>
          <div class="relative h-3 rounded-full bg-gradient-to-r from-cc-blue via-cc-green to-cc-red mb-2"><div id="oMarker" class="absolute -top-1.5 w-6 h-6 rounded-full bg-white border-2 border-cc-navy shadow -ml-3 transition-all" style="left:${pos}%"></div></div>
          <div class="flex justify-between text-[10px] text-cc-g500 mb-4"><span>${fmtCOP(s.zMin)}</span><span>${fmtCOP(s.zMax)}</span></div>
          <label class="text-xs font-semibold text-cc-g600">Tu precio: <span id="oPrecioLbl" class="text-cc-navy font-bold">${fmtCOP(s.precio)}</span> / mes</label>
          <input id="oPrecio" type="range" class="cc-range w-full mt-2" min="${s.zMin - 500000}" max="${s.zMax + 500000}" step="50000" value="${s.precio}">
        </div>
        <div class="card bg-white rounded-xl border border-cc-g200 p-6">
          <div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Descripción & título</h3><span class="text-[11px] text-cc-g500" id="oWc"></span></div>
          <input id="oTitulo" class="w-full text-sm border border-cc-g200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-cc-primary" value="${s.titulo.replace(/"/g,'&quot;')}">
          <textarea id="oDesc" rows="4" class="w-full text-sm border border-cc-g200 rounded-lg px-3 py-2 focus:outline-none focus:border-cc-primary resize-none mb-3">${s.descripcion}</textarea>
          <button id="oBtnDesc" class="w-full text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 ${s.descIA ? 'bg-cc-green/15 text-cc-green700 cursor-default' : 'bg-cc-primary hover:bg-cc-p600 text-white'}">${s.descIA ? '<i class="fa-solid fa-check"></i> Descripción optimizada con IA' : '<i class="fa-solid fa-wand-magic-sparkles"></i> Mejorar descripción con IA'}</button>
          <p class="text-[11px] text-cc-g500 mt-2">El score se recalcula en vivo mientras editas.</p>
        </div>
        <div class="card bg-white rounded-xl border border-cc-g200 p-6">
          <h3 class="text-sm font-bold text-cc-navy mb-1">Atributos & recomendaciones IA</h3>
          <div class="bg-cc-blueSoft border border-cc-blue/30 rounded-lg px-3 py-2 mb-3 flex gap-2"><i class="fa-solid fa-lightbulb text-cc-primary mt-0.5"></i><p class="text-[11px] text-cc-navy leading-snug">Recomendación IA: agrega si incluye <b>parqueadero de visitantes</b> y <b>administración</b>, son los filtros más usados en esta zona.</p></div>
          <div class="space-y-2">${Object.keys(ATTR).map((k) => `<label class="flex items-center justify-between text-sm cursor-pointer text-cc-g700"><span>${ATTR[k]}</span><input type="checkbox" data-attr="${k}" ${s.attrs[k] ? 'checked' : ''} class="o-attr w-4 h-4 accent-cc-primary"></label>`).join('')}</div>
        </div>
      </div>`;
  }
  function bindOptim() {
    const s = optim.get();
    const wc = el('oWc'); if (wc) wc.textContent = (s.descripcion.trim() ? s.descripcion.trim().split(/\s+/).length : 0) + ' palabras';
    const b = el('oBtnFotos');
    if (b && !s.fotos) b.addEventListener('click', () => { b.disabled = true; b.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Retocando con IA…'; setTimeout(() => { optim.set({ fotos: true }); toast('Fotos retocadas con IA · Score +15', 'success'); }, 1000); });
    const bd = el('oBtnDesc');
    if (bd && !s.descIA) bd.addEventListener('click', () => {
      const before = score(optim.get());
      bd.disabled = true; bd.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Redactando con IA…';
      setTimeout(() => {
        optim.set({ titulo: DESC_IA.titulo, descripcion: DESC_IA.descripcion, descIA: true });
        const gained = Math.max(1, score(optim.get()) - before);
        toast('Descripción optimizada con IA · Score +' + gained, 'success');
      }, 1000);
    });
    document.querySelectorAll('[data-per]').forEach((btn) => btn.addEventListener('click', () => optim.set({ periodo: Number(btn.getAttribute('data-per')) })));
    const gs = el('oGoScore'); if (gs) gs.addEventListener('click', () => { const d = el('oDesc'); if (d) { d.scrollIntoView({ behavior: 'smooth', block: 'center' }); } toast('Revisa fotos, descripcion y precio para subir tu conversion', 'info'); });
    const pr = el('oPrecio');
    if (pr) {
      const live = (val) => {
        const st = optim.get(); const price = Number(val);
        const lbl = el('oPrecioLbl'); if (lbl) lbl.textContent = fmtCOP(price);
        const p = clamp(((price - st.zMin) / (st.zMax - st.zMin)) * 100, 0, 100);
        const mk = el('oMarker'); if (mk) mk.style.left = p + '%';
        const inRange = price >= st.zMin && price <= st.zMax;
        const badge = el('oRangeBadge');
        if (badge) { badge.textContent = inRange ? 'En rango ideal' : 'Fuera de rango'; badge.className = 'px-2 py-0.5 rounded-full text-[11px] font-semibold ' + (inRange ? 'bg-cc-green/15 text-cc-green700' : 'bg-cc-amber/20 text-cc-navy'); }
        const v = score({ ...st, precio: price });
        const ring = document.querySelector('#view-oficina-ia .score-ring');
        const num = document.querySelector('#view-oficina-ia .text-3xl');
        if (ring && num) { const c = scColor(v); const circ = 2 * Math.PI * 52; ring.setAttribute('stroke', c); ring.setAttribute('stroke-dashoffset', circ - (v / 100) * circ); num.textContent = v; num.style.color = c; }
      };
      pr.addEventListener('input', (e) => live(e.target.value));
      pr.addEventListener('change', (e) => optim.set({ precio: Number(e.target.value) }));
    }
    const de = el('oDesc'); if (de) de.addEventListener('input', (e) => optim.set({ descripcion: e.target.value }));
    const ti = el('oTitulo'); if (ti) ti.addEventListener('input', (e) => optim.set({ titulo: e.target.value }));
    document.querySelectorAll('.o-attr').forEach((c) => c.addEventListener('change', (e) => { const k = e.target.getAttribute('data-attr'); optim.set((st) => ({ attrs: { ...st.attrs, [k]: e.target.checked } })); }));
  }

  // Catálogo de inmuebles para sugerencias (en producción vendría del backend / Data Operativa).
  const CATALOGO = [
    { code: 'CC-90011', tipo: 'Apartamento', tx: 'Arriendo', ciudad: 'Bogotá', zona: 'Contador', hab: 2, valor: 2450000, nota: 'con parqueadero y administración' },
    { code: 'CC-90014', tipo: 'Apartamento', tx: 'Arriendo', ciudad: 'Bogotá', zona: 'Cedritos', hab: 2, valor: 2700000, nota: 'remodelado, iluminado' },
    { code: 'CC-90022', tipo: 'Apartaestudio', tx: 'Arriendo', ciudad: 'Bogotá', zona: 'Chapinero', hab: 1, valor: 1720000, nota: 'con póliza de arriendo incluida' },
    { code: 'CC-90031', tipo: 'Apartamento', tx: 'Arriendo', ciudad: 'Bogotá', zona: 'Toberín', hab: 2, valor: 2300000, nota: 'cerca a transporte' },
    { code: 'CC-90105', tipo: 'Casa', tx: 'Venta', ciudad: 'Medellín', zona: 'Envigado', hab: 3, valor: 585000000, nota: 'opción compra de cartera' },
    { code: 'CC-90108', tipo: 'Apartamento', tx: 'Venta', ciudad: 'Medellín', zona: 'El Poblado', hab: 3, valor: 640000000, nota: 'con valorización alta' },
    { code: 'CC-90201', tipo: 'Apartamento', tx: 'Venta', ciudad: 'Medellín', zona: 'Laureles', hab: 3, valor: 335000000, nota: 'pre-aprobado Davivienda' },
    { code: 'CC-90205', tipo: 'Apartamento', tx: 'Venta', ciudad: 'Medellín', zona: 'Estadio', hab: 2, valor: 298000000, nota: 'listo para habitar' }
  ];

  /* Módulo 2: Lead 360
     - Arriendo -> canon máximo ≈ 30% del ingreso.
     - Venta    -> capacidad total = crédito (cuota 30% ingreso, 12% E.A., 20 años) + cuota inicial estimada.
     - capMin/capMax: rango de capacidad total de crédito (mock; en real de bancarización/scoring).
     - ultLead: fecha/hora del último lead. hist: últimos inmuebles donde dejó lead (URL). */
  const LEADS = [
    { id: 'L-1042', nombre: 'Laura Gómez', prob: 'Alta', av: 'LG', tel: '573001234567', tipo: 'Arriendo', ciudad: 'Bogotá', hab: 2, ingreso: 8500000, inicial: 0, val: true, capMin: 150000000, capMax: 180000000, ultLead: 'Hoy 10:24 a. m.', zonas: ['Cedritos','Contador','Toberín'], comp: 'Comparó 3 aptos de 2 hab en la última semana; foco en zonas del norte.',
      hist: [
        { code: 'CC-84213', d: 'Apto · Cedritos, Bogotá', t: 'Hoy 10:24 a. m.', url: 'https://www.ciencuadras.com/inmueble/CC-84213' },
        { code: 'CC-90011', d: 'Apto · Contador, Bogotá', t: 'Ayer 6:12 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90011' },
        { code: 'CC-90031', d: 'Apto · Toberín, Bogotá', t: '26/09 3:40 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90031' },
        { code: 'CC-90014', d: 'Apto · Cedritos, Bogotá', t: '24/09 9:05 a. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90014' }
      ] },
    { id: 'L-1043', nombre: 'Andrés Restrepo', prob: 'Media', av: 'AR', tel: '573109876543', tipo: 'Venta', ciudad: 'Medellín', hab: 3, ingreso: 14000000, inicial: 120000000, val: true, capMin: 520000000, capMax: 560000000, ultLead: 'Ayer 4:15 p. m.', zonas: ['Envigado','El Poblado'], comp: 'Revisó casas en El Poblado pero abandonó por precio. Sensible al valor.',
      hist: [
        { code: 'CC-83771', d: 'Casa · Envigado, Medellín', t: 'Ayer 4:15 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-83771' },
        { code: 'CC-90108', d: 'Apto · El Poblado, Medellín', t: '27/09 11:30 a. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90108' },
        { code: 'CC-90105', d: 'Casa · Envigado, Medellín', t: '23/09 5:48 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90105' }
      ] },
    { id: 'L-1044', nombre: 'Valentina Ríos', prob: 'Alta', av: 'VR', tel: '573155551212', tipo: 'Venta', ciudad: 'Medellín', hab: 3, ingreso: 12000000, inicial: 90000000, val: true, capMin: 380000000, capMax: 420000000, ultLead: 'Hoy 9:05 a. m.', zonas: ['Laureles','Estadio'], comp: 'Alta intención: descargó 2 fichas y solicitó info de crédito hipotecario.',
      hist: [
        { code: 'CC-90201', d: 'Apto · Laureles, Medellín', t: 'Hoy 9:05 a. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90201' },
        { code: 'CC-84090', d: 'Apto · Laureles, Medellín', t: 'Ayer 7:22 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-84090' },
        { code: 'CC-90205', d: 'Apto · Estadio, Medellín', t: '25/09 2:10 p. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90205' }
      ] },
    { id: 'L-1045', nombre: 'Carlos Méndez', prob: 'Baja', av: 'CM', tel: '573201119988', tipo: 'Arriendo', ciudad: 'Bogotá', hab: 1, ingreso: 4800000, inicial: 0, val: false, capMin: 80000000, capMax: 100000000, ultLead: '25/09 8:40 a. m.', zonas: ['Chapinero'], comp: 'Una sola visita, sin presupuesto validado. Requiere calificación.',
      hist: [
        { code: 'CC-90022', d: 'Apartaestudio · Chapinero, Bogotá', t: '25/09 8:40 a. m.', url: 'https://www.ciencuadras.com/inmueble/CC-90022' }
      ] }
  ];
  const leadNav = createStore({ sel: LEADS[0].id });

  // Finanzas derivadas del ingreso (mock explicable).
  function finanzas(l) {
    const capacidadCuota = Math.round(l.ingreso * 0.30);
    if (l.tipo === 'Arriendo') {
      return { modo: 'arriendo', canon: capacidadCuota };
    }
    const im = Math.pow(1 + 12 / 100, 1 / 12) - 1; const n = 20 * 12;
    const credito = Math.round((capacidadCuota * (1 - Math.pow(1 + im, -n))) / im);
    return { modo: 'venta', cuotaMax: capacidadCuota, credito, inicial: l.inicial, capacidad: credito + l.inicial };
  }
  function sugerencias(l) {
    const f = finanzas(l);
    const tope = f.modo === 'arriendo' ? f.canon : f.capacidad;
    return CATALOGO
      .filter((p) => p.tx === l.tipo && p.ciudad === l.ciudad)
      .map((p) => {
        const enZona = l.zonas.includes(p.zona);
        const enPresu = p.valor <= tope * 1.05;
        let match = 0; if (enZona) match += 55; if (enPresu) match += 35; if (p.hab === l.hab) match += 10;
        return { ...p, match, enZona, enPresu };
      })
      .filter((p) => p.match >= 45)
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
  }
  function pitchDe(l, sug) {
    const f = finanzas(l);
    if (!sug.length) return `Hola ${l.nombre.split(' ')[0]}, sigo atento a tu búsqueda en ${l.zonas[0]}. Apenas ingrese una opción dentro de tu presupuesto te la comparto de primero.`;
    const top = sug[0];
    const presu = f.modo === 'arriendo' ? `canon hasta ${fmtCOP(f.canon)}` : `capacidad de ${fmtCOP(f.capacidad)}`;
    return `Hola ${l.nombre.split(' ')[0]}, según lo que has visto en ${l.zonas.slice(0,2).join(' y ')} y tu ${presu}, tengo un ${top.tipo.toLowerCase()} de ${top.hab} hab en ${top.zona} (${top.nota}) por ${fmtCOP(top.valor)}${l.tipo==='Arriendo'?'/mes':''}. ¿Te agendo una visita?`;
  }

  function renderLeads() {
    const s = leadNav.get(); const l = LEADS.find((x) => x.id === s.sel);
    const f = finanzas(l); const sug = sugerencias(l); const pitch = pitchDe(l, sug);
    const inmLabel = `${l.hab===1?'Apto/estudio':'Inmueble'} ${l.tipo.toLowerCase()} · ${l.zonas[0]}, ${l.ciudad}`;
    const list = LEADS.map((x) => `<button data-lead="${x.id}" class="w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${x.id === s.sel ? 'border-cc-primary bg-cc-blueSoft' : 'border-cc-g200 bg-white hover:border-cc-primary/50'}"><div class="w-9 h-9 rounded-full bg-cc-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">${x.av}</div><div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><span class="text-sm font-semibold text-cc-navy truncate">${x.nombre}</span>${probBadge(x.prob)}</div><p class="text-[11px] text-cc-g500 truncate">${x.tipo} · ${x.zonas[0]}, ${x.ciudad}</p></div></button>`).join('');

    const finBlock = f.modo === 'arriendo'
      ? `<div class="rounded-lg bg-cc-blueSoft border border-cc-blue/30 p-3 col-span-2"><p class="text-[10px] uppercase text-cc-primary font-semibold"><i class="fa-solid fa-key mr-1"></i>Canon máximo (arriendo)</p><p class="text-lg font-extrabold text-cc-navy">${fmtCOP(f.canon)}<span class="text-[11px] font-medium text-cc-g500">/mes</span></p><p class="text-[10px] text-cc-g500">Estimado en 30% del ingreso reportado</p></div>`
      : `<div class="rounded-lg bg-cc-blueSoft border border-cc-blue/30 p-3 col-span-2"><p class="text-[10px] uppercase text-cc-primary font-semibold"><i class="fa-solid fa-building-columns mr-1"></i>Capacidad total de compra</p><p class="text-lg font-extrabold text-cc-navy">${fmtCOP(f.capacidad)}</p><p class="text-[10px] text-cc-g500">Crédito ${fmtCOP(f.credito)} + inicial ${fmtCOP(f.inicial)} · cuota estimada ${fmtCOP(f.cuotaMax)}/mes</p></div>`;

    const histLeads = l.hist.slice(0, 5).map((h) => `<a href="${h.url}" target="_blank" rel="noopener" class="flex items-start gap-2 py-2 border-b border-cc-g100 last:border-0 group"><i class="fa-solid fa-link text-cc-primary text-[11px] mt-1"></i><div class="min-w-0 flex-1"><p class="text-[12px] text-cc-primary group-hover:underline truncate">${h.url}</p><p class="text-[10px] text-cc-g400">${h.d} · ${h.t}</p></div></a>`).join('');

    const sugCards = sug.length ? sug.map((p) => `<div class="bg-white rounded-lg p-3 flex items-center justify-between gap-3"><div class="min-w-0"><p class="text-sm font-semibold text-cc-navy truncate">${p.tipo} ${p.hab} hab · ${p.zona}</p><p class="text-[11px] text-cc-g500 truncate">${p.nota} · <span class="text-cc-g600">${p.code}</span></p><div class="flex gap-1.5 mt-1">${p.enZona?'<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-cc-green/15 text-cc-green700">zona que busca</span>':''}${p.enPresu?'<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-cc-blue/15 text-cc-p700">en presupuesto</span>':''}</div></div><div class="text-right flex-shrink-0"><p class="text-sm font-bold text-cc-navy">${fmtCOP(p.valor)}${l.tipo==='Arriendo'?'<span class="text-[10px] font-medium text-cc-g500">/mes</span>':''}</p><p class="text-[10px] font-semibold text-cc-amber">${p.match}% match</p></div></div>`).join('')
      : '<div class="bg-white rounded-lg p-3 text-center text-xs text-cc-g500">Sin coincidencias en catálogo para su zona y presupuesto actual.</div>';

    return `<div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div class="lg:col-span-1"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Leads recibidos</h3><span class="text-[11px] text-cc-g500">${LEADS.length} activos</span></div><div class="space-y-2">${list}</div></div>
      <div class="lg:col-span-2"><div class="card bg-white rounded-xl border border-cc-g200 p-6">
        <div class="flex items-center gap-4 mb-5"><div class="w-14 h-14 rounded-full bg-cc-primary text-white flex items-center justify-center text-lg font-bold">${l.av}</div><div class="flex-1"><div class="flex items-center gap-2 flex-wrap"><h3 class="text-lg font-bold text-cc-navy">${l.nombre}</h3>${probBadge(l.prob)}<span class="text-[11px] px-2 py-0.5 rounded-full bg-cc-g100 text-cc-g600">${l.tipo}</span></div><p class="text-xs text-cc-g500">${l.id} · Interesado en ${inmLabel} · Último lead ${l.ultLead}</p></div></div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          ${finBlock}
          <div class="rounded-lg bg-cc-zpBg p-3 col-span-2"><p class="text-[10px] uppercase text-cc-g500">Capacidad total de crédito</p><p class="text-sm font-bold text-cc-navy">Entre ${fmtCOP(l.capMin)} y ${fmtCOP(l.capMax)}</p><p class="text-[10px] ${l.val ? 'text-cc-green700' : 'text-cc-red'}">${l.val ? '✓ validado' : '⚠ sin validar'}</p></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div class="rounded-lg border border-cc-g200 p-4">
            <p class="text-[10px] uppercase text-cc-g500 mb-1"><i class="fa-regular fa-rectangle-list mr-1"></i>Últimos inmuebles donde dejó lead</p>
            ${histLeads}
          </div>
          <div class="space-y-4">
            <div class="rounded-lg border border-cc-g200 p-4"><p class="text-[10px] uppercase text-cc-g500 mb-1"><i class="fa-solid fa-location-dot mr-1 text-cc-primary"></i>Zonas donde busca</p><div class="flex flex-wrap gap-1.5">${l.zonas.map((z)=>`<span class="text-[11px] px-2 py-0.5 rounded-full bg-cc-g100 text-cc-navy font-semibold">${z}</span>`).join('')}</div></div>
            <div class="rounded-lg border border-cc-g200 p-4"><p class="text-[10px] uppercase text-cc-g500 mb-1">Comportamiento detectado</p><p class="text-sm text-cc-g700 leading-snug">${l.comp}</p></div>
          </div>
        </div>

        <div class="rounded-xl border-2 border-cc-amber bg-cc-amber/10 p-5">
          <div class="flex items-center gap-2 mb-3"><i class="fa-solid fa-wand-magic-sparkles text-cc-amber"></i><h4 class="text-sm font-bold text-cc-navy">Inmuebles sugeridos por IA</h4><span class="text-[10px] text-cc-g500">según zona + ${f.modo==='arriendo'?'canon':'capacidad'}</span></div>
          <div class="space-y-2 mb-4">${sugCards}</div>
          <div class="bg-white rounded-lg p-3 mb-4"><p class="text-[10px] uppercase text-cc-g500 mb-1">Script de abordaje personalizado</p><p id="lPitch" class="text-sm text-cc-g700 italic">"${pitch}"</p></div>
          <div class="flex flex-wrap gap-2"><button id="lWa" class="text-sm font-semibold px-4 py-2.5 rounded-lg bg-cc-green700 hover:brightness-110 text-white flex items-center gap-2"><i class="fa-brands fa-whatsapp"></i> Contactar por WhatsApp</button><button id="lCopy" class="text-sm font-semibold px-4 py-2.5 rounded-lg border border-cc-g200 text-cc-navy hover:bg-cc-g100 flex items-center gap-2"><i class="fa-regular fa-copy"></i> Copiar script</button></div>
        </div>
      </div></div>
    </div>`;
  }
  function bindLeads() {
    const l = LEADS.find((x) => x.id === leadNav.get().sel);
    const pitch = pitchDe(l, sugerencias(l));
    document.querySelectorAll('[data-lead]').forEach((b) => b.addEventListener('click', () => leadNav.set({ sel: b.getAttribute('data-lead') })));
    const cp = el('lCopy'); if (cp) cp.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(pitch).catch(()=>{}); toast('Script copiado al portapapeles', 'success'); });
    const wa = el('lWa'); if (wa) wa.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(pitch).catch(()=>{}); window.open(`https://wa.me/${l.tel}?text=${encodeURIComponent(pitch)}`, '_blank', 'noopener'); toast('Abriendo WhatsApp · script copiado', 'success'); });
  }

  const TABS = [['optimizador', 'Optimizador de Anuncio IA', 'fa-wand-magic-sparkles'], ['leads', 'Lead 360°', 'fa-user-magnifying-glass']];
  function render() {
    const t = nav.get().tab;
    const body = t === 'optimizador' ? renderOptim() : renderLeads();
    el('view-oficina-ia').innerHTML = `
      <div class="rounded-xl border border-cc-g200 bg-white p-4 mb-5 flex items-start gap-3"><div class="w-10 h-10 rounded-lg bg-cc-amber/20 flex items-center justify-center text-cc-amber text-lg"><i class="fa-solid fa-wand-magic-sparkles"></i></div><div class="flex-1"><p class="text-sm font-bold text-cc-navy">Oficina Virtual IA</p><p class="text-xs text-cc-g600">Optimiza tus anuncios y gestiona tus leads con IA.</p></div></div>
      <div class="border-b border-cc-g200 mb-5 flex gap-4 overflow-x-auto">${TABS.map(([id, label, ico]) => `<button data-ia="${id}" class="ia-tab whitespace-nowrap px-1 pb-3 text-sm font-semibold ${t === id ? 'active' : 'text-cc-g500 hover:text-cc-navy'}"><i class="fa-solid ${ico} mr-1"></i> ${label}</button>`).join('')}</div>
      <div>${body}</div>`;
    document.querySelectorAll('[data-ia]').forEach((b) => b.addEventListener('click', () => nav.set({ tab: b.getAttribute('data-ia') })));
    if (t === 'optimizador') bindOptim(); else bindLeads();
  }
  function refresh() { if (el('view-oficina-ia').classList.contains('active')) { const focus = document.activeElement ? document.activeElement.id : null; render(); if (focus === 'oDesc' || focus === 'oTitulo') { const n = el(focus); if (n) { n.focus(); const l = n.value.length; n.setSelectionRange(l, l); } } } }
  nav.subscribe(refresh); optim.subscribe(refresh); leadNav.subscribe(refresh);
  window.OficinaVirtual.secOficinaIA = { render };
})();

/* =====================================================================
   ROUTER — navegación del menú lateral
   ===================================================================== */
(function () {
  'use strict';
  const OV = window.OficinaVirtual;
  const el = (id) => document.getElementById(id);
  const META = {
    publicaciones: { render: OV.secPublicaciones.render },
    leads:         { render: OV.secLeads.render },
    'oficina-ia':  { render: OV.secOficinaIA.render },
    productos:     { render: OV.secProductos.render },
    perfil:        { render: OV.secPerfil.render },
    facturacion:   { render: OV.secFacturacion.render }
  };
  const sidebar = el('sidebar'); const backdrop = el('backdrop');
  function openSidebar() { sidebar.classList.remove('-translate-x-full'); backdrop.classList.remove('hidden'); }
  function closeSidebar() { if (window.innerWidth < 1024) { sidebar.classList.add('-translate-x-full'); backdrop.classList.add('hidden'); } }
  function activate(view) {
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    el('view-' + view).classList.add('active');
    document.querySelectorAll('.zp-menu-item').forEach((b) => b.classList.toggle('active', b.getAttribute('data-view') === view));
    META[view].render();
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  el('menuBtn').addEventListener('click', openSidebar);
  backdrop.addEventListener('click', closeSidebar);
  document.querySelectorAll('.zp-menu-item').forEach((b) => b.addEventListener('click', () => activate(b.getAttribute('data-view'))));
  activate('publicaciones');
})();
