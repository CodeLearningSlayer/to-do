import * as flsFunctions from "./modules/functions.js";
import barba from "@barba/core";
import  getApp from "./modules/getApp.js";

window.addEventListener("DOMContentLoaded", ()=>{


    const firstAnimLine = document.querySelector(".line-1");
    const secondAnimLine = document.querySelector(".line-2");
    const tryLink = document.querySelector(".try__link");
    
    const preloader = document.createElement("div");
    preloader.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 100 100">
            <polyline class="line-cornered stroke-still" points="0,0 100,0 100,100" stroke-width="10" fill="none"></polyline>
            <polyline class="line-cornered stroke-still" points="0,0 0,100 100,100" stroke-width="10" fill="none"></polyline>
            <polyline class="line-cornered stroke-animation" points="0,0 100,0 100,100" stroke-width="10" fill="none"></polyline>
            <polyline class="line-cornered stroke-animation" points="0,0 0,100 100,100" stroke-width="10" fill="none"></polyline>
        </svg>
    `;
    preloader.classList.add("preloader");

    console.log(preloader);


    function pageTransition(){
        document.body.classList.add("transition");
        const childs = Array.from(document.body.children);
        const hidePreloder = new Promise( async (resolve) => {
            const addPreloader = await setTimeout(() => {
                document.body.prepend(preloader);
                resolve();
            }, 800);
        });

        hidePreloder.then(()=>{
            setTimeout(() => {
                preloader.classList.add("preloader--hide");
                childs.forEach((child) => child.remove());
            }, 1000);
            document.body.classList.add("animated");
        });
        
    }
    
    try{
            firstAnimLine.addEventListener("animationend", function(e){
            firstAnimLine.classList.add("line-1--typed");
            secondAnimLine.classList.add("line-2--animated");
        });
    }

    catch{};
    

    try{
        secondAnimLine.addEventListener("animationend", function(e){
            secondAnimLine.classList.add("line-2--typed");
            tryLink.classList.add("try__link--animated");
        });
    }
    catch{};
    
    
    // tryLink.addEventListener("click", pageTransition);

    function delay(n){
        n = n ?? 2000;
        return new Promise(done => {
            setTimeout(()=>{
                done();
            }, n);
        });
    }


    barba.init({
        sync: true,

        transitions: [
            {
                name:'swipe-transition',
                async leave(){
                    const done = this.async();

                    pageTransition();
                    await delay(1500);
                    done();

                }
            }
        ]

    });

});

getApp();

// flsFunctions.testWebP();