/**
 * @license
 * The MIT License (MIT)
 * Copyright 2015 Government of Canada
 *
 * @author
 * Ian Boyes
 *
 * @exports IndexRebuild
 */

import React from "react";
import { connect } from "react-redux";
import { Modal, Panel } from "react-bootstrap";

import { getUnbuilt, createIndex, hideRebuild } from "../actions";
import { Button } from "../../base";
import RebuildHistory from "./History";

class RebuildIndex extends React.Component {

    constructor (props) {
        super(props);
    }

    modalEntered = () => {
        this.props.onGetUnbuilt();
    };

    save = (event) => {
        event.preventDefault();
        this.props.onRebuild();
    };

    render () {
        return (
            <Modal bsSize="large" onEntered={this.modalEntered} show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header>
                    Rebuild Index
                </Modal.Header>
                <form onSubmit={this.save}>
                    <Modal.Body>
                        <Panel>
                            Build the changes described below into a new index.
                        </Panel>

                        <RebuildHistory unbuilt={this.props.unbuilt} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" bsStyle="primary" icon="hammer">
                            Start
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        show: Boolean(state.indexes.showRebuild),
        unbuilt: state.indexes.unbuilt
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGetUnbuilt: () => {
            dispatch(getUnbuilt());
        },

        onRebuild: () => {
            dispatch(createIndex());
        },

        onHide: () => {
            dispatch(hideRebuild());
        }
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(RebuildIndex);

export default Container;