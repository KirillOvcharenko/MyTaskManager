function addTask(event) {
  event.preventDefault();

  var newItemInput = document.getElementById("newItem");
  var newItemValue = newItemInput.value;

  if (newItemValue.trim() === "") {
    return;
  }

  addTaskToDOM(newItemValue, false);

  var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList.push({ text: newItemValue, completed: false });
  localStorage.setItem('taskList', JSON.stringify(taskList));

  newItemInput.value = "";
}

function addTaskToDOM(taskText, isCompleted, category) {
  const newTask = document.createElement("li");
  newTask.classList.add("task-item");
  newTask.classList.toggle("completed", isCompleted);

  newTask.innerHTML = `
    <button class="image-button" onclick="completeTask(this)"><img src="images/icon-done.png" alt="Done"></button>
    <button class="image-button" onclick="editTask(this)"><img src="images/icon-edit.png" alt="Edit"></button>
    <button class="image-button" onclick="deleteTask(this)"><img src="images/icon-delete.png" alt="Delete"></button>
    <span class="task-text">${taskText}</span>
    <span class="category-label ${category ? `category-${category}` : ''}">${getCategoryLabel(category)}</span>
  `;

  const taskList = document.getElementById("task-list");
  
  if (isCompleted) {
    taskList.appendChild(newTask);
  } else {
    taskList.insertBefore(newTask, taskList.firstChild);
  }
}


function getCategoryLabel(category) {
  switch (category) {
    case "home": return "Дім";
    case "work": return "Робота";
    case "hobby": return "Хобі";
    case "health": return "Здоров'я";
    default: return "";
  }
}

function completeTask(button) {
  var li = button.parentElement;
  var taskText = li.querySelector('.task-text').innerText;

  var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  var taskIndex = taskList.findIndex(task => task.text === taskText);

  if (taskIndex > -1) {
    var [completedTask] = taskList.splice(taskIndex, 1);
    completedTask.completed = true;
    taskList.push(completedTask);
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }

  li.classList.add("completed");
  setTimeout(() => {
    li.remove();
    const taskListElement = document.getElementById("task-list");
    taskListElement.appendChild(li);
  }, 500);
}


function editTask(button) {
  const li = button.parentElement;
  const taskText = li.querySelector('.task-text').innerText;
  const categoryLabel = li.querySelector('.category-label').classList[1].replace('category-', '');

  window.location.href = `new-task.html?text=${encodeURIComponent(taskText)}&category=${encodeURIComponent(categoryLabel)}`;
}

function deleteTask(button) {
  var li = button.parentElement;
  var taskText = li.querySelector('.task-text').innerText;

  var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  var taskIndex = taskList.findIndex(task => task.text === taskText);

  if (taskIndex > -1) {
    taskList.splice(taskIndex, 1);
  }

  localStorage.setItem('taskList', JSON.stringify(taskList));
  li.remove();
}

function getSelectedCategory() {
  return document.getElementById("category-filter").value;
}

function filterTasks() {
  showAllTasks();
}

function showAllTasks() {
  const category = getSelectedCategory();
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];

  taskList
    .filter(task => (category === "" || task.category === category))
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
}

function showCurrentTasks() {
  const category = getSelectedCategory();
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  
  taskList
    .filter(task => !task.completed && (category === "" || task.category === category))
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
}

function showCompletedTasks() {
  const category = getSelectedCategory();
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  
  taskList
    .filter(task => task.completed && (category === "" || task.category === category))
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
}

function deleteCompletedTasks() {
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList = taskList.filter(task => !task.completed);
  localStorage.setItem('taskList', JSON.stringify(taskList));
  showAllTasks();
}

function submitNewTask(event) {
  event.preventDefault();
  
  const newItemInput = document.getElementById("newItem");
  const newItemValue = newItemInput.value;
  const categorySelect = document.getElementById("category");
  const categoryValue = categorySelect.value;

  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const originalTaskText = urlParams.get('text');

  if (originalTaskText) {
    const taskIndex = taskList.findIndex(task => task.text === decodeURIComponent(originalTaskText));
    if (taskIndex > -1) {
      taskList[taskIndex].text = newItemValue;
      taskList[taskIndex].category = categoryValue;
    }
  } else {
    taskList.push({ text: newItemValue, category: categoryValue, completed: false });
  }

  localStorage.setItem('taskList', JSON.stringify(taskList));
  window.location.href = 'index.html';
}

function toggleTheme() {
  const isDarkTheme = document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');

  const themeIcon = document.querySelector('#theme-toggle-button img');
  themeIcon.src = isDarkTheme ? 'images/icon-light-theme.png' : 'images/icon-dark-theme.png';
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const themeIcon = document.querySelector('#theme-toggle-button img');
    themeIcon.src = 'images/icon-light-theme.png';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadThemePreference();

  const themeToggleButton = document.getElementById('theme-toggle-button');
  themeToggleButton.addEventListener('click', toggleTheme);
});

window.onload = function() {
  if (window.location.pathname.endsWith("index.html")) {
    showAllTasks();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const taskText = urlParams.get('text');
  const taskCategory = urlParams.get('category');

  if (taskText && taskCategory) {
    document.getElementById("newItem").value = decodeURIComponent(taskText);
    document.getElementById("category").value = decodeURIComponent(taskCategory);
  }
};