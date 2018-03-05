import React, {Component} from 'react';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {atomOneDark} from 'react-syntax-highlighter/styles/hljs';
import {Alert} from 'react-bootstrap';

class PreviewPanel extends Component {
    render() {
        const Div = styled.div`
            height: 50%;
            padding: 16px;
            background-color: rgb(40, 44, 52);
        `;

        const FHSyntaxHighLighter = styled(SyntaxHighlighter)`
            height: 100%;
            border: 0;        
        `;

        return (
            <Div>
                {this.props.codeString ? (
                    <FHSyntaxHighLighter
                        language='javascript'
                        style={atomOneDark}
                    >
                        {this.props.codeString}
                    </FHSyntaxHighLighter>
                ) : (
                    <Alert bsStyle="warning">
                        <strong>No file selected.</strong> Select one to preview.
                    </Alert>
                )
                }
            </Div>
        );
    }
}

export default PreviewPanel;