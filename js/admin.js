/* ==========================================================================
   ADMIN DASHBOARD LOGIC — ENSAIOS & GROUP-CENTRIC MANAGEMENT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let localData = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
    let activeEnsaioId = null;

    const elements = {
        tabs: document.querySelectorAll('.admin-tab'),
        tabPanels: document.querySelectorAll('.tab-panel'),
        adminEnsaiosGrid: document.getElementById('adminEnsaiosGrid'),
        totalEnsaiosCount: document.getElementById('totalEnsaiosCount'),
        adminSearchInput: document.getElementById('adminSearchInput'),
        adminCatFilter: document.getElementById('adminCatFilter'),
        addEnsaioForm: document.getElementById('addEnsaioForm'),
        copyForm: document.getElementById('copyForm'),
        exportBtn: document.getElementById('exportBtn'),
        manageEnsaioModal: document.getElementById('manageEnsaioModal'),
        closeManageEnsaioModal: document.getElementById('closeManageEnsaioModal'),
        ensaioMetaForm: document.getElementById('ensaioMetaForm'),
        deleteEnsaioBtn: document.getElementById('deleteEnsaioBtn'),
        addPhotoToEnsaioForm: document.getElementById('addPhotoToEnsaioForm'),
        modalEnsaioPhotosGrid: document.getElementById('modalEnsaioPhotosGrid'),
        modalEnsaioTitleHeader: document.getElementById('modalEnsaioTitleHeader'),
        modalEnsaioPhotoCount: document.getElementById('modalEnsaioPhotoCount')
    };

    // 1. Tab Switcher
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            elements.tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.dataset.tab;
            const panel = document.getElementById(target);
            if (panel) panel.classList.add('active');
        });
    });

    // 2. Render Ensaios Grid (Groups View)
    function renderAdminEnsaiosGrid() {
        if (!elements.adminEnsaiosGrid) return;
        elements.adminEnsaiosGrid.innerHTML = '';

        const searchTerm = elements.adminSearchInput ? elements.adminSearchInput.value.toLowerCase().trim() : '';
        const selectedCat = elements.adminCatFilter ? elements.adminCatFilter.value : 'all';

        const filtered = localData.ensaios.filter(ensaio => {
            const matchesCat = selectedCat === 'all' || ensaio.category === selectedCat;
            const matchesSearch = !searchTerm ||
                ensaio.title.toLowerCase().includes(searchTerm) ||
                ensaio.id.toLowerCase().includes(searchTerm) ||
                (ensaio.credits && ensaio.credits.client && ensaio.credits.client.toLowerCase().includes(searchTerm));
            return matchesCat && matchesSearch;
        });

        if (elements.totalEnsaiosCount) {
            elements.totalEnsaiosCount.textContent = localData.ensaios.length;
        }

        filtered.forEach(ensaio => {
            const count = ensaio.photos ? ensaio.photos.length : (ensaio.photoCount || 0);
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.innerHTML = `
                <span class="admin-card-count">${count} Fotos</span>
                <div class="admin-card-img">
                    <img src="${ensaio.cover}" alt="${ensaio.title}" loading="lazy" />
                </div>
                <div class="admin-card-body">
                    <span class="admin-card-cat">${ensaio.categoryName || ensaio.category}</span>
                    <h4 class="admin-card-title">${ensaio.title}</h4>
                    <button class="admin-card-btn" onclick="openManageEnsaioModal('${ensaio.id}')">⚡ Gerenciar Grupo</button>
                </div>
            `;
            elements.adminEnsaiosGrid.appendChild(card);
        });
    }

    if (elements.adminSearchInput) elements.adminSearchInput.addEventListener('input', renderAdminEnsaiosGrid);
    if (elements.adminCatFilter) elements.adminCatFilter.addEventListener('change', renderAdminEnsaiosGrid);

    // 3. Manage Ensaio Modal Handler
    window.openManageEnsaioModal = function(ensaioId) {
        const ensaio = localData.ensaios.find(e => e.id === ensaioId);
        if (!ensaio) return;

        activeEnsaioId = ensaioId;
        elements.modalEnsaioTitleHeader.textContent = ensaio.title;

        // Fill Form Metadata
        document.getElementById('editEnsaioTitle').value = ensaio.title || '';
        document.getElementById('editEnsaioCat').value = ensaio.category || 'fashion';
        document.getElementById('editEnsaioCover').value = ensaio.cover || '';

        const credits = ensaio.credits || {};
        document.getElementById('editEnsaioYear').value = credits.year || '2026';
        document.getElementById('editEnsaioClient').value = credits.client || '';
        document.getElementById('editEnsaioLocation').value = credits.location || 'Rio Verde, GO';
        document.getElementById('editEnsaioStyling').value = credits.styling || '';
        document.getElementById('editEnsaioBeauty').value = credits.beauty || '';
        document.getElementById('editEnsaioConcept').value = credits.concept || '';

        renderEnsaioPhotosInsideModal(ensaio);
        elements.manageEnsaioModal.classList.add('active');
    };

    function renderEnsaioPhotosInsideModal(ensaio) {
        if (!elements.modalEnsaioPhotosGrid) return;
        elements.modalEnsaioPhotosGrid.innerHTML = '';

        const photos = ensaio.photos || [];
        if (elements.modalEnsaioPhotoCount) {
            elements.modalEnsaioPhotoCount.textContent = photos.length;
        }

        photos.forEach((photo, idx) => {
            const isCover = photo.src === ensaio.cover;
            const itemCard = document.createElement('div');
            itemCard.className = `photo-card-item ${isCover ? 'is-cover' : ''}`;
            itemCard.innerHTML = `
                ${isCover ? '<span class="cover-badge-tag">⭐️ Capa Atual</span>' : ''}
                <div style="aspect-ratio: 4/3; overflow: hidden; background: #222;">
                    <img src="${photo.src}" alt="${photo.title}" style="width:100%; height:100%; object-fit:cover;" />
                </div>
                <div style="padding: 0.6rem; display:flex; flex-direction:column; gap:0.4rem;">
                    <span style="font-size:0.75rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${photo.title || 'Foto #' + (idx+1)}</span>
                    <div style="display:flex; gap:0.3rem; margin-top:0.2rem;">
                        ${!isCover ? `<button type="button" class="admin-card-btn" style="font-size:0.65rem; padding:0.25rem;" onclick="setAsCover('${photo.src}')">Tornar Capa</button>` : ''}
                        <button type="button" class="btn-danger" style="font-size:0.65rem; padding:0.25rem;" onclick="removePhotoFromEnsaio(${idx})">Excluir</button>
                    </div>
                </div>
            `;
            elements.modalEnsaioPhotosGrid.appendChild(itemCard);
        });

        // Initialize SortableJS for Drag and Drop Reordering
        if (typeof Sortable !== 'undefined' && elements.modalEnsaioPhotosGrid) {
            if (elements.sortableInstance) elements.sortableInstance.destroy();
            elements.sortableInstance = new Sortable(elements.modalEnsaioPhotosGrid, {
                animation: 150,
                onEnd: function (evt) {
                    if (evt.oldIndex !== undefined && evt.newIndex !== undefined) {
                        const movedItem = ensaio.photos.splice(evt.oldIndex, 1)[0];
                        ensaio.photos.splice(evt.newIndex, 0, movedItem);
                    }
                }
            });
        }
    }

    window.setAsCover = function(srcUrl) {
        const ensaio = localData.ensaios.find(e => e.id === activeEnsaioId);
        if (ensaio) {
            ensaio.cover = srcUrl;
            document.getElementById('editEnsaioCover').value = srcUrl;
            renderEnsaioPhotosInsideModal(ensaio);
            renderAdminEnsaiosGrid();
        }
    };

    window.removePhotoFromEnsaio = function(photoIndex) {
        const ensaio = localData.ensaios.find(e => e.id === activeEnsaioId);
        if (ensaio && ensaio.photos) {
            if (confirm('Tem certeza que deseja remover esta foto do ensaio?')) {
                ensaio.photos.splice(photoIndex, 1);
                ensaio.photoCount = ensaio.photos.length;
                renderEnsaioPhotosInsideModal(ensaio);
                renderAdminEnsaiosGrid();
            }
        }
    };

    if (elements.closeManageEnsaioModal) {
        elements.closeManageEnsaioModal.addEventListener('click', () => {
            elements.manageEnsaioModal.classList.remove('active');
        });
    }

    // Submit Ficha Técnica
    if (elements.ensaioMetaForm) {
        elements.ensaioMetaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ensaio = localData.ensaios.find(e => e.id === activeEnsaioId);
            if (ensaio) {
                ensaio.title = document.getElementById('editEnsaioTitle').value;
                ensaio.category = document.getElementById('editEnsaioCat').value;
                const catObj = localData.categories.find(c => c.id === ensaio.category);
                ensaio.categoryName = catObj ? catObj.name : ensaio.category;
                ensaio.cover = document.getElementById('editEnsaioCover').value;

                ensaio.credits = {
                    year: document.getElementById('editEnsaioYear').value,
                    client: document.getElementById('editEnsaioClient').value,
                    location: document.getElementById('editEnsaioLocation').value,
                    styling: document.getElementById('editEnsaioStyling').value,
                    beauty: document.getElementById('editEnsaioBeauty').value,
                    concept: document.getElementById('editEnsaioConcept').value
                };

                renderAdminEnsaiosGrid();
                alert('Ficha Técnica e configurações do ensaio salvas com sucesso!');
            }
        });
    }

    // Add Photo inline to active Ensaio
    if (elements.addPhotoToEnsaioForm) {
        elements.addPhotoToEnsaioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const ensaio = localData.ensaios.find(e => e.id === activeEnsaioId);
            if (ensaio) {
                const src = document.getElementById('newPhotoInEnsaioUrl').value;
                const title = document.getElementById('newPhotoInEnsaioTitle').value || `${ensaio.title} — Nova Foto`;

                if (!ensaio.photos) ensaio.photos = [];

                ensaio.photos.unshift({
                    id: Date.now(),
                    src: src,
                    title: title,
                    categoryId: ensaio.category,
                    categoryName: ensaio.categoryName,
                    albumId: ensaio.id,
                    albumTitle: ensaio.title
                });
                ensaio.photoCount = ensaio.photos.length;

                elements.addPhotoToEnsaioForm.reset();
                renderEnsaioPhotosInsideModal(ensaio);
                renderAdminEnsaiosGrid();
            }
        });
    }

    // Delete Ensaio Entirely
    if (elements.deleteEnsaioBtn) {
        elements.deleteEnsaioBtn.addEventListener('click', () => {
            if (confirm(`Tem certeza que deseja excluir o ensaio "${activeEnsaioId}" e todo o seu acervo?`)) {
                localData.ensaios = localData.ensaios.filter(e => e.id !== activeEnsaioId);
                elements.manageEnsaioModal.classList.remove('active');
                renderAdminEnsaiosGrid();
            }
        });
    }

    // 4. Create New Ensaio Handler (Tab 2)
    if (elements.addEnsaioForm) {
        elements.addEnsaioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('newEnsaioTitle').value;
            const category = document.getElementById('newEnsaioCat').value;
            const catObj = localData.categories.find(c => c.id === category);
            const cover = document.getElementById('newEnsaioCover').value;

            const year = document.getElementById('newEnsaioYear').value || '2026';
            const client = document.getElementById('newEnsaioClient').value || '';
            const styling = document.getElementById('newEnsaioStyling').value || '';
            const beauty = document.getElementById('newEnsaioBeauty').value || '';
            const concept = document.getElementById('newEnsaioConcept').value || '';

            const newId = `${category}_${Date.now()}`;

            const newEnsaio = {
                id: newId,
                title: title,
                category: category,
                categoryName: catObj ? catObj.name : category,
                cover: cover,
                photoCount: 1,
                credits: {
                    year: year,
                    client: client,
                    location: "Rio Verde, GO • Atendimento Brasil",
                    styling: styling,
                    beauty: beauty,
                    concept: concept
                },
                photos: [
                    {
                        id: Date.now(),
                        src: cover,
                        title: `${title} — Foto de Capa`,
                        categoryId: category,
                        categoryName: catObj ? catObj.name : category,
                        albumId: newId,
                        albumTitle: title
                    }
                ]
            };

            localData.ensaios.unshift(newEnsaio);
            alert(`Novo Ensaio "${title}" criado com sucesso!`);
            elements.addEnsaioForm.reset();

            // Switch to Tab 1
            elements.tabs[0].click();
            renderAdminEnsaiosGrid();
        });
    }

    // 5. Copy & Info Form Handler (Tab 3) - Inclui Foto do Fotógrafo
    const infoPortraitInput = document.getElementById('infoPortrait');
    const infoPortraitPreview = document.getElementById('infoPortraitPreview');

    if (elements.copyForm) {
        if (localData.photographer) {
            document.getElementById('infoName').value = localData.photographer.name || '';
            document.getElementById('infoRole').value = localData.photographer.role || '';
            document.getElementById('infoWhatsapp').value = localData.photographer.whatsapp || '';
            document.getElementById('infoEmail').value = localData.photographer.email || '';
            document.getElementById('infoBio').value = localData.photographer.bio || '';
            if (infoPortraitInput) {
                const photoUrl = localStorage.getItem('photographer_portrait') || localData.photographer.portrait || '';
                infoPortraitInput.value = photoUrl;
                if (infoPortraitPreview) infoPortraitPreview.src = photoUrl;
            }
        }

        if (infoPortraitInput && infoPortraitPreview) {
            infoPortraitInput.addEventListener('input', () => {
                infoPortraitPreview.src = infoPortraitInput.value;
            });
        }

        elements.copyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!localData.photographer) localData.photographer = {};

            localData.photographer.name = document.getElementById('infoName').value;
            localData.photographer.role = document.getElementById('infoRole').value;
            localData.photographer.whatsapp = document.getElementById('infoWhatsapp').value;
            localData.photographer.email = document.getElementById('infoEmail').value;
            localData.photographer.bio = document.getElementById('infoBio').value;
            
            if (infoPortraitInput) {
                localData.photographer.portrait = infoPortraitInput.value;
                localStorage.setItem('photographer_portrait', infoPortraitInput.value);
            }

            alert('Informações e foto do fotógrafo atualizadas com sucesso! A imagem já foi aplicada no site.');
        });
    }

    // 6. Testimonials Moderation Panel (Tab 4)
    function renderAdminTestimonials() {
        const listContainer = document.getElementById('adminTestimonialsList');
        const badge = document.getElementById('pendingTestimonialsBadge');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        const customTestimonials = JSON.parse(localStorage.getItem('custom_testimonials') || '[]');
        const defaultTestimonials = localData.testimonials || [];
        const allList = [...customTestimonials, ...defaultTestimonials];

        const pendingList = allList.filter(t => t.status === 'pending');
        if (badge) badge.textContent = pendingList.length;

        if (allList.length === 0) {
            listContainer.innerHTML = `<div style="padding:2rem; color:var(--text-muted); text-align:center;">Nenhum depoimento enviado até o momento.</div>`;
            return;
        }

        allList.forEach(item => {
            const card = document.createElement('div');
            const isPending = item.status === 'pending';
            card.style.cssText = `
                background: var(--bg-secondary);
                border: 1px solid ${isPending ? '#f59e0b' : 'var(--border-color)'};
                border-radius: 8px;
                padding: 1.2rem 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            `;

            const stars = '★'.repeat(item.rating || 5) + '☆'.repeat(5 - (item.rating || 5));

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:0.8rem;">
                        <img src="${item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" />
                        <div>
                            <h4 style="font-size:0.95rem; font-weight:700; margin:0;">${item.name}</h4>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${item.ensaio}</span>
                        </div>
                    </div>
                    <span style="font-size:0.75rem; padding:0.2rem 0.6rem; border-radius:4px; font-weight:600; ${isPending ? 'background:#fef3c7; color:#b45309;' : 'background:#dcfce7; color:#15803d;'}">
                        ${isPending ? '⏳ Pendente de Aprovação' : '✅ Aprovado'}
                    </span>
                </div>
                <p style="font-size:0.9rem; color:var(--text-secondary); margin:0; font-style:italic;">"${item.comment}"</p>
                <div style="display:flex; justify-content:space-between; align-items:center; pt-2; border-top:1px solid var(--border-color);">
                    <span style="color:#ffd700; font-size:0.9rem;">${stars}</span>
                    <div style="display:flex; gap:0.5rem;">
                        ${isPending ? `<button class="btn-approve-test btn-secondary" style="background:#16a34a; color:#fff; font-size:0.8rem; padding:0.3rem 0.8rem;">Aprovar ✅</button>` : ''}
                        <button class="btn-delete-test btn-secondary" style="color:#ef4444; font-size:0.8rem; padding:0.3rem 0.8rem;">Excluir 🗑️</button>
                    </div>
                </div>
            `;

            const approveBtn = card.querySelector('.btn-approve-test');
            if (approveBtn) {
                approveBtn.addEventListener('click', () => {
                    item.status = 'approved';
                    // Update in customTestimonials if present
                    const idx = customTestimonials.findIndex(t => t.id === item.id);
                    if (idx !== -1) {
                        customTestimonials[idx].status = 'approved';
                        localStorage.setItem('custom_testimonials', JSON.stringify(customTestimonials));
                    }
                    // Update in localData
                    if (!localData.testimonials) localData.testimonials = [];
                    if (!localData.testimonials.find(t => t.id === item.id)) {
                        localData.testimonials.push(item);
                    }
                    renderAdminTestimonials();
                    alert(`Depoimento de "${item.name}" foi aprovado com sucesso! Já está visível na página inicial.`);
                });
            }

            const deleteBtn = card.querySelector('.btn-delete-test');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    if (confirm(`Excluir o depoimento de "${item.name}"?`)) {
                        const updatedCustom = customTestimonials.filter(t => t.id !== item.id);
                        localStorage.setItem('custom_testimonials', JSON.stringify(updatedCustom));
                        if (localData.testimonials) {
                            localData.testimonials = localData.testimonials.filter(t => t.id !== item.id);
                        }
                        renderAdminTestimonials();
                    }
                });
            }

            listContainer.appendChild(card);
        });
    }

    // 7. Export portfolio_data.js
    if (elements.exportBtn) {
        elements.exportBtn.addEventListener('click', () => {
            // Include approved custom testimonials in export
            const customTestimonials = JSON.parse(localStorage.getItem('custom_testimonials') || '[]');
            const approvedCustom = customTestimonials.filter(t => t.status === 'approved');
            const defaultTestimonials = localData.testimonials || [];
            
            // Merge unique testimonials
            const mergedMap = new Map();
            [...defaultTestimonials, ...approvedCustom].forEach(t => mergedMap.set(t.id, t));
            localData.testimonials = Array.from(mergedMap.values());

            const fileContent = `const PORTFOLIO_DATA = ${JSON.stringify(localData, null, 4)};\n`;
            const blob = new Blob([fileContent], { type: 'text/javascript' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'portfolio_data.js';
            a.click();
        });
    }

    renderAdminEnsaiosGrid();
    renderAdminTestimonials();
});
