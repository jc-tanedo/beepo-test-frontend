import React, {Component} from 'react';
import styled from 'styled-components';
import {getFileNames, uploadScript} from '../../api';

import {
    Panel,
    ListGroup,
    ListGroupItem,
    FormGroup,
    FormControl,
    ControlLabel
} from 'react-bootstrap';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
        };

        this.loadFileNames = this.loadFileNames.bind(this);
        this.loadPreview = this.loadPreview.bind(this);
        this.beginUpload = this.beginUpload.bind(this);
    }

    componentDidMount() {
        this.loadFileNames();
    }

    loadFileNames() {
        return getFileNames()
            .then(
                result => this.setState({
                    items: result.data
                }),
                error => this.setState({
                    error
                })
            )
    }

    loadPreview(id, e) {
        e.preventDefault();
        this.props.onFileSelect(id);
    }

    beginUpload(e) {
        if (e.target.files && e.target.files.length) {

            const file = e.target.files[0];
            const reader = new FileReader();

            if (file.size > 10000000) { // 10mB
                return alert('File too large');
            }

            reader.onload = () => {
                let contents = reader.result;

                if (contents.match(/[^\u0000-\u007f]/)) {
                    return alert('Invalid script file');
                }

                uploadScript(file, contents)
                    .then(() => {
                        this.loadFileNames();
                        alert(`${file.name} added.`)
                    });
            };

            reader.readAsBinaryString(file);
        }
    }

    render() {
        const Div = styled.div`
            height: 100%;
            padding: 16px 0 0 16px;
        `;

        const {items} = this.state;

        const fileNames = items.map(item => (
            <ListGroupItem key={item.id}>
                <a href="#" onClick={e => this.loadPreview(item.id, e)}>{item.file_name}</a>
            </ListGroupItem>
        ));

        return (
            <Div>
                <Panel>
                    <Panel.Heading>
                        Available files
                    </Panel.Heading>
                    <ListGroup>
                        {fileNames}
                        <ListGroupItem>
                            <form>
                                <FormGroup>
                                    <ControlLabel>Add script</ControlLabel>
                                    <FormControl
                                        type="file"
                                        onChange={this.beginUpload}
                                    >
                                    </FormControl>
                                </FormGroup>
                            </form>
                        </ListGroupItem>
                    </ListGroup>
                </Panel>
            </Div>
        );
    }
}

export default Sidebar;