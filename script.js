
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let currentFilter = 'all';


const taskInput = document.getElementById('taskInput');
const assigneeInput = document.getElementById('assigneeInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function addTask() {
    const taskText = taskInput.value.trim();
    const assignee = assigneeInput.value.trim();
    

    if (taskText === '') {
        alert('Введите текст задачи!');
        return;
    }
    
    if (assignee === '') {
        alert('Укажите исполнителя!');
        return;
    }
    

    const task = {
        id: Date.now(),
        text: taskText,
        assignee: assignee,
        completed: false
    };
    

    tasks.push(task);
    saveTasks(); 
    
    
    taskInput.value = '';
    assigneeInput.value = '';
    
    // Обновляем отображение
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-assignee">👤 ${task.assignee}</div>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Удалить</button>
        `;
        
        taskList.appendChild(li);
    });
    
    updateCounter();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks(); 
        renderTasks();
    }
}


function deleteTask(id) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks(); 
        renderTasks();
    }
}


function updateCounter() {
    const activeTasks = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `Задач: ${tasks.length} | Активных: ${activeTasks}`;
}


function setFilter(filter) {
    currentFilter = filter;
    
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
}


addButton.addEventListener('click', addTask);


taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

assigneeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});


renderTasks();