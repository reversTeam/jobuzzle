var ExampleAuthorTemplateMainView = function (props, context) {
	MasterView.call(this, props, context);
}

ExampleAuthorTemplateMainView.prototype = Object.create(MasterView.prototype);

ExampleAuthorTemplateMainView.prototype.render = function () {
	return (<div id="First">Example Author</div>);
};