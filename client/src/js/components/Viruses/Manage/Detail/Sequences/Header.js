/**
 * @license
 * The MIT License (MIT)
 * Copyright 2015 Government of Canada
 *
 * @author
 * Ian Boyes
 *
 * @exports SequenceHeader
 */

'use strict';

import React from "react";
import FlipMove from "react-flip-move"

var Icon = require('virtool/js/components/Base/Icon');
var Flex = require('virtool/js/components/Base/Flex');

/**
 * The header that is always shown at the top of a Sequence component. Displays the sequence accession and definition
 * and icons for managing the Sequence component's state. Icons are passed in as children.
 *
 * @class
 */
var SequenceHeader = React.createClass({

    propTypes: {
        sequenceId: React.PropTypes.string,
        definition: React.PropTypes.string
    },

    /**
     * Stop further propagation of the passed event. Triggered in response to clicking icon buttons. Stops the click
     * from triggering events on the Sequence component.
     *
     * @param event {object} - the click event to stop.
     * @func
     */
    stopPropagation: function (event) {
        event.stopPropagation();
    },

    render: function () {
        return (
            <h5 className='disable-select'>
                <Flex>
                    <Flex.Item grow={1} shrink={0}>
                        <strong>{this.props.sequenceId || 'Accession'}</strong>
                        <span> - {this.props.definition || 'Definition'}</span>
                    </Flex.Item>
                    <Flex.Item>
                        <FlipMove typeName="div" className='icon-group' leaveAnimation={false} duration={150} onClick={this.stopPropagation}>
                            {this.props.children}
                        </FlipMove>
                    </Flex.Item>
                </Flex>
            </h5>
        );
    }
});

module.exports = SequenceHeader;