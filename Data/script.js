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

//Controlls
window.onkeydown = function(e){
    //Jump
    if (e.shiftKey) {
        /*shift is down*/
        if(character.classList == "animate"){return}
        character.classList.add("animate");
        setTimeout(function(){
        character.classList.remove("animate");
        },300);
        
    }
    //Sneak
    if (e.ctrlKey) {
        /*ctrl is down*/
        document.getElementById("character").style.height="20px";
        document.getElementById("character").style.top="150px";
        document.getElementById("character").src="SPRITES/sneak.gif";
        document.getElementById("block").style.top="80px";
        setTimeout(function(){
            document.getElementById("character").style.height="40px";
            document.getElementById("character").style.top="130px";
        document.getElementById("block").style.top="60px";
        document.getElementById("character").src="SPRITES/player.gif";
            },600);
    }
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
    let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
    let blockBottom = parseInt(window.getComputedStyle(block).getPropertyValue("bottom"));
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
    if(blockLeft<20 && blockLeft>-20 && characterTop>=130){
    
        //block.style.animation = "none";
        location.href = "gameover.html";
        //alert("Game Over! score: "+Math.floor(counter/100));
        //highscore
        
        if(counter > document.getElementById("highscore").innerHTML){
            
            localStorage.setItem("yourscore", counter)
            document.getElementById("highscore").innerHTML = (counter);
        }
        counter=-1;
        
    }else{
        
       
    }
}, 10);

//random Enemy
var intervalId = window.setInterval(function(){
    let randomenemy = Math.floor(Math.random() * 7);
if (randomenemy < 1){
    block.style.animation = "none";
}

if(randomenemy > 4)
{
    block.style.animation = "speedblock 1s infinite linear";
}
else{
    block.style.animation = "block 1s infinite linear";
}
  }, 1000);

  


