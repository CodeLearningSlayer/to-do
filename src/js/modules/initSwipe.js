export function initSwipe(){
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    const leftMenu = document.querySelector(".left-side");

    let x1 = null;
    let y1 = null;

    function handleTouchStart(e){

        const firstTouch = e.touches[0];

        x1 = firstTouch.clientX;
        y1 = firstTouch.clientY;

    }

    function handleTouchMove(e){

        if (!x1 || !y1){
            return false;
        }
        
        let x2 = e.touches[0].clientX;
        let y2 = e.touches[0].clientY;

        let diffX = x2 - x1;
        let diffY = y2 - y1;

        console.log(x2, y2);

        if(Math.abs(diffX) > Math.abs(diffY)){
            if (diffX > 0 && x1 < 20){
                leftMenu.classList.add("left-side--active");
            }
            else{
                leftMenu.classList.remove("left-side--active");
            }
        }
        else{
            if (diffY < 0){
                console.log("up");
            }
            else{
                console.log("bottom");
            }
        }
        x1 = null;
        y1 = null;

    }

}