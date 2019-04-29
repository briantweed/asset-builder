"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var commands = [{
  'fn': 'build',
  'text': 'build all',
  'icon': 'industry'
}, {
  'fn': 'css',
  'text': 'compile css',
  'icon': 'palette'
}, {
  'fn': 'js',
  'text': 'compile js',
  'icon': 'code'
}, {
  'fn': 'images',
  'text': 'compress images',
  'icon': 'image'
}, {
  'fn': 'images',
  'text': 'create favicon',
  'icon': 'dice-five'
}, {
  'fn': 'zip',
  'text': 'zip assets',
  'icon': 'file-archive'
}, {
  'fn': 'clean',
  'text': 'delete templates',
  'icon': 'minus-circle',
  'button': 'danger'
}];

var Container =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Container, _React$Component);

  function Container() {
    _classCallCheck(this, Container);

    return _possibleConstructorReturn(this, _getPrototypeOf(Container).apply(this, arguments));
  }

  _createClass(Container, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "container"
      }, React.createElement(Header, null), React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-2 mt-2"
      }, React.createElement(Sidebar, null)), React.createElement("div", {
        className: "col-7 offset-1"
      }, React.createElement(TemplateForm, null), React.createElement(Heading, {
        size: "2",
        text: "Current Templates",
        style: "mt-4"
      }), React.createElement(TemplateList, null))));
    }
  }]);

  return Container;
}(React.Component);

var Sidebar =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Sidebar, _React$Component2);

  function Sidebar() {
    _classCallCheck(this, Sidebar);

    return _possibleConstructorReturn(this, _getPrototypeOf(Sidebar).apply(this, arguments));
  }

  _createClass(Sidebar, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(Heading, {
        size: "2",
        text: "Gulp Processes",
        style: "mb-4"
      }), React.createElement(GulpCommands, null));
    }
  }]);

  return Sidebar;
}(React.Component);

var GulpCommands =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(GulpCommands, _React$Component3);

  function GulpCommands() {
    _classCallCheck(this, GulpCommands);

    return _possibleConstructorReturn(this, _getPrototypeOf(GulpCommands).apply(this, arguments));
  }

  _createClass(GulpCommands, [{
    key: "render",
    value: function render() {
      return commands.map(function (data, index) {
        return React.createElement(Button, {
          data: data,
          key: index
        });
      });
    }
  }]);

  return GulpCommands;
}(React.Component);

var Header =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(Header, _React$Component4);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, _getPrototypeOf(Header).apply(this, arguments));
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-12 mt-3 mb-4"
      }, React.createElement(Heading, {
        size: "1",
        text: "{{ project_title }}"
      })));
    }
  }]);

  return Header;
}(React.Component);

var TemplateForm =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(TemplateForm, _React$Component5);

  function TemplateForm(props) {
    var _this;

    _classCallCheck(this, TemplateForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TemplateForm).call(this, props));
    _this.templateName = '';
    _this.updateInput = _this.updateInput.bind(_assertThisInitialized(_this));
    _this.handleSubmit = _this.handleSubmit.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TemplateForm, [{
    key: "updateInput",
    value: function updateInput() {
      this.templateName = event.target.value;
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit() {
      $.ajax({
        url: 'http://localhost:3000/create',
        method: 'POST',
        data: {
          'command': this.templateName
        },
        success: function success(result) {
          console.log(result);
        },
        error: function error(result) {
          console.log(result);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "pb-3"
      }, React.createElement(Heading, {
        text: "Create New Template",
        style: "mb-4"
      }), React.createElement("div", {
        className: "input-group mb-2"
      }, React.createElement("input", {
        onChange: this.updateInput,
        type: "text",
        className: "form-control form-control-sm",
        id: "template",
        name: "template",
        placeholder: "enter name without .html"
      }), React.createElement("div", {
        className: "input-group-append"
      }, React.createElement("button", {
        onClick: this.handleSubmit,
        className: "btn btn-sm btn-info ml-2"
      }, "create"))));
    }
  }]);

  return TemplateForm;
}(React.Component);

var TemplateList =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(TemplateList, _React$Component6);

  function TemplateList(props) {
    var _this2;

    _classCallCheck(this, TemplateList);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TemplateList).call(this, props));
    _this2.state = {
      names: 'There are currently no templates.'
    };
    return _this2;
  }

  _createClass(TemplateList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      $.ajax({
        url: 'http://localhost:3000/names',
        method: 'POST',
        success: function success(data) {
          _this3.setState({
            names: data
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("p", null, this.state.names);
    }
  }]);

  return TemplateList;
}(React.Component);

var Heading =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(Heading, _React$Component7);

  function Heading() {
    _classCallCheck(this, Heading);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heading).apply(this, arguments));
  }

  _createClass(Heading, [{
    key: "render",
    value: function render() {
      var HeadingTag = "h".concat(this.props.size ? this.props.size : 2);
      return React.createElement(HeadingTag, {
        className: this.props.style
      }, this.props.text);
    }
  }]);

  return Heading;
}(React.Component);

var Button =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(Button, _React$Component8);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, _getPrototypeOf(Button).apply(this, arguments));
  }

  _createClass(Button, [{
    key: "buttonClicked",
    value: function buttonClicked(fn) {
      $.ajax({
        url: 'http://localhost:3000/send',
        method: 'POST',
        data: {
          'command': fn
        },
        success: function success(result) {
          console.log(result);
        },
        error: function error(result) {
          console.log(result);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        key: this.props.index,
        onClick: this.buttonClicked.bind(this, this.props.data.fn),
        className: 'btn btn-sm btn-block mb-3 text-left btn-' + (this.props.data.button ? this.props.data.button : 'light')
      }, React.createElement("i", {
        className: 'fa fa-fw mx-2 fa-' + this.props.data.icon
      }, " "), this.props.data.text);
    }
  }]);

  return Button;
}(React.Component);

ReactDOM.render(React.createElement(Container, null), document.getElementById('app'));