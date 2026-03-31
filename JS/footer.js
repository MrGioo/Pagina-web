// Base para reproducir un sonido al pulsar botones con la clase `btn-primary`.
// Cómo añadir un sonido:
// 1) Coloca tu archivo de audio en la carpeta del proyecto, por ejemplo `Sounds/click.mp3`.
// 2) Añade la ruta como `src` en el elemento <audio> dentro de `index.html`:
//      <audio id="click-sound" src="Sounds/click.mp3" preload="auto"></audio>
// 3) Si prefieres, puedes crear un objeto Audio en JS:
//      const audio = new Audio('Sounds/click.mp3');
//    y usarlo en lugar del elemento <audio>.

document.addEventListener('DOMContentLoaded', () => {
	const buttons = document.querySelectorAll('.btn-primary');
	const audioEl = document.getElementById('click-sound');

	if (buttons.length === 0) return;

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			// Reproduce el sonido si está disponible. No bloqueamos la acción del botón.
			try {
				if (audioEl && audioEl.src) {
					audioEl.currentTime = 0;
					audioEl.play().catch(() => {/* reproducción silenciada o error de autoplay */});
				}
			} catch (e) {
				// Silenciar errores de reproducción para no afectar la UX.
			}
		});
	});
});

