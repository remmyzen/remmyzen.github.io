(function ($) {
  $(function () {  
    var groups = {};

    $('.gallery').each(function() {
    var id = parseInt($(this).attr('data-group'), 10);
    if(!groups[id]) {
        groups[id] = [];
    } 

    groups[id].push( this );
    });


    $.each(groups, function() {

    $(this).magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        gallery: { enabled:true }
    })

    });
    
    // Debounce scroll event to reduce frequency of calculations
    var scrollTimeout;
    $(window).on('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(fnOnScroll, 10);
    });

    $(window).on('resize', function () {
      fnOnResize();
    });

    var agTimeline = $('.js-timeline'),
      agTimelineLine = $('.js-timeline_line'),
      agTimelineLineProgress = $('.js-timeline_line-progress'),
      agTimelinePoint = $('.js-timeline-card_point-box'),
      agTimelineItem = $('.js-timeline_item'),
      agOuterHeight = $(window).outerHeight(),
      agHeight = $(window).height(),
      f = -1,
      agFlag = false;

    function fnOnScroll() {
      agPosY = $(window).scrollTop();
      fnUpdateFrame();
    }

    function fnOnResize() {
      agPosY = $(window).scrollTop();
      agHeight = $(window).height();
      fnUpdateFrame();
    }

    function fnUpdateWindow() {
      agFlag = false;
      agPosY = $(window).scrollTop();

      agTimelineLine.css({
        top: agTimelineItem.first().find(agTimelinePoint).offset().top - agTimelineItem.first().offset().top,
        bottom: agTimeline.offset().top + agTimeline.outerHeight() - agTimelineItem.last().find(agTimelinePoint).offset().top
      });

      f !== agPosY && (f = agPosY, agHeight, fnUpdateProgress());
    }

    function fnUpdateProgress() {
      var agTop = agTimelineItem.last().find(agTimelinePoint).offset().top;

      i = agTop + agPosY - $(window).scrollTop();
      a = agTimelineLineProgress.offset().top + agPosY - $(window).scrollTop();
      n = agPosY - a + agOuterHeight / 2;
      i <= agPosY + agOuterHeight / 2 && (n = i - a);
      agTimelineLineProgress.css({height: n + "px"});

      agTimelineItem.each(function () {
        var itemTop = $(this).find(agTimelinePoint).offset().top;
        var scrollTrigger = agPosY + agOuterHeight * 0.6; // Lowered trigger point

        (itemTop + agPosY - $(window).scrollTop()) < scrollTrigger 
          ? $(this).addClass('js-ag-active') 
          : $(this).removeClass('js-ag-active');
      });
    }

    function fnUpdateFrame() {
      // Immediate update without waiting for animation frame
      fnUpdateWindow();
    }

    // Initial setup
    fnUpdateWindow();
  });
})(jQuery);