document.addEventListener('DOMContentLoaded', () => {
            
    // --- GESTIÓN DE TEMA OSCURO ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    // --- ANIMACIÓN DE CONTADORES ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-section');
    let hasAnimated = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            
            if (prefersReducedMotion) {
                counter.innerText = target.toLocaleString();
                return; 
            }

            const duration = 2000; 
            const increment = target / (duration / 16); 
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCounter();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true; 
        }
    }, { threshold: 0.5 });
    
    if (statsSection) observer.observe(statsSection);


    // --- ACORDEÓN FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        btn.addEventListener('click', () => {
            const isCurrentlyExpanded = btn.getAttribute('aria-expanded') === 'true';

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
                }
            });

            if (isCurrentlyExpanded) {
                item.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    // --- CARRUSEL DE IMÁGENES ---
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    
    function showSlide(n) {
        if(items.length === 0) return;
        
        items[index].classList.remove('active');
        dots[index].classList.remove('active');
        dots[index].setAttribute('aria-current', 'false'); 
        
        index = (n + items.length) % items.length;
        
        items[index].classList.add('active');
        dots[index].classList.add('active');
        dots[index].setAttribute('aria-current', 'true'); 
    }
    
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(index + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(index - 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    
    let carouselInterval;
    const startCarousel = () => {
        if (items.length > 0) {
            carouselInterval = setInterval(() => showSlide(index + 1), 5000);
        }
    };
    const stopCarousel = () => {
        clearInterval(carouselInterval);
    };

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopCarousel);
        carouselContainer.addEventListener('mouseleave', startCarousel);
        carouselContainer.addEventListener('focusin', stopCarousel);
        carouselContainer.addEventListener('focusout', startCarousel);
    }
    startCarousel();


    // --- SISTEMA DE SONIDOS ---
    document.addEventListener('click', (event) => {
        if (event.target.closest('.btn-primary') || event.target.closest('.carousel-prev') || 
            event.target.closest('.carousel-next') || event.target.closest('.dot') || event.target.closest('.faq-btn')) {
            const audio = document.getElementById('click-sound');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        }
    });


    // --- EASTER EGGS ---
    const ojosSecretos = document.getElementById('ojos-secretos');
    const oofSound = document.getElementById('oof-sound'); 

    // 1. Botón secreto del footer
    if (ojosSecretos) {
        ojosSecretos.addEventListener('click', () => {
            if (oofSound) {
                oofSound.currentTime = 0;
                oofSound.play().catch(() => {});
            }

            if (!prefersReducedMotion) {
                document.body.classList.add('efecto-teletransporte');
            }

            setTimeout(() => {
                window.open('https://youtu.be/bi6Q_lzaIow?si=ZsdpVNqZ3gk0J8bK', '_blank');
                document.body.classList.remove('efecto-teletransporte');
            }, prefersReducedMotion ? 100 : 1500); 
        });
    }

    // 2. Evento Teclado: Código "FAH"
    let typedKeys = '';
    const secretWord = 'fah';

    document.addEventListener('keydown', (e) => {
        typedKeys += e.key.toLowerCase();
        
        if (typedKeys.length > secretWord.length) {
            typedKeys = typedKeys.slice(-secretWord.length);
        }
        
        if (typedKeys === secretWord) {
            if (oofSound) {
                oofSound.currentTime = 0;
                oofSound.play().catch(()=>{});
            }
            
            if (!prefersReducedMotion) {
                document.body.classList.add('shaking');
                setTimeout(() => {
                    document.body.classList.remove('shaking');
                }, 500);
            }
        }
    });
});


// --- EASTER EGG GLOBAL: Modo Todd Howard ---
let typedKeys = '';
const secretWord = 'fah';
const toddWord = 'todd';

document.addEventListener('keydown', (e) => {
    typedKeys += e.key.toLowerCase();
    
    if (typedKeys.length > 10) typedKeys = typedKeys.slice(-10);
    
    if (typedKeys.endsWith(secretWord)) {
        if (oofSound) {
            oofSound.currentTime = 0;
            oofSound.play().catch(()=>{});
        }
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 500);
    }

    if (typedKeys.endsWith(toddWord)) {
        alert("It just works. Por favor, compra Skyrim otra vez.");
        document.documentElement.style.filter = "invert(1)"; 
        setTimeout(() => document.documentElement.style.filter = "none", 1000);
    }
});

// =========================================
// LÓGICA DEL FORMULARIO Y REGISTRO (LOCALSTORAGE)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const formBugs = document.getElementById('form-bugs');
    const btnEnviarBug = document.getElementById('btn-enviar-bug');
    const mensajeEstado = document.getElementById('mensaje-estado');
    const oofSound = document.getElementById('oof-sound');

    // Elementos del registro
    const seccionRegistro = document.getElementById('seccion-registro');
    const listaTickets = document.getElementById('lista-tickets');
    const btnQuemarTickets = document.getElementById('btn-quemar-tickets');

    // 1. RENDERIZAR TICKETS GUARDADOS
    const renderizarTickets = () => {
        const ticketsGuardados = JSON.parse(localStorage.getItem('tickets_vertedero')) || [];

        if (ticketsGuardados.length === 0) {
            if(seccionRegistro) seccionRegistro.style.display = 'none';
            return;
        }

        if(seccionRegistro) seccionRegistro.style.display = 'block';
        if(listaTickets) listaTickets.innerHTML = '';

        ticketsGuardados.forEach(ticket => {
            const ticketDiv = document.createElement('div');
            ticketDiv.className = 'ticket-item';
            ticketDiv.innerHTML = `
                <div class="ticket-header">
                    <span>⚠️ ${ticket.tipo}</span>
                    <span class="ticket-fecha">${ticket.fecha}</span>
                </div>
                <p class="ticket-autor"><strong>De:</strong> ${ticket.nombre} (${ticket.correo})</p>
                <div class="ticket-desc">"${ticket.descripcion}"</div>
            `;
            listaTickets.appendChild(ticketDiv);
        });
    };

    // Llamamos a la función al cargar la página
    renderizarTickets();

    // 2. ENVÍO Y VALIDACIÓN DEL FORMULARIO
    if (formBugs) {
        formBugs.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreInput = document.getElementById('jugador-nombre');
            const correoInput = document.getElementById('jugador-correo');
            const tipoInput = document.getElementById('tipo-bug');
            const terminosInput = document.getElementById('acepto-terminos');
            const descInput = document.getElementById('descripcion-bug');

            let formularioValido = true;

            // Limpiar errores
            document.querySelectorAll('.error-texto').forEach(el => el.classList.remove('activo'));
            document.querySelectorAll('.input-invalido').forEach(el => el.classList.remove('input-invalido'));

            const marcarError = (inputElement, idError, mensaje) => {
                const spanError = document.getElementById(idError);
                spanError.textContent = mensaje;
                spanError.classList.add('activo');
                if (inputElement) inputElement.classList.add('input-invalido');
                formularioValido = false;
            };

            // Validaciones
            if (nombreInput.value.trim() === '') marcarError(nombreInput, 'error-nombre', 'No me dejes esto en blanco.');
            
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (correoInput.value.trim() === '') {
                marcarError(correoInput, 'error-correo', 'Necesitamos tu correo para vender tus datos.');
            } else if (!regexCorreo.test(correoInput.value.trim())) {
                marcarError(correoInput, 'error-correo', 'Eso no es un correo válido. ¿Dónde está la @?');
            }

            if (tipoInput.value === '') marcarError(tipoInput, 'error-tipo', 'Selecciona un bug de la lista, no somos adivinos.');
            
            if (!terminosInput.checked) {
                marcarError(null, 'error-terminos', 'Debes aceptar los términos y renunciar a tu dinero.');
                terminosInput.classList.add('input-invalido');
            }

            if (!formularioValido) return;

            // Procesar envío simulado
            const textoOriginal = btnEnviarBug.textContent;
            btnEnviarBug.textContent = "Procesando decepción...";
            btnEnviarBug.style.opacity = "0.7";
            btnEnviarBug.disabled = true;

            setTimeout(() => {
                // Guardar en LocalStorage
                const nuevoTicket = {
                    id: Date.now(),
                    nombre: nombreInput.value.trim(),
                    correo: correoInput.value.trim(),
                    tipo: tipoInput.options[tipoInput.selectedIndex].text,
                    descripcion: descInput.value.trim() || "El usuario no dejó descripción. Probablemente estaba llorando.",
                    fecha: new Date().toLocaleString()
                };

                const ticketsActuales = JSON.parse(localStorage.getItem('tickets_vertedero')) || [];
                ticketsActuales.unshift(nuevoTicket); 
                localStorage.setItem('tickets_vertedero', JSON.stringify(ticketsActuales));

                // Finalizar vista de envío
                formBugs.reset(); 
                btnEnviarBug.style.display = "none"; 
                mensajeEstado.style.display = "block";
                mensajeEstado.textContent = "¡Éxito! Tu reporte ha sido recibido e impreso en el registro.";
                
                if (oofSound) {
                    oofSound.volume = 0.5;
                    oofSound.play().catch(e => console.log("Sonido bloqueado"));
                }

                renderizarTickets(); // Actualizar panel visualmente

                setTimeout(() => {
                    mensajeEstado.style.display = "none";
                    btnEnviarBug.style.display = "block";
                    btnEnviarBug.textContent = textoOriginal;
                    btnEnviarBug.style.opacity = "1";
                    btnEnviarBug.disabled = false;
                }, 4000);

            }, 1500);
        });
    }

    // 3. QUEMAR TICKETS
    if (btnQuemarTickets) {
        btnQuemarTickets.addEventListener('click', () => {
            if(confirm("¿Estás seguro de que quieres borrar todos los reportes? (La respuesta correcta es sí).")) {
                localStorage.removeItem('tickets_vertedero');
                renderizarTickets(); // Ocultará la sección de nuevo
            }
        });
    }
});

// --- LÓGICA DEL MODAL DE LOGIN/REGISTRO ---

const modal = document.getElementById('authModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const modalTitle = document.getElementById('modalTitle');

// Instancia del sonido incluido en tu proyecto
const clickSound = new Audio('Sounds/click.mp3');

function playClickSound() {
    // Reproduce el sonido de click desde tu carpeta
    clickSound.currentTime = 0; 
    clickSound.play().catch(e => console.log("Interacción de audio bloqueada hasta que el usuario interactúe con la página"));
}

function openModal(type) {
    playClickSound();
    modal.style.display = 'flex'; 
    toggleForm(type);
}

function closeModal() {
    modal.style.display = 'none';
}

function toggleForm(type) {
    if (type === 'login') {
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        modalTitle.textContent = 'Iniciar Sesión';
    } else if (type === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        modalTitle.textContent = 'Registrarse';
    }
}

// Cierra el modal al hacer clic en el fondo oscuro
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// --- LÓGICA DE SIMULACIÓN DE SESIÓN ---

const guestView = document.getElementById('guestView');
const loggedInView = document.getElementById('loggedInView');

// Función para simular el inicio de sesión
function simulateLogin(event) {
    event.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    // Reproducimos el sonido al ingresar
    playClickSound(); 
    
    // Cerramos el modal
    closeModal();
    
    // Ocultamos los botones de Iniciar/Registrar y mostramos el de Log Out
    guestView.style.display = 'none';
    loggedInView.style.display = 'flex';
}

// Función para cerrar sesión
function logout() {
    playClickSound();
    
    // Restauramos la vista original
    loggedInView.style.display = 'none';
    guestView.style.display = 'block';
}

// Interceptamos los envíos de los formularios del modal para activar la sesión
document.getElementById('loginForm').addEventListener('submit', simulateLogin);
document.getElementById('registerForm').addEventListener('submit', simulateLogin);

// ==========================================
// LÓGICA DEL FORMULARIO DE BUGS Y EASTER EGG
// ==========================================

const contenedorBugs = document.getElementById('contenedor-bugs');
const btnMostrarBug = document.getElementById('btn-mostrar-bug');

// Función principal para mostrar u ocultar el vertedero
function toggleBugForm() {
    if (contenedorBugs.style.display === 'none' || contenedorBugs.style.display === '') {
        contenedorBugs.style.display = 'block';
        // Hacemos que la página baje suavemente hasta el formulario
        contenedorBugs.scrollIntoView({ behavior: 'smooth' });
    } else {
        contenedorBugs.style.display = 'none';
    }
}

// 1. Activar con el botón
if (btnMostrarBug) {
    btnMostrarBug.addEventListener('click', () => {
        playClickSound(); // Reutilizamos tu sonido de click
        toggleBugForm();
    });
}

// 2. Activar escribiendo "bug" en el teclado
let secuenciaTeclas = '';
const palabraSecreta = 'bug';

document.addEventListener('keydown', (event) => {
    // Si el usuario está escribiendo dentro de un input (como el de login), ignoramos las teclas
    // para evitar que el formulario salte de la nada si escriben "hambuguesa" en el registro.
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }

    // Guardamos la tecla presionada (en minúscula)
    secuenciaTeclas += event.key.toLowerCase();

    // Solo mantenemos en memoria las últimas 3 letras (el tamaño de "bug")
    if (secuenciaTeclas.length > palabraSecreta.length) {
        secuenciaTeclas = secuenciaTeclas.slice(-palabraSecreta.length);
    }

    // Si la secuencia coincide con "bug", ¡Sorpresa!
    if (secuenciaTeclas === palabraSecreta) {
        toggleBugForm();
        secuenciaTeclas = ''; // Reiniciamos la secuencia por si lo quiere hacer de nuevo
        
        // Hacemos sonar el "Oof" como recompensa por encontrar el secreto
        const oofSound = document.getElementById('oof-sound');
        if (oofSound) {
            oofSound.currentTime = 0;
            oofSound.play().catch(e => console.log("Audio bloqueado"));
        }
    }
});