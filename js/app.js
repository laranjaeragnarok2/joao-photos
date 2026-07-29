/* ==========================================================================
   JOÃO FELIPE PHOTOS - APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const state = {
        currentCategory: 'all',
        selectedTag: 'all',
        itemsPerPage: 20,
        currentPage: 1,
        filteredItems: [],
        lightboxIndex: 0,
        theme: localStorage.getItem('theme') || 'light'
    };

    const elements = {
        filterBar: document.getElementById('filterBar'),
        tagFilterBar: document.getElementById('tagFilterBar'),
        portfolioGrid: document.getElementById('portfolioGrid'),
        testimonialsGrid: document.getElementById('testimonialsGrid'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        loadMoreWrap: document.getElementById('loadMoreWrap'),
        themeToggleBtn: document.getElementById('themeToggleBtn'),
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
        clientPortalForm: document.getElementById('clientPortalForm')
    };

    // Initialize Theme
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();

    // Render Filter Pills (Categories & Tags)
    function renderFilters() {
        if (!elements.filterBar) return;
        elements.filterBar.innerHTML = '';

        PORTFOLIO_DATA.categories.forEach(cat => {
            let count = 0;
            if (cat.id === 'all') {
                count = PORTFOLIO_DATA.items.length;
            } else {
                count = PORTFOLIO_DATA.items.filter(item => item.categoryId === cat.id).length;
            }

            const btn = document.createElement('button');
            btn.className = `filter-pill ${cat.id === state.currentCategory ? 'active' : ''}`;
            btn.dataset.category = cat.id;
            btn.textContent = `${cat.name} (${count})`;

            btn.addEventListener('click', () => {
                state.currentCategory = cat.id;
                state.selectedTag = 'all';
                state.currentPage = 1;
                updateFilterUI();
                applyFilterAndRender();
            });

            elements.filterBar.appendChild(btn);
        });

        // Render Tag Filters
        if (elements.tagFilterBar && PORTFOLIO_DATA.tags) {
            elements.tagFilterBar.innerHTML = '';
            
            const allTagBtn = document.createElement('button');
            allTagBtn.className = `sidebar-tag ${state.selectedTag === 'all' ? 'active' : ''}`;
            allTagBtn.style.cursor = 'pointer';
            allTagBtn.textContent = 'Todas as Tags';
            allTagBtn.addEventListener('click', () => {
                state.selectedTag = 'all';
                updateFilterUI();
                applyFilterAndRender();
            });
            elements.tagFilterBar.appendChild(allTagBtn);

            PORTFOLIO_DATA.tags.forEach(tag => {
                const tagBtn = document.createElement('button');
                tagBtn.className = `sidebar-tag ${state.selectedTag === tag ? 'active' : ''}`;
                tagBtn.style.cursor = 'pointer';
                tagBtn.textContent = `#${tag}`;

                tagBtn.addEventListener('click', () => {
                    state.selectedTag = tag;
                    state.currentPage = 1;
                    updateFilterUI();
                    applyFilterAndRender();
                });

                elements.tagFilterBar.appendChild(tagBtn);
            });
        }
    }

    function updateFilterUI() {
        document.querySelectorAll('.filter-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.currentCategory);
        });
    }

    // Filter & Render 2-Column Seamless Grid
    function applyFilterAndRender() {
        let items = [...PORTFOLIO_DATA.items];

        if (state.currentCategory !== 'all') {
            items = items.filter(item => item.categoryId === state.currentCategory);
        }

        if (state.selectedTag !== 'all') {
            items = items.filter(item => item.tags && item.tags.includes(state.selectedTag));
        }

        state.filteredItems = items;
        renderGrid(true);
    }

    function renderGrid(reset = false) {
        if (!elements.portfolioGrid) return;
        
        if (reset) {
            elements.portfolioGrid.innerHTML = '';
        }

        const startIndex = 0;
        const endIndex = state.currentPage * state.itemsPerPage;
        const visibleItems = state.filteredItems.slice(startIndex, endIndex);

        elements.portfolioGrid.innerHTML = '';

        visibleItems.forEach((item, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.dataset.id = item.id;

            const sameCategoryPhotos = state.filteredItems.filter(i => i.categoryId === item.categoryId && i.id !== item.id);
            const altPhotoSrc = sameCategoryPhotos.length > 0 ? sameCategoryPhotos[index % sameCategoryPhotos.length].src : item.src;

            gridItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy" class="main-thumb" data-original="${item.src}" data-alt="${altPhotoSrc}" />
                
                <div class="item-overlay">
                    <div class="item-info">
                        <span class="item-category-tag">${item.categoryName}</span>
                        <h4 class="item-title-text">${item.title}</h4>
                    </div>
                </div>

                <div class="mobile-caption">
                    <h4 class="mobile-caption-title">${item.title}</h4>
                    <span class="mobile-caption-cat">${item.categoryName}</span>
                </div>
            `;

            // Hover thumbnail switch animation
            const imgEl = gridItem.querySelector('.main-thumb');
            gridItem.addEventListener('mouseenter', () => {
                const altSrc = imgEl.dataset.alt;
                if (altSrc && altSrc !== imgEl.src) {
                    imgEl.style.opacity = '0.7';
                    setTimeout(() => {
                        imgEl.src = altSrc;
                        imgEl.style.opacity = '1';
                    }, 120);
                }
            });

            gridItem.addEventListener('mouseleave', () => {
                const origSrc = imgEl.dataset.original;
                if (origSrc && imgEl.src !== origSrc) {
                    imgEl.style.opacity = '0.7';
                    setTimeout(() => {
                        imgEl.src = origSrc;
                        imgEl.style.opacity = '1';
                    }, 120);
                }
            });

            gridItem.addEventListener('click', () => openLightbox(index));
            elements.portfolioGrid.appendChild(gridItem);
        });

        // Load More Visibility
        if (elements.loadMoreWrap) {
            if (endIndex < state.filteredItems.length) {
                elements.loadMoreWrap.style.display = 'flex';
            } else {
                elements.loadMoreWrap.style.display = 'none';
            }
        }
    }

    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            state.currentPage++;
            renderGrid(false);
        });
    }

    // Render Testimonials Section
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

    // Enhanced Web & Desktop Lightbox Logic
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
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        elements.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }

    function updateLightboxContent() {
        const item = state.filteredItems[state.lightboxIndex];
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

        elements.lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.filteredItems.length}`;

        const msg = encodeURIComponent(`Olá João! Tenho interesse no ensaio "${item.title}" (${item.categoryName}).`);
        elements.lightboxShareWa.href = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${msg}`;
    }

    function nextLightbox() {
        state.lightboxIndex = (state.lightboxIndex + 1) % state.filteredItems.length;
        lightboxState.isZoomed = false;
        elements.lightboxImg.classList.remove('zoomed');
        updateLightboxContent();
    }

    function prevLightbox() {
        state.lightboxIndex = (state.lightboxIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
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

    // Modal Handlers (Budget & Client Portal)
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

    // Client Portal Handlers
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

    if (elements.clientPortalForm) {
        elements.clientPortalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('clientCode').value;
            alert(`Acessando a galeria privada com o código ${code}... Por favor, consulte o fotógrafo para o link direto de download das suas imagens.`);
            elements.clientPortalModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Initial Exec
    renderFilters();
    renderTestimonials();
    applyFilterAndRender();
});
