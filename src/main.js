document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  // Event listener for the filters
  function capitalizeFirstLetter(text) {
    let capitalizeTypeText = text.charAt(0).toUpperCase() + text.slice(1);
    return capitalizeTypeText;
  }
  // Function to show alert with a 'msg' and 'alert-type'
  function showAlert(msg, type) {
    let alertDiv = document.createElement("div");
    alertDiv.innerText = msg;
    let capitalizeTypeText;
    if (type === "success") {
      alertDiv.style.background = "#35ae4dff";
      capitalizeTypeText = type.charAt(0).toUpperCase() + type.slice(1);
      alertDiv.innerText = capitalizeTypeText + ": " + msg;
    } else if (type === "warning") {
      alertDiv.style.background = "#ff9966";
      capitalizeTypeText = type.charAt(0).toUpperCase() + type.slice(1);
      alertDiv.innerText = capitalizeTypeText + ": " + msg;
    } else if (type === "danger") {
      alertDiv.style.background = "#c54033ff";
      alertDiv.innerText = msg;
    }
    alertDiv.classList.add("alert-box");
    alertDiv.style.display = "flex";
    document.getElementsByTagName("body")[0].append(alertDiv);
  }
  // Code to mark a todo
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
      fetchAllTodos(findFilteredTodos(filters.value));
      setTimeout(() => {}, 1000);
    }
  }
  // Code to edit a todo
  function editTodo(currentElement, todoId) {
    if (localStorage.getItem("todos")) {
      const storedTodos = JSON.parse(localStorage.getItem("todos"));
      storedTodos.forEach((todo, index, array) => {
        if (todo.id == todoId) {
          if (todo.isChecked === true) {
            showAlert("Can't edit a completed todo.", "warning");
            return;
          } else {
            const todoTextPara =
              currentElement.parentNode.previousElementSibling.lastElementChild;
            todoTextPara.contentEditable = true;
            todoTextPara.style.outline = "none";
            todoTextPara.style.outline = "none";
            todoTextPara.style.background = "gray";
            todoTextPara.style.padding = "2px 4px";
            todoTextPara.focus();
            currentElement.style.display = "none";
            currentElement.previousElementSibling.style.display = "flex";
            currentElement.previousElementSibling.addEventListener(
              "click",
              (e) => {
                let editedTodoText = todoTextPara.innerText;
                currentElement.style.display = "flex";
                currentElement.previousElementSibling.style.display = "none";
                storedTodos.forEach((todo, index, array) => {
                  if (todo.id == todoId) {
                    const editedTodo = { ...todo, todoText: editedTodoText };
                    array[index] = editedTodo;
                  }
                });
                localStorage.setItem("todos", JSON.stringify(storedTodos));
                showAlert("Todo edited successfully.", "success");

                fetchAllTodos(findFilteredTodos(filters.value));
              }
            );
          }
        }
      });
    }
  }
  // Code to delete a todo
  function deleteTodo(todoId) {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "flex";
    if (modal.style.display === "flex") {
      document
        .getElementById("confirm-delete-button")
        .addEventListener("click", (e) => {
          e.preventDefault();
          if (localStorage.getItem("todos")) {
            const storedTodos = JSON.parse(localStorage.getItem("todos"));
            const filteredTodosAfterDeletion = storedTodos.filter(
              (item) => item.id != todoId
            );
            localStorage.setItem(
              "todos",
              JSON.stringify(filteredTodosAfterDeletion)
            );
            showAlert("Todo deleted successfully.", "danger");

            fetchAllTodos(findFilteredTodos(filters.value));
          }
          modal.style.display = "none";
        });
      document
        .getElementById("cancel-button")
        .addEventListener("click", (e) => {
          e.preventDefault();
          modal.style.display = "none";
        });
      document.getElementById("close-button").addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "none";
      });
    }
  }

  // Making the scope of that three function global which are inside the onclick buttons
  window.myGlobalEditTodo = editTodo;
  window.myGlobalDeleteTodo = deleteTodo;
  window.myGlobalMarkTodo = markTodo;

  // Function to find filtered todos
  function findFilteredTodos(filter) {
    const selectedValue = filter;
    let allTodo = [];
    if (!localStorage.getItem("todos")) {
      return;
    }
    allTodo = JSON.parse(localStorage.getItem("todos"));
    let todosToShow = [];
    if (selectedValue === "all") {
      todosToShow = allTodo;
    } else if (selectedValue === "completed") {
      todosToShow = allTodo.filter((todo) => todo.isChecked === true);
    } else if (selectedValue === "general") {
      todosToShow = allTodo.filter((todo) => todo.tag === "general");
    } else if (selectedValue === "personal") {
      todosToShow = allTodo.filter((todo) => todo.tag === "personal");
    } else if (selectedValue === "official") {
      todosToShow = allTodo.filter((todo) => todo.tag === "official");
    } else if (selectedValue === "education") {
      todosToShow = allTodo.filter((todo) => todo.tag === "education");
    }
    return todosToShow;
  }

  // Initial load of todos
  const filters = document.getElementById("filters");
  fetchAllTodos(findFilteredTodos(filters.value));

  // Event listener to check the change in the filter select
  filters.addEventListener("change", function (event) {
    const selectedValue = event.target.value;
    fetchAllTodos(findFilteredTodos(selectedValue));
  });

  // Fetching all todo
  function fetchAllTodos(todos) {
    const todoContainer = document.getElementById("todo-container");
    todoContainer.innerHTML = "";
    if (todos) {
      todos.forEach((todo) => {
        let newTodoDiv = document.createElement("div");
        newTodoDiv.innerHTML = `<div class="todo-item-parent-container">
        <div id=${todo.id} class="todo-item">
            <div class="todo-item__todo-box">
            <div class="custom-checkbox">
  <input class="check-button" onchange="myGlobalMarkTodo(this, ${
                todo.id
              })"  type="checkbox" ${todo.isChecked ? "checked" : ""} />
  <label for="myCheckbox"></label>
</div>
              
              <p style="text-decoration: ${
                todo.isChecked ? "line-through" : "none"
              }" class="todo-text">${todo.todoText}</p>
            </div>
            <div class="todo-container__button-box">
              <img title="Save" class="saveBtn" width="25px" height="25px" src="./src/assets/save-mat.svg" alt="">
              <img title="Edit" class="editBtn" onclick="myGlobalEditTodo(this,'${
                todo.id
              }')" width="25px" height="25px" src="./src/assets/edit-green.svg" alt="">
              <img title="Delete" class="deleteBtn"  onclick="myGlobalDeleteTodo('${
                todo.id
              }')" width="25px" height="25px" src="./src/assets/delete-mat.svg" alt="">
            </div>
          </div>
          <p class="todo-item__tag">${capitalizeFirstLetter(todo.tag)}</p>
          </div>`;
        todoContainer.append(newTodoDiv);
      });
    }
  }

  // Code to add new todo
  function addNewTodo(todo) {
    if (!localStorage.getItem("todos")) {
      localStorage.setItem("todos", JSON.stringify([]));
    }
    const storedTodos = JSON.parse(localStorage.getItem("todos"));
    storedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(storedTodos));
    showAlert("Todo successfully added to the database.", "success");
    document.getElementById("todo-input").value = "";
    fetchAllTodos(findFilteredTodos(filters.value));
  }

  // Event listener for save todo button
  document.getElementById("saveBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const todoText = document.getElementById("todo-input").value;
    if (todoText === "") {
      showAlert("Please enter something.", "warning");
      return;
    }
    const timeStamp = Date.now();
    const tagValue = document.getElementById("tags").value;
    const newTodo = {
      todoText: todoText,
      id: timeStamp,
      tag: tagValue,
      isChecked: false,
    };
    addNewTodo(newTodo);
  });
});
