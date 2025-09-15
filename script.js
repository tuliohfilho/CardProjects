document.addEventListener("DOMContentLoaded", () => {
    const addProjectBtn = document.getElementById("add-project-btn");
    const projectModal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const projectForm = document.getElementById("project-form");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const closeBtn = document.querySelector(".close");
    const filterInput = document.getElementById("filter-input");
    const filterTypeSelect = document.getElementById("filter-type");
    const projectList = document.getElementById("project-list");
    const viewToggleBtn = document.getElementById("view-toggle-btn");

    let projects = [];
    let editingProjectId = null;
    let currentView = "grid"; // 'grid' ou 'list'

    // Função para carregar projetos do localStorage
    const loadProjects = () => {
        const storedProjects = localStorage.getItem("projects");
        if (storedProjects) {
            projects = JSON.parse(storedProjects);
            renderProjects();
        }
    };

    // Função para salvar projetos no localStorage
    const saveProjects = () => {
        localStorage.setItem("projects", JSON.stringify(projects));
    };

    // Função para renderizar os projetos na tela
    const renderProjects = (filter = "", filterType = "all") => {
        projectList.innerHTML = "";
        projectList.className = `project-list ${currentView}-view`;

        // Atualiza o ícone do botão de visualização
        viewToggleBtn.className = `view-toggle-icon ${currentView}-view`;

        const filteredProjects = projects.filter(project => {
            const searchTerms = filter.toLowerCase().split(/[,\s]+/).filter(term => term !== "");
            if (searchTerms.length === 0) return true;

            switch (filterType) {
                case "name":
                    return searchTerms.some(term => project.name.toLowerCase().includes(term));
                case "path":
                    return searchTerms.some(term => project.path.toLowerCase().includes(term));
                case "tags":
                    return searchTerms.some(term => project.tags.some(tag => tag.toLowerCase().includes(term)));
                case "all":
                default:
                    return searchTerms.some(term => 
                        project.name.toLowerCase().includes(term) ||
                        project.description.toLowerCase().includes(term) ||
                        project.tags.some(tag => tag.toLowerCase().includes(term))
                    );
            }
        });

        if (filteredProjects.length === 0) {
            projectList.innerHTML = 
                `<p style="text-align: center; color: #666; font-style: italic; margin: 40px 0;">Nenhum projeto encontrado.</p>`;
            return;
        }

        filteredProjects.forEach(project => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            projectCard.dataset.id = project.id;
            
            if (currentView === "list") {
                projectCard.innerHTML = `
                    <div class="card-info">
                        <div class="card-title">
                            <h3>${project.name}</h3>
                            <span class="copy-icon" onclick="copyToClipboard('${project.name}')" title="Copiar nome">📋</span>
                        </div>
                        <p class="path">
                            ${project.path}
                            <span class="copy-icon" onclick="copyToClipboard('${project.path}')" title="Copiar caminho">📋</span>
                        </p>
                        <p class="description">${project.description || "Sem descrição"}</p>
                    </div>
                    <div class="tags">
                        ${project.tags.map(tag => `<span onclick="filterByTag('${tag}')">${tag}</span>`).join('')}
                    </div>
                    <div class="actions">
                        <button class="open-folder" onclick="openFolder('${project.path.replace(/\\/g, '\\\\')}')">📁 Abrir Pasta</button>
                        <button class="open-vs" onclick="openInVS('${project.path.replace(/\\/g, '\\\\')}', '${project.solutionName || project.name}')">💻 Abrir no VS</button>
                        <button class="edit-btn" onclick="editProject(${project.id})">✏️ Editar</button>
                        <button class="delete-btn" onclick="deleteProject(${project.id})">🗑️ Excluir</button>
                    </div>
                `;
            } else {
                projectCard.innerHTML = `
                    <h3>${project.name} <span class="copy-icon" onclick="copyToClipboard('${project.name}')" title="Copiar nome">📋</span></h3>
                    <p class="path"><strong>Caminho:</strong> ${project.path} <span class="copy-icon" onclick="copyToClipboard('${project.path}')" title="Copiar caminho">📋</span></p>
                    <p><strong>Descrição:</strong> ${project.description || "Sem descrição"}</p>
                    <div class="tags"><strong>Tags:</strong> ${project.tags.map(tag => `<span onclick="filterByTag('${tag}')">${tag}</span>`).join("")}</div>
                    <div class="actions">
                        <button class="open-folder" onclick="openFolder('${project.path.replace(/\\/g, '\\\\')}')">Abrir Pasta</button>
                        <button class="open-vs" onclick="openInVS('${project.path.replace(/\\/g, '\\\\')}', '${project.solutionName || project.name}')">Abrir no VS</button>
                        <button class="edit-btn" onclick="editProject(${project.id})">Editar</button>
                        <button class="delete-btn" onclick="deleteProject(${project.id})">Excluir</button>
                    </div>
                `;
            }
            projectList.appendChild(projectCard);
        });
    };

    // Função para copiar texto para área de transferência
    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copiado para a área de transferência!");
        }).catch(() => {
            alert("Erro ao copiar para a área de transferência.");
        });
    };

    // Função para filtrar por tag clicada
    window.filterByTag = (tag) => {
        const currentFilter = filterInput.value.toLowerCase();
        const clickedTag = tag.toLowerCase();
        
        if (!currentFilter.includes(clickedTag)) {
            filterInput.value = currentFilter ? `${currentFilter}, ${clickedTag}` : clickedTag;
        }
        filterTypeSelect.value = "tags";
        renderProjects(filterInput.value, filterTypeSelect.value);
    };

    // Função para abrir pasta
    window.openFolder = (path) => {
        const normalizedPath = path.replace(/\\\\/g, '/');
        
        try {
            window.open(`file:///${normalizedPath}`, '_blank');
        } catch (error) {
            copyToClipboard(normalizedPath);
            alert(`Não foi possível abrir a pasta diretamente. Caminho copiado: ${normalizedPath}`);
        }
    };

    // Função para abrir no Visual Studio/VS Code
    window.openInVS = (projectPath, solutionName) => {
        const normalizedPath = projectPath.replace(/\\\\/g, '/');
        let finalSolutionName = solutionName || '';
        
        if (!finalSolutionName) {
            finalSolutionName = projectPath.split(/[\\\/]/).pop();
        }
        
        if (!finalSolutionName.endsWith('.sln')) {
            finalSolutionName += '.sln';
        }
        
        const solutionPath = `${normalizedPath}/${finalSolutionName}`;
        
        const choice = confirm("Clique em OK para abrir no Visual Studio ou Cancelar para abrir no VS Code");
        
        if (choice) {
            // Visual Studio
            try {
                window.open(`devenv "${solutionPath}"`, '_blank');
            } catch (error) {
                copyToClipboard(`devenv "${solutionPath}"`);
                alert(`Comando copiado para área de transferência: devenv "${solutionPath}"`);
            }
        } else {
            // VS Code
            try {
                window.open(`code "${normalizedPath}"`, '_blank');
            } catch (error) {
                copyToClipboard(`code "${normalizedPath}"`);
                alert(`Comando copiado para área de transferência: code "${normalizedPath}"`);
            }
        }
    };

    // Função para editar projeto
    window.editProject = (id) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            openModal(true, project);
        }
    };

    // Função para excluir projeto
    window.deleteProject = (id) => {
        if (confirm("Tem certeza que deseja excluir este projeto?")) {
            projects = projects.filter(p => p.id !== id);
            saveProjects();
            renderProjects(filterInput.value, filterTypeSelect.value);
        }
    };

    // Função para abrir o modal
    const openModal = (isEdit = false, project = null) => {
        editingProjectId = isEdit ? project.id : null;
        modalTitle.textContent = isEdit ? "Editar Projeto" : "Criar Projeto";
        submitBtn.textContent = isEdit ? "Salvar Alterações" : "Criar Projeto";

        if (isEdit && project) {
            document.getElementById("project-name").value = project.name;
            document.getElementById("project-path").value = project.path;
            document.getElementById("project-description").value = project.description;
            document.getElementById("project-tags").value = project.tags.join(", ");
            document.getElementById("solution-name").value = project.solutionName || "";
        } else {
            projectForm.reset();
        }

        projectModal.style.display = "block";
        document.body.style.overflow = "hidden";
    };

    // Função para fechar o modal
    const closeModal = () => {
        projectModal.style.display = "none";
        document.body.style.overflow = "auto";
        editingProjectId = null;
        projectForm.reset();
    };

    // Event listeners
    addProjectBtn.addEventListener("click", () => openModal());
    cancelBtn.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);

    // Alternar visualização
    viewToggleBtn.addEventListener("click", () => {
        currentView = currentView === "grid" ? "list" : "grid";
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    // Filtros
    filterInput.addEventListener("input", () => {
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    filterTypeSelect.addEventListener("change", () => {
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    // Fechar modal clicando fora
    window.addEventListener("click", (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("project-name").value;
        const path = document.getElementById("project-path").value;
        const description = document.getElementById("project-description").value;
        const tags = document.getElementById("project-tags").value.split(/[,\s]+/).map(tag => tag.trim()).filter(tag => tag !== "");
        const solutionName = document.getElementById("solution-name").value;

        if (editingProjectId) {
            // Editar projeto existente
            const projectIndex = projects.findIndex(p => p.id === editingProjectId);
            if (projectIndex !== -1) {
                projects[projectIndex] = {
                    ...projects[projectIndex],
                    name,
                    path,
                    description,
                    tags,
                    solutionName
                };
            }
        } else {
            // Criar novo projeto
            const newProject = {
                id: Date.now(),
                name,
                path,
                description,
                tags,
                solutionName
            };
            projects.push(newProject);
        }

        saveProjects();
        renderProjects(filterInput.value, filterTypeSelect.value);
        closeModal();
    });

    // Carregar projetos ao inicializar
    loadProjects();
});

