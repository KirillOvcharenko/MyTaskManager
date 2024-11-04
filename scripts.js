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
    taskList[taskIndex].completed = true;
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }

  li.classList.add("completed");
  setTimeout(() => {
    li.remove();
    showAllTasks();
  }, 500);
}

function editTask(button) {
  var li = button.parentElement;
  var taskTextSpan = li.querySelector('.task-text');
  var currentText = taskTextSpan.innerText;

  var newTaskText = prompt("Редагування завдання:", currentText);
  if (newTaskText !== null && newTaskText.trim() !== "") {
    taskTextSpan.innerText = newTaskText;

    var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    var taskIndex = taskList.findIndex(task => task.text === currentText);

    if (taskIndex > -1) {
      taskList[taskIndex].text = newTaskText;
      localStorage.setItem('taskList', JSON.stringify(taskList));
    }
  }
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

function showAllTasks() {
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  
  taskList
    .filter(task => !task.completed)
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
  
  taskList
    .filter(task => task.completed)
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
}

function showCurrentTasks() {
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList
    .filter(task => !task.completed)
    .forEach(task => addTaskToDOM(task.text, task.completed, task.category));
}

function showCompletedTasks() {
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList
    .filter(task => task.completed)
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

  if (newItemValue.trim() !== "") {
    const taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    taskList.push({ text: newItemValue, category: categoryValue, completed: false });
    localStorage.setItem('taskList', JSON.stringify(taskList));

    window.location.href = 'index.html';
  }
}

window.onload = function() {
  if (window.location.pathname.endsWith("index.html")) {
    showAllTasks();
  }
};