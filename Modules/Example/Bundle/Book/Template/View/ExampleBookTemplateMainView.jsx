var ExampleBookTemplateMainView = function (props, context) {
	MasterView.call(this, props, context);
}

ExampleBookTemplateMainView.prototype = Object.create(MasterView.prototype);

ExampleBookTemplateMainView.prototype.render = function () {
	return (<div id="First">Example Book</div>);
};