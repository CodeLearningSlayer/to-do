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
    console.log(res);
    if (!res.ok){
        throw new Error("Connection error");
    }

    return res;
};

export {postTask};
export {getTasks};