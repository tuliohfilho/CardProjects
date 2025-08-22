document.addEventListener('DOMContentLoaded', () => {
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const projectForm = document.getElementById('project-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeBtn = document.querySelector('.close');
    const filterInput = document.getElementById('filter-input');
    const projectList = document.getElementById('project-list');

    let projects = [];
    let editingProjectId = null;

    // Função para carregar projetos do localStorage
    const loadProjects = () => {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            projects = JSON.parse(storedProjects);
            renderProjects();
        }
    };

    // Função para salvar projetos no localStorage
    const saveProjects = () => {
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    // Função para renderizar os projetos na tela
    const renderProjects = (filter = '') => {
        projectList.innerHTML = '';
        const filteredProjects = projects.filter(project => {
            const searchTerm = filter.toLowerCase();
            return project.name.toLowerCase().includes(searchTerm) ||
                   project.description.toLowerCase().includes(searchTerm) ||
                   project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });

        if (filteredProjects.length === 0) {
            projectList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic; margin: 40px 0;">Nenhum projeto encontrado.</p>';
            return;
        }

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p class="path"><strong>Caminho:</strong> ${project.path}</p>
                <p><strong>Descrição:</strong> ${project.description || 'Sem descrição'}</p>
                <div class="tags"><strong>Tags:</strong> ${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
                <div class="actions">
                    <button class="open-folder" onclick="openFolder('${project.path}')">Abrir Pasta</button>
                    ${project.solutionName ? `<button class="open-vs" onclick="openVS('${project.path}', '${project.solutionName}')">Abrir no VS</button>` : ''}
                    <button class="edit-btn" onclick="editProject(${project.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">Excluir</button>
                </div>
            `;
            projectList.appendChild(projectCard);
        });
    };

    // Função para abrir o modal
    const openModal = (isEdit = false, project = null) => {
        editingProjectId = isEdit ? project.id : null;
        modalTitle.textContent = isEdit ? 'Editar Projeto' : 'Criar Projeto';
        submitBtn.textContent = isEdit ? 'Salvar Alterações' : 'Criar Projeto';

        if (isEdit && project) {
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-path').value = project.path;
            document.getElementById('project-description').value = project.description;
            document.getElementById('project-tags').value = project.tags.join(', ');
            document.getElementById('solution-name').value = project.solutionName || '';
        } else {
            projectForm.reset();
        }

        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    // Função para fechar o modal
    const closeModal = () => {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        editingProjectId = null;
        projectForm.reset();
    };

    // Event listeners para o modal
    addProjectBtn.addEventListener('click', () => openModal());
    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Fechar modal clicando fora dele
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Event listener para o formulário
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('project-name').value;
        const path = document.getElementById('project-path').value;
        const description = document.getElementById('project-description').value;
        const tags = document.getElementById('project-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const solutionName = document.getElementById('solution-name').value;

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
        renderProjects(filterInput.value);
        closeModal();
    });

    // Event listener para o campo de filtro
    filterInput.addEventListener('input', (e) => {
        renderProjects(e.target.value);
    });

    // Funções globais para serem acessadas pelos botões nos cards
    window.openFolder = (path) => {
        // Por enquanto, copia o caminho para a área de transferência
        if (navigator.clipboard) {
            navigator.clipboard.writeText(path).then(() => {
                alert(`Caminho copiado para área de transferência: ${path}`);
            }).catch(() => {
                alert(`Caminho da pasta: ${path}`);
            });
        } else {
            alert(`Caminho da pasta: ${path}`);
        }
    };

    window.openVS = (path, solutionName) => {
        const fullPath = `${path}\\${solutionName}.sln`;
        const command = `devenv "${fullPath}"`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(command).then(() => {
                alert(`Comando copiado para área de transferência: ${command}`);
            }).catch(() => {
                alert(`Execute no terminal: ${command}`);
            });
        } else {
            alert(`Execute no terminal: ${command}`);
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
            renderProjects(filterInput.value);
        }
    };

    // Carregar projetos ao iniciar
    loadProjects();
});

