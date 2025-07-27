// Get references to HTML elements
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

// --- Functions ---

/**
 * Loads tasks from Local Storage and renders them.
 */
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todos')) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

/**
 * Saves the current tasks from the DOM to Local Storage.
 */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todoList li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(tasks));
}

/**
 * Adds a new task to the DOM.
 * @param {string} taskText - The text content of the task.
 * @param {boolean} [completed=false] - Whether the task is initially completed.
 */
function addTaskToDOM(taskText, completed = false) {
    if (taskText.trim() === '') {
        alert('Please enter a task!');
        return;
    }

    const listItem = document.createElement('li');
    if (completed) {
        listItem.classList.add('completed');
    }

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.classList.add('task-text');
    taskSpan.addEventListener('click', toggleTaskCompletion); // Allow clicking text to toggle

    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerHTML = '&#10003;'; // Checkmark symbol
    completeBtn.title = 'Mark as Complete/Incomplete';
    completeBtn.addEventListener('click', toggleTaskCompletion);

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerHTML = '&times;'; // Multiplication sign (X)
    deleteBtn.title = 'Delete Task';
    deleteBtn.addEventListener('click', deleteTask);

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    listItem.appendChild(taskSpan);
    listItem.appendChild(actionsDiv);
    todoList.appendChild(listItem);

    // Only save if it's a newly added task, not on load
    if (!completed && taskText !== todoInput.value) { // Prevents saving on initial load if text doesn't match input
        saveTasks();
    }

    todoInput.value = ''; // Clear input field
}

/**
 * Toggles the 'completed' class for a task item.
 * @param {Event} event - The click event.
 */
function toggleTaskCompletion(event) {
    const listItem = event.target.closest('li');
    if (listItem) {
        listItem.classList.toggle('completed');
        saveTasks();
    }
}

/**
 * Deletes a task item from the DOM.
 * @param {Event} event - The click event.
 */
function deleteTask(event) {
    const listItem = event.target.closest('li');
    if (listItem) {
        listItem.remove();
        saveTasks();
    }
}

// --- Event Listeners ---

// Add task when the "Add Task" button is clicked
addTodoBtn.addEventListener('click', () => {
    addTaskToDOM(todoInput.value);
});

// Add task when Enter key is pressed in the input field
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTaskToDOM(todoInput.value);
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', loadTasks);