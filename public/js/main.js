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
});
