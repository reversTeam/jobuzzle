var tmp = React['createClass']({
	"render" : function () {
		throw "It's an abstract view, you can't instancied an object if you don't have override render method"
	}
});

var MasterView = function (props, context) {
	tmp.call(this, props, context);
};

MasterView.prototype = Object.create(tmp.prototype);

MasterView.prototype.reactInheritance = tmp;

MasterView.prototype.render = function () {
	return <div onClick={this.test.bind(this)}>{this.state.n}</div>
};