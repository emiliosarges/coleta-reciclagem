// app.js - lógica do front-end
// - Carrega pontos da API
// - Renderiza no Leaflet
// - Filtro por material
// - Cadastro de novos pontos (preenchendo lat/lng pelo clique no mapa)

let map;
let markersLayer; // LayerGroup para controlar filtros
let allPoints = [];

const materialFilter = document.getElementById('materialFilter');
const pointsList = document.getElementById('pointsList');
const addPointForm = document.getElementById('addPointForm');
const formMsg = document.getElementById('formMsg');
const locateBtn = document.getElementById('locateBtn');

init();

async function init(){
  initMap();
  await loadMaterials();
  await loadPoints();
  bindEvents();
}

// Inicia o mapa
function initMap(){
  // Centro aproximado do Brasil; o usuário pode clicar em "Usar minha localização"
  map = L.map('map', { scrollWheelZoom: true }).setView([-15.78, -47.92], 11);

  // Tiles do OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Layer para markers (facilita limpar/aplicar filtros)
  markersLayer = L.layerGroup().addTo(map);

  // Clique no mapa preenche lat/lng do formulário
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    addPointForm.lat.value = lat.toFixed(6);
    addPointForm.lng.value = lng.toFixed(6);
    flashMessage('Coordenadas preenchidas a partir do mapa.', 'ok');
  });
}

// Carrega lista de materiais suportados (para popular o filtro)
async function loadMaterials(){
  try{
    const res = await fetch('/api/materials');
    const data = await res.json();
    const mats = data.materials || [];
    mats.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      materialFilter.appendChild(opt);
    });
  }catch(e){
    console.error('Erro ao carregar materiais', e);
  }
}

// Carrega pontos existentes
async function loadPoints(){
  try{
    const res = await fetch('/api/points');
    const data = await res.json();
    allPoints = data.points || [];
    renderPoints();
  }catch(e){
    console.error('Erro ao carregar pontos', e);
  }
}

// Renderiza markers e lista lateral de acordo com filtro
function renderPoints(){
  const selected = materialFilter.value;
  markersLayer.clearLayers();
  pointsList.innerHTML = '';

  const filtered = selected
    ? allPoints.filter(p => (p.materials || []).some(m => normalize(m) === normalize(selected)))
    : allPoints;

  filtered.forEach(p => {
    const marker = L.marker([p.lat, p.lng]).addTo(markersLayer);
    const popupHtml = `
      <strong>${escapeHtml(p.name)}</strong><br/>
      ${escapeHtml(p.address)}<br/>
      <small><em>${(p.hours && escapeHtml(p.hours)) || 'Horários não informados'}</em></small><br/>
      <div style="margin-top:6px;">
        ${(p.materials || []).map(m => `<span class="badge">${escapeHtml(m)}</span>`).join(' ')}
      </div>
      ${p.contact ? `<div style="margin-top:6px;">Contato: ${escapeHtml(p.contact)}</div>` : ''}
      ${p.notes ? `<div style="margin-top:6px;">Obs.: ${escapeHtml(p.notes)}</div>` : ''}
    `;
    marker.bindPopup(popupHtml);

    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:8px;">
        <div>
          <div style="font-weight:700;">${escapeHtml(p.name)}</div>
          <div class="muted small">${escapeHtml(p.address)}</div>
          <div class="muted small">${p.hours ? escapeHtml(p.hours) : 'Horários não informados'}</div>
          <div style="margin-top:6px;">
            ${(p.materials || []).map(m => `<span class="badge">${escapeHtml(m)}</span>`).join(' ')}
          </div>
        </div>
        <div>
          <button class="btn secondary" data-jump="${p.lat},${p.lng}">Ver no mapa</button>
        </div>
      </div>
    `;
    li.querySelector('button').addEventListener('click', () => {
      map.setView([p.lat, p.lng], 15);
      marker.openPopup();
    });
    pointsList.appendChild(li);
  });

  if (filtered.length === 0){
    pointsList.innerHTML = `<li class="muted">Nenhum ponto encontrado para este filtro.</li>`;
  }
}

function bindEvents(){
  materialFilter.addEventListener('change', renderPoints);

  addPointForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.textContent = '';

    const formData = new FormData(addPointForm);
    const payload = {
      name: formData.get('name'),
      address: formData.get('address'),
      lat: formData.get('lat'),
      lng: formData.get('lng'),
      materials: String(formData.get('materials') || '')
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean),
      hours: formData.get('hours'),
      contact: formData.get('contact'),
      notes: formData.get('notes')
    };

    try{
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok){
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao salvar');
      }

      const { point } = await res.json();
      allPoints.push(point);
      addPointForm.reset();
      formMsg.textContent = 'Ponto salvo com sucesso!';
      formMsg.style.color = '#22c55e';
      renderPoints();
      // Foca e destaca no mapa
      map.setView([point.lat, point.lng], 15);
    }catch(err){
      formMsg.textContent = err.message || 'Falha ao salvar ponto.';
      formMsg.style.color = '#f87171';
    }
  });

  // Geolocalização
  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation){
      flashMessage('Geolocalização não suportada no seu navegador.', 'err');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 14);
        flashMessage('Mapa centralizado na sua localização.', 'ok');
      },
      () => flashMessage('Não foi possível obter sua localização.', 'err'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Utils
function flashMessage(text, type='ok'){
  formMsg.textContent = text;
  formMsg.style.color = (type === 'ok') ? '#22c55e' : '#f87171';
  setTimeout(() => { formMsg.textContent = ''; }, 2500);
}

function normalize(s){ return String(s || '').toLowerCase().trim(); }

function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}
