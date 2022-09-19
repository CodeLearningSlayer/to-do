const postTask = async (url, task) => {
    let newTask = {
        text: task.text,
        type: task.type,
        id: task.id
    };
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type" : 'application/json',
        },
        body: JSON.stringify(newTask)
    });

    return await res.json();
};

const getTasks = async(url) =>{
    const res = await fetch(url);
    if (!res.ok){
        throw new Error("Connection error");
    }

    return await res.json();
};

const deleteTask = async(url, taskId) => {

    const res = await fetch(`${url}/${taskId}`, {
        method: "DELETE",
    });

};

export {postTask};
export {getTasks};
export {deleteTask};