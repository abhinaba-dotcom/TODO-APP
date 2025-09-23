document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  function showAlert(msg, type) {
    let alertDiv = document.createElement("div");
    alertDiv.innerText = msg;
    let capitalizeTypeText;
    if (type === "success") {
      alertDiv.style.background = "green";
      capitalizeTypeText = type.charAt(0).toUpperCase() + type.slice(1);
    alertDiv.innerText = capitalizeTypeText + ": " + msg;
    } else if (type === "warning") {
      alertDiv.style.background = "#ff9966";
      capitalizeTypeText = type.charAt(0).toUpperCase() + type.slice(1);
    alertDiv.innerText = capitalizeTypeText + ": " + msg;
    } else if (type === "danger") {
      alertDiv.style.background = "red";
    alertDiv.innerText = msg;
    }
    
    alertDiv.classList.add("alert-box");
    alertDiv.style.display = "flex";
    document.getElementsByTagName("body")[0].append(alertDiv);
  }
  function markTodo(currentElement, todoId) {
    if (localStorage.getItem("todos")) {
      const storedTodos = JSON.parse(localStorage.getItem("todos"));
      if (currentElement.checked) {
        storedTodos.forEach((todo, index, array) => {
          if (todo.id == todoId) {
            const checkedTodo = { ...todo, isChecked: true };
            array[index] = checkedTodo;
          }
        });
      } else {
        storedTodos.forEach((todo, index, array) => {
          if (todo.id == todoId) {
            const checkedTodo = { ...todo, isChecked: false };
            array[index] = checkedTodo;
          }
        });
      }
      localStorage.setItem("todos", JSON.stringify(storedTodos));
      setTimeout(() => {
        fetchAllTodos();
      }, 1000);
    }
  }
  function editTodo(currentElement, todoId) {
    if (localStorage.getItem("todos")) {
      const storedTodos = JSON.parse(localStorage.getItem("todos"));
      const todoTextPara =
        currentElement.parentNode.previousElementSibling.lastElementChild;
      todoTextPara.contentEditable = true;
      todoTextPara.style.outline = "none";
      todoTextPara.style.outline = "none";
      todoTextPara.focus();
      currentElement.style.display = "none";
      currentElement.previousElementSibling.style.display = "flex";
      currentElement.previousElementSibling.addEventListener("click", (e) => {
        let editedTodoText = todoTextPara.innerText;
        currentElement.style.display = "flex";
        currentElement.previousElementSibling.style.display = "none";
        storedTodos.forEach((todo, index, array) => {
          if (todo.id == todoId) {
            const editedTodo = {...todo, todoText: editedTodoText};
            array[index] = editedTodo;
          }
        });
        localStorage.setItem("todos", JSON.stringify(storedTodos));
            showAlert("Todo edited successfully.", "success");

        setTimeout(() => {
          fetchAllTodos();
        }, 1000);
      });
    }
  }
  function deleteTodo(todoId) {
    if (localStorage.getItem("todos")) {
      const storedTodos = JSON.parse(localStorage.getItem("todos"));
      const filteredTodosAfterDeletion = storedTodos.filter(
        (item) => item.id != todoId
      );
      localStorage.setItem("todos", JSON.stringify(filteredTodosAfterDeletion));
                  showAlert("Todo deleted successfully.", "danger");

      fetchAllTodos();
    }
  }
  window.myGlobalEditTodo = editTodo;
  window.myGlobalDeleteTodo = deleteTodo;
  window.myGlobalMarkTodo = markTodo;
  fetchAllTodos();
  function fetchAllTodos() {
    let allTodo = [];
    if (!localStorage.getItem("todos")) {
      return;
    }
    allTodo = JSON.parse(localStorage.getItem("todos"));
    const todoContainer = document.getElementById("todo-container");
    todoContainer.innerHTML = "";
    if (allTodo) {
      allTodo.forEach((todo) => {
        let newTodoDiv = document.createElement("div");
        newTodoDiv.innerHTML = `<div id=${todo.id} class="todo-item">
            <div class="todo-item__todo-box">
              <input class="check-button" onchange="myGlobalMarkTodo(this, ${
                todo.id
              })"  type="checkbox" ${todo.isChecked ? "checked" : ""} />
              <p style="text-decoration: ${
                todo.isChecked ? "line-through" : "none"
              }" class="todo-text">${todo.todoText}</p>
            </div>
            <div class="todo-container__button-box">
              <img class="saveBtn" width="25px" height="25px" src="./src/assets/save.svg" alt="">
              <img class="editBtn" onclick="myGlobalEditTodo(this,'${
                todo.id
              }')" width="25px" height="25px" src="./src/assets/edit.svg" alt="">
              <img class="deleteBtn"  onclick="myGlobalDeleteTodo('${
                todo.id
              }')" width="25px" height="25px" src="./src/assets/delete.svg" alt="">
            </div>
          </div>`;
        todoContainer.append(newTodoDiv);
      });
    }
  }

  function addNewTodo(todo) {
    if (!localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify([]));
    }
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    storedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(storedTodos));
    showAlert("Todo successfully added to the database.", "success");
    fetchAllTodos();
  }

  document.getElementById("saveBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const todoText = document.getElementById("todo-input").value;
    if(todoText===""){
      showAlert("Please enter something.", "warning");
      return;
    }
    const timeStamp = Date.now();
    const newTodo = { todoText: todoText, id: timeStamp, isChecked: false };
    addNewTodo(newTodo);
  });
});
