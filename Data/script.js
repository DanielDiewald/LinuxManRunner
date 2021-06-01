//setscoreonstart
function checksavescore(){
    document.getElementById("highscore").innerHTML = localStorage.getItem("yourscore");
    document.getElementById("lastscore").innerHTML = localStorage.getItem("lastscore");

    
}
var character = document.getElementById("character");
var block = document.getElementById("block");
var erika = document.getElementById("erika");
var counter=0;
var score = 0;
//Jump + Animation
function jump(){
    if(character.classList == "animate"){return}
    character.classList.add("animate");
    setTimeout(function(){
        character.classList.remove("animate");
    },300);
}

//Score
if(counter > 10){
    var x = setInterval(function() {
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter);
        localStorage.setItem("lastscore", counter)
    }, 100);
    
}
else{
    var x = setInterval(function() {
        counter++;
        document.getElementById("scoreSpan").innerHTML = Math.floor(counter);
        localStorage.setItem("lastscore", counter)
    }, 500);
}





//checkDead
var checkDead = setInterval(function() {
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
        block.style.animation = "none";
        location.href = "gameover.html";
        //alert("Game Over! score: "+Math.floor(counter/100));
        //highscore
        
        if(counter > document.getElementById("highscore").innerHTML){
            
            localStorage.setItem("yourscore", counter)
            document.getElementById("highscore").innerHTML = (counter);
        }
        counter=-1;
        block.style.animation = "block 1s infinite linear";
    }else{
        //counter++;
        //document.getElementById("scoreSpan").innerHTML = Math.floor(counter/100);
    }
}, 10);


  


