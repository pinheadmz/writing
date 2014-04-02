/*
***************************************
*  designed by MATTHEW ZIPKIN 2012    *
* matthew(dot)zipkin(at)gmail(dot)com *
***************************************
*/

// canvas reference: http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

// global variables
var alphawords = null;
var mute = false;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint = false;
var score = [0, 0];
var p = 0;
var abc = -1;
var arrownumber = 0;
var checkarrow = 0;
var arrowbounce = 0;
var transformMethod = 'transform';
var arrowset = new Array();
var game = [[[146,627,-60],[259,306,-60],[351,89,60],[449,380,70],[513,626,false],[210,450,0],[462,433,false]],[[244,81,90],[254,333,90],[250,611,false],[167,79,0],[387,100,10],[523,219,100],[424,321,-180],[297,331,false],[300,332,20],[526,411,50],[493,592,150],[190,599,false]],[[460,150,-120],[278,107,130],[184,254,110],[164,461,70],[304,619,-10],[478,535,false]],[[208,82,90],[215,335,90],[213,614,false],[181,102,-20],[403,117,40],[513,380,110],[413,564,140],[157,598,false]],[[176,89,90],[174,320,90],[175,621,false],[178,87,0],[449,77,false],[171,339,0],[393,337,false],[174,617,0],[460,623,false]],[[170,85,90],[170,327,90],[169,626,false],[173,81,0],[454,76,false],[170,333,0],[405,335,false]],[[460,132,-140],[264,99,140],[161,302,90],[198,514,60],[395,613,-20],[502,451,-90],[495,341,false],[322,344,0],[496,343,90],[494,640,false]],[[166,75,90],[165,324,90],[166,623,false],[515,75,90],[510,318,90],[513,623,false],[165,337,0],[327,333,0],[503,324,false]],[[208,77,90],[215,328,90],[216,622,false],[149,76,0],[285,67,false],[154,628,0],[286,619,false]],[[424,75,90],[439,290,90],[418,490,110],[259,619,-150],[145,442,false]],[[169,72,90],[170,294,90],[171,620,false],[171,383,-40],[303,252,-40],[440,82,false],[244,324,50],[345,458,50],[467,615,false]],[[165,71,90],[169,296,90],[180,615,0],[455,617,false]],[[171,85,90],[169,340,90],[170,625,false],[171,84,50],[268,328,50],[385,606,-50],[480,370,-60],[588,82,80],[590,352,90],[592,622,false]],[[170,84,90],[169,328,90],[179,610,false],[169,83,50],[333,326,50],[496,609,-90],[498,348,-90],[494,80,false]],[[338,72,-200],[187,219,110],[168,471,60],[345,621,-10],[512,457,-80],[497,208,-120],[338,74,false]],[[211,82,90],[206,314,90],[202,624,false],[165,83,-10],[375,91,20],[535,288,100],[401,402,170],[175,395,false]],[[342,77,-190],[181,231,120],[165,468,50],[348,615,-10],[513,416,-80],[493,204,-120],[340,77,false],[351,482,50],[456,692,false]],[[195,86,90],[194,317,90],[190,620,false],[168,86,-20],[374,86,10],[512,232,110],[404,337,160],[198,385,false],[344,357,50],[491,611,false]],[[425,154,-130],[215,107,130],[231,283,40],[438,413,60],[424,582,140],[262,607,-140],[157,498,false]],[[323,75,90],[322,320,90],[325,622,false],[147,82,0],[326,77,0],[516,77,false]],[[173,84,90],[167,364,80],[230,587,20],[436,533,-40],[487,309,-80],[488,69,false]],[[152,89,50],[217,324,60],[314,589,-50],[414,304,-60],[478,71,false]],[[157,78,60],[219,290,60],[293,605,-60],[379,316,-70],[425,76,false],[425,80,60],[518,413,60],[588,625,-60],[656,320,-70],[704,72,false]],[[168,81,50],[288,292,50],[499,621,false],[488,80,-240],[345,344,120],[181,621,false]],[[150,84,30],[322,317,-40],[513,73,false],[319,315,90],[323,617,false]],[[181,80,0],[494,84,110],[350,339,120],[156,621,0],[498,616,false]]];
var gamewords= ['Apple','Banana','Cat','Dog','Ear','Fish','Goat','Hat','Ice','Jewel','King','Lion','Mouse','Nose','Owl','Peach','Queen','Rabbit','Snake','Tomato','Umbrella','Van','Watch','Xylophone','Yo-yo','Zebra'];

// hides url bar in mobile safari
window.addEventListener("load",function() {
	setTimeout(function(){
		window.scrollTo(0,1);
	}, 0);
});

// ***** runs on page load
$(window).load(function(){


	// audio check, dang firefox is  hella ghetto
	alphawords = document.getElementById("alphawords");
	if ((alphawords.canPlayType('audio/mp3') || 0) == 0)
	{
		alphawords.src = "audio/alphawords.ogg";
	}

	document.ontouchmove = function(e) {e.preventDefault()};

	// get this browsers transform method
	transformMethod = getTransformMethod();
	
	// start canvas
	mycanvas = $("#canvas")[0];
	mycanvas.width = $(mycanvas).width();
	mycanvas.height = $(mycanvas).height();
	context = mycanvas.getContext("2d");

	// start base
	mybase = $("#base")[0];
	mybase.width = $(mybase).width();
	mybase.height = $(mybase).height();
	bcontext = mybase.getContext("2d");

	// get coordinates of canvas for offset
	mycanvasX = mycanvas.getBoundingClientRect().left;
	mycanvasY = mycanvas.getBoundingClientRect().top;

	// set drawing preferences
	context.strokeStyle = "#ff0000";
	context.lineJoin = "round";
	context.lineCap = "round";
	context.lineWidth = 30;
	bcontext.fillStyle = "#0000ff";
	bcontext.font="900px SFCartoonistHandBold";

	// require user click to download fonts and audio and stuff
	$("#zstart").click(function(){zstart();});
});


// ***** load everything and get going!
function zstart()
{
	// load audio
	alphawords.autobuffer = true;
	alphawords.load();
	setvolume(1);

	$("#zstart").remove();

	loadbase();
	$("#readout").click(function(){loadbase();});
	// add event listeners $ handlers to canvas
	$("#canvas").bind("mousedown", function(e){start(e.pageX, e.pageY);});
	$("#canvas").bind("mousemove", function(e){move(e.pageX, e.pageY);});
	$("#mainc").bind("mouseup", function(e){stop();});
	$("#mainc").bind("mousemove", function(e){leave(e.pageX, e.pageY);});

	// add TOUCH event listeners $ handlers to canvas for iOS
	$("#canvas").bind("touchstart", function(e){e.preventDefault(); start(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);});
	$("#canvas").bind("touchmove", function(e){e.preventDefault(); move(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);});
	$("#mainc").bind("touchend", function(e){e.preventDefault(); stop();});
	$("#mainc").bind("touchmove", function(e){e.preventDefault(); leave(e.originalEvent.targetTouches[0].pageX, e.originalEvent.targetTouches[0].pageY);});
}


// ***** drawing functions
function start(x, y)
{
	score = [0, 0];

	var mouseX = x - mycanvasX;
	var mouseY = y - mycanvasY;
	
	paint = true;
	addClick(x - mycanvasX, y - mycanvasY, false);
	redraw();
}

function move(x, y)
{
	if (paint)
	{
		addClick(x - mycanvasX, y - mycanvasY, true);
		redraw();
	}

	// ***** debug
	//$("#readout").html(Math.floor(x - mycanvasX) + ", " + Math.floor(y - mycanvasY));
}

function stop()
{
	paint = false;
}

function leave(x, y)
{
	if ( (x < mycanvasX) || (y < mycanvasY) || (x > mycanvasX + mycanvas.width) ||(y > mycanvasY + mycanvas.height) )
		paint = false;
}

// ***** add new point data to arrays
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	
	// keep score!
	checkbase(x, y);
}

// ***** reset canvas and print all array data to canvas as lines
function redraw()
{
	// clear
	context.clearRect(0, 0, mycanvas.width, mycanvas.height);
	
	// go through arrays and draw paths
	for (var i = 0; i < clickX.length; i++)
	{
		context.beginPath();
		
		// starts line or starts creation of 1 pixel dot for simple click
		if(clickDrag[i] && i)
			context.moveTo(clickX[i-1], clickY[i-1]);
		else
			context.moveTo(clickX[i] - 1, clickY[i]);
		
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.stroke();
	}
}

// ***** puts big letter in base canvas
function loadbase()
{	
	// restart 'level' clear drawing
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	paint = false;
	redraw();

	// restart arrow checking scheme
	checkarrow = 0;

	// draw next letter on base canvas
	abc++;
	//change word and pic on screen
	$("#gameword").html(gamewords[abc])
	$("#gamewordpic").html("<img src='i/" + gamewords[abc] + ".png'>")
	// play sound!
	playword(abc);
	letter = String.fromCharCode(abc + 65);
	bcontext.clearRect(0, 0, mybase.width, mybase.height);
	bcontext.fillText(letter, 130, 680);

	// start first set of arrows
	arrownumber = 0;
	arrowbounce = 0;
	arrowset = game[abc];
	addarrows();
}

// ***** adds next set of arrows
function addarrows()
{
	// clear existing arrows
	$(".arrow").remove();
	arrowbounce = 0;
	score = [0, 0];

	for (var i = arrownumber; i < arrowset.length; i++)
	{
		addarrow(arrowset[i][0], arrowset[i][1], arrowset[i][2]);
		if (arrowset[i][2] === false)
			return false;
	}
}


// ***** add an arrow to the canvas
function addarrow(x, y, deg)
{
	newdiv = "<div class='arrow' id='arrow_" + arrownumber + "' style='left: " + x + "px; top: " + y + "px;'></div>";

	$("#screen").append(newdiv);

	// rotate arrow or classify as endpoint
	if (deg !== false)
		$("#arrow_" + arrownumber).css(transformMethod, "rotate(" + deg + "deg)");
	else
		$("#arrow_" + arrownumber).addClass('stop')

	// bounce new arrow
	$("#arrow_" + arrownumber).delay((arrowbounce * 500)).animate({top: '-=50', left: '-=50', padding: '+=50'},400).delay(200).animate({top: '+=50', left: '+=50', padding: '-=50'},200);

	arrowbounce++;
	arrownumber++;
}


// ***** checks current position against base for accuracy
function checkbase(x, y)
{
	// compares path with letter printed on base layer
	cbase = bcontext.getImageData(x,y,1,1).data;
	var point = 0;
	for (i = 0; i < cbase.length; i++)
		point += cbase[i];
	if (point != 0)
		score[0] += 1;
	score[1] += 1;
	p = Math.floor((score[0] / score[1]) * 100);
	if (p < 90)
	{
		paint = false;
		undo();
	}

	// compares path with location of arrows center
	arrowx = game[abc][checkarrow][0] + 32;
	arrowy = game[abc][checkarrow][1] + 32;
	if((Math.abs(x - arrowx) <= 32) && (Math.abs(y - arrowy) <= 32))
	{
		$("#arrow_" + checkarrow).addClass("check");
		
		// go to next set if done
		if ((arrowset.length - 1) == checkarrow)
		{
			abc = (abc == 25) ? -1 : abc;
			loadbase();
			return false;
		}
		
		if (arrowset[checkarrow][2] === false)
			addarrows();
			checkarrow++;
	}

	// ***** debug
	//$("#readout").html(p + "%");
}

// ***** get this browsers transform method ref: https://github.com/zachstronaut/jquery-css-transform/blob/master/jquery-css-transform.js
function getTransformMethod()
{
	var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
        var p;
        while (p = properties.shift())
        {
            if (typeof $("#mainc")[0].style[p] != 'undefined')
            {
                return p;
            }
        }
        
        // Default to transform also
        return 'transform';
}

// ***** play audio clip for letter and word
function playword(abc)
{
	if (mute)
		return false;	

	where = (abc * 2);
	if (alphawords.played.length > 0)
		alphawords.currentTime = where;

	alphawords.play();

	setInterval(function(){
		if (alphawords.currentTime >= (where + 2))
		{
			alphawords.pause();

		}		
	}, 10);
}

// ***** removes last stroke from drawing path
function undo()
{
	for (var i = (clickDrag.length - 1) ; i >= 0 ; i--)
	{
		if (!clickDrag[i])
		{
			clickDrag.length = i;
			clickX.length = i;
			clickY.length = i;
			paint = false;
			redraw();
			$(".arrow").removeClass("check");
			// this guy makes the first arrow currently on screen the next arrow to check
			checkarrow = $(".arrow")[0].id[6];
			return false;
		}
	}
}

// ***** sets volume of sound effects
function setvolume(v)
{
	$(".volbutt").removeClass('volselect');
	$("#vol" + v).addClass('volselect');
	if (v == 0)
		mute = true;
	else
		mute = false;
	alphawords.volume =(v * 0.49);
}
