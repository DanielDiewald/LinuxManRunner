//screenwith
$(document).ready(function(){


    var width = document.getElementById('alex').offsetWidth;
    console.log("breite", width)
                let height = document.getElementById('alex').offsetHeight;
                let windowWidth = $(document).outerWidth();
                let windowHeight = $(document).outerHeight();
                let r = 1;
                
                r = windowWidth / 500
                console.log("x", r)
                yr = (r / 5)*2
                console.log("y", yr)
                document.body.style.zoom=r
               /* $('#alex').css(
                    'transform','scaleX(' + 1 + ')'),
                });*/
  
  /* $('#alex').css(
    'zoom','scale(' + 10 + ')'),
    '-moz-transform','scale(' + 10 + ')'),
    */

});