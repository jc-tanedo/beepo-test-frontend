import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import styled from 'styled-components';
import _ from 'lodash';

import {getScript} from '../api';

import Sidebar from '../components/partials/Sidebar';
import PreviewPanel from '../components/partials/Preview';
import OptionsPanel from '../components/partials/Options';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            script: {},
            codeReplaced: false
        };
        this.onFileSelect = this.onFileSelect.bind(this);
        this.updatePreview = this.updatePreview.bind(this);
        this.downloadUpdated = this.downloadUpdated.bind(this);
        this.formatReplacementMap = this.formatReplacementMap.bind(this);
    }

    onFileSelect(id) {
        getScript(id).then(({data}) => this.setState({script: data[0]}));
    }

    formatReplacementMap(replaceMap) {
        replaceMap.color = _.mapValues(replaceMap.color, replacement => {
            return replacement !== 'ignore'
                ? `lib.properties.color(json[lib.group_uuid].colorpalette[0], ${replacement})`
                : null;
        });

        replaceMap.text = _.mapValues(replaceMap.text, replacement => {
            return replacement !== 'ignore'
                ? `json["${replacement}"]`
                : null;
        });

        return replaceMap;
    }

    replaceBody(body, replaceMap) {
        replaceMap = this.formatReplacementMap(replaceMap);

        _.forEach(replaceMap.color, (replacement, color) => {
            if (!replacement) return;
            body = body.replace(new RegExp(color, 'gm'), replacement);
        });

        _.forEach(replaceMap.text, (replacement, text) => {
            if (!replacement) return;
            body = body.replace(new RegExp(text, 'gm'), replacement);
        });

        this.setState({codeReplaced: true});
        return body;
    }

    updatePreview(replaceMap) {
        const {script} = this.state;

        script.body = this.replaceBody(script.body, replaceMap);

        this.setState({script});
    }

    downloadUpdated(replaceMap) {
        const {script} = this.state;

        if (!this.state.codeReplaced) {
            script.body = this.replaceBody(script.body, replaceMap);
        }

        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(script.body));
        downloadLink.setAttribute('download', script.file_name);

        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);

        downloadLink.click();

        document.body.removeChild(downloadLink);
    }

    render() {
        const FullHeightRow = styled(Row)`
            height: 100%;
        `;

        const FullHeightCol = styled(Col)`
            height: 100%
        `;

        const FitGrid = styled(Grid)`
            height: 100vh;
            width: 100%;
        `;

        return (
            <FitGrid>
                <FullHeightRow>
                    <FullHeightCol md={2}>
                        <Sidebar onFileSelect={this.onFileSelect}/>
                    </FullHeightCol>
                    <FullHeightCol md={10}>
                        <FitGrid fluid={true}>
                            <PreviewPanel codeString={this.state.script.body}/>
                            <OptionsPanel
                                codeString={this.state.script.body}
                                onPreviewReplaced={this.updatePreview}
                                onDownloadReplaced={this.downloadUpdated}
                            />
                        </FitGrid>
                    </FullHeightCol>
                </FullHeightRow>
            </FitGrid>
        );
    }
}

export default App;
