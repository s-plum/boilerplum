'use strict';

var convertNodeList = function (list) {
    var array = new Array(list.length);
    for (var i = 0, n = list.length; i < n; i++)
        array[i] = list[i];
    return array;
};

function plumquery(selector) {
	var nodes = document.querySelectorAll(selector);
	if (nodes) {
		return convertNodeList(nodes);
	}
	else {
		return [];
	}
}

module.exports = plumquery;