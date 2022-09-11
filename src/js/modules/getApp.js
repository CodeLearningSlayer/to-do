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
            const checkbox = document.createElement("label");

            task.className = "task";
            editButton.className = "task__edit";
            removeButton.className = "task__remove";


            checkbox.innerHTML = `
            <label class="task__label">
                <input type="checkbox" class="task__checkbox">
                <div class="task__checkbox-styled"></div>
                ${this.text}
            </label>
            `;

            task.innerHTML = ` 
                
                    ${checkbox.innerHTML}
                    <div class="task__actions">
                        ${editButton.outerHTML}
                        ${removeButton.outerHTML}
                    </div>
                
            `;


            task.addEventListener("click", (e)=>{
                if (e.target.className === task.className){
                    if(!task.querySelector(".task__checkbox").checked){
                        task.querySelector(".task__checkbox").checked = true;
                        this.isCompleted = true;
                    }
                    else{
                        task.querySelector(".task__checkbox").checked = false;
                        this.isCompleted = false;
                    }
                }
                if (e.target.className === removeButton.className){
                    task.remove(); // здесь как-то передать this в removeTask
                    const remove = new Event("delete");
                    task.dispatchEvent(remove); //запускать на том же элементе, что и отлавливать
                }
            });

            

            
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
        constructor(collectionHtmlElement){ //arrOfTasks приходит с сервера
            this.list = collectionHtmlElement || document.body;
            this.completed = [];
            this.toDo = [];
            this.planned = [];
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


        createList(arrOfTasks){
            arrOfTasks.forEach(task => {
                if (task.type === "daily" || task.type === "today"){
                    this.toDo.push(new Task(task.text, this.list));
                }
                else if(task.type === "planned"){
                    this.planned.push(new PlannedTask(task.text, this.list, task.deadline));
                }
            });
        }

        getData(url){
            getTasks(url)
            .then(data => {
                console.log(data);
            });
        }

        removeTask(task, tasksArr){ //работа с dom-деревом
            if (task.isCompleted){
                this.completed.splice(this.completed.indexOf(task)); //запуск рендера по новой
            }
            else{
                this.toDo.splice(this.toDo.indexOf(task));
            }
            tasksArr.splice(tasksArr.indexOf(task), 1);
            this.renderList(tasksArr);
        }

        renderList(tasksArr){
            tasksArr.forEach(task => {
                task.render();    
            });
        }
        
        createListeners(tasksArr){
            tasksArr.forEach(task => {
                task.elem.addEventListener("delete", () => {
                    this.removeTask(task, tasksArr);
                });
            });
            
        }



    }

    const tasksList = new ToDoList(document.querySelector(".tasks__items"));
    const tasksArr = [new Task("Помыть голову", tasksList.list)]; //Должен передаваться в метод, т.к. берётся с сервера

    tasksList.renderList(tasksArr);
    tasksList.createListeners(tasksArr);
    tasksList.getData("http://localhost:3000/completed");
    // console.log(fetch("http://localhost:3000"));
}