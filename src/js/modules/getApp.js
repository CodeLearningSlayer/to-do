import { getTasks } from "../services/getAndSend.js";

export default function getApp(){
    class Task {
        constructor(text, type, parentSelector) {
            this.text = text;
            this.isCompleted = false;
            this.parent = parentSelector;
            this.type = type;
        }
        render(){
            const task = document.createElement("li");
            this.elem = task;
            const editButton = document.createElement("div");
            const removeButton = document.createElement("div");
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            
            checkbox.className = "task__checkbox";
            task.className = "task";
            editButton.className = "task__edit";
            removeButton.className = "task__remove";

            checkbox.type = "checkbox";

            
            
            label.innerHTML = `
                <label class="task__label">
                    ${checkbox.outerHTML}
                    <div class="task__checkbox-styled"></div>
                    ${this.text}
                </label>
            `;
            
            task.innerHTML = ` 
            ${label.innerHTML}
            <div class="task__actions">
                ${editButton.outerHTML}
                ${removeButton.outerHTML}
            </div>
            `;
            
           
            //повесить на input?
            task.addEventListener("click", (e) => {
                console.log(e.target);
                if (e.target.className === removeButton.className){
                    // task.remove(); // здесь как-то передать this в removeTask
                    const remove = new Event("delete");
                    task.dispatchEvent(remove); //запускать на том же элементе, что и отлавливать
                }
                else if(e.target.className === task.className){
                    // e.stopImmediatePropagation();
                    if(!task.querySelector(`.${checkbox.className}`).checked){
                        task.querySelector(`.${checkbox.className}`).checked = true;
                    }
                    else{
                        task.querySelector(`.${checkbox.className}`).checked = false;
                    }
                    task.querySelector(`.${checkbox.className}`).onchange();
                }
                
            }, true);

  
            task.querySelector(`.${checkbox.className}`).onchange = () =>{
                const remove = new Event("changeState");
                this.isCompleted = !this.isCompleted;
                this.elem.dispatchEvent(remove);
            };

            if (this.isCompleted){
                task.querySelector(".task__checkbox").checked = true;
            }

            
            this.parent.append(task);
        }

        replace(newParentSelector){
            this.parent = newParentSelector;
        }
        
    }
    
    class PlannedTask extends Task{
        constructor(text, parentSelector, deadline){
            super(text, parentSelector);
            this.deadline = deadline;
        }
    }

    class ToDoList {
        constructor(collectionHtmlElement, collection){ //arrOfTasks приходит с сервера
            this.list = collectionHtmlElement || document.body;
            this.completed = [];
            this.toDo = [];
            this.collection = collection;
            this.visibleToDoList = [];
            this.visibleCompletedList = [];
        }

        createAddInput(parentSelector){
            const addInputForm = document.createElement("div");
            const input = document.createElement("input");

            input.className = "add-form__input";
            addInputForm.className = "add-form__inner";

            input.placeholder = "Add a task";
            input.type = "text";


            addInputForm.innerHTML = `
                <div class="input__wrapper">
                    ${input.outerHTML}
                </div>
            `;

            document.querySelector(parentSelector).prepend(addInputForm);

            addInputForm.addEventListener("keydown", (e)=>{
                if (e.target.className === input.className && e.code === "Enter"){
                    let newTask = new Task(e.target.value, document.querySelector(".nav__item--active").textContent.toLowerCase(), this.toDoList);

                    this.toDo.push(newTask);
                    this.renderList(this.toDo);
                    this.refreshTaskCount(".tasks__title", "toDo");
                    this.createListeners(this.toDo);
                }
            });
            
        }

        createToDoList(parentSelector){
            this.toDoList = document.createElement("ul");
            const title = document.createElement("h6");

            title.className = "tasks__title";

            this.toDoList.className = "tasks__items";

            document.querySelector(parentSelector).append(title);
            document.querySelector(parentSelector).append(this.toDoList);
        }

        createCompletedList(parentSelector){

            this.completedList = document.createElement("ul");
            const title = document.createElement("h6");

            title.className = "completed__title";

            this.completedList.className = "completed__items";

            document.querySelector(parentSelector).append(title);
            document.querySelector(parentSelector).append(this.completedList);
        }

        renderWindow(firstList, secondList){
            
            this.renderList(firstList);
            this.renderList(secondList);

            this.createListeners(firstList);
            this.createListeners(secondList);

            this.refreshTaskCount(".tasks__title", "toDo");
            this.refreshTaskCount(".completed__title", "completed");
        }

        refreshTaskCount(selector, type){
            if(type === "toDo"){
                document.querySelector(selector).textContent = `Tasks - ${document.querySelector(selector).nextSibling.children.length}`;
            }
            else{
                document.querySelector(selector).textContent = `Completed - ${document.querySelector(selector).nextSibling.children.length}`;
            }
        }

        addCollections(parentSelector){

            const collections = document.createElement("div");
            const title = document.createElement("h6");
            const itemsList = document.createElement("ul");

            collections.className = "collections";
            title.className = "collections__title";
            itemsList.className = "collections__nav";
            
            title.textContent = "Collections";
            
            const collectionArr=[];

            for(let i=0; i<3; i++){
                const collection = document.createElement("li");
                collection.addEventListener("click", function(){
                    collectionArr.forEach(item => item.classList.remove("nav__item--active"));
                    this.classList.add("nav__item--active");
                });
                 collectionArr.push(collection);

            }
            
            for(let i=0; i<collectionArr.length; i++){
                collectionArr[i].classList.add("nav__item");
                switch(i){
                    case 0:
                        collectionArr[i].classList.add("nav__item--daily");
                        collectionArr[i].classList.add("nav__item--active");
                        collectionArr[i].textContent = "Daily";
                        break;
                    case 1:
                        collectionArr[i].classList.add("nav__item--today"); 
                        collectionArr[i].textContent = "Today";
                         break;
                    case 2:
                        collectionArr[i].classList.add("nav__item--plans"); 
                        collectionArr[i].textContent = "Plans";
                        break;
                }
            }
            
            collectionArr.forEach(tab => {
                itemsList.append(tab);
            });

            collections.append(title);
            collections.append(itemsList);
            document.querySelector(parentSelector).append(collections);

            collections.addEventListener("click", (e)=>{
                if (e.target.classList.contains("nav__item--daily")){

                    this.visibleToDoList = this.toDo.filter(task => task.type === "daily");
                    this.visibleCompletedList = this.completed.filter(task => task.type === "daily");

                    console.log(this.visibleToDoList);
                    console.log(this.visibleCompletedList);

                    this.renderWindow(this.visibleToDoList, this.visibleCompletedList);

                }
                if (e.target.classList.contains("nav__item--today")){
                
                    this.visibleToDoList = this.toDo.filter(task => task.type === "today");
                    this.visibleCompletedList = this.completed.filter(task => task.type === "today");

                    this.renderWindow(this.visibleToDoList, this.visibleCompletedList);


                }
                if (e.target.classList.contains("nav__item--plans")){
                    
                    this.visibleToDoList = this.toDo.filter(task => task.type === "plans");
                    this.visibleCompletedList = this.completed.filter(task => task.type === "plans");

                    this.renderWindow(this.visibleToDoList, this.visibleCompletedList);

                }
            });
        }


        createList(data, stateOfTasks){ //создание списка объектов задач
            data.forEach(task => {
                if (stateOfTasks === "toDo"){
                    this.toDo.push(new Task(task.text, task.type, this.toDoList));
                }
                if (stateOfTasks === "completed"){
                    let newTask = new Task(task.text, task.type, this.completedList);
                    newTask.isCompleted = true;
                    this.completed.push(newTask);
                }
            });
        }

        async getData(url, stateOfTasks){ //заполняем массивы задач в зависимости от их состояния //т.к. асинхронна, выполняется последней - исправить
            const data = await getTasks(url);
            this.createList(data, stateOfTasks);
        }

        removeTask(task, tasksArr){ //работа с dom-деревом

            tasksArr.splice(tasksArr.indexOf(task), 1);

            this.refreshTaskCount(".tasks__title", "toDo");
            this.refreshTaskCount(".completed__title", "completed");

            this.renderList(tasksArr);
            this.createListeners(tasksArr);

        }

        renderList(tasksArr){ //рендерим список задач
            if(tasksArr === this.toDo || tasksArr === this.visibleToDoList){
                this.toDoList.innerHTML = "";
            }
            else{
                this.completedList.innerHTML = "";
            }
            tasksArr.forEach(task => {
                task.render();
            });
        }
        
        createListeners(tasksArr){ //создание обработчиков событий для удаления из списка
            tasksArr.forEach(task => {
                task.elem.addEventListener("delete", () => {
                    this.removeTask(task, tasksArr);
                });

                task.elem.addEventListener("changeState", () => {
                    console.log(task);
                    if(task.isCompleted){
                        console.log(task.text + " completed");
                        task.replace(this.completedList);
                        this.completed.push(task);
                        this.toDo.splice(this.toDo.indexOf(task), 1);
                    }
                    else{
                        console.log(task.text + " is not completed");
                        this.toDo.push(task);
                        task.replace(this.toDoList);
                        this.completed.splice(this.completed.indexOf(task), 1);
                    }

                    this.renderList(this.toDo);
                    this.createListeners(this.toDo);

                    this.renderList(this.completed);
                    this.createListeners(this.completed);

                    this.refreshTaskCount(".tasks__title", "toDo");
                    this.refreshTaskCount(".completed__title", "completed");
                
                });

            });
        }
            

        async start(){
            this.addCollections(".left-side");
            this.createAddInput(".right-side");
            
            this.createToDoList(".right-side .tasks");
            this.createCompletedList(".completed");

            await this.getData('http://localhost:4000/toDo', "toDo");
            await this.getData('http://localhost:4000/completed', "completed");

            this.refreshTaskCount(".tasks__title", "toDo");
            this.refreshTaskCount(".completed__title", "completed");


            this.renderList(this.toDo);
            this.createListeners(this.toDo);

            this.renderList(this.completed);
            this.createListeners(this.completed);
        }

    }
    const tasksList = new ToDoList(document.querySelector(".tasks__items"));
    // const tasksArr = [new Task("Помыть голову", tasksList.list)]; //Должен передаваться в метод, т.к. берётся с сервера

    tasksList.start();
    
}