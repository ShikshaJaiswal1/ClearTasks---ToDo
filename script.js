const inputBox = document.getElementById("input-box");
const dueDate = document.getElementById("due-date");
const category = document.getElementById("category");
const listContainer = document.getElementById("list-container");

// Add Task
function AddTask() {
  if (inputBox.value === '') {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = `
      ${inputBox.value}
      <div class="task-meta">📅 ${dueDate.value || "No deadline"} | 🏷️ ${category.value}</div>
    `;
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    li.setAttribute("draggable", "true");
    addDragAndDrop(li);
  }
  inputBox.value = "";
  dueDate.value = "";
  saveData();
}

// Mark Checked / Delete
listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
}, false);

// Save
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Display
function displayData() {
  listContainer.innerHTML = localStorage.getItem("data");
  let tasks = listContainer.querySelectorAll("li");
  tasks.forEach(task => addDragAndDrop(task));
}
displayData();

// Drag and Drop
function addDragAndDrop(task) {
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");
    saveData();
  });
}

listContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(listContainer, e.clientY);
  if (afterElement == null) {
    listContainer.appendChild(dragging);
  } else {
    listContainer.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
