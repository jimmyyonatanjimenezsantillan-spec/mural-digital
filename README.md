# Mural Digital

Un mural interactivo de fotografías y videos organizado en columnas independientes, con zoom del mural, ampliación de columnas y tarjetas en revisión.

## Uso

Abre `index.html` en un navegador moderno. No requiere instalación ni compilación. Arrastra el fondo para recorrer el mural y usa la rueda sobre él para acercar o alejar; sobre una columna, la rueda desplaza solo esa columna. En pantallas táctiles, arrastra el fondo para moverlo y usa dos dedos para el zoom. Los videos usan los controles del reproductor y no comienzan automáticamente.

## Participación

Elige un espacio vacío, completa el formulario y selecciona una fotografía o video para dejar una solicitud pendiente. Al abrir una solicitud pendiente, se puede aprobar y publicar en el mismo espacio como demostración local. Las publicaciones y aprobaciones se guardan únicamente en el almacenamiento local de ese navegador; no se comparten con otros visitantes ni se publican en un servidor.

Para ofrecer participación compartida se necesita un backend para almacenar contenido y solicitudes, sincronizar la disponibilidad de espacios y habilitar moderación autenticada. El servidor debe guardar las aprobaciones y hacerlas visibles para todos los visitantes.

## Archivos

- `index.html`: estructura del mural y formularios.
- `styles.css`: estilos y diseño adaptable.
- `script.js`: interacciones, selección de espacios y persistencia local.
