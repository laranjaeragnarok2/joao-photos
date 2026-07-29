/* ==========================================================================
   JOÃO FELIPE PHOTOS - APPLICATION LOGIC (ENSAIOS CARDS & ALBUM VIEWER)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentCategory: 'all',
        filteredEnsaios: [],
        currentAlbumPhotos: [],
        lightboxIndex: 0,
        theme: localStorage.getItem('theme') || 'light'
    };

    const elements = {
        filterBar: document.getElementById('filterBar'),
        ensaiosGrid: document.getElementById('ensaiosGrid'),
        testimonialsGrid: document.getElementById('testimonialsGrid'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        albumModal: document.getElementById('albumModal'),
        albumModalTitle: document.getElementById('albumModalTitle'),
        albumModalCategory: document.getElementById('albumModalCategory'),
        albumPhotosGrid: document.getElementById('albumPhotosGrid'),
        closeAlbumModalBtn: document.getElementById('closeAlbumModalBtn'),
        lightbox: document.getElementById('lightboxModal'),
        lightboxImg: document.getElementById('lightboxImg'),
        lightboxTitle: document.getElementById('lightboxTitle'),
        lightboxCategory: document.getElementById('lightboxCategory'),
        lightboxCounter: document.getElementById('lightboxCounter'),
        lightboxClose: document.getElementById('lightboxClose'),
        lightboxPrev: document.getElementById('lightboxPrev'),
        lightboxNext: document.getElementById('lightboxNext'),
        lightboxShareWa: document.getElementById('lightboxShareWa'),
        contactModal: document.getElementById('contactModal'),
        openModalBtns: document.querySelectorAll('.open-modal-btn'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        budgetForm: document.getElementById('budgetForm'),
        clientPortalModal: document.getElementById('clientPortalModal'),
        openClientPortalBtns: document.querySelectorAll('.open-client-portal-btn'),
        closeClientModalBtn: document.getElementById('closeClientModalBtn'),
        clientPortalForm: document.getElementById('clientPortalForm'),
        mobileMenuToggleBtn: document.getElementById('mobileMenuToggleBtn'),
        navMenu: document.getElementById('navMenu'),
        albumModalCredits: document.getElementById('albumModalCredits')
    };

    // Custom Floating Cursor Logic
    const cursor = document.getElementById('customCursor');
    const cursorLabel = document.getElementById('cursorLabel');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursor.classList.add('visible');
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
        });
    }

    window.setCursorHover = function(label) {
        if (!cursor) return;
        if (label) {
            cursor.classList.add('active');
            if (cursorLabel) cursorLabel.textContent = label;
        } else {
            cursor.classList.remove('active');
        }
    };

    // Hero Crossfade Slider Logic
    const heroImgs = document.querySelectorAll('#heroBgWrapper .hero-bg-img');
    if (heroImgs.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroImgs[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroImgs.length;
            heroImgs[currentSlide].classList.add('active');
        }, 4500);
    }

    // Mobile Menu Toggle Event
    if (elements.mobileMenuToggleBtn && elements.navMenu) {
        elements.mobileMenuToggleBtn.addEventListener('click', () => {
            elements.mobileMenuToggleBtn.classList.toggle('active');
            elements.navMenu.classList.toggle('active');
        });

        // Fechar ao clicar nos links do menu e ativar categoria se houver data-category
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (elements.mobileMenuToggleBtn && elements.navMenu) {
                    elements.mobileMenuToggleBtn.classList.remove('active');
                    elements.navMenu.classList.remove('active');
                }

                const targetCat = link.getAttribute('data-category');
                if (targetCat) {
                    state.currentCategory = targetCat;
                    updateFilterUI();
                    applyFilterAndRender();
                }
            });
        });
    }

    // Initialize Theme
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();

    // Render Filter Pills
    function renderFilters() {
        if (!elements.filterBar) return;
        elements.filterBar.innerHTML = '';

        PORTFOLIO_DATA.categories.forEach(cat => {
            let count = 0;
            if (cat.id === 'all') {
                count = PORTFOLIO_DATA.ensaios.length;
            } else {
                count = PORTFOLIO_DATA.ensaios.filter(item => item.category === cat.id).length;
            }

            const btn = document.createElement('button');
            btn.className = `filter-pill ${cat.id === state.currentCategory ? 'active' : ''}`;
            btn.dataset.category = cat.id;
            btn.textContent = `${cat.name} (${count})`;

            btn.addEventListener('click', () => {
                state.currentCategory = cat.id;
                updateFilterUI();
                applyFilterAndRender();
            });

            elements.filterBar.appendChild(btn);
        });
    }

    function updateFilterUI() {
        document.querySelectorAll('.filter-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.currentCategory);
        });
    }

    // Filter & Render Ensaios Grid (Home Cards)
    function applyFilterAndRender() {
        if (state.currentCategory === 'all') {
            state.filteredEnsaios = [...PORTFOLIO_DATA.ensaios];
        } else {
            state.filteredEnsaios = PORTFOLIO_DATA.ensaios.filter(
                item => item.category === state.currentCategory
            );
        }

        renderEnsaiosGrid();
    }

    function renderEnsaiosGrid() {
        if (!elements.ensaiosGrid) return;
        elements.ensaiosGrid.innerHTML = '';

        state.filteredEnsaios.forEach(ensaio => {
            const card = document.createElement('div');
            card.className = 'ensaio-card';
            card.innerHTML = `
                <div class="ensaio-cover-wrapper">
                    <img src="${ensaio.cover}" alt="${ensaio.title}" class="ensaio-cover-img" loading="lazy" />
                    <div class="ensaio-card-overlay">
                        <span class="ensaio-cat-badge">${ensaio.categoryName}</span>
                        <h3 class="ensaio-title">${ensaio.title}</h3>
                        <div class="ensaio-meta-row">
                            <span>${ensaio.photoCount} Fotografias</span>
                            <span class="btn-open-ensaio">Ver Ensaio Completo ↗</span>
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener('mouseenter', () => window.setCursorHover && window.setCursorHover('VER ENSAIO'));
            card.addEventListener('mouseleave', () => window.setCursorHover && window.setCursorHover(null));
            card.addEventListener('click', () => {
                if (window.setCursorHover) window.setCursorHover(null);
                openAlbumModal(ensaio);
            });
            elements.ensaiosGrid.appendChild(card);
        });
    }

    // Open Album Viewer Modal & Render Editorial Credits
    function openAlbumModal(ensaio) {
        state.currentAlbumPhotos = ensaio.photos;
        elements.albumModalTitle.textContent = ensaio.title;
        elements.albumModalCategory.textContent = ensaio.categoryName;

        // Render Editorial Credits Box
        if (elements.albumModalCredits) {
            const credits = ensaio.credits || {
                year: "2026",
                client: "Coleção Editorial / Autoral",
                location: "Estúdio & Externa • Rio Verde, GO",
                styling: "Mariana Souza / Direção de Arte",
                beauty: "Beleza Editorial Concept",
                concept: `Ensaio ${ensaio.categoryName} focado em alta resolução, iluminação técnica rigorosa e estética contemporânea.`
            };

            const waMsg = encodeURIComponent(`Olá João Felipe! Estava navegando no seu site e gostaria de solicitar um orçamento referente ao ensaio "${ensaio.title}" (${ensaio.categoryName}).`);
            const waUrl = `https://wa.me/5511999999999?text=${waMsg}`;

            elements.albumModalCredits.innerHTML = `
                <div class="credits-header">
                    <span class="credits-title-badge">Ficha Técnica Editorial</span>
                    <span class="credits-year-tag">Ano: ${credits.year}</span>
                </div>
                <div class="credits-grid">
                    <div class="credit-item">
                        <span class="credit-label">Projeto / Cliente</span>
                        <span class="credit-value">${credits.client}</span>
                    </div>
                    <div class="credit-item">
                        <span class="credit-label">Localização</span>
                        <span class="credit-value">${credits.location}</span>
                    </div>
                    <div class="credit-item">
                        <span class="credit-label">Styling & Figurino</span>
                        <span class="credit-value">${credits.styling}</span>
                    </div>
                    <div class="credit-item">
                        <span class="credit-label">Beleza & Cabelo</span>
                        <span class="credit-value">${credits.beauty}</span>
                    </div>
                </div>
                <div class="credits-actions">
                    <p class="credits-description">${credits.concept}</p>
                    <a href="${waUrl}" target="_blank" rel="noopener" class="btn-credits-wa">
                        <span>💬 Agendar Ensaio Similar</span>
                    </a>
                </div>
            `;
        }

        elements.albumPhotosGrid.innerHTML = '';

        ensaio.photos.forEach((photo, index) => {
            const isWide = (index % 5 === 0);
            const gridItem = document.createElement('div');
            gridItem.className = `grid-item ${isWide ? 'mosaic-wide' : 'mosaic-half'}`;
            gridItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
                <div class="item-overlay">
                    <div class="item-info">
                        <span class="item-category-tag">${photo.categoryName}</span>
                        <h4 class="item-title-text">${photo.title}</h4>
                    </div>
                </div>
            `;

            gridItem.addEventListener('mouseenter', () => window.setCursorHover && window.setCursorHover('ZOOM'));
            gridItem.addEventListener('mouseleave', () => window.setCursorHover && window.setCursorHover(null));
            gridItem.addEventListener('click', () => {
                if (window.setCursorHover) window.setCursorHover(null);
                openLightbox(index);
            });
            elements.albumPhotosGrid.appendChild(gridItem);
        });

        elements.albumModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (elements.closeAlbumModalBtn) {
        elements.closeAlbumModalBtn.addEventListener('click', () => {
            elements.albumModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Render Testimonials
    function renderTestimonials() {
        if (!elements.testimonialsGrid || !PORTFOLIO_DATA.testimonials) return;
        elements.testimonialsGrid.innerHTML = '';

        PORTFOLIO_DATA.testimonials.forEach(t => {
            const card = document.createElement('div');
            card.style.cssText = 'background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 2rem; border-radius: 6px;';
            card.innerHTML = `
                <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-style: italic;">"${t.text}"</p>
                <div>
                    <h4 style="font-size: 1rem; font-weight: 700;">${t.name}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em;">${t.role}</span>
                </div>
            `;
            elements.testimonialsGrid.appendChild(card);
        });
    }

    // Enhanced Fullscreen Lightbox Logic
    const lightboxState = {
        isZoomed: false,
        isInfoOpen: true
    };

    function openLightbox(index) {
        state.lightboxIndex = index;
        lightboxState.isZoomed = false;
        elements.lightboxImg.classList.remove('zoomed');
        updateLightboxContent();
        elements.lightbox.classList.add('active');
        elements.lightbox.focus();
    }

    function closeLightbox() {
        elements.lightbox.classList.remove('active');
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    function updateLightboxContent() {
        const item = state.currentAlbumPhotos[state.lightboxIndex];
        if (!item) return;

        elements.lightboxImg.src = item.src;
        elements.lightboxTitle.textContent = item.title;
        elements.lightboxCategory.textContent = item.categoryName;
        
        const sidebarTitle = document.getElementById('sidebarTitle');
        const sidebarCategory = document.getElementById('sidebarCategory');
        const sidebarDesc = document.getElementById('sidebarDescription');
        const sidebarTags = document.getElementById('sidebarTags');

        if (sidebarTitle) sidebarTitle.textContent = item.title;
        if (sidebarCategory) sidebarCategory.textContent = item.categoryName;
        if (sidebarDesc) sidebarDesc.textContent = item.description || "Produção fotográfica autoral por João Felipe.";
        
        if (sidebarTags) {
            sidebarTags.innerHTML = '';
            const tags = item.tags || [item.categoryName, "Editorial", "João Felipe"];
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'sidebar-tag';
                span.textContent = `#${tag}`;
                sidebarTags.appendChild(span);
            });
        }

        elements.lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.currentAlbumPhotos.length}`;

        const msg = encodeURIComponent(`Olá João! Tenho interesse no ensaio "${item.title}" (${item.categoryName}).`);
        elements.lightboxShareWa.href = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${msg}`;
    }

    function nextLightbox() {
        state.lightboxIndex = (state.lightboxIndex + 1) % state.currentAlbumPhotos.length;
        lightboxState.isZoomed = false;
        elements.lightboxImg.classList.remove('zoomed');
        updateLightboxContent();
    }

    function prevLightbox() {
        state.lightboxIndex = (state.lightboxIndex - 1 + state.currentAlbumPhotos.length) % state.currentAlbumPhotos.length;
        lightboxState.isZoomed = false;
        elements.lightboxImg.classList.remove('zoomed');
        updateLightboxContent();
    }

    function toggleZoom() {
        lightboxState.isZoomed = !lightboxState.isZoomed;
        elements.lightboxImg.classList.toggle('zoomed', lightboxState.isZoomed);
    }

    function toggleInfoSidebar() {
        const sidebar = document.getElementById('lightboxSidebar');
        if (sidebar) {
            lightboxState.isInfoOpen = !lightboxState.isInfoOpen;
            sidebar.classList.toggle('active', lightboxState.isInfoOpen);
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            elements.lightbox.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    }

    if (elements.lightboxClose) elements.lightboxClose.addEventListener('click', closeLightbox);
    if (elements.lightboxNext) elements.lightboxNext.addEventListener('click', nextLightbox);
    if (elements.lightboxPrev) elements.lightboxPrev.addEventListener('click', prevLightbox);
    if (elements.lightboxImg) elements.lightboxImg.addEventListener('click', toggleZoom);

    const zoomBtn = document.getElementById('lightboxZoomBtn');
    const infoBtn = document.getElementById('lightboxInfoBtn');
    const fsBtn = document.getElementById('lightboxFullscreenBtn');

    if (zoomBtn) zoomBtn.addEventListener('click', toggleZoom);
    if (infoBtn) infoBtn.addEventListener('click', toggleInfoSidebar);
    if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);

    window.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;
        
        const key = e.key.toLowerCase();
        if (key === 'escape') closeLightbox();
        if (key === 'arrowright') nextLightbox();
        if (key === 'arrowleft') prevLightbox();
        if (key === 'z') toggleZoom();
        if (key === 'i') toggleInfoSidebar();
        if (key === 'f') toggleFullscreen();
    });

    // Theme Switcher Logic
    function updateThemeIcon() {
        if (!elements.themeToggleBtn) return;
        elements.themeToggleBtn.textContent = state.theme === 'dark' ? '☀️' : '🌙';
    }

    if (elements.themeToggleBtn) {
        elements.themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
            updateThemeIcon();
        });
    }

    // Modal Handlers
    elements.openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', () => {
            elements.contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (elements.budgetForm) {
        elements.budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('inputName').value;
            const category = document.getElementById('selectCategory').value;
            const msgText = document.getElementById('inputMessage').value;

            const text = `Olá João Felipe! Meu nome é ${name}. Gostaria de solicitar um orçamento para ensaio de *${category}*.\n\nMensagem: ${msgText}`;
            const waUrl = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${encodeURIComponent(text)}`;
            
            window.open(waUrl, '_blank');
            elements.contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Client Portal Handlers (Private Galleries)
    elements.openClientPortalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            elements.clientPortalModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (elements.closeClientModalBtn) {
        elements.closeClientModalBtn.addEventListener('click', () => {
            elements.clientPortalModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    const closePrivateBtn = document.getElementById('closePrivateGalleryBtn');
    const privateModal = document.getElementById('privateGalleryModal');

    if (closePrivateBtn && privateModal) {
        closePrivateBtn.addEventListener('click', () => {
            privateModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (elements.clientPortalForm) {
        let selectedPhotoTitles = new Set();

        elements.clientPortalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('clientCode').value.trim().toUpperCase();
            
            const clientGallery = PORTFOLIO_DATA.clientGalleries.find(g => g.code.toUpperCase() === code);

            if (clientGallery) {
                elements.clientPortalModal.classList.remove('active');
                selectedPhotoTitles.clear();
                
                document.getElementById('privateClientName').textContent = clientGallery.clientName.toUpperCase();
                document.getElementById('privateGalleryTitle').textContent = clientGallery.title;
                document.getElementById('privateDownloadBtn').href = clientGallery.downloadUrl || '#';
                
                const selectedCountElem = document.getElementById('selectedPhotoCount');
                if (selectedCountElem) selectedCountElem.textContent = '0';

                const grid = document.getElementById('privatePhotosGrid');
                grid.innerHTML = '';

                clientGallery.photos.forEach((photo, index) => {
                    const gridItem = document.createElement('div');
                    gridItem.className = 'grid-item';
                    gridItem.innerHTML = `
                        <img src="${photo.src}" alt="${photo.title}" loading="lazy" />
                        <button class="fav-btn" style="position:absolute; top:10px; right:10px; z-index:10; background:rgba(0,0,0,0.6); border:none; color:#fff; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:1rem; transition:transform 0.2s;" title="Favoritar Foto">🤍</button>
                        <div class="item-overlay">
                            <div class="item-info">
                                <span class="item-category-tag">Ensaio Privado</span>
                                <h4 class="item-title-text">${photo.title}</h4>
                            </div>
                        </div>
                    `;

                    const favBtn = gridItem.querySelector('.fav-btn');
                    favBtn.addEventListener('click', (evt) => {
                        evt.stopPropagation();
                        if (selectedPhotoTitles.has(photo.title)) {
                            selectedPhotoTitles.delete(photo.title);
                            favBtn.textContent = '🤍';
                            favBtn.style.transform = 'scale(1)';
                        } else {
                            selectedPhotoTitles.add(photo.title);
                            favBtn.textContent = '❤️';
                            favBtn.style.transform = 'scale(1.25)';
                        }
                        if (selectedCountElem) selectedCountElem.textContent = selectedPhotoTitles.size;
                    });

                    gridItem.addEventListener('click', () => {
                        state.currentAlbumPhotos = clientGallery.photos;
                        openLightbox(index);
                    });

                    grid.appendChild(gridItem);
                });

                // Handler para enviar seleção via WhatsApp
                const sendWaBtn = document.getElementById('sendSelectionWaBtn');
                if (sendWaBtn) {
                    sendWaBtn.onclick = () => {
                        if (selectedPhotoTitles.size === 0) {
                            alert('Você ainda não selecionou nenhuma foto! Clique no coração 🤍 das fotos para escolher.');
                            return;
                        }
                        const listStr = Array.from(selectedPhotoTitles).map(t => `• ${t}`).join('\n');
                        const text = `Olá João Felipe! Sou ${clientGallery.clientName} e finalizei a seleção de ${selectedPhotoTitles.size} fotos do meu ensaio "${clientGallery.title}":\n\n${listStr}\n\nAguardando o próximo passo!`;
                        const waUrl = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${encodeURIComponent(text)}`;
                        window.open(waUrl, '_blank');
                    };
                }

                privateModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                alert(`Senha incorreta ("${code}"). Dica de demonstração: tente usar a senha JOAO2026, GESTAO2026 ou FASHION2026.`);
            }
        });
    }

    // Initial Exec
    renderFilters();
    renderTestimonials();
    applyFilterAndRender();
});
