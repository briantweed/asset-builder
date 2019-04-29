
const commands = [
    {
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
        'fn': 'images',
        'text': 'create favicon',
        'icon': 'dice-five',
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

class Container extends React.Component {
    render() {
        return (
            <div className="container">
                <Header/>
                <div className="row">
                    <div className="col-2 mt-2">
                        <Sidebar/>
                    </div>
                    <div className="col-7 offset-1">
                        <TemplateForm/>
                        <Heading size="2" text="Current Templates" style="mt-4"/>
                        <TemplateList/>
                    </div>
                </div>
            </div>
        );
    }
}

class Sidebar extends React.Component {
    render() {
        return (
            <div>
                <Heading size="2" text="Gulp Processes" style="mb-4"/>
                <GulpCommands/>
            </div>
        );
    }
}

class GulpCommands extends React.Component {
    render() {
        return commands.map((data, index) => {
            return <Button data={data} key={index}/>
        });
    }
}

class Header extends React.Component {
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

class TemplateForm extends React.Component {
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

class TemplateList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            names: []
        };
    }

    componentDidMount() {
        $.ajax({
            url : 'http://localhost:3000/names',
            method : 'POST',
            dataType: 'JSON',
            success: (data) => {
               this.setState({names: data});
            }
        });
    }

    render() {
        let names = this.state.names;
        return names.map((name, index) => {
            return <PageLink name={name} key={index}/>
        });

    }

}


class PageLink extends React.Component {
    render() {
        const href = this.props.name + `.html`;
        return (
            <a key={this.props.index} className="list-group-item list-group-item-action" href={href}>{this.props.name}</a>
        );
    }
}

class Heading extends React.Component {
    render() {
        const HeadingTag = `h${(this.props.size ? this.props.size : 2)}`;
        return (
            <HeadingTag className={this.props.style}>{this.props.text}</HeadingTag>
        );
    }
}

class Button extends React.Component {
    buttonClicked(fn){
        $.ajax({
            url : 'http://localhost:3000/send',
            method : 'POST',
            data: {
                'command': fn
            },
            success : function(result){
                console.log(result)
            },
            error : function(result){
                console.log(result)
            }
        });
    };
    render() {
        return (
            <button key={this.props.index} onClick={this.buttonClicked.bind(this, this.props.data.fn)} className={'btn btn-sm btn-block mb-3 text-left btn-' + (this.props.data.button ? this.props.data.button : 'light')}><i className={'fa fa-fw mx-2 fa-' + this.props.data.icon}> </i>{this.props.data.text}</button>
        );
    }
}

ReactDOM.render(<Container/>, document.getElementById('app'));