jQuery(document).ready(function() {

  var groups = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 10,
    prefetch: {
      // url points to a json file that contains an array of country names, see
      // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
      url: '/groups.json'

    }
  });

  // kicks off the loading/processing of `local` and `prefetch`
  groups.initialize();

  // passing in `null` for the `options` arguments will result in the default
  // options being used
  jQuery('#join-group .typeahead').typeahead(null, {
    name: 'Gruppen',
    displayKey: 'name',
    // `ttAdapter` wraps the suggestion engine in an adapter that
    // is compatible with the typeahead jQuery plugin
    source: groups.ttAdapter()
  });

});