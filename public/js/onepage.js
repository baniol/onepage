$(document).ready(function(){

	var pages = {

		$this:null,
		pagesNum :0,
		currentPage:0,
		colorArray: [],
		_iScroll:[],
		carousel:null,
		hash:null,
		hashArray:[],
		touchDev:null,
		clickEvent:null,

		init: function(){
			$this = this;

			// touch device detection
			this.touchDev = this.touchDev();
			// this.clickEvent = this.touchDev ? 'touchstart' : 'click';
			this.clickEvent = 'click';

			this.hash = window.location.hash;

			// getting colors for main menu items (from html - #hidden-colors - set in less file)
			var col = $('#hidden-colors span');
			$.each(col,function(k,v){
				var c = $(v).css('background-color');
				$this.colorArray.push(c);
			});

			this.setMenuWidth();
			var menuLi = $('#main-menu .ca-menu li');

			// set top menu items colors
			// loop if the nuber of items is greater than color array (default 5 colors)
			var ci = 0;
			var lic = 0;
			$.each(menuLi,function(k,v){
				var el = $(v);
				if(ci >= $this.colorArray.length){
					ci = 0;
				}
				el.css('background-color',$this.colorArray[ci]);
				ci++;
				lic++;
			});

			// setting menu width for horizontal scrolling
			var liWidth= menuLi.width();
			// console.log(liWidth*lic);
			$('#main-menu .ca-menu').width(liWidth*lic+30);
			$('#main-content').css({'margin-top':$('#menu-wrapper').height()+'px'});

			// init hash
			this.pagesNum = lic;
			this.createHashArray();
			this.currentPage = this.pageByHash();
			this.hash = arr[this.currentPage].slug;

			// set current page
			this.changePage();
			this.bindEvents();

			// init top menu horizontal scroll
			// @todo - trigger only if the top menu is wider than the viewport
			$this.initScroll(0,$('#main-menu')[0],{hScrollbar:false});
		},

		bindEvents: function(){
			window.addEventListener('orientationchange', function(){$this.orientationChange();}, false);
			$(document).on($this.clickEvent,'.ca-menu li',function(e){
				e.preventDefault();
				$this.currentPage = $(this).data('id');
				$this.changePage();
			});

			$(document).on($this.clickEvent,'#page-nav .left',function(e){
				$this.navLeft();
			});

			$(document).on($this.clickEvent,'#page-nav .right',function(e){
				$this.navRight();
			});

			$(document).keydown(function(e){
			    if (e.keyCode == 37) { // left
			       $this.navLeft();
			    }
			    if (e.keyCode == 39) { // right
			       $this.navRight();
			    }
			});
		},

		navLeft: function(){
			if($this.currentPage == 0){
				$this.currentPage = $this.pagesNum-1;
			}
			else{
				$this.currentPage--;
			}
			$this.changePage();
		},

		navRight: function(){
			var index;
				if($this.currentPage == $this.pagesNum-1){
				$this.currentPage = 0;
			}
			else{
				$this.currentPage++;
			}
			$this.changePage();
		},

		setMenuWidth: function(){
			var docW = $(document).width(),
				contW = $("#content-wrapper").width(),
				mcontent = $('#main-content').width(),
				add = mcontent >= 800 ? 7 : 0,
				m = (docW - mcontent)/2 - add;

			$('menu-title').width(contW);
			$('#menu-wrapper').width(contW);
			$('#page-nav').css({width:mcontent,left:m});;
		},

		createHashArray: function(){
			for(var i=0;i<arr.length;i++){
				this.hashArray[arr[i].slug] = i;
			}
		},

		pageByHash: function(){
			if($this.hash == ''){
				return 0;
			}else{
				return this.hashArray[this.hash.replace('#','')];
			}
		},

		changeHash: function(){
			var h = arr[$this.currentPage].slug;
			this.hash = h;
			window.location.hash = '#'+h;
		},

		changePage: function(slide){
			this.changeMenu();
			var page = $('#page_'+($this.currentPage+1));
			$('#main-content article').hide();
			page.show();
			this.changeHash();
			this.changeColor();
		},

		// set active current menu item
		changeMenu: function(){
			var curr = arr[$this.currentPage];
			var m = $('#main-menu .ca-menu li[data-id='+this.currentPage+']');
			$('#main-menu .ca-menu li').removeClass('hover');
			m.addClass('hover');
			$('#menu-title').text(curr.title);
		},

		changeColor: function(){
			var cIndex; // color array index
			if($this.currentPage >= $this.colorArray.length){
				cIndex = $this.currentPage - $this.colorArray.length;
			}else{
				cIndex = $this.currentPage;
			}
			var color = $this.colorArray[cIndex];
			
			$('body').css('background-color',color);
			$('#menu-wrapper,#main-menu').css('background-color',color);
		},

        initScroll: function(index,element,opt){
        	var options = opt || {};
            // $('#swipeview-slider .swipeview-active span').css({display:'block'});
            setTimeout(function(){
                if(typeof $this._iScroll[index] !== 'undefined')
	                $this._iScroll[index].destroy();
	            delete $this._iScroll[index];
	            options.useTransition = true;
	            $this._iScroll[index] = new iScroll(element,options);
            },200);
        },

		touchDev: function() {
			return !!('ontouchstart' in window) // works on most browsers 
			|| !!('onmsgesturechange' in window); // works on ie10
		},

		orientationChange: function(){
			this.setMenuWidth();
			this.changePage();
			// if (orientation == 0 || orientation == 180) {
			//   //portraitMode, do your stuff here
			// }
			// else if (orientation == 90 || orientation == -90) {
			//   //landscapeMode
			// }
		}
	};

	pages.init();

});