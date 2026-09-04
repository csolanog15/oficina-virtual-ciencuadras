# Oficina Virtual — Ciencuadras (Prototipo)

Prototipo interactivo de la **Oficina Virtual para Inmobiliarias y Constructoras** de Ciencuadras.

SPA (HTML + Tailwind + JS vanilla) con 3 módulos:

1. **Optimizador de Anuncio IA** — Score de calidad dinámico, impacto proyectado, diagnóstico de fotos/descripción/atributos, benchmark de precio y editor en vivo.
2. **Lead 360° & Siguiente Mejor Acción** — Leads con probabilidad de conversión, enriquecimiento y widget de NBA con script + WhatsApp.
3. **Acelerador Transaccional Grupo Bolívar** — Pre-aprobado Davivienda, simulador de crédito + compra de cartera, Seguros Bolívar y propuesta en 1 clic.

Estilos alineados a los tokens del design system del monorepo `segurosbolivar/ciencuadras-monorepo-mf` (`libs/ds/.../_variables.scss`).

> Datos simulados (mock) para el mercado colombiano (COP, Bogotá/Medellín).

## Cómo publicarlo en GitHub Pages (1 paso, una sola vez)

El workflow de despliegue ya está listo. Solo falta **activar Pages** una vez:

1. Ir a **Settings → Pages**.
2. En **Build and deployment → Source**, seleccionar **GitHub Actions**.
3. Ir a **Actions → Deploy to GitHub Pages → Run workflow** (o hacer cualquier push a `main`).

La URL quedará en: **https://csolanog15.github.io/oficina-virtual-ciencuadras/**

## Ver en local

```bash
npx http-server . -p 8080 -c-1
# abrir http://127.0.0.1:8080/
```
