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

		init: function(){
			$this = this;

			this.hash = window.location.hash;

			// getting colors for main menu items (from html - #hidden-colors - set in less file)
			var col = $('#hidden-colors span');
			$.each(col,function(k,v){
				var c = $(v).css('background-color');
				$this.colorArray.push(c);
			});

			$('#menu-wrapper').width($("#content-wrapper").width());
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
			$('#main-content').css(
				{
					'margin-top':$('#menu-wrapper').height()+'px'
					// height:'400px'
				});

			// var slideWidth = $('#main-content').width();
			// $('#content-list li').width(slideWidth);
			// $('#c-wrapper').width(slideWidth*lic);

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

		// setContentHeight: function(){
		// 	setTimeout(function(){
		// 		var p = parseInt($this.currentPage+1,10);
		// 		var act = $('#page_'+p).height();
		// 		$('#main-content').height(act+30);
		// 	},10);
		// },

		bindEvents: function(){
			$(document).on('click','.ca-menu li',function(e){
				e.preventDefault();
				$this.currentPage = $(this).data('id');
				$this.changePage();
			});
			$(document).keydown(function(e){
			    if (e.keyCode == 37) { // left
			       if($this.currentPage == 0){
			       		$this.currentPage = $this.pagesNum-1;
			       }
			       else{
			       		$this.currentPage--;
			       }
			       $this.changePage();
			    }
			    if (e.keyCode == 39) { // right
			       var index;
			       if($this.currentPage == $this.pagesNum-1){
			       		$this.currentPage = 0;
			       }
			       else{
			       		$this.currentPage++;
			       }
			       $this.changePage();
			    }
			});
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
			// this.pageScroll.scrollToPage(this.currentPage);
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

		startSwipeview: function(slides){
            var el,i,page;
            this.carousel = new SwipeView('#main-content', {
                numberOfPages: slides.length,
                hastyPageFlip: true,
                loop:true
            });

            // Load initial data
            for (i=0; i<3; i++) {
                page = i==0 ? slides.length-1 : i-1;
                el = $('<div class="active-content" />')
                el.html(slides[page].content);
                $this.carousel.masterPages[i].appendChild(el[0]);
            }

            // $this.initScroll(1,$('.swipeview-active')[0]);

            $this.carousel.onFlip(function () {
                var el,upcoming,i;
                for (i=0; i<3; i++) {

                    upcoming = $this.carousel.masterPages[i].dataset.upcomingPageIndex;

                    if (upcoming != $this.carousel.masterPages[i].dataset.pageIndex) {
                    	$this.currentPage = $this.carousel.pageIndex;
                        $this.changePage(true);
                        el = $this.carousel.masterPages[i].querySelector('div');
                        el.innerHTML = slides[upcoming].content;
                    }
                }
                $this.setContentHeight();
                // $this.initScroll(1,$('.swipeview-active')[0]);
            });
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
        }
	};

	pages.init();

});