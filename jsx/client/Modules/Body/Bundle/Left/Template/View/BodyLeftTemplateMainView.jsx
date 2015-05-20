

var BodyLeftTemplateMainView = function () { MasterView.apply(this, arguments);}
BodyLeftTemplateMainView.prototype = Object.create(MasterView.prototype);

BodyLeftTemplateMainView.prototype.render = function () {
		return (<div id="left">
			Left
		</div>);
	}

window["BodyLeftTemplateMainView"] = BodyLeftTemplateMainView;


