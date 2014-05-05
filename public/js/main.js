$(document).ready(function() {

  $('input#startDate').datepicker({
      todayBtn: "linked",
      autoclose: true,
      todayHighlight: true
  });

  moment.lang('de');

});
