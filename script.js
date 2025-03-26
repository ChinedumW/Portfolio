document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const taskCategory = document.getElementById('taskCategory');
    
    // Category Icons
    const categoryIcons = {
        general: 'fas fa-tasks',
        work: 'fas fa-briefcase',
        personal: 'fas fa-user',
        shopping: 'fas fa-shopping-cart',
        health: 'fas fa-heartbeat'
    };
    
    // App State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    renderTasks();
    updateTaskCount();
    
    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });
    
    // Functions
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false,
                category: taskCategory.value,
                createdAt: new Date().toISOString()
            };
            
            tasks.unshift(newTask); // Add to beginning of array
            saveTasks();
            renderTasks();
            updateTaskCount();
            
            // Add animation to container
            const container = document.querySelector('.container');
            container.classList.add('pulse');
            setTimeout(() => container.classList.remove('pulse'), 300);
            
            taskInput.value = '';
            taskInput.focus();
        }
    }
    
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    function deleteTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        taskElement.classList.add('slide-out');
        
        // Wait for animation to complete before removing
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            updateTaskCount();
        }, 300);
    }
    
    function clearCompleted() {
        const completedTasks = document.querySelectorAll('.task-item.completed');
        completedTasks.forEach(task => {
            task.classList.add('slide-out');
        });
        
        setTimeout(() => {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            updateTaskCount();
        }, 300);
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all' filter
        });
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = `
                <div style="text-align: center; padding: 30px 0; color: #aaa;">
                    <i class="fas fa-clipboard-list" style="font-size: 40px; margin-bottom: 10px;"></i>
                    <p>No tasks found</p>
                </div>
            `;
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.setAttribute('data-id', task.id);
            
            // Format date
            const taskDate = new Date(task.createdAt);
            const formattedDate = taskDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <span class="task-category">
                        <i class="${categoryIcons[task.category]}"></i>
                        ${task.category.charAt(0).toUpperCase() + task.category.slice(1)} · ${formattedDate}
                    </span>
                </div>
                <button class="delete-btn">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            
            const checkbox = taskItem.querySelector('.task-checkbox');
            const deleteBtn = taskItem.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(taskItem);
        });
    }
    
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Helper function to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            animation: pulse 0.3s;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .slide-out {
            animation: slideOut 0.3s forwards;
        }
        
        @keyframes slideOut {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});