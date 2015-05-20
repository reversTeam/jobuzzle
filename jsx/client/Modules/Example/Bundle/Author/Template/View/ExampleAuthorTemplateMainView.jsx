

var ExampleAuthorTemplateMainView = function () { MasterView.apply(this, arguments);}
ExampleAuthorTemplateMainView.prototype = Object.create(MasterView.prototype);

ExampleAuthorTemplateMainView.prototype.render = function () {
		return (<div id="author">
			Example Author View
		</div>);
	}

window["ExampleAuthorTemplateMainView"] = ExampleAuthorTemplateMainView;


