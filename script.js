const surface = document.getElementById('muralSurface');
const stage = document.querySelector('.mural-shell');
const participationModal = document.getElementById('participationModal');
const detailModal = document.getElementById('detailModal');
const participationForm = document.getElementById('participationForm');
const photoInput = document.getElementById('photoInput');
const imagePreviewBox = document.getElementById('imagePreviewBox');
const imagePreview = document.getElementById('imagePreview');
const openParticipationModalBtn = document.getElementById('openParticipationModal');
const selectedSlotLabel = document.getElementById('selectedSlotLabel');
const modalSelectedSlot = document.getElementById('modalSelectedSlot');
const detailImage = document.getElementById('detailImage');
const detailName = document.getElementById('detailName');
const detailStatus = document.getElementById('detailStatus');
const detailMeta = document.getElementById('detailMeta');
const detailDescription = document.getElementById('detailDescription');
const detailActions = document.getElementById('detailActions');
const approveSubmissionBtn = document.getElementById('approveSubmission');
const rejectSubmissionBtn = document.getElementById('rejectSubmission');
const toolbarButtons = document.querySelectorAll('[data-action]');
const yearFromInput = document.getElementById('yearFrom');
const yearToInput = document.getElementById('yearTo');
const yearFromValue = document.getElementById('yearFromValue');
const yearToValue = document.getElementById('yearToValue');
const careerInput = document.getElementById('career');
const stateInput = document.getElementById('state');
const municipalityInput = document.getElementById('municipality');

const TILE_SIZE = 96;
const STORAGE_KEY = 'mural-digital-local-demo-v1';
const CAREERS = ['ITI', 'IMRN', 'LAET', 'IPET', 'LCIA'];
const STATES = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas'
];
const muralState = {
  columns: 12,
  rows: 8,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  selectedSlot: null,
  activeTile: null,
  selectingSlot: false,
  dragging: false,
  pointerStart: null,
  tiles: []
};

function notify(message, isError = false) {
  selectedSlotLabel.textContent = message;
  selectedSlotLabel.classList.toggle('is-error', isError);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createBaseGrid() {
  const tiles = [];
  for (let y = 1; y <= muralState.rows; y += 1) {
    for (let x = 1; x <= muralState.columns; x += 1) {
      tiles.push({
        id: `slot-${x}-${y}`,
        x,
        y,
        type: 'empty',
        label: 'Disponible',
        name: '',
        description: '',
        image: '',
        career: '',
        state: '',
        municipality: '',
        yearFrom: '',
        yearTo: ''
      });
    }
  }
  return tiles;
}

function getSlot(x, y) {
  return muralState.tiles.find((tile) => tile.x === x && tile.y === y);
}

function updateSurfaceSize() {
  surface.style.width = `${muralState.columns * TILE_SIZE + 60}px`;
  surface.style.height = `${muralState.rows * TILE_SIZE + 60}px`;
}

function renderMural() {
  surface.replaceChildren();

  muralState.tiles.forEach((tile) => {
    const element = document.createElement('article');
    element.className = `tile ${tile.type}`;
    element.dataset.id = tile.id;
    element.setAttribute('role', 'button');
    element.tabIndex = 0;
    element.setAttribute(
      'aria-label',
      tile.type === 'empty' ? `Espacio ${tile.x}, ${tile.y}, disponible` : `Espacio ${tile.x}, ${tile.y}: ${tile.name}`
    );
    element.style.setProperty('--x', tile.x);
    element.style.setProperty('--y', tile.y);
    element.style.left = `${(tile.x - 1) * TILE_SIZE + 30}px`;
    element.style.top = `${(tile.y - 1) * TILE_SIZE + 30}px`;

    const photo = document.createElement('div');
    photo.className = 'photo-tile';
    if (tile.image) photo.style.backgroundImage = `url("${tile.image}")`;

    const label = document.createElement('div');
    label.className = 'tile-label';
    label.textContent = tile.label;

    element.append(photo, label);
    surface.append(element);
  });
}

function updateTransform() {
  surface.style.transform = `translate(${muralState.offsetX}px, ${muralState.offsetY}px) scale(${muralState.scale})`;
}

function centerMural() {
  muralState.offsetX = Math.max(16, (stage.clientWidth - surface.offsetWidth) / 2);
  muralState.offsetY = Math.max(70, (stage.clientHeight - surface.offsetHeight) / 2);
  updateTransform();
}

function setSelectionMode(enabled) {
  muralState.selectingSlot = enabled;
  stage.classList.toggle('selecting', enabled);
  openParticipationModalBtn.setAttribute('aria-pressed', String(enabled));
  if (enabled) {
    notify('Selecciona un espacio vacío para continuar.');
  }
}

function openParticipationModal(slot) {
  if (!slot || slot.type !== 'empty') return;

  muralState.selectedSlot = { x: slot.x, y: slot.y };
  modalSelectedSlot.textContent = `Espacio elegido: ${slot.x} · ${slot.y}`;
  resetLocationFields();
  participationModal.classList.remove('hidden');
  participationModal.setAttribute('aria-hidden', 'false');
  document.getElementById('publicName').focus();
}

function closeParticipationModal() {
  participationModal.classList.add('hidden');
  participationModal.setAttribute('aria-hidden', 'true');
  participationForm.reset();
  resetLocationFields();
  imagePreviewBox.classList.add('hidden');
  imagePreview.removeAttribute('src');
  photoInput.value = '';
  muralState.selectedSlot = null;
}

function closeDetailModal() {
  detailModal.classList.add('hidden');
  detailModal.setAttribute('aria-hidden', 'true');
}

function openTileDetail(tile) {
  muralState.activeTile = tile;
  detailImage.src = tile.image;
  detailName.textContent = tile.name;
  detailStatus.textContent = tile.type === 'pending'
    ? 'Pendiente de revisión (solo este navegador)'
    : 'Aprobada localmente (solo este navegador)';
  detailMeta.textContent = [
    tile.career,
    [tile.municipality, tile.state].filter(Boolean).join(', '),
    `${tile.yearFrom} – ${tile.yearTo}`
  ].filter(Boolean).join(' · ');
  detailDescription.textContent = tile.description;
  detailActions.classList.toggle('hidden', tile.type !== 'pending');
  detailModal.classList.remove('hidden');
  detailModal.setAttribute('aria-hidden', 'false');
}

function handleTileActivation(element) {
  const tile = muralState.tiles.find((item) => item.id === element.dataset.id);
  if (!tile) return;

  if (tile.type === 'empty') {
    setSelectionMode(true);
    openParticipationModal(tile);
    return;
  }

  openTileDetail(tile);
}

function handleTileClick(event) {
  if (muralState.dragging) return;
  const element = event.target.closest('.tile');
  if (element) handleTileActivation(element);
}

function handleTileKeydown(event) {
  const element = event.target.closest('.tile');
  if (!element || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  handleTileActivation(element);
}

function saveLocalState() {
  const submissions = muralState.tiles
    .filter((tile) => tile.type === 'pending' || tile.type === 'approved-local')
    .map(({ id, x, y, type, label, name, description, image, career, state, municipality, yearFrom, yearTo }) => ({
      id, x, y, type, label, name, description, image, career, state, municipality, yearFrom, yearTo
    }));

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return true;
  } catch (error) {
    console.error('No se pudo guardar el estado local del mural.', error);
    notify('No se pudo guardar en este navegador. La solicitud solo seguirá disponible en esta sesión.', true);
    return false;
  }
}

function loadLocalState() {
  let stored;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('No se pudo acceder al almacenamiento local.', error);
    notify('El almacenamiento local no está disponible; los cambios solo durarán en esta sesión.', true);
    return;
  }
  if (!stored) return;

  try {
    const submissions = JSON.parse(stored);
    if (!Array.isArray(submissions)) throw new TypeError('El estado guardado del mural no es una lista.');

    submissions.forEach((submission) => {
      if (!submission || !Number.isInteger(submission.x) || !Number.isInteger(submission.y)) return;
      if (!['pending', 'approved-local'].includes(submission.type)) return;
      const tile = getSlot(submission.x, submission.y);
      if (!tile || typeof submission.image !== 'string' || !submission.image.startsWith('data:image/')) return;
      Object.assign(tile, {
        type: submission.type,
        label: typeof submission.label === 'string' ? submission.label : 'En revisión',
        name: typeof submission.name === 'string' ? submission.name : '',
        description: typeof submission.description === 'string' ? submission.description : '',
        image: submission.image,
        career: typeof submission.career === 'string' ? submission.career : '',
        state: typeof submission.state === 'string' ? submission.state : '',
        municipality: typeof submission.municipality === 'string' ? submission.municipality : '',
        yearFrom: typeof submission.yearFrom === 'string' ? submission.yearFrom : '',
        yearTo: typeof submission.yearTo === 'string' ? submission.yearTo : ''
      });
    });
  } catch (error) {
    console.error('Los datos guardados del mural no se pudieron leer.', error);
    notify('No se pudieron leer los datos guardados; inicia una nueva demostración local.', true);
  }
}

function updateYearRange(changedInput) {
  let yearFrom = Number(yearFromInput.value);
  let yearTo = Number(yearToInput.value);

  if (yearFrom > yearTo) {
    if (changedInput === yearFromInput) yearTo = yearFrom;
    else yearFrom = yearTo;
  }

  yearFromInput.value = String(yearFrom);
  yearToInput.value = String(yearTo);
  yearFromInput.max = String(yearTo);
  yearToInput.min = String(yearFrom);
  yearFromValue.value = String(yearFrom);
  yearFromValue.textContent = String(yearFrom);
  yearToValue.value = String(yearTo);
  yearToValue.textContent = String(yearTo);
}

function previewSelectedPhoto() {
  const [file] = photoInput.files;
  if (!file) {
    imagePreviewBox.classList.add('hidden');
    imagePreview.removeAttribute('src');
    return;
  }
  if (!file.type.startsWith('image/')) {
    photoInput.value = '';
    window.alert('Selecciona un archivo de imagen válido.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.src = reader.result;
    imagePreviewBox.classList.remove('hidden');
  };
  reader.onerror = () => {
    console.error('No se pudo leer la fotografía seleccionada.', reader.error);
    window.alert('No se pudo abrir la fotografía. Prueba con otro archivo.');
  };
  reader.readAsDataURL(file);
}

function addSelectOption(select, value, label, disabled = false) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  option.disabled = disabled;
  select.append(option);
}

function populateStates() {
  STATES.forEach((state) => addSelectOption(stateInput, state, state));
}

function updateMunicipalities(state, selectedMunicipality = '') {
  municipalityInput.replaceChildren();
  const municipalities = MUNICIPALITIES_BY_STATE[state] || [];
  addSelectOption(
    municipalityInput,
    '',
    state ? 'Elige un municipio' : 'Primero elige un estado',
    !state
  );
  municipalityInput.disabled = !state;
  municipalities.forEach((municipality) => {
    addSelectOption(municipalityInput, municipality, municipality);
  });
  if (municipalities.includes(selectedMunicipality)) {
    municipalityInput.value = selectedMunicipality;
  }
}

function resetLocationFields() {
  if (!stateInput || !municipalityInput) return;
  stateInput.value = '';
  updateMunicipalities('');
}

function handleSubmission(event) {
  event.preventDefault();
  const file = photoInput.files[0];
  const publicName = document.getElementById('publicName').value.trim();
  const career = careerInput.value;
  const state = stateInput.value;
  const municipality = municipalityInput.value;
  const description = document.getElementById('description').value.trim();
  const { x, y } = muralState.selectedSlot || {};
  const slot = Number.isInteger(x) && Number.isInteger(y) ? getSlot(x, y) : null;

  if (!slot || slot.type !== 'empty') {
    window.alert('Elige un espacio que siga disponible antes de enviar la solicitud.');
    closeParticipationModal();
    setSelectionMode(true);
    return;
  }
  if (!publicName || !description || !file || !CAREERS.includes(career)
      || !STATES.includes(state) || !MUNICIPALITIES_BY_STATE[state]?.includes(municipality)
      || !participationForm.reportValidity()) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (slot.type !== 'empty') {
      window.alert('Ese espacio ya no está disponible. Elige otro hueco.');
      closeParticipationModal();
      return;
    }

    Object.assign(slot, {
      type: 'pending',
      label: 'En revisión',
      name: publicName,
      description,
      image: reader.result,
      career,
      state,
      municipality,
      yearFrom: yearFromInput.value,
      yearTo: yearToInput.value
    });

    renderMural();
    const saved = saveLocalState();
    closeParticipationModal();
    setSelectionMode(false);
    notify(saved
      ? `Solicitud pendiente en el espacio ${x} · ${y}. Solo se guarda en este navegador.`
      : `Solicitud pendiente en el espacio ${x} · ${y}, pero no se pudo guardar tras cerrar esta sesión.`);
  };
  reader.onerror = () => {
    console.error('No se pudo leer la fotografía para enviar la solicitud.', reader.error);
    window.alert('No se pudo leer la fotografía. Intenta con otro archivo.');
  };
  reader.readAsDataURL(file);
}

function approveCurrentSubmission() {
  const tile = muralState.activeTile;
  if (!tile || tile.type !== 'pending') return;

  tile.type = 'approved-local';
  tile.label = tile.name || 'Aprobada localmente';
  renderMural();
  saveLocalState();
  closeDetailModal();
  notify('Aprobada localmente en este navegador; no se ha publicado en un servidor.');
}

function rejectCurrentSubmission() {
  const tile = muralState.activeTile;
  if (!tile || tile.type !== 'pending') return;

  Object.assign(tile, {
    type: 'empty',
    label: 'Disponible',
    name: '',
    description: '',
    image: '',
    career: '',
    state: '',
    municipality: '',
    yearFrom: '',
    yearTo: ''
  });
  renderMural();
  saveLocalState();
  closeDetailModal();
  notify(`La solicitud fue rechazada y el espacio ${tile.x} · ${tile.y} está disponible nuevamente.`);
}

function attachCloseHandlers() {
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.close === 'modal') closeParticipationModal();
      if (button.dataset.close === 'detail') closeDetailModal();
    });
  });
}

function bindToolbar() {
  toolbarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'zoom-in') muralState.scale = clamp(muralState.scale + 0.15, 0.7, 2.2);
      if (action === 'zoom-out') muralState.scale = clamp(muralState.scale - 0.15, 0.7, 2.2);
      if (action === 'reset') {
        muralState.scale = 1;
        centerMural();
        return;
      }
      updateTransform();
    });
  });
}

function bindPanAndZoom() {
  stage.addEventListener('wheel', (event) => {
    event.preventDefault();
    muralState.scale = clamp(muralState.scale - event.deltaY * 0.0015, 0.7, 2.2);
    updateTransform();
  }, { passive: false });

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('.mural-toolbar')) return;
    muralState.pointerStart = {
      x: event.clientX,
      y: event.clientY,
      offsetX: muralState.offsetX,
      offsetY: muralState.offsetY
    };
    muralState.dragging = false;
    const captureTarget = event.target.closest('.tile') || event.target;
    captureTarget.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!muralState.pointerStart) return;
    const deltaX = event.clientX - muralState.pointerStart.x;
    const deltaY = event.clientY - muralState.pointerStart.y;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
      muralState.dragging = true;
      surface.classList.add('dragging');
    }
    if (!muralState.dragging) return;
    muralState.offsetX = muralState.pointerStart.offsetX + deltaX;
    muralState.offsetY = muralState.pointerStart.offsetY + deltaY;
    updateTransform();
  });

  const finishPan = () => {
    if (muralState.dragging) {
      window.setTimeout(() => {
        muralState.dragging = false;
      }, 0);
    }
    muralState.pointerStart = null;
    surface.classList.remove('dragging');
  };
  stage.addEventListener('pointerup', finishPan);
  stage.addEventListener('pointercancel', finishPan);
}

openParticipationModalBtn.addEventListener('click', () => {
  setSelectionMode(true);
});
surface.addEventListener('click', handleTileClick);
surface.addEventListener('keydown', handleTileKeydown);
participationForm.addEventListener('submit', handleSubmission);
photoInput.addEventListener('change', previewSelectedPhoto);
stateInput.addEventListener('change', () => updateMunicipalities(stateInput.value));
yearFromInput.addEventListener('input', () => updateYearRange(yearFromInput));
yearToInput.addEventListener('input', () => updateYearRange(yearToInput));
approveSubmissionBtn.addEventListener('click', approveCurrentSubmission);
rejectSubmissionBtn.addEventListener('click', rejectCurrentSubmission);

attachCloseHandlers();
bindToolbar();
bindPanAndZoom();
muralState.tiles = createBaseGrid();
populateStates();
updateMunicipalities('');
updateYearRange(yearFromInput);
loadLocalState();
updateSurfaceSize();
renderMural();
centerMural();
window.addEventListener('resize', centerMural);
