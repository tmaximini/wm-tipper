exports.convertToSlug = function (text) {
  return text
    .toLowerCase()
    .replace(/ /g,'-')
    .replace(/[^\w-]+/g,'');
};


exports.userInGroup = function (user, group) {
 return user.groups.some(function (userGroup) {
    return userGroup.equals(group._id);
  });
};


exports.getPoints = function(match, tip) {
  var points = 0;
  var st1 = match.scoreTeam1;
  var st2 = match.scoreTeam2;

  if ((st1 === tip.scoreTeam1) && (st2 === tip.scoreTeam2)) {
    points = 3;
  } else {

      if ((tip.bet === 'X' && (st1 === st2)) ||
          (tip.bet === '1' && (st1 > st2)) ||
          (tip.bet === '2' && (st1 < st2))) {
        points = 1;
      }
  }
  return points;
};