

var ExampleBookTemplateMainView = function () { MasterView.apply(this, arguments);}
ExampleBookTemplateMainView.prototype = Object.create(MasterView.prototype);

ExampleBookTemplateMainView.prototype.render = function () {
		return (<div id="book">
			Example -'\3e' Book View
		</div>);
	}

window["ExampleBookTemplateMainView"] = ExampleBookTemplateMainView;


