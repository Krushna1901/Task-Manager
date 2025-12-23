class TaskManager {
    constructor() {
        this.tasks = Storage.getTasks();
        this.filter = "all";
        this.searchText = "";
        this.dragIndex = null;
        this.init();
    }

    init() {
        this.events();
        this.render();
    }

    add(text) {
        this.tasks.push({
            id: generateId(),
            text,
            completed: false
        });
        this.saveAndRender();
    }

    delete(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveAndRender();
    }

    toggle(id) {
        this.tasks.forEach(t => {
            if (t.id === id) t.completed = !t.completed;
        });
        this.saveAndRender();
    }

    edit(id, text) {
        this.tasks.forEach(t => {
            if (t.id === id) t.text = text;
        });
        this.saveAndRender();
    }

    getFilteredTasks() {
        let list = [...this.tasks];

        if (this.filter === "active")
            list = list.filter(t => !t.completed);

        if (this.filter === "completed")
            list = list.filter(t => t.completed);

        if (this.searchText)
            list = list.filter(t =>
                t.text.toLowerCase().includes(this.searchText.toLowerCase())
            );

        return list;
    }

    render() {
        UI.renderTasks(this.getFilteredTasks(), {
            toggle: id => this.toggle(id),
            delete: id => this.delete(id),
            edit: (id, text) => this.edit(id, text),
            dragStart: i => this.dragIndex = i,
            drop: i => {
                const moved = this.tasks.splice(this.dragIndex, 1)[0];
                this.tasks.splice(i, 0, moved);
                this.saveAndRender();
            }
        });

        UI.updateStats(this.tasks);
    }

    saveAndRender() {
        Storage.saveTasks(this.tasks);
        this.render();
    }

    events() {
        const form = qs("#taskForm");
        const input = qs("#taskInput");
        const search = qs("#searchInput");
        const theme = qs("#themeToggle");

        form.addEventListener("submit", e => {
            e.preventDefault();
            if (input.value.trim()) {
                this.add(input.value.trim());
                input.value = "";
            }
        });

        search.addEventListener("input", e => {
            this.searchText = e.target.value;
            this.render();
        });

        qsa(".filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                qsa(".filter-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
                this.filter = btn.dataset.filter;
                this.render();
            });
        });

        theme.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TaskManager();
});
