const Storage = {
    getTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    },

    saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
};
