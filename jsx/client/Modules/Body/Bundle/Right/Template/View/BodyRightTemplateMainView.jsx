


var BodyRightTemplateMainView = function () { MasterView.apply(this, arguments);}
BodyRightTemplateMainView.prototype = Object.create(MasterView.prototype);

BodyRightTemplateMainView.prototype.onClick = function () {
		var dispatcher = serviceLocator.get('Dispatcher');
		dispatcher.trigger('Body:Right:coverShow');
	}

BodyRightTemplateMainView.prototype.render = function () {
		return (<div id="right" onClick={this.onClick}>
			Right
		</div>);
	}

window["BodyRightTemplateMainView"] = BodyRightTemplateMainView;


