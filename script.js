const surface = document.getElementById('muralSurface');
const stage = document.querySelector('.mural-shell');
const participationModal = document.getElementById('participationModal');
const detailModal = document.getElementById('detailModal');
const participationForm = document.getElementById('participationForm');
const mediaInput = document.getElementById('mediaInput');
const imagePreviewBox = document.getElementById('imagePreviewBox');
const imagePreview = document.getElementById('imagePreview');
const videoPreview = document.getElementById('videoPreview');
const openParticipationModalBtn = document.getElementById('openParticipationModal');
const selectedSlotLabel = document.getElementById('selectedSlotLabel');
const modalSelectedSlot = document.getElementById('modalSelectedSlot');
const detailImage = document.getElementById('detailImage');
const detailVideo = document.getElementById('detailVideo');
const detailName = document.getElementById('detailName');
const detailStatus = document.getElementById('detailStatus');
const detailMeta = document.getElementById('detailMeta');
const detailDescription = document.getElementById('detailDescription');
const detailActions = document.getElementById('detailActions');
const approveSubmissionButton = document.getElementById('approveSubmission');
const yearFromInput = document.getElementById('yearFrom');
const yearToInput = document.getElementById('yearTo');
const yearFromValue = document.getElementById('yearFromValue');
const yearToValue = document.getElementById('yearToValue');
const includeGeneration = document.getElementById('includeGeneration');
const generationControls = document.getElementById('generationControls');
const careerInput = document.getElementById('career');

const COLUMN_COUNT = 5;
const SLOTS_PER_COLUMN = 10;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2.25;
const STORAGE_KEY = 'mural-digital-local-demo-v1';
const CAREERS = ['ITI', 'IMRN', 'LAET', 'IPET', 'LCIA'];
const DEMO_IMAGE = (id, width = 700, height = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=82`;
const DEMO_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const muralState = {
  tiles: [],
  selectedSlot: null,
  selectingSlot: false,
  expandedColumn: null,
  drag: null,
  backgroundPointers: new Map(),
  backgroundGesture: null,
  backgroundDragged: false,
  draggedColumn: null,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  activeTile: null
};

const demoItems = [
  { column: 1, type: 'image', name: 'Comunidad UPM', description: 'Una jornada para recordar en nuestra universidad.', image: DEMO_IMAGE('photo-1523580494863-6f3031224c94', 720, 940), height: 'tall', career: 'ITI', yearFrom: '2008', yearTo: '2012' },
  { column: 1, type: 'video', name: 'Momentos del campus', description: 'Un instante en movimiento, compartido por la comunidad.', video: DEMO_VIDEO, poster: DEMO_IMAGE('photo-1509062522246-3755977927d7', 720, 520), height: 'short', career: 'LAET' },
  { column: 1, type: 'image', name: 'Encuentro de generaciones', description: 'Amistades y recuerdos que siguen creciendo.', image: DEMO_IMAGE('photo-1529156069898-49953e39b3ac', 720, 760), height: 'medium', yearFrom: '2012', yearTo: '2016' },
  { column: 2, type: 'image', name: 'Día de celebración', description: 'Celebramos veinte años de aprendizaje y comunidad.', image: DEMO_IMAGE('photo-1527529482837-4698179dc6ce', 720, 650), height: 'medium', career: 'IMRN' },
  { column: 2, type: 'image', name: 'En el aula', description: 'Ideas, proyectos y muchas horas compartidas.', image: DEMO_IMAGE('photo-1523240795612-9a054b0db644', 720, 960), height: 'tall', yearFrom: '2010', yearTo: '2014' },
  { column: 2, type: 'video', name: 'Flores para el aniversario', description: 'Video de muestra. Pulsa reproducir para verlo.', video: DEMO_VIDEO, poster: DEMO_IMAGE('photo-1490750967868-88aa4486c946', 720, 520), height: 'short' },
  { column: 3, type: 'image', name: 'Nuevas amistades', description: 'La universidad también se construye con grandes amistades.', image: DEMO_IMAGE('photo-1517486808906-6ca8b3f04846', 720, 820), height: 'tall', career: 'IPET', yearFrom: '2017', yearTo: '2020' },
  { column: 3, type: 'video', name: 'Un recuerdo en movimiento', description: 'Video de muestra de reproducción manual.', video: DEMO_VIDEO, poster: DEMO_IMAGE('photo-1511632765486-a01980e01a18', 720, 570), height: 'short' },
  { column: 3, type: 'image', name: 'Orgullo UPM', description: 'Veinte años compartiendo experiencias y sueños.', image: DEMO_IMAGE('photo-1529390079861-591de354faf5', 720, 700), height: 'medium', yearFrom: '2006', yearTo: '2010' },
  { column: 4, type: 'image', name: 'Celebrar juntos', description: 'Una comunidad que se encuentra y celebra.', image: DEMO_IMAGE('photo-1511795409834-ef04bbd61622', 720, 900), height: 'tall', career: 'LCIA' },
  { column: 4, type: 'image', name: 'Trabajo en equipo', description: 'Cada generación aporta algo único.', image: DEMO_IMAGE('photo-1517245386807-bb43f82c33c4', 720, 600), height: 'short', yearFrom: '2014', yearTo: '2018' },
  { column: 4, type: 'video', name: 'Pequeño gran recuerdo', description: 'Pulsa el control para iniciar el video.', video: DEMO_VIDEO, poster: DEMO_IMAGE('photo-1521737711867-e3b97375f902', 720, 520), height: 'short' },
  { column: 5, type: 'image', name: 'Nuestra historia', description: 'Un mural hecho de historias y personas.', image: DEMO_IMAGE('photo-1529156069898-49953e39b3ac', 720, 720), height: 'medium', career: 'ITI', yearFrom: '2020', yearTo: '2024' },
  { column: 5, type: 'image', name: 'Aprender y compartir', description: 'Los mejores recuerdos se construyen en comunidad.', image: DEMO_IMAGE('photo-1523580494863-6f3031224c94', 720, 960), height: 'tall', yearFrom: '2006', yearTo: '2009' },
  { column: 5, type: 'video', name: 'Instante del aniversario', description: 'Video de muestra de reproducción manual.', video: DEMO_VIDEO, poster: DEMO_IMAGE('photo-1527529482837-4698179dc6ce', 720, 520), height: 'short' }
];

function notify(message, isError = false) {
  selectedSlotLabel.textContent = message;
  selectedSlotLabel.classList.toggle('is-error', isError);
}

function createBaseMural() {
  const tiles = [];
  for (let column = 1; column <= COLUMN_COUNT; column += 1) {
    const items = demoItems.filter((item) => item.column === column);
    for (let position = 1; position <= SLOTS_PER_COLUMN; position += 1) {
      const item = items[position - 1];
      tiles.push(item
        ? {
          ...item,
          id: `slot-${column}-${position}`,
          column,
          position,
          mediaType: item.type,
          type: 'approved-local',
          demo: true,
          name: `Ejemplo · ${item.type === 'video' ? 'Video' : 'Fotografía'} ${String(column).padStart(2, '0')}.${position}`,
          description: `${item.type === 'video' ? 'Video' : 'Imagen'} de demostración; no es una publicación real ni representa a estudiantes de la UPM.`,
          career: '',
          yearFrom: '',
          yearTo: '',
          label: 'Demostración'
        }
        : {
          id: `slot-${column}-${position}`,
          column,
          position,
          type: 'empty',
          label: 'Disponible',
          name: '',
          description: '',
          image: '',
          video: '',
          career: '',
          yearFrom: '',
          yearTo: ''
        });
    }
  }
  return tiles;
}

function createMedia(tile) {
  if (tile.mediaType === 'video') {
    const video = document.createElement('video');
    video.className = 'tile-video';
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.src = tile.video;
    if (tile.poster) video.poster = tile.poster;
    video.setAttribute('aria-label', `${tile.name}: reproductor de video`);
    return video;
  }

  const image = document.createElement('img');
  image.className = 'tile-image';
  image.src = tile.image;
  image.alt = tile.name;
  image.draggable = false;
  image.loading = 'lazy';
  image.addEventListener('error', () => image.classList.add('media-unavailable'), { once: true });
  return image;
}

function createTile(tile) {
  if (tile.type === 'empty') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'empty-slot';
    button.dataset.id = tile.id;
    button.setAttribute('aria-label', `Espacio disponible en columna ${tile.column}, posición ${tile.position}. Participar`);
    button.innerHTML = '<span aria-hidden="true">+</span><span>Espacio disponible</span>';
    return button;
  }

  const card = document.createElement('article');
  card.className = `mural-card ${tile.height || 'medium'} ${tile.type === 'pending' ? 'pending' : ''}`;
  card.dataset.id = tile.id;
  const mediaFrame = tile.mediaType === 'video'
    ? document.createElement('div')
    : document.createElement('button');
  if (tile.mediaType !== 'video') {
    mediaFrame.type = 'button';
    mediaFrame.dataset.action = 'detail';
    mediaFrame.dataset.id = tile.id;
    mediaFrame.setAttribute('aria-label', `${tile.name}: ver detalle`);
  }
  mediaFrame.className = 'card-media';
  mediaFrame.append(createMedia(tile));
  const caption = document.createElement('div');
  caption.className = 'card-caption';
  const title = document.createElement('strong');
  title.textContent = tile.name;
  if (tile.mediaType === 'video') {
    const detailButton = document.createElement('button');
    detailButton.type = 'button';
    detailButton.className = 'video-title';
    detailButton.dataset.action = 'detail';
    detailButton.dataset.id = tile.id;
    detailButton.textContent = tile.name;
    caption.append(detailButton);
  } else {
    caption.append(title);
  }
  const status = document.createElement('span');
  status.textContent = tile.type === 'pending'
    ? 'Pendiente de revisión local'
    : tile.demo
      ? `${tile.mediaType === 'video' ? 'Video' : 'Fotografía'} de demostración`
      : tile.mediaType === 'video' ? 'Video' : 'Fotografía';
  caption.append(status);
  card.append(mediaFrame, caption);
  return card;
}

function renderMural() {
  surface.replaceChildren();
  for (let column = 1; column <= COLUMN_COUNT; column += 1) {
    const section = document.createElement('section');
    section.className = 'mural-column';
    section.dataset.column = String(column);
    const heading = document.createElement('div');
    heading.className = 'column-heading';
    const title = document.createElement('span');
    title.textContent = `Columna ${String(column).padStart(2, '0')}`;
    const expand = document.createElement('button');
    expand.className = 'column-expand';
    expand.type = 'button';
    expand.dataset.action = 'expand';
    expand.dataset.column = String(column);
    expand.textContent = muralState.expandedColumn === column ? 'Volver al mural' : 'Ampliar';
    expand.setAttribute('aria-label', muralState.expandedColumn === column
      ? 'Volver a la vista general'
      : `Ampliar columna ${column}`);
    heading.append(title, expand);
    const feed = document.createElement('div');
    feed.className = 'column-feed';
    feed.dataset.column = String(column);
    muralState.tiles
      .filter((tile) => tile.column === column)
      .forEach((tile) => feed.append(createTile(tile)));
    section.append(heading, feed);
    surface.append(section);
  }
  stage.classList.toggle('has-expanded-column', muralState.expandedColumn !== null);
  surface.querySelectorAll('.mural-column').forEach((column) => {
    column.classList.toggle('expanded', Number(column.dataset.column) === muralState.expandedColumn);
  });
  updateMuralTransform();
}

function updateMuralTransform() {
  surface.style.transform = `translate(${muralState.offsetX}px, ${muralState.offsetY}px) scale(${muralState.scale})`;
}

function setMuralSize() {
  const width = window.matchMedia('(max-width: 700px)').matches ? 980 : 1390;
  surface.style.width = `${width}px`;
}

function zoomAt(clientX, clientY, nextScale) {
  const bounds = stage.getBoundingClientRect();
  const originX = bounds.left + surface.offsetLeft;
  const originY = bounds.top + surface.offsetTop;
  const contentX = (clientX - originX - muralState.offsetX) / muralState.scale;
  const contentY = (clientY - originY - muralState.offsetY) / muralState.scale;
  muralState.scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextScale));
  muralState.offsetX = clientX - originX - contentX * muralState.scale;
  muralState.offsetY = clientY - originY - contentY * muralState.scale;
  updateMuralTransform();
}

function setSelectionMode(enabled) {
  muralState.selectingSlot = enabled;
  stage.classList.toggle('selecting', enabled);
  openParticipationModalBtn.setAttribute('aria-pressed', String(enabled));
  if (enabled) notify('Elige una tarjeta disponible para seleccionar tu espacio.');
}

function openParticipationModal(tile) {
  if (!tile || tile.type !== 'empty') return;
  muralState.selectedSlot = tile.id;
  modalSelectedSlot.textContent = `Columna ${tile.column} · espacio ${tile.position}`;
  participationModal.classList.remove('hidden');
  participationModal.setAttribute('aria-hidden', 'false');
  document.getElementById('publicName').focus();
}

function closeParticipationModal() {
  participationModal.classList.add('hidden');
  participationModal.setAttribute('aria-hidden', 'true');
  participationForm.reset();
  generationControls.hidden = true;
  yearFromInput.value = '2006';
  yearToInput.value = '2026';
  updateYearRange(yearFromInput);
  imagePreviewBox.classList.add('hidden');
  imagePreview.classList.add('hidden');
  imagePreview.removeAttribute('src');
  videoPreview.pause();
  videoPreview.removeAttribute('src');
  videoPreview.load();
  videoPreview.classList.add('hidden');
  mediaInput.value = '';
  muralState.selectedSlot = null;
}

function closeDetailModal() {
  detailVideo.pause();
  detailModal.classList.add('hidden');
  detailModal.setAttribute('aria-hidden', 'true');
  detailVideo.removeAttribute('src');
  detailVideo.load();
}

function openTileDetail(tile) {
  if (!tile) return;
  muralState.activeTile = tile;
  const isVideo = tile.mediaType === 'video';
  detailImage.classList.toggle('hidden', isVideo);
  detailVideo.classList.toggle('hidden', !isVideo);
  if (isVideo) {
    detailVideo.src = tile.video;
    detailVideo.poster = tile.poster || '';
    detailVideo.load();
  } else {
    detailImage.src = tile.image;
    detailImage.alt = tile.name;
  }
  detailName.textContent = tile.name;
  detailStatus.textContent = tile.type === 'pending'
    ? 'Pendiente de revisión local'
    : tile.demo ? `${isVideo ? 'Video' : 'Fotografía'} de demostración`
      : isVideo ? 'Video' : 'Fotografía';
  detailMeta.textContent = [
    tile.career,
    tile.yearFrom && tile.yearTo ? `${tile.yearFrom} – ${tile.yearTo}` : ''
  ].filter(Boolean).join(' · ');
  detailDescription.textContent = tile.description || 'Sin descripción.';
  detailActions.classList.toggle('hidden', tile.type !== 'pending');
  detailModal.classList.remove('hidden');
  detailModal.setAttribute('aria-hidden', 'false');
}

function approvePendingTile() {
  const tile = muralState.activeTile;
  if (!tile || tile.type !== 'pending') return;
  tile.type = 'approved-local';
  tile.label = tile.name;
  const saved = saveLocalState();
  closeDetailModal();
  renderMural();
  notify(saved
    ? 'Aprobado y publicado en esta posición para este navegador. La publicación compartida necesita servidor.'
    : 'Aprobado en esta sesión, pero no se pudo guardar en este navegador.');
}

function findTile(id) {
  return muralState.tiles.find((tile) => tile.id === id);
}

function handleMuralClick(event) {
  const expandButton = event.target.closest('[data-action="expand"]');
  if (expandButton) {
    const column = Number(expandButton.dataset.column);
    muralState.expandedColumn = muralState.expandedColumn === column ? null : column;
    renderMural();
    return;
  }

  const empty = event.target.closest('.empty-slot');
  if (empty) {
    openParticipationModal(findTile(empty.dataset.id));
    setSelectionMode(false);
    return;
  }

  const detail = event.target.closest('[data-action="detail"]');
  if (detail && !event.target.closest('video')) openTileDetail(findTile(detail.dataset.id));
}

function saveLocalState() {
  const submissions = muralState.tiles
    .filter((tile) => tile.type === 'pending' || tile.type === 'approved-local' && tile.submittedLocally)
    .map(({ id, type, label, name, description, image, video, mediaType, career, yearFrom, yearTo }) =>
      ({ id, type, label, name, description, image, video, mediaType, career, yearFrom, yearTo }));
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return true;
  } catch (error) {
    console.error('No se pudo guardar el estado local del mural.', error);
    return false;
  }
}

function loadLocalState() {
  let stored;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error('No se pudo acceder al almacenamiento local.', error);
    return;
  }
  if (!stored) return;
  try {
    const submissions = JSON.parse(stored);
    if (!Array.isArray(submissions)) throw new TypeError('El estado guardado del mural no es una lista.');
    submissions.forEach((submission) => {
      if (!submission || typeof submission.id !== 'string'
          || !['pending', 'approved-local'].includes(submission.type)) return;
      const tile = findTile(submission.id);
      if (!tile || tile.type !== 'empty' || !['image', 'video'].includes(submission.mediaType)) return;
      Object.assign(tile, submission, {
        type: submission.type,
        submittedLocally: true,
        label: submission.type === 'pending' ? 'En revisión' : submission.name,
        height: 'medium'
      });
    });
  } catch (error) {
    console.error('Los datos guardados del mural no se pudieron leer.', error);
    notify('No se pudieron leer las solicitudes locales guardadas.', true);
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

function previewSelectedMedia() {
  const [file] = mediaInput.files;
  imagePreviewBox.classList.toggle('hidden', !file);
  if (!file) return;
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    mediaInput.value = '';
    imagePreviewBox.classList.add('hidden');
    window.alert('Selecciona una fotografía o un video válido.');
    return;
  }
  const isVideo = file.type.startsWith('video/');
  imagePreview.classList.toggle('hidden', isVideo);
  videoPreview.classList.toggle('hidden', !isVideo);
  const reader = new FileReader();
  reader.onload = () => {
    if (isVideo) {
      videoPreview.src = reader.result;
      videoPreview.load();
    } else imagePreview.src = reader.result;
  };
  reader.onerror = () => {
    console.error('No se pudo leer el contenido seleccionado.', reader.error);
    window.alert('No se pudo abrir el archivo. Prueba con otro contenido.');
  };
  reader.readAsDataURL(file);
}

function handleSubmission(event) {
  event.preventDefault();
  const file = mediaInput.files[0];
  const publicName = document.getElementById('publicName').value.trim();
  const description = document.getElementById('description').value.trim();
  const tile = findTile(muralState.selectedSlot);
  if (!tile || tile.type !== 'empty') {
    window.alert('Ese espacio ya no está disponible. Elige otra tarjeta vacía.');
    closeParticipationModal();
    setSelectionMode(true);
    return;
  }
  if (!participationForm.reportValidity() || !file
      || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))
      || (careerInput.value && !CAREERS.includes(careerInput.value))) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (tile.type !== 'empty') {
      window.alert('Ese espacio ya no está disponible. Elige otro hueco.');
      closeParticipationModal();
      return;
    }
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    Object.assign(tile, {
      type: 'pending',
      submittedLocally: true,
      mediaType,
      image: mediaType === 'image' ? reader.result : '',
      video: mediaType === 'video' ? reader.result : '',
      poster: '',
      height: 'medium',
      label: 'En revisión',
      name: publicName,
      description,
      career: careerInput.value,
      yearFrom: includeGeneration.checked ? yearFromInput.value : '',
      yearTo: includeGeneration.checked ? yearToInput.value : ''
    });
    const saved = saveLocalState();
    renderMural();
    closeParticipationModal();
    setSelectionMode(false);
    notify(saved
      ? 'Tu contenido quedó pendiente de revisión en este navegador; aún no está publicado.'
      : 'Tu contenido quedó pendiente durante esta sesión. No se pudo persistir en este navegador.');
  };
  reader.onerror = () => {
    console.error('No se pudo leer el contenido para enviar la solicitud.', reader.error);
    window.alert('No se pudo leer el archivo. Intenta con otro.');
  };
  reader.readAsDataURL(file);
}

function bindColumnScrolling() {
  surface.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || event.target.closest('video, input, select, textarea, .column-heading')) return;
    const feed = event.target.closest('.column-feed');
    if (!feed || !event.target.closest('.mural-card, .empty-slot')) return;
    muralState.drag = {
      feed,
      y: event.clientY,
      scrollTop: feed.scrollTop,
      pointerId: event.pointerId,
      captured: false
    };
  });
  surface.addEventListener('pointermove', (event) => {
    if (!muralState.drag || event.pointerId !== muralState.drag.pointerId) return;
    const delta = event.clientY - muralState.drag.y;
    if (Math.abs(delta) <= 4) return;
    if (!muralState.drag.captured) {
      muralState.drag.feed.setPointerCapture(event.pointerId);
      muralState.drag.captured = true;
    }
    muralState.draggedColumn = muralState.drag.feed;
    muralState.drag.feed.scrollTop = muralState.drag.scrollTop - delta;
    event.preventDefault();
  });
  const finishDrag = (event) => {
    if (!muralState.drag || event.pointerId !== muralState.drag.pointerId) return;
    const feed = muralState.drag.feed;
    muralState.drag = null;
    if (muralState.draggedColumn === feed) {
      window.setTimeout(() => {
        if (muralState.draggedColumn === feed) muralState.draggedColumn = null;
      }, 250);
    }
  };
  surface.addEventListener('pointerup', finishDrag);
  surface.addEventListener('pointercancel', finishDrag);
  surface.addEventListener('click', (event) => {
    if (!muralState.draggedColumn || event.target.closest('.column-feed') !== muralState.draggedColumn) return;
    event.stopImmediatePropagation();
    event.preventDefault();
    muralState.draggedColumn = null;
  }, true);
}

function bindBackgroundNavigation() {
  stage.addEventListener('wheel', (event) => {
    if (event.target.closest('video, input, select, textarea')) return;
    const column = event.target.closest('.mural-column');
    if (column) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        column.querySelector('.column-feed').scrollTop += event.deltaY;
        event.preventDefault();
      }
      return;
    }
    event.preventDefault();
    zoomAt(event.clientX, event.clientY, muralState.scale * Math.exp(-event.deltaY * 0.0012));
  }, { passive: false });

  stage.addEventListener('pointerdown', (event) => {
    if (event.target.closest('.modal, .column-heading, .mural-card, .empty-slot, video, button, input, select, textarea')) return;
    const feed = event.target.closest('.column-feed');
    if (feed && event.target !== feed) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const pointer = { x: event.clientX, y: event.clientY };
    muralState.backgroundPointers.set(event.pointerId, pointer);
    if (muralState.backgroundPointers.size === 1) {
      muralState.backgroundGesture = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        offsetX: muralState.offsetX,
        offsetY: muralState.offsetY,
        scale: muralState.scale
      };
    } else if (muralState.backgroundPointers.size === 2) {
      const [first, second] = [...muralState.backgroundPointers.values()];
      muralState.backgroundGesture = {
        pinch: true,
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale: muralState.scale,
        centerX: (first.x + second.x) / 2,
        centerY: (first.y + second.y) / 2
      };
    }
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('dragging-background');
  });

  stage.addEventListener('pointermove', (event) => {
    if (!muralState.backgroundPointers.has(event.pointerId)) return;
    muralState.backgroundPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = muralState.backgroundGesture;
    if (!gesture) return;
    if (gesture.pinch && muralState.backgroundPointers.size >= 2) {
      const [first, second] = [...muralState.backgroundPointers.values()];
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const centerX = (first.x + second.x) / 2;
      const centerY = (first.y + second.y) / 2;
      zoomAt(centerX, centerY, gesture.scale * distance / Math.max(gesture.distance, 1));
      muralState.backgroundDragged = true;
      event.preventDefault();
      return;
    }
    if (gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.x;
    const deltaY = event.clientY - gesture.y;
    if (Math.hypot(deltaX, deltaY) < 5) return;
    muralState.backgroundDragged = true;
    muralState.offsetX = gesture.offsetX + deltaX;
    muralState.offsetY = gesture.offsetY + deltaY;
    updateMuralTransform();
    event.preventDefault();
  });

  const finishBackgroundGesture = (event) => {
    if (!muralState.backgroundPointers.has(event.pointerId)) return;
    muralState.backgroundPointers.delete(event.pointerId);
    if (muralState.backgroundPointers.size === 1) {
      const [remainingId, point] = [...muralState.backgroundPointers.entries()][0];
      muralState.backgroundGesture = {
        pointerId: remainingId,
        x: point.x,
        y: point.y,
        offsetX: muralState.offsetX,
        offsetY: muralState.offsetY,
        scale: muralState.scale
      };
    } else if (!muralState.backgroundPointers.size) {
      muralState.backgroundGesture = null;
      stage.classList.remove('dragging-background');
      window.setTimeout(() => { muralState.backgroundDragged = false; }, 250);
    }
  };
  stage.addEventListener('pointerup', finishBackgroundGesture);
  stage.addEventListener('pointercancel', finishBackgroundGesture);
  stage.addEventListener('click', (event) => {
    if (!muralState.backgroundDragged) return;
    event.stopImmediatePropagation();
    event.preventDefault();
  }, true);
}

document.getElementById('openParticipationModal').addEventListener('click', () => {
  setSelectionMode(!muralState.selectingSlot);
});
surface.addEventListener('click', handleMuralClick);
approveSubmissionButton.addEventListener('click', approvePendingTile);
participationForm.addEventListener('submit', handleSubmission);
mediaInput.addEventListener('change', previewSelectedMedia);
yearFromInput.addEventListener('input', () => updateYearRange(yearFromInput));
yearToInput.addEventListener('input', () => updateYearRange(yearToInput));
includeGeneration.addEventListener('change', () => {
  generationControls.hidden = !includeGeneration.checked;
});
document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.close === 'modal') closeParticipationModal();
    if (button.dataset.close === 'detail') closeDetailModal();
  });
});
bindColumnScrolling();
bindBackgroundNavigation();
muralState.tiles = createBaseMural();
loadLocalState();
setMuralSize();
renderMural();
window.addEventListener('resize', setMuralSize);
