
var magnatApp = magnatApp || {};

magnatApp.define = function(namespace){

	var parts = namespace.split('.'),
			parent = magnatApp,
			i;

	if(parts[0] == 'magnatApp')
		parts = parts.slice(1);

	for(i = 0; i < parts.length; i++){
		if(typeof parent[parts[i]] == 'undefined')
			parent[parts[i]] = {};
		parent = parent[parts[i]];
	}

	return parent;
};



magnatApp.define('init');
magnatApp.define('features');
magnatApp.define('socials');
magnatApp.define('header.menu');
magnatApp.define('player');
magnatApp.define('slider');
magnatApp.define('instagram');
magnatApp.define('about');
magnatApp.define('technology');
magnatApp.define('magnatMap');
magnatApp.define('comment');
magnatApp.define('footer.subscribe');
magnatApp.define('product.item');
magnatApp.define('orderForm');

//==============================================================================
//																 INIT
//==============================================================================

magnatApp.init = (function(){

	var isInitPage;

	function initPage(){

		isInitPage = true;

		// detect init page; delete path from href
		isInitPage = window.location.pathname.split('/')[1] === '' || window.location.pathname.split('/')[1] === 'index.html';
		if(window.location.pathname.split('/')[1] === 'index.html')
			if(history.pushState)
				history.pushState(null, null, window.location.origin);

		magnatApp.features.checkSupport();

		// include animations style if support || jQuery script
		if(magnatApp.features.isCSSTransitionSupport())
			$('head').append('<link rel="stylesheet" type="text/css" href="css/animation.css">');

		// initialize blocks
		magnatApp.header.initHeader();
		magnatApp.slider.initSlider();
		magnatApp.product.initProducts();
		magnatApp.socials.initSocials();
		magnatApp.footer.subscribe.initSubscribe();
		magnatApp.magnatMap.initMap();

		if(isInitPage){
			magnatApp.player.initPlayer();
			magnatApp.instagram.initInstagram();
			magnatApp.about.initAbout();
			magnatApp.technology.initTechnology();
			$('#left-down-picture').height($(window).height() * 0.7);
			$('#technology').height($(window).height() * 0.8);
		}
		else{
			magnatApp.comment.initComment();
			magnatApp.orderForm.initOrderForm();
		}

		initControlElements();
		setPageHandlers();

	}

	function initControlElements(){
		magnatApp.features.toggleUpButton($(window).scrollTop() > 1);
	}

	function setPageHandlers(){
		$('html, body').on('keyup keydown', function(event){
			if(event.which == 38 || event.which == 40 && $('#modal-instagram-picture, #modal-menu, #modal-about-magnat, #modal-about-technology').is(':visible'))
				event.preventDefault();
		});

		$('html, body').on('wheel', function(event){
			if($('#modal-instagram-picture, #modal-menu').is(':visible'))
				event.preventDefault();
		});

		// ПЛАВНАЯ ПЕРЕМОТКА СТРАНИЦЫ
		$(document).on("click", function(event){
			if($(event.target).hasClass('scroll')){
				event.preventDefault();
				magnatApp.features.smoothScroll($(event.target).attr("data-link"));
			}
		});

		$(document).on('scroll', function(event){
			magnatApp.features.toggleUpButton($(window).scrollTop() > 1);
			magnatApp.header.toggleHeader($(window).scrollTop() > 100);
		});

		$(window).on('resize', function(event){
			if(isInitPage) magnatApp.player.sizingPlayerBlock();
		});

	}

	function checkInitPage(){
		return isInitPage;
	}

	function checkBrowser(){
		// Opera 8.0+
		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';

		// Safari 3.0+ "[object HTMLElementConstructor]"
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

		// Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;

		// Edge 20+
		var isEdge = !isIE && !!window.StyleMedia;

		// Chrome 1+
		var isChrome = !!window.chrome && !!window.chrome.webstore;

		// Blink engine detection
		var isBlink = (isChrome || isOpera) && !!window.CSS;

		if(isOpera) return 'opera';
		if(isFirefox) return 'firefox';
		if(isSafari) return 'safari';
		if(isIE) return 'ie';
		if(isEdge) return 'edge';
		if(isChrome) return 'chrome';
		if(isBlink) return 'blink';
		return 'unknown';
	}

	return {
		initPage: initPage,
		checkInitPage: checkInitPage,
		checkBrowser: checkBrowser
	}
})();



//==============================================================================
//																 FEATURES
//==============================================================================

magnatApp.features = (function(){

	var videoHtml5Support, CSSTransitionSupport;

	// запрет прокрутки сайта
	function denyScrolling(access){
		if(access){
			$('html, body').css("overflow-y", "hidden");
			$('#modal-up-button').hide();
		}
		else{
			$('html, body').css("overflow-y", "auto");
			$('#modal-up-button').show();
		}
	};

	function smoothScroll(obj){
		var destin = $(obj).offset().top - 50;
		var interval = $(window).scrollTop() < destin ? destin - $(window).scrollTop() : $(window).scrollTop() - destin;
		$("html, body").animate({scrollTop: destin}, interval);

	}

	// кнопка вверх
	function toggleUpButton(isShow){
		if(isShow && $('#modal-up-button').css('display') === 'none')
			$('#modal-up-button').show();
		if(!isShow && $('#modal-up-button').css('display') !== 'none')
			$('#modal-up-button').hide();
	}

	function checkSupport(){
		videoHtml5Support = Modernizr.video;
		if(!videoHtml5Support) console.log('HTML5 video not support');
		CSSTransitionSupport = Modernizr.csstransitions;
		if(!CSSTransitionSupport) console.log('CSS3 transition not support');
	}

	function isVideoHtml5Support(){
		return videoHtml5Support;
	}

	function isCSSTransitionSupport(){
		return CSSTransitionSupport;
	}

	return{
		denyScrolling: denyScrolling,
		toggleUpButton: toggleUpButton,
		checkSupport: checkSupport,
		smoothScroll: smoothScroll,
		isVideoHtml5Support: isVideoHtml5Support,
		isCSSTransitionSupport: isCSSTransitionSupport
	}

})();




//==============================================================================
//																 SOCIALS
//==============================================================================

magnatApp.socials = (function(){

	var url = '';

	function shareVK(purl, ptitle, pimg, text){
		url = 'http://vkontakte.ru/share.php?';
		url += 'url='          + encodeURIComponent(purl);
		url += '&title='       + encodeURIComponent(ptitle);
		url += '&description=' + encodeURIComponent(text);
		url += '&image='       + encodeURIComponent(pimg);
		url += '&noparse=true';
		popup(url);
	};

	function shareTwitter(purl, ptitle) {
		url  = 'http://twitter.com/share?';
		url += 'text='      + encodeURIComponent(ptitle);
		url += '&url='      + encodeURIComponent(purl);
		url += '&counturl=' + encodeURIComponent(purl);
		popup(url);
	};

	function popup(url) {
		window.open(url,'','toolbar=0,status=0,width=626,height=436');
	};

	function shareFB(){
		FB.ui({
			method: 'share_open_graph',
			action_type: 'og.likes',
			hashtag: 'magnat-lzr-pro',
			action_properties: JSON.stringify({
			object:'http://magnat-lzr.pro/',
			})
		});
	};

	function initSocials(){
		if(!magnatApp.features.isCSSTransitionSupport()){
			$('#social.left').hover(
			  function(){ $(this).stop().animate({'left': 0 }, 500); },
			  function(){ $(this).stop().animate({'left': -25 }, 500); });

			$('#social.right').hover(
			  function(){ $(this).stop().animate({'right': 0 }, 500); },
			  function(){ $(this).stop().animate({'right': -25 }, 500); });
		}
	}

	return {
		initSocials: initSocials,
		shareVK: shareVK,
		shareTwitter: shareTwitter,
		shareFB: shareFB
	}
})();


//==============================================================================
//																 **HEADER**
//==============================================================================

magnatApp.header = (function(){

	var header;

	function initHeader(){
		header = $('header');
		if($(window).scrollTop() > 100)
			header.addClass('fixed');
		magnatApp.header.menu.initMenu();

		if(!magnatApp.init.checkInitPage())
			toggleHeaderName($(window).scrollTop() > 100);
	}

	function toggleHeader(isTop){

		if(!magnatApp.init.checkInitPage())
			toggleHeaderName(isTop);

		if(!isTop && header.hasClass('fixed')){

			if(!magnatApp.features.isCSSTransitionSupport())
				header.stop().animate({ 'height': 100,
																'lineHeight': 100,
																'backgroundColor': jQuery.Color("#000000").transition("transparent", 0.6) }, 1000);

			header.removeClass('fixed');
		}

		if(isTop && !header.hasClass('fixed')){

			if(!magnatApp.features.isCSSTransitionSupport())
				header.stop().animate({ 'height': 50,
																'lineHeight': 50,
																'backgroundColor': jQuery.Color("#000000").transition("transparent", 0.5) }, 1000);

			header.addClass('fixed');
		}

		magnatApp.header.menu.modifySubMenu();
	}

	function getHeader(){
		return header;
	}

	function toggleHeaderName(isTop){
		if(!isTop){
			$('#name h2').hide();
			$('#product-name h1').css('opacity', 1);
		}
		else{
			$('#name h2').show();
			$('#product-name h1').css('opacity', 0);
		}
	}

	return {
		initHeader: initHeader,
		toggleHeader: toggleHeader,
		getHeader: getHeader
	}

})();

//==============================================================================
//															 	 **MENU**
//==============================================================================


magnatApp.header.menu = (function(){

	var header;

	function initMenu(){
		header = magnatApp.header.getHeader();
		modifySubMenu();
		setMenuHadlers();
	};

	function setMenuHadlers(){
		$('#mobile-menu').on('click', function(){
			$(this).hide();
			magnatApp.features.denyScrolling(false);
		});

		$('#mobile-menu-button').on('click', function(){
			$('#mobile-menu').show();
			magnatApp.features.denyScrolling(true);
		});

		if(!magnatApp.features.isCSSTransitionSupport())
		header.find('.have-sub').hover(
			function(){ $(this).find('.sub-menu').stop().fadeIn(1000); },
			function(){ $(this).find('.sub-menu').stop().fadeOut(1000); }
		);
	}

	function modifySubMenu(){
		if(!magnatApp.features.isCSSTransitionSupport()){
			var topSub = header.hasClass('fixed') ? 50 : 100;
			var transparentSub = header.hasClass('fixed') ? 0.5 : 0.6;
			header.find('.have-sub .sub-menu').css({'top': topSub, 'backgroundColor': jQuery.Color("#000000").transition("transparent", transparentSub) });
		}
	}

	return {
		initMenu: initMenu,
		modifySubMenu: modifySubMenu
	}

})();




//==============================================================================
//															 **PLAYER**
//==============================================================================

magnatApp.player = (function(){

	var player,
			playButton,
			muteButton,
			volumeSlider,
			videoList,
			currentVideo,
			previousVolume,
			videoDescriptions,
			previousVolumeDragging;

	function initPlayer(){
		player = $('#player');
		playButton = $('#play');
		muteButton = $('#mute');
		volumeSlider = $('#volume-control-button');
		videoList = document.getElementsByClassName('bgVideo');
		currentVideo = document.getElementById('bgvid');
		videoDescriptions = [{text: 'Magnat LZR 980', href: '980.html'},
												 {text: 'Magnat LZR 580', href: '580.html'},
											 	 {text: 'Magnat LZR 765', href: '765.html'} ];

		sizingPlayerBlock();

		if(magnatApp.features.isVideoHtml5Support()){
			initControls();
			setHandlers();
		}
		else {
			player.find('.bgVideo').hide();
			playButton.hide();
			muteButton.hide();
			$('#volume-bar').hide();
			$('#videoNotSupport').show();
		}

		// playVideo(currentVideo);
	}

	function initControls(){
		setVolume(0.1);

		volumeSlider.draggable({
			axis: 'x',
			containment: 'parent',
			start: function(){ previousVolumeDragging = ($(this).position().left / 180).toFixed(1); },
			drag:  function(){ setVolume( ($(this).position().left / 180).toFixed(1)); },
			stop:  function(){ setVolume( ($(this).position().left / 180).toFixed(1));
												 previousVolume = previousVolumeDragging; }
		});
	}

	function setHandlers(){
		for(var i = 0; i < videoList.length; i++){
			$(videoList[i]).on('ended', function(){ playNextVideo(this); $(this).css('opacity', 0); });
			$(videoList[i]).on('playing', function(){ $(this).css('opacity', 1); });
			$(videoList[i]).on('click', function(){ toggleVideo(currentVideo); });
		}

		muteButton.on('click', function(){ if(currentVideo.volume > 0) setVolume(0);
																 			 else												 setVolume(previousVolume); });

		playButton.on('click', function(){ if(currentVideo.paused) playVideo(currentVideo);
 																 			 else										 pauseVideo(currentVideo); });
	}

	function playVideo(video){
		video.play();
		currentVideo = video;
		playButton.addClass('play');
		$('#model a').removeAttr('id').attr('href', videoDescriptions[$(video).index()].href);
		$('#model h1').text(videoDescriptions[$(video).index()].text);
	}

	function pauseVideo(video){
		playButton.removeClass('play');
		video.pause();
	}

	function playNextVideo(video){
		var playingVideo = video === videoList[videoList.length - 1] ? videoList[0] : video.nextElementSibling;
		playVideo(playingVideo);
	}

	function toggleVideo(video){
		if(video.paused)
			playVideo(video);
		else
			pauseVideo(video);
	}

	function setVolume(volume){
			previousVolume = videoList[0].volume;

		if(volume > 0)
			muteButton.removeClass('mute');
		else
			muteButton.addClass('mute');

		for(var k = 0; k < videoList.length; k++){
			videoList[k].volume = volume;
			videoList[k].muted = (volume === 0);
		}

		volumeSlider.css("left", (volume * 180) + 'px');
	}

	function sizingPlayerBlock(){
		player.height($(window).height());
	}

	function getPlayer(){
		return player;
	}

	return {
		initPlayer: initPlayer,
		getPlayer: getPlayer,
		sizingPlayerBlock: sizingPlayerBlock
	}

})();



//==============================================================================
//															   **PRODUCT**
//==============================================================================

magnatApp.product = (function(){

	var product;

	function initProducts(){
		product = $('#product');

		if(!magnatApp.features.isCSSTransitionSupport()){
			$('.products-item').hover(function(){
			  $(this).children('img').stop().animate( {'opacity': 0.2}, 500);
			}, function(){
			  $(this).children('img').stop().animate( {'opacity': 1}, 500);
			});
		}
	}

	function getProduct(){
		return product;
	};

	return {
		initProducts: initProducts,
		getProduct: getProduct
	}
})();


//==============================================================================
//																 **SLIDER**
//==============================================================================

magnatApp.slider = (function(){

	var slider,
			slides,
			colors,
			activeColor,
			initLeftPosition,
			touchOffsetX,
			dragOffsetX;

	function initSlider(){
		slider				= $('#main-picture').find('img');
		colors				= $('#main-product-buy');
		activeColor		= colors.find('ul li').first();
		touchOffsetX	= 0,
		dragOffsetX 	= 0;

		fillSliderNavigation();
		setHandlers();
	}

	function setHandlers(){

		if(!magnatApp.init.checkInitPage()){
			colors.on('click', 'ul li', function(){
				activeColor.removeClass('active');
				activeColor = $(this);
				$(this).addClass('active');
				setSliderColor($(this).attr('data-load-count'), $(this).attr('data-load-path'), $(this).attr('data-rus-color'));
			});

			slider.on('mousedown', function(event){
				dragOffsetX = event.pageX;
			});

			slider.on('mouseup', function(event){
				if(Math.abs(dragOffsetX - event.pageX) === 0)
					showBigPicture();
			});

			$('#modal-picture').on('click', function(){
				$(this).hide();
				magnatApp.features.denyScrolling(false);
			});
		}

		$('#nav-slider').on('click', 'li', function(event){
			changeSlide($(this).data('slide'));
			event.preventDefault();
		});

		$('#next').on('click', function(){ nextSlide(); });
		$('#prev').on('click', function(){ prevSlide(); });

		slider.draggable({
			axis: 'x',
			start: function(){ initLeftPosition = $(this).position().left; },
			stop: function(){ var indent = ($(this).parent().width() - $(this).width()) / 2;
												var move = initLeftPosition - $(this).position().left;
												if(move > 0 && move > indent)
													prevSlide();
												else if(move < 0 && Math.abs(move) > indent)
													nextSlide();
												$(this).removeAttr('style'); }
		});

		if(Modernizr.touchevents){
			$(slider).on('touchstart', function(event){
				touchOffsetX = event.originalEvent.touches[0].pageX;
			});

			$(slider).on('touchend', function(event){
				if((touchOffsetX - event.originalEvent.changedTouches[0].pageX) > 0 &&
				Math.abs(touchOffsetX - event.originalEvent.changedTouches[0].pageX) > $(window).width() / 2)
					prevSlide();
				if((touchOffsetX - event.originalEvent.changedTouches[0].pageX) < 0 &&
				Math.abs(touchOffsetX - event.originalEvent.changedTouches[0].pageX) > $(window).width() / 2)
					nextSlide();
			});
		}
	}

	function showBigPicture(){
		var modalPicture = $('#modal-picture');
		if(!modalPicture.is(':visible')){
			modalPicture.find('img').attr('src', slider.attr('src'));
			modalPicture.show();
		}
		magnatApp.features.denyScrolling(modalPicture.is(':visible'));
	};

	function fillSliderNavigation(){
		var str = '',
				count = slider.attr('data-count'),
				path = slider.attr('data-source');

		for(var i = 0; i < count; i++)
			str += '<li data-slide="' + (i + 1) + '" ><a><img src="' + path + 'min-' + (i + 1) + '.jpg"></a></li>\r\n';

		$('#nav-slider').html(str).find('li:first-child').addClass('active');
		slides = $('#nav-slider').find('li');
	}

	function setSliderColor(count, path, rus){
		$(slider).attr('data-count', count).attr('data-source', path).attr('src', path + '1.jpg');
		console.log(rus);
		colors.find('.color span').text(rus);
		fillSliderNavigation();
	}

	function getImgPath(n){
		return slider.attr('data-source') + n + '.jpg';
	};

	function getCurrentSlide(){
		return Number(slider.attr('data-slide'));
	};

	function changeSlide(n){
		slider.attr('data-slide', function(){
						setSlidePanel(n);
						return n; })
					.stop()
					.animate({'opacity': 0 }, 500, function(){
						$(this).attr('src', getImgPath(n)); })
			 		.animate({'opacity': 1 }, 500);
	}

	function prevSlide(){
		var prevSlide = getCurrentSlide() > 1 ? getCurrentSlide() - 1 : slides.length;
		changeSlide(prevSlide);
	}

	function nextSlide(){
		var nextSlide = getCurrentSlide() < slides.length ? getCurrentSlide() + 1 : 1;
		changeSlide(nextSlide);
	}

	function setSlidePanel(n){
		$(slides).removeClass('active');
		$(slides[n-1]).addClass('active');
	}

	return {
		initSlider: initSlider
	}
})();


//==============================================================================
//															   **INSTAGRAM**
//==============================================================================
magnatApp.instagram = (function(){

	function initInstagram(){

		$('.carousel').slick({
			slidesToShow: 5,
			slidesToScroll: 2,
			variableWidth: true,
			infinite: true,
			autoplay: true,
			autoplaySpeed: 1000
		});

		setHandlers();

	};

	function setHandlers(){
		$('#modal-instagram-picture').hide().on('click', function(){
			$(this).children().removeAttr('src').end().hide();
			magnatApp.features.denyScrolling(false);
		});

		$('.carousel').on('mouseout', function(){
			$(this).children().blur();
		});

		$('.carousel').on("click", 'div img', function(event){
			$('#modal-instagram-picture').children().attr('src', $(event.target).attr('src').replace("lit", "big")).end().show();
			magnatApp.features.denyScrolling(true);
		});
	};

	return {
		initInstagram: initInstagram
	}
})();



//==============================================================================
//															   **MAP**
//==============================================================================
magnatApp.magnatMap = (function(){

	function initMap(){
		$('#map, #close-map').click(function(){
			var map = $('section.map');
			var backTop = $(window).width() < 680 ? 400 : 500;
			if(!map.hasClass('opened')){
				map.addClass('opened');
				$('html, body').animate({ scrollTop: $(document).height() }, 2000);
			}
			else
				$('html, body').animate({ scrollTop: $(document).scrollTop() - backTop + 100 }, 1000, function(){
					map.removeClass('opened')});
		});

	};

	return {
		initMap: initMap
	}
})();




//==============================================================================
//															   **ABOUT**
//==============================================================================
magnatApp.about = (function(){

	function initAbout(){

			var mam = document.getElementById('modal-about-magnat');
			mam.firstElementChild.addEventListener('click', function(e){
				e.stopPropagation();
			}, true);

			$('#more-magnat, #more-magnat-2').on('click', function(event){
				$('#modal-about-magnat').show().children().animate({'opacity' : 1}, 1000);
				magnatApp.features.denyScrolling(true);
			});

			$('#modal-about-magnat').hide().click(function(){
				$(this).children().removeAttr('src').css('opacity', 0).end().hide();
				magnatApp.features.denyScrolling(false);
			});

	};

	return { initAbout: initAbout }
})();


//==============================================================================
//														 **TECHNOLOGY**
//==============================================================================
magnatApp.technology = (function(){

	function initTechnology(){

		var mat = document.getElementById('modal-about-technology');
		mat.firstElementChild.addEventListener('click', function(e){
			e.stopPropagation();
		}, true);

		$('#modal-about-technology').hide().click(function(){
			$(this).children().removeAttr('src').css('opacity', 0).end().hide();
			magnatApp.features.denyScrolling(false);
		});

		$('#more-tech').click(function(event){
			$('#modal-about-technology').show().children().animate({'opacity' : 1}, 1000);
			magnatApp.features.denyScrolling(true);
		});

	};

	return { initTechnology: initTechnology }
})();


//==============================================================================
//														 **SUBSCRIBE**
//==============================================================================
magnatApp.footer.subscribe = (function(){

	function initSubscribe(){
		$('#subscribe').on('click', function(){
			if(!Math.abs(validateMail($('#subscribe-input')))){
				sendMail();
			}
			else
			{
				var mailOk = document.createElement('p');
				$(mailOk).addClass('mailok').text("Укажите корректные данные").insertAfter($('#subscribe'));
				setInterval(function(){
					$(mailOk).fadeOut("slow", function(){ $(this).remove(); });
				}, 2000);
			}
		});
	};

	function sendMail(){
		var form_data = $('#subscribe-input').serialize();
		form_data += "&action=subscribe";
		console.log(form_data);
		$.ajax({
			type: "POST",
			url: "./mail.php",
			data: form_data,
			success: function(){
				$('#subscribe-input').remove();
				var mailOk = document.createElement('p');
				$(mailOk).addClass('mailok').text("Ваша заявка на подписку принята").insertAfter($('#subscribe'));
				$('#subscribe').text('Cпасибо, что Вы с нами').off();
				setInterval(function(){
					$(mailOk).fadeOut("slow", function(){ $(this).remove(); });
				}, 10000);
			}
		});
	};

	function validateMail(obj){
		console.log(/.+@.+\..+/i.test($(obj).val()));
		if(/.+@.+\..+/i.test($(obj).val())) return 0;
		else return 1;
	}

	return {
		initSubscribe: initSubscribe
	}
})();


//==============================================================================
//														 **COMMENT**
//==============================================================================
magnatApp.comment = (function(){

	function initComment(){
		var browser = magnatApp.init.checkBrowser();
		if(browser === 'safari' || browser === 'ie')
			$('#comments').hide();
	}

	return {
		initComment: initComment
	}
})();




//==============================================================================
//														 **ORDER FORM**
//==============================================================================

magnatApp.orderForm = (function(){

	var orderForm,
			orderButton,
			alert;

	function initOrderForm(){
		orderForm = $('#order-form');
		orderButton = $('#make-order');

		orderForm.find('input[name=phone]').mask('(999) 999-9999');
		alert = document.createElement('p');
		$(alert).addClass('alert');

		setHandlers();
	}

	function setHandlers(){
		orderForm.on('change blur', 'input', function(){
			var result = validate($(this));
			orderForm.find('p.alert').remove();

			if(!Math.abs(result))
				$(this).removeClass('novalid');
			else
				$(this).addClass('novalid');

			if(result === -1)
				$(alert).text('Заполните поле').addClass('alert').insertAfter($(this));
			if(result === 1 && $(this).attr('name') === 'name')
				$(alert).text('Введите корректное ФИО, пример "Иванов Иван Иванович"').addClass('alert').insertAfter($(this));
			if(result === 1 && $(this).attr('name') === 'phone')
				$(alert).text('Введите корректный телефон, пример "(000)000-0000"').addClass('alert').insertAfter($(this));
			if(result === 1 && $(this).attr('name') === 'mail')
				$(alert).text('Введите корректный адрес почты, пример "ivanov@mail.ru"').addClass('alert').insertAfter($(this));
		});

		orderButton.on('click', function(event){
			orderForm.toggleClass('active');

			if(!Math.abs(validate(orderForm.find('input[name=name]'))) &&
				 !Math.abs(validate(orderForm.find('input[name=mail]'))) &&
				 !Math.abs(validate(orderForm.find('input[name=phone]')))){

				var form_data = $('#order-form').serialize(); //собераем все данные из формы
				form_data += "&action=order";
				$.ajax({
					type: "POST",
					url: "./mail.php",
					data: form_data,
					success: function(){
						orderButton.off().text('спасибо за заказ');
						orderForm.remove();
						var mailOk = document.createElement('p');
						$(mailOk).addClass('mailok').text("Ваша заявка принята, мы отправили вам письмо подтверждения на почту и наш менеджер свяжется с вами по указанному телефону").insertAfter($('#make-order'));
						setInterval(function(){
							$(mailOk).fadeOut("slow", function(){ $(this).remove(); });
						}, 10000);
					}
				});
			}
		});
	}

	function validate(obj){
		if(obj.val() === '' || obj.val() === '(___) ___-____') return -1;

		if(obj.attr('name') === 'name'){
			if(/^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/.test(obj.val())) return 0;
			else return 1; }

		if(obj.attr('name') === 'phone'){
			if(obj.val().search('_') === -1) return 0;
			else return 1; }

		if(obj.attr('name') === 'mail'){
			if(/.+@.+\..+/i.test(obj.val())) return 0;
			else return 1; }
	}

	return {
		initOrderForm: initOrderForm
	}
})();











$(document).ready(function(){
	magnatApp.init.initPage();
});
