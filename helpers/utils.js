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