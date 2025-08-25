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

    let projects = [];
    let editingProjectId = null;

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
        const filteredProjects = projects.filter(project => {
            const searchTerm = filter.toLowerCase();
            if (!searchTerm) return true; // Se o filtro estiver vazio, mostra todos

            switch (filterType) {
                case "name":
                    return project.name.toLowerCase().includes(searchTerm);
                case "path":
                    return project.path.toLowerCase().includes(searchTerm);
                case "tags":
                    return project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                case "all":
                default:
                    return project.name.toLowerCase().includes(searchTerm) ||
                           project.description.toLowerCase().includes(searchTerm) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
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
                filterInput.value = tagItem.dataset.tag;
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
        const tags = document.getElementById("project-tags").value.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
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

    // Funções globais para serem acessadas pelos botões nos cards
    window.openFolder = (path) => {
        const formattedPath = path.replace(/\\/g, "/"); // Substitui \ por /
        try {
            window.open(formattedPath, "_blank");
        } catch (e) {
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
        let finalSolutionPath = path;
        let effectiveSolutionName = solutionName || projectName; // Usa solutionName se existir, senão o nome do projeto

        if (effectiveSolutionName) {
            if (!effectiveSolutionName.toLowerCase().endsWith(".sln")) {
                finalSolutionPath = `${path}\\${effectiveSolutionName}.sln`;
            } else {
                finalSolutionPath = `${path}\\${effectiveSolutionName}`;
            }
        }
        
        const formattedPath = finalSolutionPath.replace(/\\/g, "/"); // Substitui \ por /
        const command = `devenv "${formattedPath}"`;

        try {
            window.open(`vscode://file/${formattedPath}`, "_blank"); // Tenta abrir com VS Code URI
        } catch (e) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(command).then(() => {
                    alert(`Comando copiado para área de transferência: ${command}\n\nPara abrir no Visual Studio, cole e execute este comando no Prompt de Comando ou PowerShell.`);
                }).catch(() => {
                    alert(`Não foi possível abrir o Visual Studio. Copie o comando manualmente: ${command}`);
                });
            } else {
                alert(`Não foi possível abrir o Visual Studio. Copie o comando manualmente: ${command}`);
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


