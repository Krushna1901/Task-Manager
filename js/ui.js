const UI = {
    renderTasks(tasks, handlers) {
        const list = qs("#taskList");
        list.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task-item" + (task.completed ? " completed" : "");
            li.draggable = true;

            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">❌</button>
            `;

            li.querySelector("input").onclick =
                () => handlers.toggle(task.id);

            li.querySelector("button").onclick =
                () => handlers.delete(task.id);

            // Double click to edit
            li.querySelector(".task-text").ondblclick = () => {
                const input = document.createElement("input");
                input.value = task.text;
                li.replaceChild(input, li.children[1]);
                input.focus();

                input.onblur = () => {
                    handlers.edit(task.id, input.value.trim() || task.text);
                };
            };

            // Drag & Drop
            li.ondragstart = () => handlers.dragStart(index);
            li.ondragover = e => e.preventDefault();
            li.ondrop = () => handlers.drop(index);

            list.appendChild(li);
        });
    },

    updateStats(tasks) {
        qs("#totalTasks").textContent = tasks.length;
        qs("#completedTasks").textContent =
            tasks.filter(t => t.completed).length;
        qs("#activeTasks").textContent =
            tasks.filter(t => !t.completed).length;
    }
};
