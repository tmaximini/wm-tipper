// jQuery plugin to prevent double submission of forms
jQuery.fn.preventDoubleSubmission = function() {
  $(this).on('submit',function(e){
    var $form = $(this);

    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      console.log('prevented double submission');
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

  // Keep chainability
  return this;
};

$(document).ready(function() {
  $('textarea').autosize();
  $('form').preventDoubleSubmission();
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
  $('.confirmNewsDelete').click(function() {
    return confirm('Newseintrag löschen?');
  });

  $('.togglePastMatches').click(function() {
    $('.matches .started').toggle();
    if ($(this).text() === 'Vergangene Partien anzeigen') {
      $(this).text('Vergangene Partien ausblenden');
    } else {
      $(this).text('Vergangene Partien anzeigen');
    }
    return false;
  });


  // Find all YouTube videos
  //var $allVideos = $('iframe[src^="//www.youtube.com"]');

  //// The element that is fluid width
  //var $fluidEl = $('.wmTipper');

  //// Figure out and save aspect ratio for each video
  //$allVideos.each(function() {

  //  $(this)
  //    .data('aspectRatio', this.height / this.width)

  //    // and remove the hard coded width/height
  //    .removeAttr('height')
  //    .removeAttr('width');

  //});

  //// When the window is resized
  //// (You'll probably want to debounce this)
  //$(window).resize(function() {

  //  var newWidth = $fluidEl.width() - 40;

  //  // Resize all videos according to their own aspect ratio
  //  $allVideos.each(function() {

  //    var $el = $(this);
  //    $el
  //      .width(newWidth)
  //      .height(newWidth * $el.data('aspectRatio'));

  //  });

  //// Kick off one resize to fix all videos on page load
  //}).resize();

});
