		/* 
			Hey? What's going on here? This stuff looks crazy!

			I decided to challenge myself and design + build a resume page by noon 6/15...

			My requirements were: it shouldn't feel like work, and it
			should demonstrate some sort of competence. 

			The design part was actually the trickiest, since such a tight timeframe
			wouldn't give me a lot of time to design assets, I knew I had to rely on type...
			then it dawned on me that even though ASCII art gets popular every now and again,
			people just kind of forgot about the wonderful world of ANSI... also even though
			I've spent a lot of time in school on Typography, I think being a type snob
			is boring. People are literate about type now. Don't be a snob.

			Anyway, I'm sure some of you are saying:

			*So, why is the code so sloppy?* I dunno, you try doing this from
			scratch in 4 hours with a world cup hang over and very little sleep.

			*Oh, so why isn't the code more sloppy?* Because try as I might,
			sometimes I have a hard time writing sloppy code.

			*Hey, so how does this work?* Pretty damn well. I'll be making
			a cool ANSI art animation library for all your vintage terminal needs.
		*/


$(document).ready(function(){
	
	window.rainbow = new Rainbow();

	// this is the original method I wrote which relies on CSS transitions
	// not very authentic, but easier to manage
	// common code in this functions should be abstracted for library
	function genText(txt, anime, fnt){
		if (typeof fnt === "undefined" || fnt === null) { 
			fnt = "ANSI Shadow"
		}
		figlet.text(txt, {font: fnt,
			horizontalLayout: "default",
			veritcalLayout: "default"
		}, function(err, data){
			// Skip animation if space is clear
			if($(".row").length > 0){
				window.wash();
			}
			formatted = ''
			arr = data.split("\n")
			jQuery.each(arr, function(dex, val){
				// this is such a hatch job, but the alternative
				// is to calculate areas after rendering
				// quite possibly every time an event is triggered

				var foo = ''
				if(dex == 0){
					foo += "<div class='range'>"
				}else if($.trim(arr[dex-1]).length < 1){
					foo += "<div class='range'>"
				}

				foo += '<span class="row">' + val.replace(/\s+$/g, "") + "\n</span>"

				if((dex < (arr.length - 2)) && ($.trim(arr[dex+1]).length < 1)){
						foo += "</div>"
				}
				formatted += foo;
			});
			$("#aolol").html(formatted);
			anime()
		})
	}

	// this uses typin... and look how much slimmer it is...
	function authText(txt, anime, fnt){
		if (typeof fnt === "undefined" || fnt === null) { 
			fnt = "ANSI Shadow"
		}
		if (typeof anime === "undefined" || anime === null) { 
			anime = function(){
				console.warn("authText called without callback")
			}
		}
		figlet.text(txt, {font:fnt,
					horizontalLayout:"default",
					verticalLayout:"default"
				},function(err,data){
					wash()
					typin(data)
		});
	}

	function wash(callback){
		if (typeof callback === "undefined" || callback === null) { 
				callback = function(){
					console.log("no callback passed to wash");
				}
			}
		$("span").animate({
			opacity:"0"
		}, {duration: 250, complete: callback});
	}

	function spit(selectah, wait){
		if (typeof wait === "undefined" || wait === null) { 
				wait = 500; 
			}	
		if (typeof selectah === "undefined" || selectah === null) { 
			selectah = $("span")
		}
		delayCount = 0
			selectah.each(function(i, ele){
				if(($.trim($(ele).html()).length) > 1){
					delayCount += 1
				}
			$(this).delay(wait*delayCount).animate({
				marginLeft:"0px"
			})
		})
	}

	 function scatter(selectah, wait, callback){
	 	if (typeof selectah === "undefined" || selectah === null) { 
			selectah = $("span")
		}
		if (typeof wait === "undefined" || wait === null) { 
			wait = 1500
		}
	 	$("span").each(function(i){
	 		(screenRez = $(window).width() + 1000)
	 		valz = Math.floor(Math.random()*(screenRez-0+1)-1000)
	 		$(this).css({"margin-left":valz})
	 	});
	 	if (typeof callback === "undefined" || callback === null) { 
			console.warn("no callback for scatter");
		}else{
			setTimeout(function() {
 				callback()
 			} , wait)
		}

	 }

	function sow(remaining, wait, cb){
		if (typeof wait === "undefined" || wait === null) { 
				wait = 50; 
			}	
			if(typeof callback === "undefined" || callback === null) { 
				cb = function(){
					$("span").css({"opacity":"0","margin-left":"0px"});
					$("span").animate({
						opacity:1
					}, 0)
				}
			}	
		if(remaining > 0){
			window.scatter($("span"), wait, function(){
				sow((remaining-1), wait, cb);
			});
		}else{
			cb()
		}
	}

	function rgb2hex(rgb) {
	    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

	    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    function hex(x) {
	        return ("0" + parseInt(x).toString(16)).slice(-2);
	    }
	    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}


	function invertColor(col){
		return "#" + (("000000" + (0xFFFFFF ^ parseInt(col.substring(1), 16)).toString(16)).slice(-6))
	}

	function randColor(){
		return "#" + ("000000" + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
	}

	function invertColObj(obj){
		obj.children().each(function(i, v){
			hex = rgb2hex($(v).css("color"))
			$(v).css({"color":invertColor(hex)});
		})
	}


	function colorize(cols){
		if (typeof cols === "undefined" || cols === null) { 
			cols = [randColor(), randColor()];
		}
		window.rainbow.setSpectrumByArray(cols)
		gap = Math.round((100 / $("span").length))
		$("span").each(function(i){
			$(this).css({"color":"#" +rainbow.colourAt((0+(gap*i)))})
		});
	}

	//Blur looks stupid on the ANSI, but great on ASCII
	function blurize(){
		$("span").each(function(i, v){
			$(this).css({"text-shadow":("0 0 3px " + $(this).css("color"))});
		});
	}

	function typin(txt, wait, poz, anime){
		if (typeof wait === "undefined" || wait === null) { 
			wait = 1
		}
		if (typeof poz === "undefined" || poz === null) { 
			poz = 0
		}
		if (typeof anime === "undefined" || anime === null) { 
			anime = function(){
				console.warn("typin called without callback")
			}
		}

		typeo = setInterval(function(){
			type = txt.substring(0, poz)
			// since we're feeding it groomed text from made up txt, lets
			// stick to pre whitespace
			//type = "<span class='typeo'>" + type + "</span>"
			$("#aolol").html(type);
			poz += 1
			if(poz > txt.length){
				clearInterval(typeo)
				anime()
			}
		}, wait)
	}

	window.spit = spit
	window.genText = genText
	window.wash = wash
	window.scatter = scatter
	window.colorize = colorize
	window.invertColor = invertColor
	window.invertColObj = invertColObj
	window.randColor = randColor
	window.sow = sow
	window.blurize = blurize
	window.typin = typin

	function lightboxin(content){
		//$(".lightbox").unbind("")
		$("#flash").animate({
			opacity:0
			},{duration: 400,
			 complete:function(){
				$(".lightbox").show(0, function(){
					$("#flash").html(content)
					$("#flash").animate({
						opacity:1
					},50)
				});
			}
		})

		$(document).on("keyup", function(e){
			if(e.which == 27){
				$(".lightbox").hide();
			}
		})
	}


	function experience(wait){
		if (typeof wait === "undefined" || wait === null) { 
				wait = 50; 
			}	
			window.wash()
			$("#aolol").addClass("navigable");
			str = "Companies:\nPlayAPI\nQuirky\nFashism\nOMGPOP"

			// using my original genText method instead since it generates
			// range areas that can be targeted for events
			// Uncomment this method once authText is brought to parity  
			/*authText(str, function(){
				$(".range").on("click", function(e){
				if($(".range").index($(this)) > 0){
					lightboxin(loadExperience($(this)));
					//console.warn($(".range").index($(this)));
				}
			});
			})*/
		genText(str, function(){
			spit($("span"), wait);
			window.colorize();
			$(".range").on("click", function(e){
				if($(".range").index($(this)) > 0){
					lightboxin(loadExperience($(this)));
					//console.warn($(".range").index($(this)));
				}
			});
		});
	}

	function biography(){
		str = "Ruby on Rails developer, Digital Director, and generally dedicated guy possessing a strong design and social media background. Over eight years start-up experience covering all aspects of production from initial concept and architecting to scaling for over a hundred thousand users."
	}

	function loadExperience(ranger){
		dex = ($(".range").index(ranger) - 1)
		lightboxin($($("#experience div")[dex]).html());
	}

	function loadBio(){
		$("#aolol").addClass("txt");
		$("nav").one("click", function(){
			$("#aolol").removeClass("navigable").removeClass("txt");
		});
	}

	$(".experience").on("click", function(){
		window.wash(function(){
			experience();	
		});
	});

	$("nav").on("click", function(){
		$(".lightbox").hide();
	});

	$(".bio").on("click", function(){
			$("#aolol").removeClass("navigable").addClass("txt");
			window.wash(typin($("#bio").html(), 5, 1));
	});

	$(".why").on("click", function(){
		$("#aolol").removeClass("navigable").removeClass("txt");
		// Uncomment below to use type out function, left here
		// as example of how grooming can be done for it.
		/* 
		groomed = $.trim($("#why").html()).replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\n")
		authText(groomed, function(){
			window.sow(5, 450, function(){
				window.colorize([randColor(), randColor()]);
				$("sapn").css({
					"opacity":"0",
					"margin-left":"0px"
				});
				$("span").animate({
					opacity:1
				},10);
			});
		})*/
		groomed = $.trim($("#why").html()).replace(/(<br>)|(<br \/>)|(<p>)|(<\/p>)/g, "\n")
		genText(groomed, function(){
			window.sow(5, 450, function(){
				window.colorize([randColor(), randColor()]);
				$("span").css({
					"opacity":"0",
					"margin-left":"0px"
				});
				$("span").animate({
					opacity:1
				}, 1)
			});
			window.colorize([randColor(), randColor()]);
		})
	})

	$(".dim").on("click", function(){
		$("body").toggleClass("dim");
		if($("body").hasClass("dim")){
			$("nav .dim:first").html("[DAY]")
		}else{
			$("nav .dim:first").html("[NIGHT]")
		}
	})

	$("#aolol").on("mouseover", ".range", function(){
		if($("#aolol").hasClass("navigable") && ($(".range").index($(this)) > 0)){
			window.invertColObj($(this));
			$(this).one("mouseout", function(){
				window.invertColObj($(this));
			})
		}
	});

	$(".escape").on("click", function(){
		$(".lightbox").hide();
	});

	experience(300);

	function adjustContent(){
		content_height = ($(window).height() - $("nav").height());
		content_width = ($(window).width() - 20);
		$(".content").height(content_height);
		$("#aolol").height(content_height);
		$("#aolol").width(content_width);
	}

	adjustContent();

	$(window).resize(function(){
		adjustContent();
	});

})
