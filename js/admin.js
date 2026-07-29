/* ==========================================================================
   ADMIN DASHBOARD LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    let localData = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
    let editingPhotoId = null;

    const elements = {
        tabs: document.querySelectorAll('.admin-tab'),
        tabPanels: document.querySelectorAll('.tab-panel'),
        adminPhotoGrid: document.getElementById('adminPhotoGrid'),
        totalPhotosCount: document.getElementById('totalPhotosCount'),
        adminSearchInput: document.getElementById('adminSearchInput'),
        adminCatFilter: document.getElementById('adminCatFilter'),
        addPhotoForm: document.getElementById('addPhotoForm'),
        copyForm: document.getElementById('copyForm'),
        exportBtn: document.getElementById('exportBtn'),
        editModal: document.getElementById('editModal'),
        closeEditModal: document.getElementById('closeEditModal'),
        editPhotoForm: document.getElementById('editPhotoForm'),
        deletePhotoBtn: document.getElementById('deletePhotoBtn')
    };

    // 1. Tab Switcher
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.tabs.forEach(t => t.classList.remove('active'));
            elements.tabPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(target).classList.add('active');
        });
    });

    // 2. Render Photos Grid
    function renderAdminGrid() {
        if (!elements.adminPhotoGrid) return;
        elements.adminPhotoGrid.innerHTML = '';

        const searchTerm = elements.adminSearchInput.value.toLowerCase().trim();
        const selectedCat = elements.adminCatFilter.value;

        const filtered = localData.items.filter(item => {
            const matchesCat = selectedCat === 'all' || item.categoryId === selectedCat;
            const matchesSearch = !searchTerm || 
                item.title.toLowerCase().includes(searchTerm) || 
                item.id.toString() === searchTerm ||
                (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm)));
            return matchesCat && matchesSearch;
        });

        elements.totalPhotosCount.textContent = localData.items.length;

        filtered.slice(0, 100).forEach(item => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.innerHTML = `
                <div class="admin-card-img">
                    <img src="${item.src}" alt="${item.title}" loading="lazy" />
                </div>
                <div class="admin-card-body">
                    <span class="admin-card-cat">${item.categoryName}</span>
                    <h4 class="admin-card-title">${item.title}</h4>
                    <button class="admin-card-btn" onclick="openEditModal(${item.id})">Editar Foto</button>
                </div>
            `;
            elements.adminPhotoGrid.appendChild(card);
        });
    }

    elements.adminSearchInput.addEventListener('input', renderAdminGrid);
    elements.adminCatFilter.addEventListener('change', renderAdminGrid);

    // 3. Edit Photo Modal Handler
    window.openEditModal = function(id) {
        const item = localData.items.find(i => i.id === id);
        if (!item) return;

        editingPhotoId = id;
        document.getElementById('editPhotoId').textContent = item.id;
        document.getElementById('editPhotoPreview').src = item.src;
        document.getElementById('editPhotoTitle').value = item.title;
        document.getElementById('editPhotoCat').value = item.categoryId;
        document.getElementById('editPhotoDesc').value = item.description || '';
        document.getElementById('editPhotoTags').value = (item.tags || []).join(', ');

        elements.editModal.classList.add('active');
    };

    if (elements.closeEditModal) {
        elements.closeEditModal.addEventListener('click', () => {
            elements.editModal.classList.remove('active');
        });
    }

    elements.editPhotoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = localData.items.find(i => i.id === editingPhotoId);
        if (item) {
            item.title = document.getElementById('editPhotoTitle').value;
            const newCatId = document.getElementById('editPhotoCat').value;
            const catObj = localData.categories.find(c => c.id === newCatId);
            item.categoryId = newCatId;
            item.categoryName = catObj ? catObj.name : newCatId;
            item.description = document.getElementById('editPhotoDesc').value;
            item.tags = document.getElementById('editPhotoTags').value.split(',').map(t => t.strip ? t.strip() : t.trim()).filter(Boolean);

            renderAdminGrid();
            elements.editModal.classList.remove('active');
            alert('Fotografia atualizada!');
        }
    });

    if (elements.deletePhotoBtn) {
        elements.deletePhotoBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta foto?')) {
                localData.items = localData.items.filter(i => i.id !== editingPhotoId);
                renderAdminGrid();
                elements.editModal.classList.remove('active');
            }
        });
    }

    const setCoverBtn = document.getElementById('setCoverBtn');
    if (setCoverBtn) {
        setCoverBtn.addEventListener('click', () => {
            const item = localData.items.find(i => i.id === editingPhotoId);
            if (item) {
                const ensaio = localData.ensaios.find(e => e.id === item.albumId || e.category === item.categoryId);
                if (ensaio) {
                    ensaio.cover = item.src;
                    alert(`Fotografia #${item.id} definida como Capa do Ensaio "${ensaio.title}"!`);
                } else {
                    alert(`Capa do grupo "${item.categoryName}" atualizada!`);
                }
            }
        });
    }

    // 4. Add New Photo Handler
    elements.addPhotoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const src = document.getElementById('newPhotoUrl').value;
        const title = document.getElementById('newPhotoTitle').value;
        const categoryId = document.getElementById('newPhotoCat').value;
        const catObj = localData.categories.find(c => c.id === categoryId);
        const description = document.getElementById('newPhotoDesc').value;
        const tags = document.getElementById('newPhotoTags').value.split(',').map(t => t.trim()).filter(Boolean);

        const newId = Math.max(...localData.items.map(i => i.id), 0) + 1;

        localData.items.unshift({
            id: newId,
            src: src,
            categoryId: categoryId,
            categoryName: catObj ? catObj.name : categoryId,
            title: title,
            description: description,
            tags: tags
        });

        alert('Nova fotografia adicionada!');
        elements.addPhotoForm.reset();
        renderAdminGrid();
    });

    // 5. Copy & Info Form Handler
    if (elements.copyForm) {
        document.getElementById('infoName').value = localData.photographer.name;
        document.getElementById('infoRole').value = localData.photographer.role;
        document.getElementById('infoWhatsapp').value = localData.photographer.whatsapp;
        document.getElementById('infoEmail').value = localData.photographer.email;
        document.getElementById('infoBio').value = localData.photographer.bio;

        elements.copyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localData.photographer.name = document.getElementById('infoName').value;
            localData.photographer.role = document.getElementById('infoRole').value;
            localData.photographer.whatsapp = document.getElementById('infoWhatsapp').value;
            localData.photographer.email = document.getElementById('infoEmail').value;
            localData.photographer.bio = document.getElementById('infoBio').value;

            alert('Informações atualizadas com sucesso!');
        });
    }

    // 6. Export portfolio_data.js
    elements.exportBtn.addEventListener('click', () => {
        const fileContent = `const PORTFOLIO_DATA = ${JSON.stringify(localData, null, 4)};\n`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'portfolio_data.js';
        a.click();
    });

    renderAdminGrid();
});
