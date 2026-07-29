/* ==========================================================================
   JOÃO FELIPE PHOTOS - EDITORIAL OFF-WHITE APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Application State
    const state = {
        currentCategory: 'all',
        itemsPerPage: 20,
        currentPage: 1,
        filteredItems: [],
        lightboxIndex: 0,
        theme: localStorage.getItem('theme') || 'light' // Default to light
    };

    // 2. DOM Elements
    const elements = {
        filterBar: document.getElementById('filterBar'),
        portfolioGrid: document.getElementById('portfolioGrid'),
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
            btn.className = `filter-pill ${cat.id === state.currentCategory ? 'active' : ''}`;
            btn.dataset.category = cat.id;
            btn.textContent = `${cat.name} (${count})`;

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
        document.querySelectorAll('.filter-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === state.currentCategory);
        });
    }

    // 5. Filter & Render 2-Column Grid Items
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
            gridItem.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy" />
                <div class="item-overlay">
                    <div class="item-info">
                        <span class="item-category-tag">${item.categoryName}</span>
                        <h4 class="item-title-text">${item.title}</h4>
                    </div>
                </div>
            `;

            gridItem.addEventListener('click', () => openLightbox(index));
            elements.portfolioGrid.appendChild(gridItem);
        });

        // Load More Button Visibility
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

    // 6. Lightbox Modal Logic
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

        const msg = encodeURIComponent(`Olá João! Tenho interesse no trabalho "${item.title}" (${item.categoryName}).`);
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

    window.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    // 7. Theme Switcher Logic
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

    // 8. Contact Modal Logic
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

    // Initial Execution
    renderFilters();
    applyFilterAndRender();
});
