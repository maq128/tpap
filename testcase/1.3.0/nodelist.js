var NodeList = KISSY.NodeList;

console.log('NodeList.all', NodeList.all);
var parent = NodeList.all('.dom-father');
console.log('parent', parent);
console.log('parent.text()', parent.text());
console.log('parent.lengthx', parent.lengthx);
var children = parent.all('div');
console.log('children', children);
console.log('children.text()', children.text());
console.log('children.lengthx', children.lengthx);

parent.on( 'click', function( e ) {
	// console.log('click:', this, e);
	// var div = parent.getDOMNode();
	// console.log('getDOMNode', div, div.innerHTML);
	var ancestor = parent.parent();
	console.log('ancestor', ancestor, ancestor.lengthx);
});
parent.on( 'mouseover', function( e ) {
	console.log('mouseover:', e);
});

// var parent = NodeList('<div>html</div>');
// console.log('ctor', parent);
// var child = parent.all('div');
// console.log('child', child);
