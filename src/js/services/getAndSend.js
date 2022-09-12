const postTask = async (url, task) => {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type" : 'application/json',
        },
        body: task
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

export {postTask};
export {getTasks};