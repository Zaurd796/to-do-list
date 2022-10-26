document.addEventListener("DOMContentLoaded", function() {

  const form = document.querySelector("#addForm");
  const newItemInput = form.querySelector("#newItemText");
  const itemList = document.querySelector("#items");
  const filter = document.querySelector("#filter");

  let tasks = [];

  // Идём в localStorage и получаем оттуда задачи
  // Если данные есть, тогда забираем их, парсим из JSON в массив и записываем в массив tasks
  // Если данных нет, тогда оставляем переменную tasks пустым массивом
  if (localStorage.getItem("tasks")) {
    const JSONdataFromLS = localStorage.getItem("tasks");
    tasks = JSON.parse(JSONdataFromLS);
  }

  // На основе массива tasks рендерим эти задачи на странице
  tasks.forEach(function(item) {
    renderTask(item);
  });
  
  // 1. Добавление новой задачи.

  form.addEventListener("submit", addItem);

  function addItem(e) {
    // Отменяем отправку формы
    e.preventDefault();

    // Получаем текст из инпута
    let newItemText = newItemInput.value;

    renderTask(newItemText);

    // Добавляем задачу в массив с задачами
    tasks.push(newItemText);
    
    // Обновить список задач в localStorage
    const jsonTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", jsonTasks);

    // Очистим поле добавления новой задачи
    newItemInput.value = "";
  }

  function renderTask(taskText) {
    // Создаём элемент для новой задачи
    const newElement = document.createElement("li");
    newElement.classList.add("list-group-item");
    

    // Добавим текст в новый элемент
    const newTextNode = document.createTextNode(taskText);
    newElement.append(newTextNode);
  
    // Создаём кнопку
    const deleteBtn = document.createElement("button");

    // Добавляем текст
    deleteBtn.append(document.createTextNode("Удалить"));

    // Добавляем класс
    deleteBtn.classList.add("btn", "btn-light", "btn-sm", "float-right");
    
    // Добавляем data-атрибут
    deleteBtn.dataset.action = "delete";
    
    // Добавляем атрибут type
    deleteBtn.setAttribute("type", "button");

    // Помещаем кнопку внутрь тэга li
    newElement.append(deleteBtn);

    // Добавляем новую задачу в список всех задач
    itemList.prepend(newElement);
}

  // Удаление задачи

  itemList.addEventListener("click", removeItem);

  function removeItem(e) {
    if (e.target.hasAttribute("data-action") && e.target.getAttribute("data-action") === "delete") {
      // Удаляем задачу из HTML разметки
      if (confirm("Удалить задачу?")) {
        e.target.parentElement.remove();
      }

      // Удаляем из массива tasks
      // Получаем текст задачи которую надо удалить
      const taskText = e.target.closest(".list-group-item").firstChild.textContent;
      // Находим индекс задачи в массиве задач
      const index = tasks.findIndex(item => item === taskText);
      // Удаляем элемент из массива tasks
      if (index !== -1) {
        tasks.splice(index, 1);
      }

      // Обновляем localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  // Фильтрация списка

  filter.addEventListener("input", filterItems);

  function filterItems(e) {
    // Получаем фразу для поиска и переводим в нижний регистр
    let searchedText = e.target.value.toLowerCase();

    // Получаем список всех задач
    const items = itemList.querySelectorAll("li");

    // Перебираем все найденные тэги li циклом
    items.forEach(function(item) {
      
      // Получаем текст задачи из списка
      let itemText = item.firstChild.textContent.toLocaleLowerCase();

      // Проверяем вхождение искомой подстроки
      if (itemText.indexOf(searchedText) !== -1) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
  




});