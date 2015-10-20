window.onload = function() {
	var instantPresentation = function() {
		var els = {
			slidesContainer: null,
			slides: null,
			stages: null,
			progress: null,
			pageNum: null,
			pageNumTimeout: null,
			currentPosition: 1
		};
		
		var switchSlide = function() {
			localStorage.setItem(Config.LS_CS, els.currentPosition);
			els.slidesContainer.style.left = '-' + ((els.currentPosition - 1) * 100) + '%';
			els.progress.style.width = (els.currentPosition / els.slides.length * 100) + '%';
			
			showPageNum();
		};
		
		var bounce = function(left) {
			if (left) {
				els.slidesContainer.style.left = Config.BOUNCE_RATE + '%';
			} else {
				els.slidesContainer.style.left = '-' + ((els.currentPosition - 1) * 100 + Config.BOUNCE_RATE) + '%';
			}
			
			setTimeout(function() {
				els.slidesContainer.style.left = '-' + ((els.currentPosition - 1) * 100) + '%';
			}, 200);
			
			showPageNum();
		};
		
		var showPageNum = function() {
			if (els.pageNum) {
				els.pageNum.innerHTML = els.currentPosition + '<span>/' + els.slides.length + '</span>';
				els.pageNum.className = '';
				
				clearTimeout(els.pageNumTimeout);
				els.pageNumTimeout = setTimeout(function() {
					els.pageNum.className = 'hide';
				}, Config.SLIDE_NUM_TIME);
			}
		};
		
		var addEvents = function() {
			document.onkeydown = function keyDown(event) {
				// left
				if (event.keyCode == '37') {
					if (els.currentPosition > 1) {
						--els.currentPosition;
						switchSlide();
					}
				}
				// right
				if (event.keyCode == '39') {
					if (els.currentPosition < els.slides.length) {
						++els.currentPosition;
						switchSlide();
					}
				}
			};

			var hammer = new Hammer(els.slidesContainer);
			hammer.on('swiperight', function(e) {
				if (els.currentPosition > 1) {
					--els.currentPosition;
					switchSlide();
				} else {
					bounce(true);
				}
			});
			
			hammer.on('swipeleft', function(e) {
				if (els.currentPosition < els.slides.length) {
					++els.currentPosition;
					switchSlide();
				} else {
					bounce(false);
				}
			});
		};
		
		var init = function() {
			if (Config.SLIDE_NUM) {
				document.getElementById('container').innerHTML += '<span id="page-num"></span>';
				els.pageNum = document.getElementById('page-num');
			}
			
			els.slidesContainer = document.getElementById('slides');
			els.slides = document.querySelectorAll('#slides > div');
			els.stages = document.getElementById('stages');
			els.progress = document.getElementById('progress');
			
			if (localStorage.getItem(Config.LS_CS) === null) {
				localStorage.setItem(Config.LS_CS, els.currentPosition);
			} else {
				els.currentPosition = localStorage.getItem(Config.LS_CS);
			}
			
			els.slidesContainer.style.width = (els.slides.length * 100) + '%';
			
			for (var i = 0; i < els.slides.length; ++i) {
				els.slides[i].style.width = (100 / els.slides.length) + '%';
				
				if (els.slides[i].classList.contains('section-start')) {
					var pos = 0;
					if (i != 0) {
						pos = i / els.slides.length * 100;
					}
					els.stages.innerHTML += '<span style="left: ' + pos + '%;"></span>';
				}
			}
			
			addEvents();
			switchSlide();
		}();
	}();
};
