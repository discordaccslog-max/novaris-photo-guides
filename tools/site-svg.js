/* Original SVG artwork for the storefront: logo, favicon, guide icons, hero aperture. */
export const logo = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.6"/><g fill="none" stroke="#e09a2c" stroke-width="1.6" stroke-linecap="round"><path d="M16 6.5 L24.2 11.2"/><path d="M24.2 11.2 L24.2 20.8"/><path d="M24.2 20.8 L16 25.5"/><path d="M16 25.5 L7.8 20.8"/><path d="M7.8 20.8 L7.8 11.2"/><path d="M7.8 11.2 L16 6.5"/></g><circle cx="16" cy="16" r="4" fill="#e09a2c"/></svg>`;

export const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1f1d1a"/><circle cx="16" cy="16" r="11" fill="none" stroke="#f4efe6" stroke-width="1.6"/><path d="M16 8.6 L22.4 12.3 L22.4 19.7 L16 23.4 L9.6 19.7 L9.6 12.3 Z" fill="none" stroke="#e09a2c" stroke-width="1.8" stroke-linejoin="round"/><circle cx="16" cy="16" r="3.4" fill="#e09a2c"/></svg>\n`;

export const icons = {
  portrait: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="36" height="38" rx="3"/><circle cx="24" cy="20" r="7"/><path d="M12 39c2-7 7-10 12-10s10 3 12 10"/></svg>`,
  wedding: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="18" cy="27" r="11"/><circle cx="30" cy="27" r="11"/><path d="M20 9l4-4 4 4-4 4z"/></svg>`,
  product: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 40h40"/><path d="M4 40c0-14 4-22 4-34"/><rect x="20" y="20" width="10" height="20" rx="2"/><path d="M23 20v-5h4v5"/><path d="M36 8l-6 8M40 14l-7 5M31 5l-3 9"/></svg>`,
  landscape: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="33" cy="14" r="5"/><path d="M3 40l13-18 9 12 6-7 14 13z"/><path d="M3 44h42"/></svg>`,
  event: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l8 6"/><rect x="4" y="2" width="8" height="7" rx="1.5" transform="rotate(36 8 6)"/><path d="M16 12l-6 30h28L30 26z" stroke-dasharray="2 3"/><path d="M6 44h36"/><circle cx="27" cy="34" r="3"/><path d="M22 44c0-4 2-6 5-6s5 2 5 6"/></svg>`,
  library: `<svg class="card-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="14" y="4" width="26" height="34" rx="2"/><path d="M10 9v32a2 2 0 0 0 2 2h24"/><path d="M6 14v31a2 2 0 0 0 2 2h22" opacity=".6"/><path d="M20 13h14M20 19h14M20 25h9"/></svg>`
};

export function aperture() {
  const d = 40, s = d * Math.tan(Math.PI / 6);
  let blades = "";
  for (let i = 0; i < 6; i++) {
    const fill = i % 2 ? "#2d2a26" : "#35312c";
    blades += `<g transform="rotate(${i * 60})"><rect class="ap-blade" x="${(-s).toFixed(2)}" y="-240" width="260" height="${240 - d}" fill="${fill}" stroke="#e09a2c" stroke-opacity=".45" stroke-width="1"/></g>`;
  }
  let ticks = "";
  for (let i = 0; i < 48; i++) {
    const long = i % 4 === 0;
    ticks += `<line x1="0" y1="-104" x2="0" y2="${long ? -114 : -109}" transform="rotate(${i * 7.5})" stroke="currentColor" stroke-width="${long ? 1.4 : 0.8}" stroke-opacity="${long ? 0.7 : 0.4}"/>`;
  }
  return `<svg class="aperture" viewBox="-124 -124 248 248" role="img" aria-labelledby="ap-title">
  <title id="ap-title">Illustration of a lens aperture slowly opening and closing, with warm light behind it</title>
  <defs>
    <radialGradient id="ap-light"><stop offset="0" stop-color="#ffd38a"/><stop offset=".45" stop-color="#e09a2c" stop-opacity=".85"/><stop offset="1" stop-color="#e09a2c" stop-opacity="0"/></radialGradient>
    <radialGradient id="ap-halo"><stop offset=".7" stop-color="#e09a2c" stop-opacity=".5"/><stop offset="1" stop-color="#e09a2c" stop-opacity="0"/></radialGradient>
    <clipPath id="ap-clip"><circle r="97"/></clipPath>
  </defs>
  <circle class="ap-falloff" r="124" fill="url(#ap-halo)"/>
  <g class="ap-ring" style="color:var(--ink)">${ticks}</g>
  <circle r="100" fill="#1f1d1a" stroke="currentColor" stroke-opacity=".25" style="color:var(--ink)"/>
  <circle class="ap-glow" r="70" fill="url(#ap-light)"/>
  <g clip-path="url(#ap-clip)">${blades}</g>
  <circle r="97" fill="none" stroke="#4a443d" stroke-width="2"/>
</svg>`;
}

