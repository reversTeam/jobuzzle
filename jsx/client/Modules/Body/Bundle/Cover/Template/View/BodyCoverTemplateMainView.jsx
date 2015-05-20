

var BodyCoverTemplateMainView = function () { MasterView.apply(this, arguments);}
BodyCoverTemplateMainView.prototype = Object.create(MasterView.prototype);

BodyCoverTemplateMainView.prototype.getInitialState = function () {
		return ({ visible : false });
	}

BodyCoverTemplateMainView.prototype.coverShow = function () {
		this.setState({ visible : true });
	}

BodyCoverTemplateMainView.prototype.coverHide = function () {
		var dispatcher = serviceLocator.get('Dispatcher');

		dispatcher.trigger(this._template._referer);
		this.setState({ visible : false });
	}

BodyCoverTemplateMainView.prototype.render = function () {
		var activeState = 'disable';
		if (this.state.visible)
			activeState = 'enable'
		return (<div className={activeState} id="cover" onClick={this.coverHide.bind(this)}>
			Covers
		</div>);
	}

window["BodyCoverTemplateMainView"] = BodyCoverTemplateMainView;


