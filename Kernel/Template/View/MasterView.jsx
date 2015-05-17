var MasterView = React['createClass']({

	"render" : function () {
		throw "It's an abstract view, you can't instancied an object if you don't have override render method"
	}

});

MasterView.extend = function (childPrototype) {
	var parent = this;
	var child = function() { return parent.apply(this, arguments); };
	child.extend = parent.extend;
	var Surrogate = function() {};

	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	for(var key in childPrototype){
		child.prototype[key] = childPrototype[key];
	}
	return child;
};