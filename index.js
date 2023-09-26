import { deleteLocalItem, getLocalItem, setLocalItem } from "./localStorage.js";
import languageSet from "./languageSet.js";

// Elements
const appName = document.querySelector(".app-name");
const formBtn = document.querySelector(".form-btn");
const form = document.querySelector(".task-form");
const taskCardContainer = document.querySelector(".task-card-container");
const langBtns = document.querySelectorAll(".language-btn");

const todoList = getLocalItem("todo");
if (!todoList) {
  setLocalItem("todo", [
  ]);
}
/* language */
let currLang = "en";

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
  taskCardContainer.innerHTML = "";
  todoList.forEach((item) => {
    taskCardContainer.innerHTML += `<div value = ${item.id} class="task-card">
    <p><span class="desc">${languageSet[currLang].todoCard.task}</span>${item.task}</p>
    <p><span class="desc">${languageSet[currLang].todoCard.deadline}</span>${item.deadline}</p>
    <div class="task-btn-area">
    <button class="task-card-btn edit-btn">${languageSet[currLang].button.edit}</button>
    <button class="task-card-btn delete-btn">${languageSet[currLang].button.discard}</button>
    </div>`;
  });
};

const changeLang = () => {
  appName.innerText = languageSet[currLang].appName;
  formBtn.innerText = languageSet[currLang].button.addCard;
  renderList();
};

changeLang();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target, formBtn);
  const formProps = Object.fromEntries(formData);
  formProps.deadline = dayjs(formProps.deadline).format('MM-DD-YYYY HH:mm');
  formProps.id = Date.now()
  todoList.push(formProps);
  setLocalItem("todo", todoList);
  renderList();
});
