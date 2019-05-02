
const ucwords = (string) => {
    return string.toLowerCase()
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


const commands = [
    {
        'fn': 'watch',
        'text': 'watch',
        'icon': 'eye',
    }, {
        'fn': 'build',
        'text': 'build all',
        'icon': 'industry',
    }, {
        'fn': 'css',
        'text': 'compile css',
        'icon': 'palette',
    }, {
        'fn': 'js',
        'text': 'compile js',
        'icon': 'code',
    }, {
        'fn': 'images',
        'text': 'compress images',
        'icon': 'image',
    }, {
        'fn': 'favicon',
        'text': 'create favicon',
        'icon': 'dice-five',
    }, {
        'fn': 'fonts',
        'text': 'copy fonts',
        'icon': 'font',
    }, {
        'fn': 'zip',
        'text': 'zip assets',
        'icon': 'file-archive',
    }, {
        'fn': 'clean',
        'text': 'delete templates',
        'icon': 'minus-circle',
        'button': 'danger'
    }
];


class Container extends React.Component
{
    render() {
        return (
            <div className="container">
                <Header/>
                <div className="row">
                    <div className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3 mt-2">
                        <Sidebar/>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 offset-sm-1">
                        <TemplateForm/>
                        <Heading size="2" text="Current Templates" style="my-4"/>
                        <TemplateList/>
                    </div>
                </div>
            </div>
        );
    }
}


class Sidebar extends React.Component
{
    render() {
        return (
            <div>
                <Heading size="2" text="Gulp Processes" style="mb-4"/>
                <GulpCommands/>
            </div>
        );
    }
}


class GulpCommands extends React.Component
{
    render() {
        return commands.map((data, index) => {
            return <Button data={data} key={index}/>
        });
    }
}


class Header extends React.Component
{
    render() {
        return (
            <div className="row">
                <div className="col-12 mt-3 mb-4">
                    <Heading size="1" text="{{ project_title }}" />
                </div>
            </div>
        );
    }
}


class TemplateForm extends React.Component
{
    constructor(props){
        super(props);
        this.templateName = '';
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateInput() {
        this.templateName = event.target.value
    }

    handleSubmit() {
        $.ajax({
            url : 'http://localhost:3000/create',
            method : 'POST',
            dataType: 'json',
            data: {
                'command': this.templateName
            },
            success: function (result) {
                console.log(result)
            },
            error : function(result){
                console.log(result)
            }
        });
    }

    render() {
        return (
            <div className="pb-3">
                <Heading text="Create New Template" style="mb-4"/>
                <div className="input-group mb-2">
                    <input onChange={this.updateInput} type="text" className="form-control form-control-sm" id="template" name="template" placeholder="enter name without .html" />
                    <div className="input-group-append">
                        <button onClick={this.handleSubmit} className="btn btn-sm btn-info ml-2">create</button>
                    </div>
                </div>
            </div>
        );
    }
}


class TemplateList extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            names: 'There are currently no templates'
        };
    }

    componentDidMount() {
        $.ajax({
            url : 'http://localhost:3000/names',
            method : 'POST',
            dataType: 'json',
            success: (data) => {
               if(data.length) this.setState({names: data});
            }
        });
    }

    render() {
        let names = this.state.names;
        if(typeof names === "object") {
            return names.map((name, index) => {
                return <PageLink name={name} key={index}/>
            });
        } else {
            return (
                <p>{names}</p>
            );
        }

    }
}


class PageLink extends React.Component
{
    render() {
        const href = this.props.name + `.html`;
        return (
            <a key={this.props.index} className="list-group-item list-group-item-action" href={href}>{ucwords(this.props.name)}</a>
        );
    }
}


class Heading extends React.Component
{
    render() {
        const HeadingTag = `h${(this.props.size ? this.props.size : 2)}`;
        return (
            <HeadingTag className={this.props.style}>{this.props.text}</HeadingTag>
        );
    }
}


class Button extends React.Component
{
    constructor(props) {
        super(props);
        this.updateIcon = this.updateIcon.bind(this);
        this.default = this.props.data.icon;
        this.spinner = 'spinner fa-spin';
        this.state = {
            icon: this.default
        };
    }

    updateIcon(icon) {
        this.setState({icon: icon});
    }

    buttonClicked(command){
        let self = this;
        self.updateIcon(this.spinner);
        $.ajax({
            url : 'http://localhost:3000/send',
            method : 'POST',
            data: {
                'command': command
            },
            success : function(result){
                self.updateIcon(self.default);
                if(result.status === 200) {
                   toastr["success"](result.success)
                }
            },
            error : function(result){
                console.log(result)
            }
        });
    };

    render() {
        return (
            <button key={this.props.index} onClick={this.buttonClicked.bind(this, this.props.data.fn)} className={'btn btn-sm btn-block mb-3 text-left btn-' + (this.props.data.button ? this.props.data.button : 'light')}><i className={'fa fa-fw mx-2 fa-' + this.state.icon}> </i>{this.props.data.text}</button>
        );
    }
}


ReactDOM.render(<Container/>, document.getElementById('app'));