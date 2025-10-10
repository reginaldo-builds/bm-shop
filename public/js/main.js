// Menu hamburguer
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sidebarMenu = document.getElementById('sidebarMenu');
const menuOverlay = document.getElementById('menuOverlay');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebarMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        sidebarMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', () => {
        sidebarMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Inscrição realizada com sucesso!', 'success');
        newsletterForm.reset();
    });
}