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
        projectList.className = `project-list ${currentView}-view`; // Adiciona classe de visualização

        const filteredProjects = projects.filter(project => {
            const searchTerms = filter.toLowerCase().split(/[,\s]+/).filter(term => term !== "");
            if (searchTerms.length === 0) return true; // Se o filtro estiver vazio, mostra todos

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
            projectCard.innerHTML = `
                <h3>${project.name} <span class="copy-icon" data-copy="${project.name}">📋</span></h3>
                <p class="path"><strong>Caminho:</strong> ${project.path} <span class="copy-icon" data-copy="${project.path}">📋</span></p>
                <p><strong>Descrição:</strong> ${project.description || "Sem descrição"}</p>
                <div class="tags"><strong>Tags:</strong> ${project.tags.map(tag => `<span class="tag-item" data-tag="${tag}">${tag}</span>`).join("")}</div>
                <div class="actions">
                    <button class="open-folder" onclick="openFolder(\'${project.path.replace(/\\/g, '\\\\')}\')">Abrir Pasta</button>
                    <button class="open-vs" onclick="openVS(\'${project.path.replace(/\\/g, '\\\\')}\', \'${project.name.replace(/\\/g, '\\\\')}\', \'${project.solutionName.replace(/\\/g, '\\\\') || ''}\')">Abrir no VS</button>
                    <button class="edit-btn" onclick="editProject(${project.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">Excluir</button>
                </div>
            `;
            projectList.appendChild(projectCard);
        });

        // Add event listeners for copy icons
        document.querySelectorAll(".copy-icon").forEach(icon => {
            icon.onclick = (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(icon.dataset.copy);
                alert("Copiado para a área de transferência!");
            };
        });

        // Add event listeners for clickable tags
        document.querySelectorAll(".tag-item").forEach(tagItem => {
            tagItem.onclick = (e) => {
                e.stopPropagation();
                const currentFilter = filterInput.value.toLowerCase();
                const clickedTag = tagItem.dataset.tag.toLowerCase();
                
                // Adiciona a tag clicada ao filtro, se já não estiver lá
                if (!currentFilter.includes(clickedTag)) {
                    filterInput.value = currentFilter ? `${currentFilter}, ${clickedTag}` : clickedTag;
                }
                filterTypeSelect.value = "tags";
                renderProjects(filterInput.value, filterTypeSelect.value);
            };
        });
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

    // Event listener para o campo de filtro
    filterInput.addEventListener("input", () => {
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    // Event listener para o tipo de filtro
    filterTypeSelect.addEventListener("change", () => {
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    // Event listener para o botão de alternar visualização
    viewToggleBtn.addEventListener("click", () => {
        currentView = currentView === "grid" ? "list" : "grid";
        viewToggleBtn.textContent = currentView === "grid" ? "Visualização em Lista" : "Visualização em Cards";
        renderProjects(filterInput.value, filterTypeSelect.value);
    });

    // Funções globais para serem acessadas pelos botões nos cards
    window.openFolder = (path) => {
        // Tenta abrir a pasta diretamente no explorador de arquivos
        // Note: Isso só funciona em ambientes que permitem (ex: Electron, extensões de navegador específicas)
        // Em navegadores padrão, isso será bloqueado por segurança.
        const formattedPath = path.replace(/\\/g, "/"); // Substitui \ por /
        try {
            // Tentativa de abrir diretamente (pode não funcionar em todos os navegadores/SO)
            window.open(`file:///${formattedPath}`, "_blank");
        } catch (e) {
            // Fallback para copiar para a área de transferência
            if (navigator.clipboard) {
                navigator.clipboard.writeText(path).then(() => {
                    alert(`Caminho copiado para área de transferência: ${path}\n\nPara abrir a pasta, cole este caminho no explorador de arquivos.`);
                }).catch(() => {
                    alert(`Não foi possível abrir a pasta. Copie o caminho manualmente: ${path}`);
                });
            } else {
                alert(`Não foi possível abrir a pasta. Copie o caminho manualmente: ${path}`);
            }
        }
    };

    window.openVS = (path, projectName, solutionName) => {
        let effectiveSolutionName = solutionName || projectName; // Usa solutionName se existir, senão o nome do projeto
        
        // Garante que o nome da solução termine com .sln
        if (effectiveSolutionName && !effectiveSolutionName.toLowerCase().endsWith(".sln")) {
            effectiveSolutionName += ".sln";
        }

        const fullSolutionPath = `${path}\\${effectiveSolutionName}`;
        const formattedSolutionPath = fullSolutionPath.replace(/\\/g, "/"); // Substitui \ por /

        // Comando para abrir no Visual Studio (devenv)
        const devenvCommand = `devenv "${fullSolutionPath}"`;

        // Comando para abrir a pasta no VS Code
        const vscodeCommand = `code "${path}"`;

        // Tenta abrir no Visual Studio (completo) via URI scheme (se configurado)
        try {
            window.open(`vs-code://file/${formattedSolutionPath}`, "_blank"); // Tenta abrir com VS Code URI
            // Se o usuário tiver o VS Code configurado para abrir .sln, isso pode funcionar.
            // Caso contrário, o fallback será para o devenv ou cópia.
        } catch (e) {
            // Fallback para copiar o comando devenv ou vscode para a área de transferência
            if (confirm(`Não foi possível abrir diretamente. Deseja copiar o comando para abrir no Visual Studio (OK) ou no VS Code (Cancelar)?`)) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(devenvCommand).then(() => {
                        alert(`Comando copiado para área de transferência: ${devenvCommand}\n\nPara abrir no Visual Studio, cole e execute este comando no Prompt de Comando ou PowerShell.`);
                    }).catch(() => {
                        alert(`Não foi possível copiar o comando. Copie manualmente: ${devenvCommand}`);
                    });
                } else {
                    alert(`Não foi possível copiar o comando. Copie manualmente: ${devenvCommand}`);
                }
            } else { // Usuário escolheu VS Code
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(vscodeCommand).then(() => {
                        alert(`Comando copiado para área de transferência: ${vscodeCommand}\n\nPara abrir a pasta no VS Code, cole e execute este comando no terminal.`);
                    }).catch(() => {
                        alert(`Não foi possível copiar o comando. Copie manualmente: ${vscodeCommand}`);
                    });
                } else {
                    alert(`Não foi possível copiar o comando. Copie manualmente: ${vscodeCommand}`);
                }
            }
        }
    };

    window.editProject = (id) => {
        const project = projects.find(p => p.id === id);
        if (project) {
            openModal(true, project);
        }
    };

    window.deleteProject = (id) => {
        const project = projects.find(p => p.id === id);
        if (project && confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
            projects = projects.filter(p => p.id !== id);
            saveProjects();
            renderProjects(filterInput.value, filterTypeSelect.value);
        }
    };

    // Carregar projetos ao iniciar
    loadProjects();
});


