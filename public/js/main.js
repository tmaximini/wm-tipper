$(document).ready(function() {
  $('textarea').autosize();
  $('input#startDate').datepicker({
    todayBtn: "linked",
    autoclose: true,
    todayHighlight: true
  });
});
