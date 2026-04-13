document.addEventListener('DOMContentLoaded', () => {
            
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

    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasAnimated) {
            animateCounters();
            hasAnimated = true; 
        }
    }, { threshold: 0.5 });
    
    if (statsSection) observer.observe(statsSection);

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        btn.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    
    function showSlide(n) {
        if(items.length === 0) return;
        items[index].classList.remove('active');
        dots[index].classList.remove('active');
        index = (n + items.length) % items.length;
        items[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    
    if (nextBtn) nextBtn.addEventListener('click', () => showSlide(index + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => showSlide(index - 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
    
    if (items.length > 0) setInterval(() => showSlide(index + 1), 5000);

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

    const ojosSecretos = document.getElementById('ojos-secretos');
    const oofSound = document.getElementById('oof-sound'); 

    if (ojosSecretos) {
        ojosSecretos.addEventListener('click', () => {
            // Reproducir sonido "Oof" al hacer clic
            if (oofSound) {
                oofSound.currentTime = 0;
                oofSound.play().catch(() => {});
            }

            // Añadir clase para la animación de teletransporte
            document.body.classList.add('efecto-teletransporte');

            // Abrir el link de Rick Astley después de 1.5 segundos
            setTimeout(() => {
                window.open('https://www.youtube.com/watch?v=zu2Eaw6Ohxc', '_blank');
                // Quitamos el efecto por si el usuario vuelve a la pestaña original
                document.body.classList.remove('efecto-teletransporte');
            }, 1500); 
        });
    }

    // Easter Egg 2: Escribir "oof" en el teclado
    let typedKeys = '';
    const secretWord = 'oof';

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
            
            document.body.classList.add('shaking');
            
            setTimeout(() => {
                document.body.classList.remove('shaking');
            }, 500);
        }
    });

}); // FIN DEL DOMContentLoaded (¡Solo debe haber uno al final!)