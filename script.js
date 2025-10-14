document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const progressBar = document.querySelector('.progress-bar');
    const slideNavPanel = document.getElementById('slideNavPanel');
    const slideNavPanelClose = document.querySelector('.slide-nav-panel-close');
    const slideNavList = document.getElementById('slideNavList');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // Fonction pour extraire le titre d'une slide
    function getSlideTitle(slide, index) {
        const h1 = slide.querySelector('h1');
        const h2 = slide.querySelector('h2');
        
        if (h1) {
            return h1.textContent.trim();
        } else if (h2) {
            return h2.textContent.trim();
        } else if (slide.classList.contains('activity-slide')) {
            return `Activité ${index}`;
        } else {
            return `Slide ${index + 1}`;
        }
    }

    // Créer la liste de navigation des slides
    function createSlideNavigation() {
        slideNavList.innerHTML = '';
        
        slides.forEach((slide, index) => {
            const title = getSlideTitle(slide, index + 1);
            const navItem = document.createElement('div');
            navItem.className = 'slide-nav-item';
            navItem.innerHTML = `
                <span class="slide-number">${index + 1}</span>
                ${title}
            `;
            
            navItem.addEventListener('click', () => {
                goToSlide(index);
                closeSlideNavPanel();
            });
            
            slideNavList.appendChild(navItem);
        });
    }

    // Mettre à jour l'item actuel dans la navigation
    function updateSlideNavigation() {
        const navItems = document.querySelectorAll('.slide-nav-item');
        navItems.forEach((item, index) => {
            item.classList.toggle('current', index === currentSlide);
        });
    }

    // Ouvrir le panneau de navigation
    function openSlideNavPanel() {
        slideNavPanel.classList.add('open');
        updateSlideNavigation();
    }

    // Fermer le panneau de navigation
    function closeSlideNavPanel() {
        slideNavPanel.classList.remove('open');
    }

    function goToSlide(slideIndex) {
        sliderContainer.style.transform = `translateX(-${slideIndex * 100}vw)`;
        currentSlide = slideIndex;
        updateUI();
        updateSlideNavigation();
    }
    
    function updateUI() {
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        const progressPercent = totalSlides > 1 ? ((currentSlide) / (totalSlides - 1)) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
    }

    // Event listeners
    nextBtn.addEventListener('click', () => { if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1); });
    prevBtn.addEventListener('click', () => { if (currentSlide > 0) goToSlide(currentSlide - 1); });
    
    // Clic sur le compteur pour ouvrir la navigation
    slideCounter.addEventListener('click', openSlideNavPanel);
    
    // Fermer le panneau
    slideNavPanelClose.addEventListener('click', closeSlideNavPanel);
    
    // Fermer en cliquant en dehors du panneau
    document.addEventListener('click', (e) => {
        if (slideNavPanel.classList.contains('open') && 
            !slideNavPanel.contains(e.target) && 
            !slideCounter.contains(e.target)) {
            closeSlideNavPanel();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextBtn.click();
        else if (e.key === 'ArrowLeft') prevBtn.click();
        else if (e.key === 'Escape') {
            if (slideNavPanel.classList.contains('open')) {
                closeSlideNavPanel();
            } else if (modal.style.display !== 'none') {
                closeModal();
            }
        }
    });
    
    const modal = document.getElementById('folderModal');
    const modalFolderName = document.getElementById('modalFolderName');
    const modalFolderDesc = document.getElementById('modalFolderDesc');
    const closeModalBtn = document.querySelector('.modal-close');
    const folderIcons = document.querySelectorAll('.folder-icon');

    const folderDescriptions = {
        bin: { name: "/bin", desc: "Contient les commandes binaires essentielles pour tous les utilisateurs (ls, cp)." },
        boot: { name: "/boot", desc: "Contient les fichiers nécessaires au démarrage du système, y compris le noyau Linux." },
        dev: { name: "/dev", desc: "Contient les fichiers de périphériques (disques durs, terminaux, etc.)." },
        etc: { name: "/etc", desc: "Contient les fichiers de configuration de tout le système. Le centre de contrôle." },
        home: { name: "/home", desc: "Contient les dossiers personnels des utilisateurs." },
        opt: { name: "/opt", desc: "Utilisé pour installer des logiciels optionnels ou tiers (ex: Google Chrome)." },
        usr: { name: "/usr", desc: "Contient les programmes installés par le système. La plupart des commandes se trouvent dans /usr/bin." },
        var: { name: "/var", desc: "Contient des données variables, comme les logs (/var/log) et les caches." },
        tmp: { name: "/tmp", desc: "Dossier pour les fichiers temporaires, souvent vidé au redémarrage." },
        media: { name: "/media", desc: "Point de montage pour les périphériques amovibles (clés USB, CD-ROM)." },
        mnt: { name: "/mnt", desc: "Point de montage temporaire pour les administrateurs système." },
        sys: { name: "/sys", desc: "Un système de fichiers virtuel qui expose des informations sur le noyau et les périphériques." }
    };

    function openModal(folder) {
        const data = folderDescriptions[folder];
        modalFolderName.textContent = data.name;
        modalFolderDesc.textContent = data.desc;
        modal.style.display = 'flex';
    }
    function closeModal() { modal.style.display = 'none'; }
    folderIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const folderName = icon.dataset.folder;
            if (folderName) openModal(folderName);
        });
    });
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    const fsContainer = document.getElementById('fs-container');
    const rootFolderIcon = document.getElementById('root-folder-icon');
    const fsInstruction = document.getElementById('fs-instruction');

    rootFolderIcon.addEventListener('click', () => {
        fsContainer.classList.add('active');
        fsInstruction.textContent = "Chaque dossier a un rôle précis.";
    });

    // Initialisation
    createSlideNavigation();
    goToSlide(0);
});
