import { readFileSync } from "node:fs";
const scriptFont = readFileSync(
  new URL(
    "../node_modules/@fontsource/allura/files/allura-latin-400-normal.woff2",
    import.meta.url,
  ),
).toString("base64");
// Simplified illustrated uniforms, based on supplied references, not replicas.
// Preserve the original jersey.svg silhouette; omit uncertain sponsor/brand marks.
export function jerseySvg(number, variant = "home") {
  const value = String(number);
  if (!/^\d{1,2}$/.test(value)) throw new Error("Invalid jersey number");
  if (!["home", "away"].includes(variant)) throw new Error("Invalid uniform");
  const home = variant === "home";
  const body = home ? "#111" : "#f5f5f5";
  const ink = home ? "#fff" : "#111";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 280" role="img" aria-labelledby="title" data-number="${value}">
${home ? "" : `<style>@font-face{font-family:UniformScript;src:url(data:font/woff2;base64,${scriptFont}) format("woff2");font-weight:400}</style>`}
<title id="title">Reference-based ${home ? "black home" : "white away"} jersey illustration, number ${value}</title>
<path fill="${body}" stroke="#777" stroke-width="2" stroke-linejoin="round" d="m100 35-70 33-25 66 60 27 24-40-8 143h138l-8-143 24 40 60-27-25-66-70-33c-10 15-30 18-50 18s-40-3-50-18Z"/>
${home ? "" : '<path fill="none" stroke="#111" stroke-width="13" d="m100 46-54 27-12 28m166-55 54 27 12 28"/>'}
<path fill="none" stroke="${ink}" stroke-width="14" d="m17 115 53 23m160 0 53-23"/>
<path fill="${home ? "#080808" : "#fff"}" stroke="${home ? "#333" : "#111"}" stroke-width="5" d="m111 40 39 22 39-22-10 27-29 11-29-11Z"/>
<path fill="none" stroke="${home ? "#333" : "#ddd"}" stroke-width="2" d="m101 111-7 128m105-128 7 128M88 249h126"/>
<text x="150" y="105" text-anchor="middle" fill="${ink}" font-family="${home ? "Arial, sans-serif" : "UniformScript, cursive"}" font-size="${home ? "15" : "28"}" font-weight="${home ? "700" : "400"}" ${home ? 'textLength="100" lengthAdjust="spacingAndGlyphs"' : ""}>${home ? "BUCKAROOS" : "Smackover"}</text>
<text x="150" y="225" text-anchor="middle" fill="${ink}" font-family="Impact, Arial Black, sans-serif" font-size="124" font-weight="900" textLength="${value.length === 1 ? "70" : "122"}" lengthAdjust="spacingAndGlyphs">${value}</text>
</svg>`;
}
