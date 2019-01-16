// pressure version of the BART

$(document).ready(function() { 
    
    var saveThis = 'hidden'; // text fields that save data should not be shown; can be shown in testing
    
    // initialize values
    var round = 0;
    var start_size = 150; // start value of widht & height of the image; must correspond to the value that is specified for the #ballon id in style.css
    var increase = 8; // number of pixels by which balloon is increased each pump
    var size; // start_size incremented by 'increase'
    var pumps; 
    var total = 0; // money that has been earned in total
    var rounds_played = 6;
    var explode_array =  [17, 10, 23, 13, 7, 20];
    var maximal_pumps = 30;
    var pumpmeup; // number pumps in a given round
    var number_pumps = []; // arrays for saving number of pumps
    var exploded = []; // array for saving whether ballon has exploded
    
    
    // initialize language
    var label_press = 'Increase pressure in the supply line';
    var label_collect = 'Inflate the balloon with air from the supply line';
    var label_balance = 'total credit:';
    var label_currency = ' Coins';
    var label_header = 'Balloon game round ';
    var label_gonext1 = 'Start next round';
    var label_gonext2 = 'exit game';
    var msg_1 = '<p>You have this round ';
    var msg_explosion2 = ' Times the pressure increases. The balloon is already after ';
    var msg_explosion3 = ' Pressure increases burst!</p><p> You did not make any money this round.</p>';
    var msg_collect2 = ' Sometimes the pressure increases without the balloon exploding. The balloon would be in this round only after '
    var msg_collect3 = ' Pressure increases burst.</p><p>They have ';
    var msg_collect4 = ' Taler profit made. The money earned is safe in the bank.</p>';
    var msg_end1 = '<p>This completes this part of the study. You are in the balloon game ';
    var msg_end2 = ' Taler profit made. </p><p>click on <i>Continue</i>, to proceed with the study.</p>';
    
    
    // initialize labels
    $('#press').html(label_press); 
    $('#collect').html(label_collect);
    $('#total_term').html(label_balance);
    $('#total_value').html(total+label_currency);
    
    
    // below: create functions that define game functionality
    
    // what happens when a new round starts
    var new_round = function() {
        $('#gonext').hide();
        $('#message').hide();  
        $('#collect').show();
        $('#press').show();
        round += 1;
        size = start_size;
        pumps = 0;
        //  console.log(explode_array[round-1]);
        $('#ballon').width(size); 
        $('#ballon').height(size);
        $('#ballon').show();
        $('#round').html('<h2>'+label_header+round+'<h2>');
    };
    
    // what happens when the game ends
    var end_game = function() {
        $('#sliderwrap').remove();
        $('#total').remove();
        $('#collect').remove();
        $('#ballon').remove();
        $('#press').remove();
        $('#gonext').remove();
        $('#round').remove();
        $('#goOn').show();
        $('#message').html(msg_end1+total+msg_end2).show();
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

        // Upload:
        var participantEmail = $("#participantName").val()

        submitAssignent(participantEmail,number_pumps,exploded,total)
    };

    var submitAssignent = function(name,number_pumps,exploded,total){
        
        console.log('submitAssignment: params: ',name,number_pumps,exploded,total)
        const SUBMIT_ENDPOINT = 'https://us-central1-able-groove-224509.cloudfunctions.net/onBartData'
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
        $('#message').html(msg_1+pumpmeup+msg_explosion2+explode_array[round-1]+msg_explosion3).show();
    };
    
    // message shown if balloon does not explode
    var collected_message = function() {
        $('#collect').hide();
        $('#press').hide();    
        $('#message').html(msg_1+pumpmeup+msg_collect2+explode_array[round-1]+msg_collect3+pumpmeup+msg_collect4).show();
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
            $('#gonext').html(label_gonext2).show();
        }
    };
    
    // add money to bank
    var increase_value = function() {
        $('#total_value').html(total+label_currency);
    };
    
    
    // button functionalities
    
    // pump button functionality -> 'pressure' in slider bar increases
    $('#press').click(function() {
        if (pumps >= 0 && pumps < maximal_pumps) { // interacts with the collect function, which sets pumps to -1, making the button temporarily unclickable
            pumps += 1;
            $("#slider" ).slider( "option", "value", pumps );
        }
    });
    
    // click this button to start the next round (or end game when all rounds are played)
    $('#gonext').click(function() {
        if (round < rounds_played) {
            new_round();
        }
        else {
            end_game();
        }
    });  
    
    // continue button that is shown when the game has ended
    $("#goOn").click(function() {
        $("form[name=f1]").submit();
    });
    
    // collect button: release pressure and hope for money
    $('#collect').click(function() {
        if (pumps === 0) {
	    alert('There is still no air in the supply line. You can only inflate the balloon as soon as you have pumped air into the supply line at least once. Press the button "Increase pressure in the supply line."');
        }
        else if (pumps > 0) { // only works after at least one pump has been made
	    var explosion = 0; // is set to one if pumping goes beyond explosion point; see below
	    number_pumps.push(pumps); // save number of pumps
	    pumpmeup = pumps;
	    pumps = -1; // makes pumping button unclickable until new round starts
	    for (var i = 0; i < pumpmeup; i++) {
	        size += increase;
	        if (i === explode_array[round-1]-1) { // -> insert explosion criterion here
	            explosion = 1; 
	            break; // break loop when explosion point is reached; balloon will not get pumped any further!
	        }
	    }
	    //determine animation speed; faster for smaller balloons
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
	    // animates slider value to 0
            $('#slider').slider('value', 0);
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
	    }
	    // handle no explosion
	    else {
	        total += pumpmeup;
	        setTimeout(collected_message, animate_speed+1000);
	        setTimeout(increase_value, animate_speed+1000);
	        setTimeout(gonext_message, animate_speed+1000);
	    }
	    // console.log(number_pumps);	
	    exploded.push(explosion); // save whether balloon has exploded or not
	    // console.log(exploded);
	    // console.log(i);
        }
    });
    
    // initialize slider that handles the pumps
    
    $( "#slider" ).slider( {
        orientation: "vertical",
        value: 0,
        min: 0,
        max: 32,
        disabled: true,
        animate: true,
        create: function( event, ui ) {
            var v=$(this).slider('value');
            $(this).find('.ui-slider-handle').text(v);
        },
        change: function( event, ui ) {
            $(this).find('.ui-slider-handle').text(ui.value);
        },
        range: "min",
    });
    
    // test:
    $("#test").click(function() {
        let name = 'shahar',
            number_pumps = 4,
            exploded = 5,
            total= 6;
        //submitAssignent(name,number_pumps,exploded,total)

        // validate Email:
        var participantName = $("#participantName").val()
        if(participantName == ''){
            alert('Please Enter Email to continue.')
            return;
        }

        if(!isValidEmailAddress(participantName)){
            alert('Please Enter a Valid Email to continue.')
            return; 
        }

        alert('כעת יתבצע תרגול קצר, על מנת לוודא שהבנת את ההוראות. הכסף שתרוויח/י במהלך התרגול לא ישמר בקופה.')
         
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

    }

    // start the game!
    new_round();
    hideGame();
    
});
