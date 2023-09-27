import { deleteLocalItem, getLocalItem, setLocalItem } from "./localStorage.js";
import languageSet from "./languageSet.js";

// Elements
const appName = document.querySelector(".app-name");
const formBtn = document.querySelector(".form-btn");
const form = document.querySelector(".task-form");
const taskInput = document.getElementById('task-input');
const deadlineInput = document.getElementById('deadline-input');
const taskCardContainer = document.querySelector(".task-card-container");
const langBtns = document.querySelectorAll(".language-btn");
let deleteBtns;
let editBtns;

let todoList = getLocalItem("todo");
if (!todoList) {
  setLocalItem("todo", [
  ]);
}
/* language */
let currLang = "en";
let formState = 'add';
let editedItemPos;

langBtns.forEach((item) => {
  item.addEventListener("click", () => {
    currLang = item.getAttribute("value");
    changeLang();
    langBtns.forEach((btn) => {
      if (btn.getAttribute("value") === currLang) {
        btn.classList.add("active-language-btn");
      } else {
        btn.classList.remove("active-language-btn");
      }
    });
  });
});

const renderList = () => {
  let todoList = getLocalItem("todo");
  taskCardContainer.innerHTML = "";
  todoList.forEach((item, index) => {
    taskCardContainer.innerHTML += `<div value = ${item.id} class="task-card">
    <p><span class="desc">${languageSet[currLang].todoCard.task}</span>${item.task}</p>
    <p><span class="desc">${languageSet[currLang].todoCard.deadline}</span>${item.deadline}</p>
    <div class="task-btn-area">
    <button value=${item.id} class="task-card-btn edit-btn">${languageSet[currLang].button.edit}</button>
    <button value=${item.id} class="task-card-btn delete-btn" >${languageSet[currLang].button.discard}</button>
    </div>`;
  });
}

const addTaskCardEvent = () => {
  deleteBtns = document.querySelectorAll(".delete-btn")
  deleteBtns.forEach((deleteBtn) => {
    const deleteTask = () => {
      todoList = todoList.filter((item) => item.id != deleteBtn.value);
      setLocalItem("todo", todoList);
      renderList();
      addTaskCardEvent();
    }
    deleteBtn.addEventListener("click", deleteTask)
  })

  editBtns = document.querySelectorAll(".edit-btn")
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      const editedItem = todoList.find((item, index) => {
        editedItemPos = index;
        return item.id.toString() == editBtn.value
      });
      taskInput.value = editedItem.task
      deadlineInput.value = dayjs(editedItem.deadline).format('YYYY-MM-DDTHH:mm');
      formState = 'edit';
      formBtn.innerText = languageSet[currLang].button.editCard;
    })

  })
};

const prepareList = () => {
  renderList();
  addTaskCardEvent();
}

const changeLang = () => {
  appName.innerText = languageSet[currLang].appName;
  if (formState === 'add') {
    formBtn.innerText = languageSet[currLang].button.addCard;
  } else {
    formBtn.innerText = languageSet[currLang].button.editCard;
  }
  prepareList();
};
changeLang();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target, formBtn);
  const formProps = Object.fromEntries(formData);
  formProps.deadline = dayjs(formProps.deadline).format('MM-DD-YYYY HH:mm');
  if (formState === 'add') {
    formProps.id = Date.now()
    todoList.push(formProps);
  } else {
    formProps.id = todoList[editedItemPos].id
    todoList[editedItemPos] = formProps;
    formState = 'add';
    formBtn.innerText = languageSet[currLang].button.addCard
  }
  // validate form
  if (!formProps.task || formProps.deadline === "Invalid Date") {
    window.alert(languageSet[currLang].message.formAlert)
  } else if (todoList.length > 20) {
    window.alert(languageSet[currLang].message.maximumTaskCard);
    todoList.pop()
  } else {
    setLocalItem("todo", todoList);
    prepareList();
  }
});
