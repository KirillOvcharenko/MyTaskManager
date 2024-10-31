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

function addTaskToDOM(task, isCompleted) {
  var newTask = document.createElement("li");
  newTask.classList.toggle("completed", isCompleted);

  newTask.innerHTML = `
    <button class="image-button" onclick="completeTask(this)"><img src="images/icon-done.png" alt="Done"></button>
    <button class="image-button" onclick="editTask(this)"><img src="images/icon-edit.png" alt="Edit"></button>
    <button class="image-button" onclick="deleteTask(this)"><img src="images/icon-delete.png" alt="Delete"></button>
    <span class="task-text">${task}</span>`;
    
  var taskList = document.getElementById("task-list");
  if (isCompleted) {
    taskList.appendChild(newTask);
  } else {
    taskList.insertBefore(newTask, taskList.firstChild);
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
    document.getElementById("task-list").appendChild(li);
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
  taskList.forEach(task => addTaskToDOM(task.text, task.completed));
}

function showCurrentTasks() {
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList
    .filter(task => !task.completed)
    .forEach(task => addTaskToDOM(task.text, task.completed));
}

function showCompletedTasks() {
  document.getElementById("task-list").innerHTML = "";
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList
    .filter(task => task.completed)
    .forEach(task => addTaskToDOM(task.text, task.completed));
}

function deleteCompletedTasks() {
  let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList = taskList.filter(task => !task.completed);
  localStorage.setItem('taskList', JSON.stringify(taskList));
  showAllTasks();
}

window.onload = function() {
  let savedTasks = JSON.parse(localStorage.getItem('taskList')) || [];
  for (let i = 0; i < savedTasks.length; i++) {
    addTaskToDOM(savedTasks[i].text, savedTasks[i].completed);
  }
};
