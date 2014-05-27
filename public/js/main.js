$(document).ready(function() {
  $('textarea').autosize();
  $('input#startDate').datepicker({
    todayBtn: "linked",
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
    loop: true
    //etc..
  });
});
