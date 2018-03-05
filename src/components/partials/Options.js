import React, {Component} from 'react';
import styled from 'styled-components';

import {getOptions} from '../../api';

import {
    Grid,
    Row,
    Col,
    ListGroup,
    ListGroupItem,
    Button
} from 'react-bootstrap';

class OptionsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [],
            texts: [],
            colorOptions: [0, 1, 2, 3, 4, 'ignore'],
            textOptions: [],
            colorReplaceMap: {},
            textReplaceMap: {}
        };
        this.getColors = this.getColors.bind(this);
        this.getTexts = this.getTexts.bind(this);
        this.initColorReplaceMap = this.initColorReplaceMap.bind(this);
        this.updateColorReplaceMap = this.updateColorReplaceMap.bind(this);
        this.initTextReplaceMap = this.initTextReplaceMap.bind(this);
        this.updateTextReplaceMap = this.updateTextReplaceMap.bind(this);
        this.onPreviewReplaced = this.onPreviewReplaced.bind(this);
        this.onDownloadReplaced = this.onDownloadReplaced.bind(this);
    }

    componentDidMount() {
        return getOptions()
            .then(({data}) => this.setState({textOptions: [...data, 'ignore']}));
    }

    getColors() {
        const colorRegex = /"#[0-9A-F]{6}"/igm;
        let colors = this.props.codeString.match(colorRegex) || [];
        let uniqueColors = colors.filter((v, i, a) => a.indexOf(v) === i);

        this.setState({colors: uniqueColors});

        this.initColorReplaceMap(uniqueColors);
    }

    initColorReplaceMap(colors) {
        let colorReplaceMap = colors.reduce((result, color) => {
            result[color] = 'ignore';
            return result;
        }, {});

        this.setState({colorReplaceMap});
    }

    updateColorReplaceMap(color, e) {
        const temp = this.state.colorReplaceMap;
        temp[color] = e.target.value;

        this.setState({colorReplaceMap: temp});
    }

    getTexts() {
        const textRegex = /(?:\.Text)\("[\w\s]+(?:")/igm;
        let texts = this.props.codeString.match(textRegex) || [];
        let uniqueTexts = texts.filter((v, i, a) => a.indexOf(v) === i);
        let trimmedTexts = uniqueTexts.map(text => text.substr(6));

        this.setState({texts: trimmedTexts});

        this.initTextReplaceMap(trimmedTexts);
    }

    initTextReplaceMap(texts) {
        let textReplaceMap = texts.reduce((result, color) => {
            result[color] = 'ignore';
            return result;
        }, {});

        this.setState({textReplaceMap});
    }

    updateTextReplaceMap(text, e) {
        const temp = this.state.textReplaceMap;
        temp[text] = e.target.value;

        this.setState({textReplaceMap: temp});
    }

    onDownloadReplaced() {
        const replacementMapping = {
            color: this.state.colorReplaceMap,
            text: this.state.textReplaceMap
        };

        this.props.onDownloadReplaced(replacementMapping);
    }

    onPreviewReplaced() {
        const replacementMapping = {
            color: this.state.colorReplaceMap,
            text: this.state.textReplaceMap
        };

        this.props.onPreviewReplaced(replacementMapping);
    }

    componentWillMount() {
        if (this.props.codeString) {
            this.getColors();
            this.getTexts();
        }
    }

    render() {
        const FullHeightRow = styled(Row)`
            background-color: #eeeeee;
            height: 100%;
        `;

        const FullHeightCol = styled(Col)`
            height: 100%
        `;

        const FitGrid = styled(Grid)`
            position: relative;
            height: 50%;
            width: 100%;
        `;

        const FloatButtonContainer = styled.div`
            position: absolute;
            bottom: 0;
            right: 0;
            padding-bottom: 16px;
        `;

        const PaddedButton = styled(Button)`
            margin: 0px 4px;
        `;

        const ColorOptions = this.state.colorOptions.map(index => (
            <option key={index} value={index}>{index}</option>
        ));

        const colorList = this.state.colors.map((color, index) => (
            <ListGroupItem key={index}>
                {color}
                <select
                    className="pull-right"
                    onChange={e => this.updateColorReplaceMap(color, e)}
                    value={this.state.colorReplaceMap[color]}
                >
                    {ColorOptions}
                </select>
            </ListGroupItem>
        ));

        const TextOptions = this.state.textOptions.map(index => (
            <option key={index} value={index}>{index}</option>
        ));

        const textList = this.state.texts.map((text, index) => (
            <ListGroupItem key={index}>
                {text}
                <select
                    className="pull-right"
                    onChange={e => this.updateTextReplaceMap(text, e)}
                    value={this.state.textReplaceMap[text]}
                >
                    {TextOptions}
                </select>
            </ListGroupItem>
        ));

        return (
            <FitGrid>
                <FullHeightRow>
                    <FullHeightCol xs={6}>
                        <h3>Colors:</h3>
                        <ListGroup>{colorList}</ListGroup>
                    </FullHeightCol>
                    <FullHeightCol xs={6}>
                        <h3>Text:</h3>
                        <ListGroup>{textList}</ListGroup>
                    </FullHeightCol>
                </FullHeightRow>

                {this.props.codeString &&
                <FloatButtonContainer>
                    <PaddedButton
                        bsStyle="info"
                        bsSize="large"
                        onClick={this.onPreviewReplaced}
                    >
                        Preview
                    </PaddedButton>
                    <PaddedButton
                        bsStyle="primary"
                        bsSize="large"
                        onClick={this.onDownloadReplaced}
                    >
                        Download
                    </PaddedButton>
                </FloatButtonContainer>
                }
            </FitGrid>
        );
    }
}

export default OptionsPanel;