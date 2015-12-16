sliderInt = 1; //slider default on load
sliderNext = 2; //next image in order

$(document).ready(function(){

    $('.quickslider > img#1').fadeIn(300); // initially load first slider on load
    $('.nav-thumbs a:first').addClass('active'); // add active class to first dot
    startSlider();
    $('.left').click(function(){
        prev();
        $('.nav-thumbs a').removeClass('active');
    });
    $('.right').click(function(){
        next();
        $('.nav-thumbs a').removeClass('active');
    });
    $('.nav-thumbs a').click(function(){
        $('.nav-thumbs a').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-slide');
        showSlide(id);
    });

});

function startSlider(){
    count = $('.quickslider > div').size(); //variable to count all the list items or img
    loop = setInterval(function(){

        if(sliderNext>count){
            sliderNext = 1; // set to beginning after completion of slides list
            sliderInt = 1; // set the Integer number back to 1 also
        }

        $('.quickslider > div').fadeOut(300); // fadeout all images
        $('.quickslider > div#'+sliderNext).fadeIn(300); // use sliderNext to calculate the next slider id
        sliderInt = sliderNext; // update so that the current slide = 2 as set globally
        sliderNext = sliderNext + 1; // calculate the next image

    }, 3000); // after milliseconds loop
}

//previous function
function prev(){
    //calculate the slide which comes before the current slide
    newSlide = sliderInt - 1; // current slide minus 1 added to variable called newSlide
    showSlide(newSlide); // pass information from  newSlide above to function showSlide

}

function next(){
    //calculate the slide which comes after the current slide
    newSlide = sliderInt + 1; // current slide plus 1 added to variable called newSlide
    showSlide(newSlide); // pass information from  newSlide above to function showSlide
}

function stopLoop(){
    window.clearInterval(loop); //clear interval of loop so that it does not skip images when in between intervals, ie. the 300 miliseconds just about to complete, and clicking on next will make it seem as though the you have clicked through two images 

}

function showSlide(id){ // id is the variable name of what we will be calling which will be passed
    stopLoop(); // call function that we have declared above so that the interval is cleared and restarted

        if(id > count){
            id = 1; // if id = more than the count of images then set back to 1
        }else if(id < 1){
            id = count; // if id = less than count of list then set back to 4 or whatever number of images
        }

        $('.quickslider > div').fadeOut(300); // fadeout all images
        $('.quickslider > div#'+id).fadeIn(300); // use sliderNext to calculate the next slider id
    
        $('.nav-thumbs > a#'+id).addClass('active');

        sliderInt = id; // update so that the current slide = 2 as set globally
        sliderNext = id + 1; // calculate the next image
        startSlider(); // start the slider process again, as it was stopped before
}

$('.quickslider > div').hover(function(){
        stopLoop(); // stops the loop when image is hovered over
},
function(){
    startSlider(); // starts where the loop left off
});