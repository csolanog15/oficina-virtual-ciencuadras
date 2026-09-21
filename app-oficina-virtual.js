/* =====================================================================
   Zona Privada Ciencuadras - Prototipo interactivo (SPA vanilla JS)
   Look fiel a la zona privada real (Publicaciones, plan Impulsa, banners).
   Datos simulados (mock) - mercado colombiano (COP, Bogota/Medellin).
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
    return `<aside class="hidden xl:block w-64 flex-shrink-0"><div class="rounded-xl bg-cc-zpBanner border border-cc-g200 p-5 text-center"><div class="h-8 flex items-center justify-center mb-3"><span class="text-cc-navy font-extrabold">davi<span class="text-cc-red">vienda</span></span></div><p class="text-xs text-cc-g600 leading-snug mb-4">Gestiona aqui, con mas de 8 bancos el credito para tu cliente. Comision 0,3%</p><button class="w-full text-sm font-semibold px-4 py-2 rounded-lg bg-cc-amber text-white hover:brightness-95">Iniciar solicitud</button></div></aside>`;
  }
  window.OficinaVirtual = { utils: { fmtCOP, probBadge, toast, createStore, clamp, el, sectionHead, bannerColumn } };
})();

/* SECCION: PUBLICACIONES (vista principal) */
(function () {
  'use strict';
  const { fmtCOP, toast, createStore, el, bannerColumn } = window.OficinaVirtual.utils;
  const PROPS = [
    { code: 'CC-84213', tipo: 'Apartamento', tx: 'Arriendo', precio: 2400000, ciudad: 'Bogota', barrio: 'Cedritos', hab: 2, banos: 1, area: 62, dias: 21, leads: 8, activo: true, foto: 'linear-gradient(135deg,#3E98CC,#006098)' },
    { code: 'CC-84090', tipo: 'Apartamento', tx: 'Venta', precio: 335000000, ciudad: 'Medellin', barrio: 'Laureles', hab: 3, banos: 2, area: 88, dias: 12, leads: 14, activo: true, destacado: true, foto: 'linear-gradient(135deg,#53A532,#277619)' },
    { code: 'CC-83771', tipo: 'Casa', tx: 'Venta', precio: 620000000, ciudad: 'Medellin', barrio: 'Envigado', hab: 4, banos: 3, area: 180, dias: 5, leads: 3, activo: true, foto: 'linear-gradient(135deg,#FF9D21,#DB7C18)' },
    { code: 'CC-83540', tipo: 'Apartaestudio', tx: 'Arriendo', precio: 1750000, ciudad: 'Bogota', barrio: 'Chapinero', hab: 1, banos: 1, area: 34, dias: 0, leads: 0, activo: false, foto: 'linear-gradient(135deg,#7B8F9D,#5D6F7E)' }
  ];
  const store = createStore({ tab: 'activas', filtro: '', planOpen: true });

  function planPanel(open) {
    const prod = [['fa-star', 'Inmuebles destacados', 9, 394],['fa-arrow-up-wide-short', 'Inmuebles Ascendidos', 14, 389],['fa-bullhorn', 'Inmuebles pautados', 3, 0]];
    return `<div class="rounded-xl border border-cc-g200 bg-white mb-5"><button id="planToggle" class="w-full flex items-center justify-between px-5 pt-4 pb-2 text-left"><p class="text-sm text-cc-g700">Tu plan actual es: <b class="text-cc-navy">Plan Impulsa</b></p><i class="fa-solid fa-chevron-${open ? 'up' : 'down'} text-cc-g400"></i></button>${open ? `<div class="px-5 pb-5"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"><div class="flex items-start gap-2"><i class="fa-regular fa-calendar text-cc-primary mt-0.5"></i><div><p class="text-xs font-semibold text-cc-navy">Dias disponibles: 19</p><p class="text-[11px] text-cc-g500">Vence: 2026-10-10</p></div></div>${prod.map(([ico, t, uso, disp]) => `<div class="flex items-start gap-2"><i class="fa-solid ${ico} text-cc-primary mt-0.5"></i><div><p class="text-xs font-semibold text-cc-navy">${t}</p><p class="text-[11px] text-cc-g500">${uso} En uso · ${disp} Disponibles</p></div></div>`).join('')}</div><div class="text-right mt-3"><button id="adqProd" class="text-sm font-semibold text-cc-primary hover:underline">Adquirir productos</button></div></div>` : ''}</div>`;
  }
  function propCard(p) {
    const precioLabel = p.tx === 'Arriendo' ? 'Valor Arriendo' : 'Valor Venta';
    return `<article class="card bg-white rounded-xl border border-cc-g200 overflow-hidden"><div class="flex flex-col sm:flex-row"><div class="relative sm:w-52 h-36 sm:h-auto flex-shrink-0" style="background:${p.foto}">${p.destacado ? '<span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cc-amber text-white"><i class="fa-solid fa-star"></i> Destacado</span>' : ''}${!p.activo ? '<span class="absolute inset-0 bg-black/45 flex items-center justify-center text-white text-xs font-semibold"><i class="fa-solid fa-eye mr-1"></i> Inactivo</span>' : ''}</div><div class="flex-1 p-4"><div class="flex items-start justify-between gap-2"><div><p class="text-[11px] text-cc-g500">${precioLabel}</p><p class="text-lg font-extrabold text-cc-navy">${fmtCOP(p.precio)}${p.tx === 'Arriendo' ? '<span class="text-xs font-medium text-cc-g500">/mes</span>' : ''}</p><p class="text-sm text-cc-g700 mt-0.5">${p.tipo} en ${p.tx.toLowerCase()}</p><p class="text-[12px] text-cc-g600"><i class="fa-solid fa-location-dot text-cc-primary"></i> ${p.barrio}, ${p.ciudad}</p></div><span class="text-[11px] px-2 py-0.5 rounded-full ${p.activo ? 'bg-cc-green/15 text-cc-green700' : 'bg-gray-100 text-gray-500'}">${p.activo ? 'Activa' : 'Inactiva'}</span></div><div class="flex items-center gap-4 text-[12px] text-cc-g600 mt-3"><span><i class="fa-solid fa-bed text-cc-g400"></i> ${p.hab}</span><span><i class="fa-solid fa-toilet text-cc-g400"></i> ${p.banos}</span><span><i class="fa-solid fa-ruler-combined text-cc-g400"></i> ${p.area} m2</span><span class="ml-auto text-cc-g500">Codigo: ${p.code}</span></div><div class="flex items-center justify-between mt-3 pt-3 border-t border-cc-g200"><div class="flex items-center gap-3 text-[12px]"><span class="text-cc-g600"><i class="fa-regular fa-clock"></i> ${p.dias} dias</span><span class="font-semibold text-cc-navy"><i class="fa-solid fa-users text-cc-primary"></i> ${p.leads} leads</span></div><div class="flex items-center gap-1"><button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-g500" title="Compartir"><i class="fa-solid fa-share-nodes"></i></button><button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-g500" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button><button class="prop-act w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-red" title="Eliminar"><i class="fa-regular fa-trash-can"></i></button></div></div></div></div></article>`;
  }
  function render() {
    const s = store.get();
    const activas = PROPS.filter((p) => p.activo);
    const inactivas = PROPS.filter((p) => !p.activo);
    let list = s.tab === 'activas' ? activas : s.tab === 'inactivas' ? inactivas : PROPS;
    if (s.filtro) list = list.filter((p) => (p.code + ' ' + p.barrio + ' ' + p.ciudad + ' ' + p.tipo).toLowerCase().includes(s.filtro.toLowerCase()));
    const tab = (id, label, n) => `<button data-tab="${id}" class="pb-2 text-sm font-semibold border-b-2 ${s.tab === id ? 'text-cc-primary border-cc-primary' : 'text-cc-g500 border-transparent hover:text-cc-navy'}">${label} <span class="opacity-80">${n}</span></button>`;
    el('view-publicaciones').innerHTML = `<div class="flex gap-6"><div class="flex-1 min-w-0"><div class="mb-4"><h2 class="text-lg font-bold text-cc-navy">Publicaciones</h2><p class="text-sm text-cc-g600 mt-0.5">Lleva el control de tu plan y tus servicios disponibles, actualizalo cuando sea necesario. Tambien puedes publicar un inmueble, editarlo, aplicarle servicios, compartirlo y desactivarlo.</p></div>${planPanel(s.planOpen)}<div class="flex items-center justify-between flex-wrap gap-3 mb-5"><div class="flex items-center gap-3"><button class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2"><i class="fa-solid fa-plus"></i> Publicar</button><button class="text-sm font-semibold px-4 py-2 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white">Comprar plan</button></div><button id="exportXls" class="text-sm font-semibold text-cc-primary hover:underline flex items-center gap-2">Exportar Excel <i class="fa-solid fa-download"></i></button></div><div class="rounded-xl border border-cc-primary/40 bg-cc-blueSoft p-4 mb-5 flex items-start gap-3"><i class="fa-solid fa-circle-info text-cc-primary mt-0.5"></i><div class="flex-1"><p class="text-sm font-bold text-cc-navy">Estas a pocos pasos de publicar tu inmueble</p><p class="text-xs text-cc-g600">Tienes una publicacion guardada y pendiente por terminar. Retomala desde aqui para empezar a impulsarla.</p></div><button id="continuar" class="text-sm font-semibold text-cc-primary hover:underline whitespace-nowrap flex items-center gap-1">Continuar <i class="fa-solid fa-chevron-right text-[10px]"></i></button></div><div class="rounded-xl border border-cc-g200 bg-white p-4 mb-5 text-center"><p class="text-sm text-cc-g700">Configura los horarios de visita a tus inmuebles</p><button id="agenda" class="text-sm font-semibold text-cc-primary hover:underline mt-1">Agendamiento</button></div><div class="flex items-center gap-6 border-b border-cc-g200 mb-4">${tab('activas', 'Activas', activas.length)}${tab('inactivas', 'Inactivas', inactivas.length)}${tab('publicadas', 'Publicadas', PROPS.length)}</div><div class="space-y-4">${list.length ? list.map(propCard).join('') : '<div class="rounded-xl border border-dashed border-cc-g300 bg-white p-10 text-center text-cc-g500 text-sm">Aun no tienes informacion en esta categoria</div>'}</div></div>${bannerColumn()}</div>`;
    el('planToggle') && el('planToggle').addEventListener('click', () => store.set({ planOpen: !store.get().planOpen }));
    document.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => store.set({ tab: b.getAttribute('data-tab') })));
    document.querySelectorAll('.prop-act').forEach((b) => b.addEventListener('click', () => toast('Accion de demo (' + (b.title || 'accion') + ')', 'info')));
    el('exportXls') && el('exportXls').addEventListener('click', () => toast('Exportando inmuebles a Excel...', 'success'));
    el('continuar') && el('continuar').addEventListener('click', () => toast('Retomando publicacion guardada...', 'info'));
    el('agenda') && el('agenda').addEventListener('click', () => toast('Abriendo agendamiento de visitas...', 'info'));
    el('adqProd') && el('adqProd').addEventListener('click', () => toast('Ir a adquirir productos', 'info'));
  }
  store.subscribe(render);
  window.OficinaVirtual.secPublicaciones = { render };
})();

/* SECCION: MIS LEADS */
(function () {
  'use strict';
  const { toast, el, sectionHead, bannerColumn } = window.OficinaVirtual.utils;
  const CONTACTS = [
    { code: 'CC-84090', inmueble: 'Apto · Laureles, Medellin', nombre: 'Valentina Rios', tel: '+57 315 555 1212', canal: 'WhatsApp', fecha: '04/09/2026', tipo: 'Formulario' },
    { code: 'CC-84213', inmueble: 'Apto · Cedritos, Bogota', nombre: 'Laura Gomez', tel: '+57 300 123 4567', canal: 'Telefono', fecha: '04/09/2026', tipo: 'Llamada' },
    { code: 'CC-83771', inmueble: 'Casa · Envigado, Medellin', nombre: 'Andres Restrepo', tel: '+57 310 987 6543', canal: 'WhatsApp', fecha: '03/09/2026', tipo: 'Formulario' },
    { code: 'CC-84090', inmueble: 'Apto · Laureles, Medellin', nombre: 'Camilo Duarte', tel: '+57 320 445 8890', canal: 'Email', fecha: '02/09/2026', tipo: 'Formulario' },
    { code: 'CC-84213', inmueble: 'Apto · Cedritos, Bogota', nombre: 'Daniela Pena', tel: '+57 301 778 2211', canal: 'WhatsApp', fecha: '01/09/2026', tipo: 'Formulario' }
  ];
  const canalBadge = (c) => {
    const map = { WhatsApp: 'bg-cc-green/15 text-cc-green700', 'Telefono': 'bg-cc-blue/15 text-cc-p700', Email: 'bg-cc-amber/20 text-cc-navy' };
    const ico = { WhatsApp: 'fa-whatsapp', 'Telefono': 'fa-phone', Email: 'fa-envelope' };
    const brand = c === 'WhatsApp' ? 'fa-brands' : 'fa-solid';
    return `<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[c] || 'bg-gray-100'}"><i class="${brand} ${ico[c]}"></i> ${c}</span>`;
  };
  function render() {
    el('view-leads').innerHTML = `<div class="flex gap-6"><div class="flex-1 min-w-0">${sectionHead('Mis leads', 'Contactos generados por tus inmuebles publicados', '<button id="dlContacts" class="text-sm font-semibold px-4 py-2 rounded-lg border border-cc-primary text-cc-primary hover:bg-cc-blueSoft flex items-center gap-2">Exportar Excel <i class="fa-solid fa-download"></i></button>')}<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"><div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Total leads</p><p class="text-2xl font-extrabold text-cc-navy">${CONTACTS.length}</p></div><div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Por WhatsApp</p><p class="text-2xl font-extrabold text-cc-green700">${CONTACTS.filter(c=>c.canal==='WhatsApp').length}</p></div><div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Inmuebles con leads</p><p class="text-2xl font-extrabold text-cc-navy">3</p></div><div class="rounded-xl border border-cc-g200 bg-white p-4"><p class="text-[11px] uppercase text-cc-g500">Ultimos 7 dias</p><p class="text-2xl font-extrabold text-cc-navy">${CONTACTS.length}</p></div></div><div class="rounded-xl border border-cc-g200 bg-white overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead class="bg-cc-g100 text-cc-g600"><tr><th class="text-left font-semibold px-4 py-3">Contacto</th><th class="text-left font-semibold px-4 py-3">Inmueble</th><th class="text-left font-semibold px-4 py-3">Canal</th><th class="text-left font-semibold px-4 py-3">Tipo</th><th class="text-left font-semibold px-4 py-3">Fecha</th><th class="text-right font-semibold px-4 py-3">Accion</th></tr></thead><tbody class="divide-y divide-cc-g200">${CONTACTS.map((c) => `<tr class="hover:bg-cc-zpBg"><td class="px-4 py-3"><p class="font-semibold text-cc-navy">${c.nombre}</p><p class="text-[11px] text-cc-g500">${c.tel}</p></td><td class="px-4 py-3 text-cc-g700"><span class="text-[11px] text-cc-g500">${c.code}</span><br>${c.inmueble}</td><td class="px-4 py-3">${canalBadge(c.canal)}</td><td class="px-4 py-3 text-cc-g600">${c.tipo}</td><td class="px-4 py-3 text-cc-g600">${c.fecha}</td><td class="px-4 py-3 text-right"><button class="ct-wa w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-green700" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></button><button class="ct-view w-8 h-8 rounded-lg hover:bg-cc-g100 text-cc-primary" title="Ver detalle"><i class="fa-solid fa-arrow-up-right-from-square"></i></button></td></tr>`).join('')}</tbody></table></div></div></div>${bannerColumn()}</div>`;
    el('dlContacts') && el('dlContacts').addEventListener('click', () => toast('Generando reporte de leads (.xlsx)...', 'success'));
    document.querySelectorAll('.ct-wa').forEach((b) => b.addEventListener('click', () => toast('Abriendo WhatsApp con el contacto', 'success')));
    document.querySelectorAll('.ct-view').forEach((b) => b.addEventListener('click', () => toast('Detalle del lead (demo)', 'info')));
  }
  window.OficinaVirtual.secLeads = { render };
})();

/* SECCION: PRODUCTOS Y SERVICIOS */
(function () {
  'use strict';
  const { fmtCOP, el, sectionHead, toast, bannerColumn } = window.OficinaVirtual.utils;
  const PLANS = [
    { name: 'Plan Basico', price: 89000, feats: ['Hasta 10 inmuebles', 'Estadisticas basicas', 'Soporte por correo'], color: 'border-cc-g200' },
    { name: 'Plan Impulsa', price: 189000, feats: ['Hasta 50 inmuebles', '5 destacados/mes', 'Oficina Virtual IA', 'Soporte prioritario'], color: 'border-cc-primary', current: true },
    { name: 'Plan Constructora', price: 349000, feats: ['Inmuebles ilimitados', 'Proyectos y salas de venta', 'Reportes avanzados', 'Ejecutivo dedicado'], color: 'border-cc-g200' }
  ];
  function render() {
    el('view-productos').innerHTML = `<div class="flex gap-6"><div class="flex-1 min-w-0">${sectionHead('Productos y servicios', 'Adquiere alguno de nuestros planes para impulsar el potencial de tus inmuebles.')}<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${PLANS.map((p) => `<div class="card rounded-xl border-2 ${p.color} bg-white p-5 relative">${p.current ? '<span class="absolute -top-2 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cc-primary text-white">Tu plan actual</span>' : ''}<p class="text-sm font-bold text-cc-navy">${p.name}</p><p class="mt-2"><span class="text-2xl font-extrabold text-cc-navy">${fmtCOP(p.price)}</span><span class="text-xs text-cc-g500">/mes</span></p><ul class="mt-4 space-y-2">${p.feats.map((f) => `<li class="text-sm text-cc-g700 flex items-center gap-2"><i class="fa-solid fa-check text-cc-green700"></i> ${f}</li>`).join('')}</ul><button data-plan="${p.name}" class="plan-btn mt-5 w-full text-sm font-semibold px-4 py-2.5 rounded-lg ${p.current ? 'bg-cc-g100 text-cc-g600 cursor-default' : 'bg-cc-primary hover:bg-cc-p600 text-white'}">${p.current ? 'Plan activo' : 'Adquirir plan'}</button></div>`).join('')}</div></div>${bannerColumn()}</div>`;
    document.querySelectorAll('.plan-btn').forEach((b) => b.addEventListener('click', () => { if (!/actual|activo/i.test(b.textContent)) toast('Iniciando compra: ' + b.getAttribute('data-plan'), 'success'); }));
  }
  window.OficinaVirtual.secProductos = { render };
})();

/* SECCION: MIS DATOS + DATOS FACTURACION */
(function () {
  'use strict';
  const { el, sectionHead, toast, bannerColumn } = window.OficinaVirtual.utils;
  function field(label, value, ico) {
    return `<div><label class="text-[11px] uppercase text-cc-g500">${label}</label><div class="mt-1 relative"><i class="fa-solid ${ico} absolute left-3 top-1/2 -translate-y-1/2 text-cc-g400"></i><input class="w-full text-sm border border-cc-g200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cc-primary" value="${value}"></div></div>`;
  }
  function card(title, desc, fields, saveId) {
    return `<div class="flex gap-6"><div class="flex-1 min-w-0">${sectionHead(title, desc)}<div class="rounded-xl border border-cc-g200 bg-white p-6 max-w-3xl"><div class="flex items-center gap-4 mb-6"><div class="w-16 h-16 rounded-full bg-cc-primary text-white flex items-center justify-center text-xl font-bold">IB</div><div><p class="font-bold text-cc-navy">Inmobiliaria Bolivar</p><p class="text-xs text-cc-g500">NIT 900.123.456-7 · Plan Impulsa</p></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${fields}</div><button id="${saveId}" class="mt-6 text-sm font-semibold px-5 py-2.5 rounded-lg bg-cc-primary hover:bg-cc-p600 text-white"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button></div></div>${bannerColumn()}</div>`;
  }
  function renderPerfil() {
    el('view-perfil').innerHTML = card('Mis datos', 'Informacion de tu inmobiliaria', field('Razon social', 'Inmobiliaria Bolivar S.A.S', 'fa-building') + field('Correo', 'contacto@inmobolivar.co', 'fa-envelope') + field('Telefono', '+57 601 555 4433', 'fa-phone') + field('Ciudad', 'Bogota D.C.', 'fa-location-dot'), 'savePerfil');
    el('savePerfil') && el('savePerfil').addEventListener('click', () => toast('Datos actualizados', 'success'));
  }
  function renderFacturacion() {
    el('view-facturacion').innerHTML = card('Datos Facturacion', 'Informacion para la facturacion de tus servicios', field('Razon social', 'Inmobiliaria Bolivar S.A.S', 'fa-building') + field('NIT', '900.123.456-7', 'fa-id-card') + field('Direccion', 'Cra 7 # 71-52, Bogota', 'fa-location-dot') + field('Correo facturacion', 'facturacion@inmobolivar.co', 'fa-envelope'), 'saveFact');
    el('saveFact') && el('saveFact').addEventListener('click', () => toast('Datos de facturacion actualizados', 'success'));
  }
  window.OficinaVirtual.secPerfil = { render: renderPerfil };
  window.OficinaVirtual.secFacturacion = { render: renderFacturacion };
})();

/* SECCION: OFICINA VIRTUAL IA (3 modulos con sub-tabs) */
(function () {
  'use strict';
  const { fmtCOP, probBadge, toast, createStore, clamp, el } = window.OficinaVirtual.utils;
  const nav = createStore({ tab: 'optimizador' });

  const optim = createStore({ titulo: 'Apartamento en arriendo - Cedritos, Bogota', descripcion: 'Apartamento de 2 habitaciones, 1 bano, cocina integral. Zona tranquila y bien ubicada cerca de transporte.', precio: 2400000, zMin: 2100000, zMax: 3200000, fotos: false, attrs: { parqueadero: false, admin: false, gym: false, pet: false, deposito: false } });
  const ATTR = { parqueadero: 'Parqueadero de visitantes', admin: 'Administracion incluida', gym: 'Gimnasio / zona humeda', pet: 'Pet friendly', deposito: 'Deposito / bodega' };
  function score(s) {
    let sc = s.fotos ? 30 : 15;
    const d = s.descripcion.trim(); const w = d ? d.split(/\s+/).length : 0;
    let ds = clamp(Math.round((w / 60) * 22), 0, 22);
    const kw = ['parqueadero','administracion','gimnasio','iluminado','remodelado','transporte'];
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
    return `<div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5"><div class="card bg-white rounded-xl border border-cc-g200 p-6 flex items-center gap-5"><div class="relative w-32 h-32 flex-shrink-0"><svg viewBox="0 0 120 120" class="w-32 h-32 -rotate-90"><circle cx="60" cy="60" r="52" fill="none" stroke="#E9ECEF" stroke-width="12"/><circle class="score-ring" cx="60" cy="60" r="52" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><span class="text-3xl font-extrabold" style="color:${col}">${v}</span><span class="text-[10px] text-cc-g500 uppercase">/ 100</span></div></div><div><p class="text-xs font-semibold text-cc-g600 uppercase">Score de Calidad IA</p><p class="text-sm text-cc-navy font-bold mt-1">${strong ? 'Anuncio destacado' : v >= 60 ? 'Mejorable' : 'Requiere atencion'}</p><p class="text-xs text-cc-g500 mt-2 leading-relaxed">La IA evalua fotos, descripcion, atributos y precio frente a la competencia.</p></div></div><div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="card rounded-xl border p-6 ${strong ? 'bg-cc-green/5 border-cc-green/30' : 'bg-white border-cc-g200'}"><div class="flex items-center justify-between"><span class="text-xs font-semibold text-cc-g600 uppercase">Visualizaciones estimadas</span>${strong ? '<span class="text-cc-green700 text-xs font-bold">activo</span>' : '<span class="text-cc-g400 text-xs">bloqueado</span>'}</div><p class="text-3xl font-extrabold mt-2 ${strong ? 'text-cc-green700' : 'text-cc-g300'}">${strong ? '+115%' : '-'}</p><p class="text-xs text-cc-g500 mt-1">${strong ? 'Al superar 85/100 entra a resultados destacados.' : 'Alcanza 85+ para desbloquear el impulso.'}</p></div><div class="card rounded-xl border p-6 ${strong ? 'bg-cc-green/5 border-cc-green/30' : 'bg-white border-cc-g200'}"><div class="flex items-center justify-between"><span class="text-xs font-semibold text-cc-g600 uppercase">Leads cualificados</span>${strong ? '<span class="text-cc-green700 text-xs font-bold">activo</span>' : '<span class="text-cc-g400 text-xs">bloqueado</span>'}</div><p class="text-3xl font-extrabold mt-2 ${strong ? 'text-cc-green700' : 'text-cc-g300'}">${strong ? '+42%' : '-'}</p><p class="text-xs text-cc-g500 mt-1">${strong ? 'Fotos y datos completos atraen leads con intencion real.' : 'Completa el diagnostico para proyectar leads.'}</p></div></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div class="card bg-white rounded-xl border border-cc-g200 p-6"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Calidad de fotos</h3>${s.fotos ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cc-green/15 text-cc-green700">Optimas</span>' : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-cc-red">Baja luz / resolucion</span>'}</div><div class="flex gap-2 mb-4">${[1,2,3,4].map(() => `<div class="flex-1 aspect-video rounded-lg border ${s.fotos ? 'border-cc-green/40' : 'border-cc-g200'} relative overflow-hidden" style="background:${s.fotos ? 'linear-gradient(135deg,#e8f5ee,#cfeede)' : 'linear-gradient(135deg,#3a3a3a,#5a5a5a)'}"><span class="absolute bottom-1 right-1 text-[9px] px-1 rounded ${s.fotos ? 'bg-cc-green700 text-white' : 'bg-black/60 text-white'}">${s.fotos ? 'HD' : 'oscura'}</span></div>`).join('')}</div><button id="oBtnFotos" class="w-full text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 ${s.fotos ? 'bg-cc-green/15 text-cc-green700 cursor-default' : 'bg-cc-primary hover:bg-cc-p600 text-white'}">${s.fotos ? '<i class="fa-solid fa-check"></i> Fotos optimizadas (+15 aplicado)' : '<i class="fa-solid fa-wand-magic-sparkles"></i> Mejorar fotos con IA'}</button></div><div class="card bg-white rounded-xl border border-cc-g200 p-6"><div class="flex items-center justify-between mb-1"><h3 class="text-sm font-bold text-cc-navy">Benchmark de precio</h3><span class="px-2 py-0.5 rounded-full text-[11px] font-semibold ${inR ? 'bg-cc-green/15 text-cc-green700' : 'bg-cc-amber/20 text-cc-navy'}">${inR ? 'En rango ideal' : 'Fuera de rango'}</span></div><p class="text-xs text-cc-g500 mb-4">Similares en Cedritos: ${fmtCOP(s.zMin)} - ${fmtCOP(s.zMax)}</p><div class="relative h-3 rounded-full bg-gradient-to-r from-cc-blue via-cc-green to-cc-red mb-2"><div class="absolute -top-1.5 w-6 h-6 rounded-full bg-white border-2 border-cc-navy shadow -ml-3" style="left:${pos}%"></div></div><div class="flex justify-between text-[10px] text-cc-g500 mb-4"><span>${fmtCOP(s.zMin)}</span><span>${fmtCOP(s.zMax)}</span></div><label class="text-xs font-semibold text-cc-g600">Tu precio: <span class="text-cc-navy font-bold">${fmtCOP(s.precio)}</span> / mes</label><input id="oPrecio" type="range" class="cc-range w-full mt-2" min="${s.zMin - 500000}" max="${s.zMax + 500000}" step="50000" value="${s.precio}"></div><div class="card bg-white rounded-xl border border-cc-g200 p-6"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Descripcion & titulo</h3><span class="text-[11px] text-cc-g500" id="oWc"></span></div><input id="oTitulo" class="w-full text-sm border border-cc-g200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:border-cc-primary" value="${s.titulo.replace(/"/g,'&quot;')}"><textarea id="oDesc" rows="4" class="w-full text-sm border border-cc-g200 rounded-lg px-3 py-2 focus:outline-none focus:border-cc-primary resize-none">${s.descripcion}</textarea><p class="text-[11px] text-cc-g500 mt-2">El score se recalcula en vivo mientras editas.</p></div><div class="card bg-white rounded-xl border border-cc-g200 p-6"><h3 class="text-sm font-bold text-cc-navy mb-1">Atributos & recomendaciones IA</h3><div class="bg-cc-blueSoft border border-cc-blue/30 rounded-lg px-3 py-2 mb-3 flex gap-2"><i class="fa-solid fa-lightbulb text-cc-primary mt-0.5"></i><p class="text-[11px] text-cc-navy leading-snug">Recomendacion IA: agrega si incluye <b>parqueadero de visitantes</b> y <b>administracion</b>, son los filtros mas usados en esta zona.</p></div><div class="space-y-2">${Object.keys(ATTR).map((k) => `<label class="flex items-center justify-between text-sm cursor-pointer text-cc-g700"><span>${ATTR[k]}</span><input type="checkbox" data-attr="${k}" ${s.attrs[k] ? 'checked' : ''} class="o-attr w-4 h-4 accent-cc-primary"></label>`).join('')}</div></div></div>`;
  }
  function bindOptim() {
    const s = optim.get();
    const wc = el('oWc'); if (wc) wc.textContent = (s.descripcion.trim() ? s.descripcion.trim().split(/\s+/).length : 0) + ' palabras';
    const b = el('oBtnFotos');
    if (b && !s.fotos) b.addEventListener('click', () => { b.disabled = true; b.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Retocando con IA...'; setTimeout(() => { optim.set({ fotos: true }); toast('Fotos retocadas con IA · Score +15', 'success'); }, 1000); });
    const pr = el('oPrecio'); if (pr) pr.addEventListener('input', (e) => optim.set({ precio: Number(e.target.value) }));
    const de = el('oDesc'); if (de) de.addEventListener('input', (e) => optim.set({ descripcion: e.target.value }));
    const ti = el('oTitulo'); if (ti) ti.addEventListener('input', (e) => optim.set({ titulo: e.target.value }));
    document.querySelectorAll('.o-attr').forEach((c) => c.addEventListener('change', (e) => { const k = e.target.getAttribute('data-attr'); optim.set((st) => ({ attrs: { ...st.attrs, [k]: e.target.checked } })); }));
  }

  const LEADS = [
    { id: 'L-1042', nombre: 'Laura Gomez', prob: 'Alta', av: 'LG', inm: 'Apto arriendo · Cedritos, Bogota', tel: '573001234567', pres: 2600000, val: true, zonas: ['Cedritos','Contador','Toberin'], cred: 2, ult: 'hace 2 h', tipo: 'Arriendo', comp: 'Simulo credito y comparo 3 aptos de 2 hab en la ultima semana.', nba: { inm: 'Apto 2 hab · Contador - 2.500.000/mes (con parqueadero)', pitch: 'Hola Laura, vi que buscas 2 habitaciones en Cedritos. Tengo uno en Contador dentro de tu presupuesto, con parqueadero y administracion incluida. Te agendo una visita manana?' } },
    { id: 'L-1043', nombre: 'Andres Restrepo', prob: 'Media', av: 'AR', inm: 'Casa venta · Envigado, Medellin', tel: '573109876543', pres: 620000000, val: true, zonas: ['Envigado','El Poblado'], cred: 1, ult: 'ayer', tipo: 'Venta', comp: 'Reviso casas en El Poblado pero abandono por precio. Sensible al valor.', nba: { inm: 'Casa 3 hab · Envigado - 590.000.000 (opcion compra de cartera)', pitch: 'Hola Andres, encontre una casa en Envigado por debajo de tu tope. Ademas podemos evaluar compra de cartera para bajar tu cuota. Hablamos hoy?' } },
    { id: 'L-1044', nombre: 'Valentina Rios', prob: 'Alta', av: 'VR', inm: 'Apto venta · Laureles, Medellin', tel: '573155551212', pres: 340000000, val: true, zonas: ['Laureles','Estadio'], cred: 3, ult: 'hace 40 min', tipo: 'Venta', comp: 'Alta intencion: descargo 2 fichas y solicito info de credito hipotecario.', nba: { inm: 'Apto 3 hab · Laureles - 335.000.000 (pre-aprobado Davivienda)', pitch: 'Hola Valentina, tengo el apto en Laureles que buscabas y ya tienes pre-aprobacion Davivienda. Podemos dejar la oferta formal lista hoy mismo. Te llamo?' } },
    { id: 'L-1045', nombre: 'Carlos Mendez', prob: 'Baja', av: 'CM', inm: 'Apto arriendo · Chapinero, Bogota', tel: '573201119988', pres: 1800000, val: false, zonas: ['Chapinero'], cred: 0, ult: 'hace 5 dias', tipo: 'Arriendo', comp: 'Una sola visita, sin presupuesto validado. Requiere calificacion.', nba: { inm: 'Apto 1 hab · Chapinero - 1.750.000/mes (con poliza de arriendo)', pitch: 'Hola Carlos, sigues buscando en Chapinero? Tengo una opcion dentro de tu rango con poliza de arrendamiento incluida para agilizar el proceso. Te comparto la ficha?' } }
  ];
  const leadNav = createStore({ sel: LEADS[0].id });
  function renderLeads() {
    const s = leadNav.get(); const l = LEADS.find((x) => x.id === s.sel);
    const list = LEADS.map((x) => `<button data-lead="${x.id}" class="w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${x.id === s.sel ? 'border-cc-primary bg-cc-blueSoft' : 'border-cc-g200 bg-white hover:border-cc-primary/50'}"><div class="w-9 h-9 rounded-full bg-cc-primary text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">${x.av}</div><div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><span class="text-sm font-semibold text-cc-navy truncate">${x.nombre}</span>${probBadge(x.prob)}</div><p class="text-[11px] text-cc-g500 truncate">${x.inm}</p></div></button>`).join('');
    return `<div class="grid grid-cols-1 lg:grid-cols-3 gap-5"><div class="lg:col-span-1"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Leads recibidos</h3><span class="text-[11px] text-cc-g500">${LEADS.length} activos</span></div><div class="space-y-2">${list}</div></div><div class="lg:col-span-2"><div class="card bg-white rounded-xl border border-cc-g200 p-6"><div class="flex items-center gap-4 mb-5"><div class="w-14 h-14 rounded-full bg-cc-primary text-white flex items-center justify-center text-lg font-bold">${l.av}</div><div class="flex-1"><div class="flex items-center gap-2 flex-wrap"><h3 class="text-lg font-bold text-cc-navy">${l.nombre}</h3>${probBadge(l.prob)}<span class="text-[11px] px-2 py-0.5 rounded-full bg-cc-g100 text-cc-g600">${l.tipo}</span></div><p class="text-xs text-cc-g500">${l.id} · Interesado en ${l.inm} · Ult. actividad ${l.ult}</p></div></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5"><div class="rounded-lg bg-cc-zpBg p-3"><p class="text-[10px] uppercase text-cc-g500">Presupuesto</p><p class="text-sm font-bold text-cc-navy">${fmtCOP(l.pres)}</p><p class="text-[10px] ${l.val ? 'text-cc-green700' : 'text-cc-red'}">${l.val ? 'validado' : 'sin validar'}</p></div><div class="rounded-lg bg-cc-zpBg p-3"><p class="text-[10px] uppercase text-cc-g500">Creditos simulados</p><p class="text-sm font-bold text-cc-navy">${l.cred}</p><p class="text-[10px] text-cc-g500">previos</p></div><div class="rounded-lg bg-cc-zpBg p-3 col-span-2"><p class="text-[10px] uppercase text-cc-g500">Zonas exploradas</p><p class="text-sm font-semibold text-cc-navy leading-tight">${l.zonas.join(' · ')}</p></div></div><div class="rounded-lg border border-cc-g200 p-3 mb-5"><p class="text-[10px] uppercase text-cc-g500 mb-1">Comportamiento detectado</p><p class="text-sm text-cc-g700">${l.comp}</p></div><div class="rounded-xl border-2 border-cc-amber bg-cc-amber/10 p-5"><div class="flex items-center gap-2 mb-3"><i class="fa-solid fa-wand-magic-sparkles text-cc-amber"></i><h4 class="text-sm font-bold text-cc-navy">Siguiente Mejor Accion (IA)</h4></div><div class="bg-white rounded-lg p-3 mb-3"><p class="text-[10px] uppercase text-cc-g500">Inmueble alternativo sugerido</p><p class="text-sm font-semibold text-cc-navy">${l.nba.inm}</p></div><div class="bg-white rounded-lg p-3 mb-4"><p class="text-[10px] uppercase text-cc-g500 mb-1">Script de abordaje personalizado</p><p class="text-sm text-cc-g700 italic">"${l.nba.pitch}"</p></div><div class="flex flex-wrap gap-2"><button id="lWa" class="text-sm font-semibold px-4 py-2.5 rounded-lg bg-cc-green700 hover:brightness-110 text-white flex items-center gap-2"><i class="fa-brands fa-whatsapp"></i> Contactar por WhatsApp</button><button id="lCopy" class="text-sm font-semibold px-4 py-2.5 rounded-lg border border-cc-g200 text-cc-navy hover:bg-cc-g100 flex items-center gap-2"><i class="fa-regular fa-copy"></i> Copiar script</button></div></div></div></div></div>`;
  }
  function bindLeads() {
    const l = LEADS.find((x) => x.id === leadNav.get().sel);
    document.querySelectorAll('[data-lead]').forEach((b) => b.addEventListener('click', () => leadNav.set({ sel: b.getAttribute('data-lead') })));
    const cp = el('lCopy'); if (cp) cp.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(l.nba.pitch).catch(()=>{}); toast('Script copiado al portapapeles', 'success'); });
    const wa = el('lWa'); if (wa) wa.addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(l.nba.pitch).catch(()=>{}); window.open(`https://wa.me/${l.tel}?text=${encodeURIComponent(l.nba.pitch)}`, '_blank', 'noopener'); toast('Abriendo WhatsApp · script copiado', 'success'); });
  }

  const acc = createStore({ cliente: 'Valentina Rios', valor: 335000000, inicialPct: 30, plazo: 15, tasa: 11.5, cartera: false, saldo: 90000000, tasaCartera: 18.0, consultado: false, aprob: false, monto: 0, seg: { arriendo: false, hogar: false, vida: false } });
  const cuota = (m, t, a) => { if (m <= 0) return 0; const im = Math.pow(1 + t / 100, 1 / 12) - 1; const n = a * 12; return im === 0 ? m / n : (m * im) / (1 - Math.pow(1 + im, -n)); };
  const PRIMAS = { arriendo: 85000, hogar: 42000, vida: 28000 };
  function renderAcc() {
    const s = acc.get(); const ini = s.valor * (s.inicialPct / 100); const fin = s.valor - ini; const c = cuota(fin, s.tasa, s.plazo);
    const cAnt = cuota(s.saldo, s.tasaCartera, 5); const cNue = cuota(s.saldo, s.tasa, 5); const ahorro = Math.max(0, cAnt - cNue);
    const prima = Object.keys(s.seg).reduce((a, k) => a + (s.seg[k] ? PRIMAS[k] : 0), 0);
    const total = c + prima + (s.cartera ? cNue : 0);
    return `<div class="mb-5 rounded-xl bg-gradient-to-r from-cc-navy to-cc-p700 text-white p-5 flex items-center justify-between flex-wrap gap-3"><div><p class="text-xs text-cc-blue uppercase tracking-wide">Diferenciador unico · Grupo Bolivar</p><h3 class="text-lg font-bold">Cierre transaccional para ${s.cliente}</h3></div><span class="text-[11px] bg-white/10 px-3 py-1 rounded-full">Davivienda · Seguros Bolivar</span></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-5"><div class="lg:col-span-2 space-y-5"><div class="card bg-white rounded-xl border border-cc-g200 p-6"><div class="flex items-center justify-between mb-3"><h3 class="text-sm font-bold text-cc-navy">Estado de bancarizacion</h3>${s.consultado ? (s.aprob ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cc-green/15 text-cc-green700">Pre-aprobado</span>' : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-cc-red">En estudio</span>') : '<span class="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cc-g100 text-cc-g500">Sin consultar</span>'}</div>${s.consultado && s.aprob ? `<div class="rounded-lg bg-cc-green/5 border border-cc-green/30 p-4 flex items-center justify-between flex-wrap gap-2"><div><p class="text-[11px] text-cc-g500">Monto pre-aprobado (tiempo real)</p><p class="text-xl font-extrabold text-cc-green700">${fmtCOP(s.monto)}</p></div><div class="text-right"><p class="text-[11px] text-cc-g500">Tasa hipotecaria</p><p class="text-sm font-bold text-cc-navy">${s.tasa}% E.A.</p></div></div>` : '<p class="text-xs text-cc-g500 mb-3">Consulta en tiempo real la bancarizacion y pre-aprobacion financiera del cliente con Davivienda.</p>'}<button id="aPre" class="mt-3 w-full text-sm font-semibold px-4 py-2.5 rounded-lg ${s.aprob ? 'bg-cc-green/15 text-cc-green700 cursor-default' : 'bg-cc-red hover:brightness-95 text-white'} flex items-center justify-center gap-2"><i class="fa-solid ${s.aprob ? 'fa-circle-check' : 'fa-building-columns'}"></i> ${s.aprob ? 'Cliente pre-aprobado Davivienda' : 'Consultar Pre-aprobado Davivienda'}</button></div><div class="card bg-white rounded-xl border border-cc-g200 p-6"><h3 class="text-sm font-bold text-cc-navy mb-4">Simulador de Credito de Vivienda</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="text-xs font-semibold text-cc-g600">Valor del inmueble: <span class="text-cc-navy font-bold">${fmtCOP(s.valor)}</span></label><input id="aValor" type="range" class="cc-range w-full mt-2" min="120000000" max="900000000" step="5000000" value="${s.valor}"></div><div><label class="text-xs font-semibold text-cc-g600">Cuota inicial: <span class="text-cc-navy font-bold">${s.inicialPct}%</span> (${fmtCOP(ini)})</label><input id="aIni" type="range" class="cc-range w-full mt-2" min="20" max="70" step="1" value="${s.inicialPct}"></div><div><label class="text-xs font-semibold text-cc-g600">Plazo: <span class="text-cc-navy font-bold">${s.plazo} anos</span></label><input id="aPlazo" type="range" class="cc-range w-full mt-2" min="5" max="30" step="1" value="${s.plazo}"></div><div><label class="text-xs font-semibold text-cc-g600">Tasa: <span class="text-cc-navy font-bold">${s.tasa}% E.A.</span></label><input id="aTasa" type="range" class="cc-range w-full mt-2" min="9" max="16" step="0.1" value="${s.tasa}"></div></div><div class="mt-4 rounded-lg bg-cc-zpBg p-4 flex items-center justify-between flex-wrap gap-2"><div><p class="text-[11px] text-cc-g500">Monto a financiar</p><p class="text-sm font-bold text-cc-navy">${fmtCOP(fin)}</p></div><div class="text-right"><p class="text-[11px] text-cc-g500">Cuota mensual estimada</p><p class="text-xl font-extrabold text-cc-navy">${fmtCOP(c)}</p></div></div><label class="flex items-center justify-between mt-4 cursor-pointer"><span class="text-sm font-semibold text-cc-navy">Incluir Compra de Cartera</span><input id="aChk" type="checkbox" ${s.cartera ? 'checked' : ''} class="w-4 h-4 accent-cc-primary"></label>${s.cartera ? `<div class="mt-3 rounded-lg border border-cc-blue/30 bg-cc-blueSoft p-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2"><div><label class="text-[11px] font-semibold text-cc-g600">Saldo cartera: <span class="text-cc-navy font-bold">${fmtCOP(s.saldo)}</span></label><input id="aSaldo" type="range" class="cc-range w-full mt-1" min="10000000" max="300000000" step="5000000" value="${s.saldo}"></div><div><label class="text-[11px] font-semibold text-cc-g600">Tasa actual: <span class="text-cc-navy font-bold">${s.tasaCartera}% E.A.</span></label><input id="aTasaC" type="range" class="cc-range w-full mt-1" min="12" max="30" step="0.5" value="${s.tasaCartera}"></div></div><p class="text-sm text-cc-green700 font-semibold">Ahorro estimado: ${fmtCOP(ahorro)} / mes al migrar a ${s.tasa}% E.A.</p></div>` : ''}</div></div><div class="space-y-5"><div class="card bg-white rounded-xl border border-cc-g200 p-6"><h3 class="text-sm font-bold text-cc-navy mb-1">Seguros Bolivar</h3><p class="text-[11px] text-cc-g500 mb-3">Precargados en la oferta segun el negocio.</p>${[['arriendo','Poliza de arrendamiento',PRIMAS.arriendo],['hogar','Seguro de hogar',PRIMAS.hogar],['vida','Seguro de vida deudor',PRIMAS.vida]].map(([k,l,p]) => `<label class="flex items-center justify-between py-2 border-b border-cc-g200 last:border-0 cursor-pointer"><span class="text-sm text-cc-g700">${l}<br><span class="text-[11px] text-cc-g500">${fmtCOP(p)}/mes</span></span><input type="checkbox" data-seg="${k}" ${s.seg[k] ? 'checked' : ''} class="a-seg w-4 h-4 accent-cc-primary"></label>`).join('')}</div><div class="card bg-cc-navy text-white rounded-xl p-6"><h3 class="text-sm font-bold mb-3">Oferta formal</h3><div class="space-y-1.5 text-sm"><div class="flex justify-between"><span class="text-cc-blue">Cuota credito</span><span class="font-semibold">${fmtCOP(c)}</span></div>${s.cartera ? `<div class="flex justify-between"><span class="text-cc-blue">Cuota cartera</span><span class="font-semibold">${fmtCOP(cNue)}</span></div>` : ''}<div class="flex justify-between"><span class="text-cc-blue">Seguros</span><span class="font-semibold">${fmtCOP(prima)}</span></div><div class="border-t border-white/20 my-2"></div><div class="flex justify-between text-base"><span class="font-bold">Total mensual</span><span class="font-extrabold text-cc-amber">${fmtCOP(total)}</span></div></div><button id="aProp" class="mt-4 w-full text-sm font-bold px-4 py-3 rounded-lg bg-cc-amber text-white hover:brightness-95 flex items-center justify-center gap-2"><i class="fa-solid fa-paper-plane"></i> Enviar propuesta en 1 clic</button></div></div></div>`;
  }
  function bindAcc() {
    const s = acc.get();
    const bp = el('aPre');
    if (bp && !s.aprob) bp.addEventListener('click', () => { bp.disabled = true; bp.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando Davivienda...'; setTimeout(() => { const m = Math.round(acc.get().valor * 0.72 / 1000000) * 1000000; acc.set({ consultado: true, aprob: true, monto: m }); toast('Cliente pre-aprobado por Davivienda', 'success'); }, 1100); });
    const R = (id, k, cast = Number) => { const n = el(id); if (n) n.addEventListener('input', (e) => acc.set({ [k]: cast(e.target.value) })); };
    R('aValor', 'valor'); R('aIni', 'inicialPct'); R('aPlazo', 'plazo'); R('aTasa', 'tasa', parseFloat); R('aSaldo', 'saldo'); R('aTasaC', 'tasaCartera', parseFloat);
    const ch = el('aChk'); if (ch) ch.addEventListener('change', (e) => acc.set({ cartera: e.target.checked }));
    document.querySelectorAll('.a-seg').forEach((c) => c.addEventListener('change', (e) => { const k = e.target.getAttribute('data-seg'); acc.set((st) => ({ seg: { ...st.seg, [k]: e.target.checked } })); }));
    const pr = el('aProp'); if (pr) pr.addEventListener('click', () => { if (!acc.get().aprob) { toast('Consulta primero el pre-aprobado Davivienda', 'warning'); return; } toast('Propuesta formal enviada al cliente', 'success'); });
  }

  const TABS = [['optimizador', 'Optimizador de Anuncio IA', 'fa-wand-magic-sparkles'], ['leads', 'Lead 360', 'fa-user-magnifying-glass'], ['acelerador', 'Acelerador Grupo Bolivar', 'fa-bolt']];
  function render() {
    const t = nav.get().tab;
    const body = t === 'optimizador' ? renderOptim() : t === 'leads' ? renderLeads() : renderAcc();
    el('view-oficina-ia').innerHTML = `<div class="rounded-xl border border-cc-g200 bg-white p-4 mb-5 flex items-start gap-3"><div class="w-10 h-10 rounded-lg bg-cc-amber/20 flex items-center justify-center text-cc-amber text-lg"><i class="fa-solid fa-wand-magic-sparkles"></i></div><div class="flex-1"><p class="text-sm font-bold text-cc-navy">Oficina Virtual IA</p><p class="text-xs text-cc-g600">Optimiza anuncios, gestiona leads con IA y cierra con credito y seguros del Grupo Bolivar. <span class="text-cc-g400">Respuesta competitiva frente a Fincaraiz y Metrocuadrado.</span></p></div></div><div class="border-b border-cc-g200 mb-5 flex gap-4 overflow-x-auto">${TABS.map(([id, label, ico]) => `<button data-ia="${id}" class="ia-tab whitespace-nowrap px-1 pb-3 text-sm font-semibold ${t === id ? 'active' : 'text-cc-g500 hover:text-cc-navy'}"><i class="fa-solid ${ico} mr-1"></i> ${label}</button>`).join('')}</div><div>${body}</div>`;
    document.querySelectorAll('[data-ia]').forEach((b) => b.addEventListener('click', () => nav.set({ tab: b.getAttribute('data-ia') })));
    if (t === 'optimizador') bindOptim(); else if (t === 'leads') bindLeads(); else bindAcc();
  }
  function refresh() { if (el('view-oficina-ia').classList.contains('active')) { const focus = document.activeElement ? document.activeElement.id : null; render(); if (focus === 'oDesc' || focus === 'oTitulo') { const n = el(focus); if (n) { n.focus(); const l = n.value.length; n.setSelectionRange(l, l); } } } }
  nav.subscribe(refresh); optim.subscribe(refresh); leadNav.subscribe(refresh); acc.subscribe(refresh);
  window.OficinaVirtual.secOficinaIA = { render };
})();

/* ROUTER - menu lateral */
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
