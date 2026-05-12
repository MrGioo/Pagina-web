document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. CREAR CUENTA DIOS POR DEFECTO ---
    let usuariosBD = JSON.parse(localStorage.getItem('baity_users')) || [];
    if (!usuariosBD.find(u => u.nombre === 'Baity')) {
        usuariosBD.push({ nombre: 'Baity', correo: 'admin@baity.com', password: '2vacas' });
        localStorage.setItem('baity_users', JSON.stringify(usuariosBD));
    }

    // --- 1. GESTIÓN DE TEMA OSCURO ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.documentElement;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    }
    
    if(themeToggle) {
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
    }

    // --- 2. ANIMACIÓN DE CONTADORES ---
    const counters = document.querySelectorAll('.counter');
    const statsSection = document.getElementById('stats-section');
    let hasAnimated = false;
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
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
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true; 
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // --- 3. ACORDEÓN FAQ ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        if(btn) {
            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isExpanded) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                } else {
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    // --- 4. CARRUSEL ---
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    function showSlide(n) {
        if(slides.length === 0) return;
        slides[index].classList.remove('active');
        if(dots[index]) dots[index].classList.remove('active');
        index = (n + slides.length) % slides.length;
        slides[index].classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
    }
    document.querySelector('.carousel-next')?.addEventListener('click', () => showSlide(index + 1));
    document.querySelector('.carousel-prev')?.addEventListener('click', () => showSlide(index - 1));

    // --- 5. SONIDOS Y EASTER EGGS ---
    const oofSound = document.getElementById('oof-sound');
    document.getElementById('ojos-secretos')?.addEventListener('click', () => {
        oofSound?.play();
        document.body.classList.add('efecto-teletransporte');
        setTimeout(() => {
            window.open('https://youtu.be/bi6Q_lzaIow?si=ZsdpVNqZ3gk0J8bK', '_blank');
            document.body.classList.remove('efecto-teletransporte');
        }, 1500);
    });

    // --- 6. FORMULARIO DE BUGS ---
    const formBugs = document.getElementById('form-bugs');
    const btnMostrarBug = document.getElementById('btn-mostrar-bug');
    const contenedorBugs = document.getElementById('contenedor-bugs');

    window.toggleBugForm = function() {
        if (!contenedorBugs) return;
        contenedorBugs.style.display = (contenedorBugs.style.display === 'none' || contenedorBugs.style.display === '') ? 'block' : 'none';
        if (contenedorBugs.style.display === 'block') contenedorBugs.scrollIntoView({ behavior: 'smooth' });
    };

    btnMostrarBug?.addEventListener('click', window.toggleBugForm);

    formBugs?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-enviar-bug');
        const originalText = btn.textContent;
        btn.textContent = "Ignorando reporte...";
        btn.disabled = true;

        setTimeout(() => {
            const nuevoTicket = {
                id: Date.now(),
                nombre: document.getElementById('jugador-nombre').value,
                correo: document.getElementById('jugador-correo').value,
                tipo: document.getElementById('tipo-bug').value,
                descripcion: document.getElementById('descripcion-bug').value || "Sin descripción.",
                fecha: new Date().toLocaleString()
            };
            const tickets = JSON.parse(localStorage.getItem('tickets_vertedero')) || [];
            tickets.unshift(nuevoTicket);
            localStorage.setItem('tickets_vertedero', JSON.stringify(tickets));

            formBugs.reset();
            // Restaurar campos bloqueados tras el envío si hay sesión
            const sesion = JSON.parse(localStorage.getItem('baity_sesion_activa'));
            if(sesion) {
                const nInput = document.getElementById('jugador-nombre');
                const cInput = document.getElementById('jugador-correo');
                if(nInput) { nInput.value = sesion.nombre; nInput.readOnly = true; nInput.style.opacity = '0.7'; }
                if(cInput) { cInput.value = sesion.correo; cInput.readOnly = true; cInput.style.opacity = '0.7'; }
            }
            
            btn.textContent = "¡Enviado a la basura!";
            setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 2000);
        }, 1000);
    });

    // --- 7. SISTEMA DE SESIÓN (LOGIN / LOGOUT / INTERFAZ) ---
    window.iniciarSesionUI = function(usuario) {
        localStorage.setItem('baity_sesion_activa', JSON.stringify(usuario));
        
        const greeting = document.getElementById('userGreeting');
        const gView = document.getElementById('guestView');
        const lView = document.getElementById('loggedInView');
        const btnBug = document.getElementById('btn-mostrar-bug');
        const navUl = document.querySelector('.main-nav ul');

        if(greeting) greeting.textContent = `Bienvenido, ${usuario.nombre}`;
        if(gView) gView.style.display = 'none';
        if(lView) lView.style.display = 'flex';

        // Lógica Baity (Admin)
        if (usuario.nombre === 'Baity') {
            if (!document.getElementById('link-admin-secreto')) {
                const adminLi = document.createElement('li');
                adminLi.id = 'link-admin-secreto';
                adminLi.innerHTML = `<a href="Admin/admin.html" style="color: #ff4500; font-weight: 800; border: 1px solid #ff4500; padding: 5px 10px; border-radius: 5px;">⚙️ PANEL DIOS</a>`;
                navUl?.appendChild(adminLi);
            }
            if(btnBug) btnBug.style.display = 'none';
        } else {
            // Usuario Normal: Mostrar botón y AUTOCOMPLETAR
            if(btnBug) btnBug.style.display = 'block';
            
            const nInput = document.getElementById('jugador-nombre');
            const cInput = document.getElementById('jugador-correo');
            if(nInput) { 
                nInput.value = usuario.nombre; 
                nInput.readOnly = true; 
                nInput.style.opacity = '0.7'; 
                nInput.style.cursor = 'not-allowed';
            }
            if(cInput) { 
                cInput.value = usuario.correo; 
                cInput.readOnly = true; 
                cInput.style.opacity = '0.7'; 
                cInput.style.cursor = 'not-allowed';
            }
        }
    };

    window.logout = function() {
        localStorage.removeItem('baity_sesion_activa');
        document.getElementById('link-admin-secreto')?.remove();
        
        const lView = document.getElementById('loggedInView');
        const gView = document.getElementById('guestView');
        const btnBug = document.getElementById('btn-mostrar-bug');
        const cBugs = document.getElementById('contenedor-bugs');

        if(lView) lView.style.display = 'none';
        if(gView) gView.style.display = 'flex';
        if(btnBug) btnBug.style.display = 'none';
        if(cBugs) cBugs.style.display = 'none';
        
        // Limpiar y desbloquear inputs al salir
        const nInput = document.getElementById('jugador-nombre');
        const cInput = document.getElementById('jugador-correo');
        if(nInput) { nInput.value = ''; nInput.readOnly = false; nInput.style.opacity = '1'; nInput.style.cursor = 'text'; }
        if(cInput) { cInput.value = ''; cInput.readOnly = false; cInput.style.opacity = '1'; cInput.style.cursor = 'text'; }
    };

    // Listeners para formularios de autenticación
    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = this.querySelector('input[type="text"]').value;
        const correo = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        let users = JSON.parse(localStorage.getItem('baity_users')) || [];
        if(users.find(u => u.correo === correo)) return alert("Correo ya registrado");
        const newUser = { nombre, correo, password };
        users.push(newUser);
        localStorage.setItem('baity_users', JSON.stringify(users));
        iniciarSesionUI(newUser);
        window.closeModal();
    });

    document.getElementById('loginForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const correo = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const users = JSON.parse(localStorage.getItem('baity_users')) || [];
        const user = users.find(u => u.correo === correo && u.password === password);
        if(user) { iniciarSesionUI(user); window.closeModal(); } else { alert("Datos incorrectos"); }
    });

    // Restaurar sesión al cargar si existe
    const sesion = JSON.parse(localStorage.getItem('baity_sesion_activa'));
    if(sesion) iniciarSesionUI(sesion);
});

// Funciones globales para el Modal (necesarias para los onclick del HTML)
window.openModal = function(type) {
    const modal = document.getElementById('authModal');
    if(modal) modal.style.display = 'flex';
    
    const lForm = document.getElementById('loginForm');
    const rForm = document.getElementById('registerForm');
    const title = document.getElementById('modalTitle');

    if(type === 'login') {
        if(lForm) lForm.style.display = 'flex';
        if(rForm) rForm.style.display = 'none';
        if(title) title.textContent = 'Iniciar Sesión';
    } else {
        if(lForm) lForm.style.display = 'none';
        if(rForm) rForm.style.display = 'flex';
        if(title) title.textContent = 'Registrarse';
    }
};

window.closeModal = function() { 
    const modal = document.getElementById('authModal');
    if(modal) modal.style.display = 'none'; 
};