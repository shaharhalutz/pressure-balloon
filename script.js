// pressure version of the BART
$(document).ready(function() {

    // show incompatible message
    var showIncompatibleMessage = function() {
        $('#participant').remove();
        $('#total').remove();
        $('#collect').remove();
        $('#ballon').remove();
        $('#press').remove();
        $('#gonext').remove();
        $('#round').remove();
        $('#message').html('This App is not compatible with Mobile Browsers, Please use on a desktop browser').show();
    };

    // browsing on mobile device?
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile()){
        console.log('on mobile')
        showIncompatibleMessage()
        return;
    }
    else{
        console.log('on desktop')
    }

    // SART:
    var saveThis = 'hidden'; // text fields that save data should not be shown; can be shown in testing

    function generateRandomInteger(min, max) {
        return Math.floor(min + Math.random()*(max + 1 - min))
    }

    // for every pump the chance for explotion is 1/128 , 1/127 , ....
    var shouldExplode = function(pumps){
        const base_range = 128 + 1
        var range = base_range - pumps;
        var randomIntInRange = generateRandomInteger(1,range)
        
        // chance number is 1 ? 
        if(randomIntInRange == 1){
            return true
        }

        return false
    }

    // initialize values
    var explosion_flag = 0
    var demo_rounds = 2;
    var round = 0 - demo_rounds;
    var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
    var increase = 2.2; // number of pixels by which balloon is increased each pump
    var size; // start_size incremented by 'increase'
    var pumps; 
    var total = 0; // money that has been earned in total
    var rounds_played = 30;
    var pumpmeup; // number pumps in a given round
    var number_pumps = []; // arrays for saving number of pumps
    var exploded = []; // array for saving whether ballon has exploded
    var keepCashEnabled = true

    // initialize language
    var label_press = 'שמירת הנקודות';
    var label_collect = 'נפח/י את הבלון';
    var label_balance = ':סכום כולל';
    var label_currency = ' מטבעות ';
    var label_header = ' סבב מספר ';
    var label_header_demo = ' סבב דמה מספר '
    var label_gonext1 = 'התחל סבב הבא';
    var label_gonext2 = 'סיים';
    var msg_1 = '<p>';
    var msg_explosion3 = ' .לא הרווחת כסף בסבב זה';
    var msg_collect4 = ' :הרווחת</p>';
    var msg_end1 = '<p>';
    var msg_end2 = ' הרווחת סך הכל </p>';
    var msg_end3 = 'ניצור עמך קשר בהקדם בכדי להעביר לך את התשלום'
    var msg_end4 = '<p>!תודה רבה על השתתפותך בניסוי</p>'
    
    
    // initialize labels
    $('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(label_currency+total);

    // below: create functions that define game functionality
    var init_data = function() {
        total = 0; // money that has been earned in total
        number_pumps = []; // arrays for saving number of pumps
        exploded = []; // array for saving whether ballon has exploded   
        
        // init visuals:
        $('#total_value').html(label_currency+total);
    }

    // what happens when a new round starts
    var new_round = function() {

        // enable keep cash:
        keepCashEnabled = true

        // reset game on completed demo rounds:
        if(round == 0){
            init_data()
            //alert('וכעת נעבור לניסוי')
            $("<div style='  text-align: right;font-size: 300%;' title = ''>וכעת נעבור לניסוי</div>").dialog({
                modal: true,
                height: 450,
                width: 450,
                buttons: {
                  Ok: function() {
                    $( this ).dialog( "close" );
                  }
                }
              });
        }

        $('#gonext').hide();
        $('#message').hide();  
        $('#collect').show();
        $('#press').show();
        round += 1;
        size = start_size;
        pumps = 0;
        explosion_flag = 0
        //  console.log(explode_array[round-1]);
        $('#ballon').width(size); 
        $('#ballon').height(size);
        $('#ballon').show();

        // show header:
        if(round > 0){
            // real rounds:
            $('#round').html('<h2>'+label_header+round+'<h2>');
        }
        else{
            // real rounds:
            $('#round').html('<h2>'+label_header_demo+(round+demo_rounds)+'<h2>');
        }
    };
    
    // what happens when the game ends
    var end_game = function() {
        $('#total').remove();
        $('#collect').remove();
        $('#ballon').remove();
        $('#press').remove();
        $('#gonext').remove();
        $('#round').remove();
        $('#message').html(msg_end1+total+msg_end2+msg_end3+msg_end4).show();
        $('#saveThis1').html('<input type='+saveThis+' name ="v_177" value="'+number_pumps+'" />');
        $('#saveThis2').html('<input type='+saveThis+' name ="v_178" value="'+exploded+'" />');
        $('#saveThis3').html('<input type='+saveThis+' name ="v_577" value="'+total+'" />');
        store_data();
        
    };

        // Important: this function will have to be replaced to ensure that
    // the data is actually sent to _your_ server: 
    var store_data = function() {
        $('#saveThis1').html('<input type='+saveThis+' name ="v_177" value="'+number_pumps+'" />');
        $('#saveThis2').html('<input type='+saveThis+' name ="v_178" value="'+exploded+'" />');
        $('#saveThis3').html('<input type='+saveThis+' name ="v_577" value="'+total+'" />');
    };

    var submitAssignent = function(name,number_pumps,exploded,total){
        
        console.log('submitAssignment: params: ',name,number_pumps,exploded,total)
        const SUBMIT_ENDPOINT = 'https://us-central1-able-groove-224509.cloudfunctions.net/onBartData'
        //const SUBMIT_ENDPOINT = 'https://aga7lso178.execute-api.eu-west-1.amazonaws.com/default/on-BART-data'
        let data = JSON.stringify({
            name,
            number_pumps:number_pumps.toString(),
            exploded:exploded.toString(),
            total,
        })

        xhr = new XMLHttpRequest();
    
        xhr.open('POST',SUBMIT_ENDPOINT);
        xhr.setRequestHeader('Content-Type', "application/json");
        xhr.onload = function() {
            if (xhr.status === 200 ) {
              console.log('submited assignment to Bart. xhr:',xhr);
    
            }
            else if (xhr.status !== 200) {
                console.error('submit to Bart Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send(data);
    }
    
    // message shown if balloon explodes
    var explosion_message = function() {
        $('#collect').hide();
        $('#press').hide();
        $('#message').html(msg_explosion3).show();
    };
    
    // message shown if balloon does not explode
    var collected_message = function() {
        $('#collect').hide();
        $('#press').hide();    
        $('#message').html(pumpmeup+msg_collect4).show();

        // activate this if you have a sound file to play a sound
        // when the balloon does not explode:
        
	// document.getElementById('tada_sound').play(); 
    };  
    
    // animate explosion using jQuery UI explosion
    var balloon_explode = function() {
        $('#ballon').hide( "explode", {pieces: 48}, 1000 );
        
        // activate this if you have a sound file to play a sound
        // when the balloon explodes:
        
        // document.getElementById('explosion_sound').play();    
    };
    
    // show button that starts next round
    var gonext_message = function() {

        $('#ballon').hide();
        if (round < rounds_played) {
            $('#gonext').html(label_gonext1).show();
        }
        else {
            // game done:
            $('#gonext').html(label_gonext2).show();

            // submit data:
            var participantEmail = $("#participantName").val()
            submitAssignent(participantEmail,number_pumps,exploded,total)
        }
    };
    
    // add money to bank
    var increase_value = function() {
        $('#total_value').html(label_currency+total);
    };
    
    // button functionalities
    
    // pump button functionality -> 'pressure' increases
    var execute_keep_cash = function() {

        if(!keepCashEnabled){
            //console.log('we are between rounds keep cash disbled')
            return ;
        }

        // dont allow done with 0 pumps:
        if(!pumps){
            alert('עליך לנפח לפחות פעם אחת')
            return;
        }

        var explosion = 0

        var i = pumps;
        if (i < 4) {
	        var animate_speed = 200;
            } else if (i < 7) {
	        var animate_speed = 300;
	    } else if (i < 12) {
	        var animate_speed = 400;
	    } else if (i < 17) {
	        var animate_speed = 500;
            } else if (i < 22) {
	        var animate_speed = 600;
	    } else if (i < 27) {
	        var animate_speed = 700;
	    } else { 
	        var animate_speed = 800; 
        }
        animate_speed = 50
        // handle no explosion
    
        total += pumps;
        setTimeout(collected_message, animate_speed+1000);
        setTimeout(increase_value, animate_speed+1000);
        setTimeout(gonext_message, animate_speed+1000);
    
        exploded.push(explosion); // save whether balloon has exploded or not
        number_pumps.push(pumps); // save number of pumps
        keepCashEnabled = false
    }

    $('#press').click(execute_keep_cash);

    var goto_next = function(){
        if (round < rounds_played) {
            new_round();
        }
        else {
            end_game();
        }
    }

    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext').click(goto_next);  

    var execute_pump = function() {

        if(explosion_flag){
            return;
        }

        // set 1 pump :
        pumps = pumps + 1
        pumpmeup = pumps;

        var explosion = 0; // is set to one if pumping goes beyond explosion point; see below
        if (shouldExplode(pumpmeup)) { // -> insert explosion criterion here

            explosion_flag = 1;
            explosion = 1; 
        }

        size += increase;
	    
        //determine animation speed; faster for smaller balloons
        var i = pumpmeup;
        if (i < 4) {
	        var animate_speed = 200;
            } else if (i < 7) {
	        var animate_speed = 300;
	    } else if (i < 12) {
	        var animate_speed = 400;
	    } else if (i < 17) {
	        var animate_speed = 500;
            } else if (i < 22) {
	        var animate_speed = 600;
	    } else if (i < 27) {
	        var animate_speed = 700;
	    } else { 
	        var animate_speed = 800; 
	    }
        animate_speed = 50
	    // balloon gets pumped using jQuery animation
	    $('#ballon').animate({
	        width: size+'px',
	        height: size+'px',
	    }, animate_speed
                                );
	    // handle explosion
	    if (explosion === 1) {
	        setTimeout(balloon_explode, animate_speed);
	        setTimeout(explosion_message, animate_speed+1400);
            setTimeout(gonext_message, animate_speed+1400);
            
            // save data (since done button wont be pressed)
            exploded.push(explosion); // save whether balloon has exploded or not
            number_pumps.push(pumpmeup); // save number of pumps
            keepCashEnabled = false

	    }
	    // handle no explosion do nothing
	    
    }

    // pump button functionality -> 'pressure' increases
    $('#collect').click(execute_pump);
 
    // test:
    $("#test").click(function() {

        // validate Email:
        var participantName = $("#participantName").val()
        if(participantName == ''){
            alert('בבקשה הכנס אי מייל')
            return;
        }

        if(!isValidEmailAddress(participantName)){
            alert(' האי מייל אינו חוקי')
            return; 
        }

        //alert('כעת יתבצע תרגול קצר, על מנת לוודא שהבנת את ההוראות. הכסף שתרוויח/י במהלך התרגול לא ישמר בקופה.')
        $("<div style='  text-align: right;font-size: 200%;' title = ''>כעת יתבצע תרגול קצר, על מנת לוודא שהבנת את ההוראות. הכסף שתרוויח/י במהלך התרגול לא ישמר בקופה</div>").dialog({
            modal: true,
            height: 450,
            width: 450,
            buttons: {
              Ok: function() {
                $( this ).dialog( "close" );
              }
            }
          });
        showGame()
    });

    var isValidEmailAddress = function(emailAddress) {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }
    // hide everything until entered email
    var hideGame = function() {
        $("#bigbigwrap").hide();
        $("#round").hide();
    }
    var showGame = function() {

        $("#round").show();

        $("#bigbigwrap").show();
        $("#participant").hide();

        // add listen to keyboard functionality:
        document.addEventListener('keyup', function (event) {
            if (event.defaultPrevented) {
                return;
            }
        
            var key = event.key || event.keyCode;

            if(key === 32 || key === ' '){

                // are we in a round ? 
                if ( !$('#gonext').is(":visible") ){
                    execute_pump()
                }

             
            }
            if(key === 13 || key === 'Enter'){
                // are we in a round ? 
                if ( !$('#gonext').is(":visible") ){
                    execute_keep_cash()
                }
                else{
                    goto_next()
                }
            }  
        });
    }

    // start the game!
    new_round();
    hideGame();
    
});
