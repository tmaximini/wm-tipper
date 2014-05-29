$(document).ready(function() {
  $('textarea').autosize();
  $('input#startDate').datepicker({
    todayBtn: 'linked',
    autoclose: true,
    todayHighlight: true
  });
  $('.confirmDelete').submit(function() {
    return confirm('Bist du ganz sicher? Alle Tips für das Spiel werden mit gelöscht...');
  });
  $('.confirmLeave').click(function() {
    return confirm('Bist du sicher, dass du die Gruppe verlassen möchtest?');
  });
  $('.confirmGroupDelete').click(function() {
    return confirm('Bist du ganz super sicher, dass du diese Gruppe löschen möchtest?');
  });
  var mySwiper = $('.swiper-container').swiper({
    //Your options here:
    mode:'horizontal',
    pagination: '.pagination',
    autoplayDisableOnInteraction: true,
    loop: true,
    autoplay: 7000,
    grabCursor: true,
    paginationClickable: true
    //etc..
  });

  $('.swiper-pagination-switch, iframe').click(function() {
    mySwiper.stopAutoplay();
  });

  // Find all YouTube videos
    var $allVideos = $('iframe[src^="//www.youtube.com"]');

    // The element that is fluid width
    var $fluidEl = $('.wmTipper');

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {

      $(this)
        .data('aspectRatio', this.height / this.width)

        // and remove the hard coded width/height
        .removeAttr('height')
        .removeAttr('width');

    });

    // When the window is resized
    // (You'll probably want to debounce this)
    $(window).resize(function() {

      var newWidth = $fluidEl.width() - 40;

      // Resize all videos according to their own aspect ratio
      $allVideos.each(function() {

        var $el = $(this);
        $el
          .width(newWidth)
          .height(newWidth * $el.data('aspectRatio'));

      });

    // Kick off one resize to fix all videos on page load
    }).resize();

});
