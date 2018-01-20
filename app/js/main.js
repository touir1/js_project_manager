"use strict";

$.get("/projectList", function(responseData) {
  var dirs = responseData.data;
  console.log("Projects list: " + dirs);
});
