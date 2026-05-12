document.addEventListener('DOMContentLoaded', () => {

    // Función para dibujar los datos en pantalla
    function renderizarAdmin() {
        const adminTickets = document.getElementById('admin-lista-tickets');
        const adminUsuarios = document.getElementById('admin-lista-usuarios');

        // Renderizar Tickets (Bugs)
        const tickets = JSON.parse(localStorage.getItem('tickets_vertedero')) || [];
        if(adminTickets) {
            adminTickets.innerHTML = '';
            if(tickets.length === 0) {
                adminTickets.innerHTML = '<p style="color:#aaa; text-align:center; padding: 20px;">No hay bugs reportados. El código es perfecto.</p>';
            } else {
                tickets.forEach(t => {
                    adminTickets.innerHTML += `
                        <div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
                            <strong style="color:#ff8c00">${t.tipo}</strong> <span style="font-size:0.8em; color:#888; float:right;">${t.fecha}</span><br>
                            <span style="color:#aaa; font-size:0.9em;">De: ${t.correo}</span><br>
                            <em style="display:block; margin-top:5px; padding:8px; background:#000; border-radius:4px; font-size:0.9em;">"${t.descripcion}"</em>
                        </div>
                    `;
                });
            }
        }

        // Renderizar Usuarios
        const usuarios = JSON.parse(localStorage.getItem('baity_users')) || [];
        if(adminUsuarios) {
            adminUsuarios.innerHTML = '';
            // Si no hay usuarios, o si el ÚNICO usuario que existe eres tú (Baity)
            if(usuarios.length === 0 || (usuarios.length === 1 && usuarios[0].nombre === 'Baity')) {
                adminUsuarios.innerHTML = '<p style="color:#aaa; text-align:center; padding: 20px;">Nadie ha caído en tu trampa aún.</p>';
            } else {
                usuarios.forEach(u => {
                    // Le ponemos una corona solo a la cuenta de Baity
                    const isAdminBadge = u.nombre === 'Baity' ? '<span style="background:#ff4500; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.7em; margin-left:8px;">👑 DIOS</span>' : '';
                    
                    adminUsuarios.innerHTML += `
                        <div style="margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
                            <strong style="color:#9acd32; font-size:1.1em;">${u.nombre}</strong> ${isAdminBadge}<br>
                            <span style="color:#aaa; font-size:0.9em;">📧 ${u.correo}</span><br>
                            <span style="color:#dc3545; font-size:0.85em;">🔑 Pass: ${u.password} (Top Secret)</span>
                        </div>
                    `;
                });
            }
        }
    }

    // Llamamos a la función al cargar la página
    renderizarAdmin();

    // Lógica del Botón: Borrar todos los bugs
    const btnQuemarTickets = document.getElementById('btn-quemar-tickets');
    if (btnQuemarTickets) {
        btnQuemarTickets.addEventListener('click', () => {
            if(confirm("¿Seguro que quieres borrar la evidencia de todos los bugs?")) {
                localStorage.removeItem('tickets_vertedero');
                renderizarAdmin(); 
            }
        });
    }

    // Lógica del Botón: Borrar a todos los usuarios
    const btnBorrarUsuarios = document.getElementById('btn-borrar-usuarios');
    if (btnBorrarUsuarios) {
        btnBorrarUsuarios.addEventListener('click', () => {
            if(confirm("¿Banear a todos y borrar la base de datos de usuarios? (Tu cuenta Dios se mantendrá a salvo)")) {
                
                // 1. Rescatamos la cuenta de Baity antes de quemar la base de datos
                const usuariosActuales = JSON.parse(localStorage.getItem('baity_users')) || [];
                const cuentaDios = usuariosActuales.find(u => u.nombre === 'Baity');
                
                if (cuentaDios) {
                    // Guardamos SOLO a Baity
                    localStorage.setItem('baity_users', JSON.stringify([cuentaDios]));
                } else {
                    localStorage.removeItem('baity_users');
                }
                
                // 2. Opcional: Borramos la sesión activa de los pobres mortales que baneamos
                const sesionActiva = JSON.parse(localStorage.getItem('baity_sesion_activa'));
                if (sesionActiva && sesionActiva.nombre !== 'Baity') {
                    localStorage.removeItem('baity_sesion_activa'); 
                }
                
                renderizarAdmin();
            }
        });
    }
});