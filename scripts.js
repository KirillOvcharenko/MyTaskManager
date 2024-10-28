function addTask(event) {
  event.preventDefault();

  var newItemInput = document.getElementById("newItem");
  var newItemValue = newItemInput.value;

  if (newItemValue.trim() === "") {
    return;
  }

  addTaskToDOM(newItemValue);

  var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  taskList.push(newItemValue);
  localStorage.setItem('taskList', JSON.stringify(taskList));

  newItemInput.value = "";
}

function addTaskToDOM(task) {
  var newTask = document.createElement("li");
  newTask.innerHTML = `
    <button class="image-button" onclick="completeTask(this)"><img src="images/icon-done.png" alt="Done"></button>
    <button class="image-button" onclick="editTask(this)"><img src="images/icon-edit.png" alt="Edit"></button>
    <button class="image-button" onclick="deleteTask(this)"><img src="images/icon-delete.png" alt="Delete"></button>
    <span class="task-text">${task}</span>`;
  var taskList = document.getElementById("task-list");
  taskList.insertBefore(newTask, taskList.firstChild);
}

function completeTask(button) {
  var li = button.parentElement;
  li.classList.add("completed");
  setTimeout(function() {
    li.style.transition = "none";
    li.remove();
    document.getElementById("task-list").appendChild(li);

    setTimeout(function() {
      li.style.transition = "";
    }, 10);
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
    var taskIndex = taskList.indexOf(currentText);
    
    if (taskIndex > -1) {
      taskList[taskIndex] = newTaskText;
      localStorage.setItem('taskList', JSON.stringify(taskList));
    }
  }
}

function deleteTask(button) {
  var li = button.parentElement;
  
  var taskList = JSON.parse(localStorage.getItem('taskList')) || [];
  var taskText = li.querySelector('.task-text').innerText;
  var taskIndex = taskList.indexOf(taskText);
  
  if (taskIndex > -1) {
    taskList.splice(taskIndex, 1);
  }

  localStorage.setItem('taskList', JSON.stringify(taskList));
  li.remove();
}

window.onload = function() {
  let savedTasks = JSON.parse(localStorage.getItem('taskList'));
  if (savedTasks) {
    for (let i = 0; i < savedTasks.length; i++) {
      addTaskToDOM(savedTasks[i]);
    }
  }
};

window.onbeforeunload = function() {
  const completedTasks = document.querySelectorAll('.completed');
  if (completedTasks.length > 0) {
    let taskList = JSON.parse(localStorage.getItem('taskList')) || [];
    completedTasks.forEach(task => {
      const taskText = task.innerText.replace('Виконати', '').replace('Видалити', '').replace('Редагувати', '').trim();
      let index = taskList.indexOf(taskText);
      if (index > -1) {
        taskList.splice(index, 1);
      }
    });
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
};