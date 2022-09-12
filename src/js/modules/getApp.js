import { getTasks } from "../services/getAndSend.js";

export default function getApp(){
    class Task {
        constructor(text, parentSelector) {
            this.text = text;
            this.isCompleted = false;
            this.parent = parentSelector;
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
            task.addEventListener("click", (e)=>{
                const change = new Event("changeState");
                if (e.target.className === task.className){
                    console.log("создаю обработчики на изменение");
                    if(!task.querySelector(".task__checkbox").checked){
                        task.querySelector(".task__checkbox").checked = true;
                        this.isCompleted = true;
                        // this.dispatchEvent(change);
                    }
                    else{
                        task.querySelector(".task__checkbox").checked = false;
                        this.isCompleted = false;
                        // this.dispatchEvent(change);
                    }
                }
                if (e.target.className === removeButton.className){
                    // task.remove(); // здесь как-то передать this в removeTask
                    const remove = new Event("delete");
                    task.dispatchEvent(remove); //запускать на том же элементе, что и отлавливать
                }
            });


            if (this.isCompleted){
                task.querySelector(".task__checkbox").checked = true;
            }

            
            this.parent.append(task);
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
                    let newTask = new Task(e.target.value, this.toDoList);

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

        refreshTaskCount(selector, type){
            if(type === "toDo"){
                document.querySelector(selector).textContent = `Tasks - ${this.toDo.length}`;
            }
            else{
                document.querySelector(selector).textContent = `Completed - ${this.completed.length}`;
            }
        }

        addCollections(){
            const dailyTasks = document.createElement("div");
            const todayTasks = document.createElement("div");
            const planTasks = document.createElement("div");

            dailyTasks.innerText = "Daily";
            todayTasks.innerText = "Today";
            planTasks.innerText = "Plans";

            dailyTasks.addEventListener("click", ()=>{

            });
        }


        createList(data, stateOfTasks){ //создание списка объектов задач
            data.forEach(task => {
                if (stateOfTasks === "toDo"){
                    this.toDo.push(new Task(task.text, this.toDoList));
                }
                if (stateOfTasks === "completed"){
                    let newTask = new Task(task.text, this.completedList);
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
            if (task.isCompleted){
                this.completed.splice(this.completed.indexOf(task), 1); //запуск рендера по новой
                this.refreshTaskCount(".completed__title", "completed");
            }
            else{
                this.toDo.splice(this.toDo.indexOf(task), 1);
                this.refreshTaskCount(".tasks__title", "toDo");
            }
            console.log(tasksArr);
            this.renderList(tasksArr);
            this.createListeners(tasksArr);

        }

        renderList(tasksArr){ //рендерим список задач
            if(tasksArr === this.toDo){
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
                        this.completed.push(task);
                        this.toDo.splice(this.toDo.indexOf(task));
                    }
                    else{
                        this.toDo.push(task);
                        this.completed.splice(this.completed.indexOf(task));
                    }
                    // this.renderList(this.toDo);
                    // this.renderList(this.completed);
                });

                });
        }
            

        async start(){
            
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