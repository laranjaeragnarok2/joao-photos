/* ==========================================================================
   JOÃO FELIPE PHOTOS - APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. App State
    const state = {
        currentCategory: 'all',
        itemsPerPage: 24,
        currentPage: 1,
        filteredItems: [],
        lightboxIndex: 0,
        theme: localStorage.getItem('theme') || 'dark'
    };

    // 2. DOM Elements
    const elements = {
        filterBar: document.getElementById('filterBar'),
        masonryGrid: document.getElementById('masonryGrid'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        loadMoreContainer: document.getElementById('loadMoreContainer'),
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
        openContactBtns: document.querySelectorAll('.open-contact-btn'),
        closeContactBtn: document.getElementById('closeContactBtn'),
        budgetForm: document.getElementById('budgetForm')
    };

    // 3. Initialize Theme
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();

    // 4. Render Filter Pills
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
            btn.className = `filter-btn ${cat.id === state.currentCategory ? 'active' : ''}`;
            btn.dataset.category = cat.id;
            btn.innerHTML = `${cat.name} <span class="filter-count">(${count})</span>`;

            btn.addEventListener('click', () => {
                state.currentCategory = cat.id;
                state.currentPage = 1;
                updateFilterUI();
                applyFilterAndRender();
            });

            elements.filterBar.appendChild(btn);
        });
    }

    function updateFilterUI() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.currentCategory);
        });
    }

    // 5. Filter & Render Masonry Items
    function applyFilterAndRender() {
        if (state.currentCategory === 'all') {
            state.filteredItems = [...PORTFOLIO_DATA.items];
        } else {
            state.filteredItems = PORTFOLIO_DATA.items.filter(
                item => item.categoryId === state.currentCategory
            );
        }

        renderGrid(true);
    }

    function renderGrid(reset = false) {
        if (!elements.masonryGrid) return;
        
        if (reset) {
            elements.masonryGrid.innerHTML = '';
        }

        const startIndex = 0;
        const endIndex = state.currentPage * state.itemsPerPage;
        const visibleItems = state.filteredItems.slice(startIndex, endIndex);

        elements.masonryGrid.innerHTML = '';

        visibleItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.innerHTML = `
                <div class="gallery-img-wrapper">
                    <img src="${item.src}" alt="${item.title}" loading="lazy" />
                    <div class="card-overlay">
                        <span class="card-tag">${item.categoryName}</span>
                        <h4 class="card-title">${item.title}</h4>
                        <div class="card-zoom-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openLightbox(index));
            elements.masonryGrid.appendChild(card);
        });

        // Toggle "Carregar Mais" Button
        if (elements.loadMoreContainer) {
            if (endIndex < state.filteredItems.length) {
                elements.loadMoreContainer.style.display = 'flex';
            } else {
                elements.loadMoreContainer.style.display = 'none';
            }
        }
    }

    // Load More Handler
    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', () => {
            state.currentPage++;
            renderGrid(false);
        });
    }

    // 6. Lightbox Handler
    function openLightbox(index) {
        state.lightboxIndex = index;
        updateLightboxContent();
        elements.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        elements.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = state.filteredItems[state.lightboxIndex];
        if (!item) return;

        elements.lightboxImg.src = item.src;
        elements.lightboxTitle.textContent = item.title;
        elements.lightboxCategory.textContent = item.categoryName;
        elements.lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.filteredItems.length}`;

        // Share Link
        const msg = encodeURIComponent(`Olá João! Vi a foto "${item.title}" no seu portfólio e gostaria de saber mais.`);
        elements.lightboxShareWa.href = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${msg}`;
    }

    function nextLightbox() {
        state.lightboxIndex = (state.lightboxIndex + 1) % state.filteredItems.length;
        updateLightboxContent();
    }

    function prevLightbox() {
        state.lightboxIndex = (state.lightboxIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
        updateLightboxContent();
    }

    if (elements.lightboxClose) elements.lightboxClose.addEventListener('click', closeLightbox);
    if (elements.lightboxNext) elements.lightboxNext.addEventListener('click', nextLightbox);
    if (elements.lightboxPrev) elements.lightboxPrev.addEventListener('click', prevLightbox);

    // Keyboard Navigation for Lightbox
    window.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    // 7. Theme Switcher Handler
    function updateThemeIcon() {
        if (!elements.themeToggleBtn) return;
        const isDark = state.theme === 'dark';
        elements.themeToggleBtn.innerHTML = isDark ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
        `;
    }

    if (elements.themeToggleBtn) {
        elements.themeToggleBtn.addEventListener('click', () => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
            updateThemeIcon();
        });
    }

    // 8. Contact & Budget Modal Logic
    elements.openContactBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    if (elements.closeContactBtn) {
        elements.closeContactBtn.addEventListener('click', () => {
            elements.contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (elements.budgetForm) {
        elements.budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('inputName').value;
            const category = document.getElementById('selectCategory').value;
            const date = document.getElementById('inputDate').value;
            const msgText = document.getElementById('inputMessage').value;

            const text = `Olá João Felipe! Meu nome é ${name}. Gostaria de orçamento para ensaio de *${category}*${date ? ' previsto para ' + date : ''}.\n\nMensagem: ${msgText}`;
            const waUrl = `https://wa.me/${PORTFOLIO_DATA.photographer.whatsapp}?text=${encodeURIComponent(text)}`;
            
            window.open(waUrl, '_blank');
            elements.contactModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // 9. Initial Load
    renderFilters();
    applyFilterAndRender();
});
