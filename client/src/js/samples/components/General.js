import React from "react";
import Moment from "moment";
import Numeral from "numeral";
import PropTypes from "prop-types";
import { capitalize } from "lodash";
import { connect } from "react-redux";
import { Panel, Table } from "react-bootstrap";

import { updateSample } from "../actions";
import EditSample from "./Edit";

const SampleDetailGeneral = (props) => {

    const cells = ["name", "host", "isolate"].map(field =>
        <tr key={field}>
            <th className="col-xs-4">{capitalize(field)}</th>
            <td className="col-xs-8">{props[field]}</td>
        </tr>
    );

    let idCell;

    if (props.showIds) {
        idCell = (
            <tr>
                <th>Unique ID</th>
                <td>{props.sampleId}</td>
            </tr>
        );
    }

    return (
        <div>
            <table className="table table-bordered">
              <tbody>
                {cells}
                {idCell}
                <tr>
                  <th>Created</th>
                  <td>{Moment(props.createdAt).calendar()}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{props.userId}</td>
                </tr>
              </tbody>
            </table>

            <Panel header="Library">
                <Table bordered fill>
                    <tbody>
                        <tr>
                            <th className="col-xs-4">Read Count</th>
                            <td className="col-xs-8">{props.count}</td>
                        </tr>
                        <tr>
                            <th>Length Range</th>
                            <td>{props.lengthRange}</td>
                        </tr>
                        <tr>
                            <th>GC Content</th>
                            <td>{props.gc}</td>
                        </tr>
                        <tr>
                            <th>Paired</th>
                            <td>{props.paired ? "Yes": "No"}</td>
                        </tr>
                    </tbody>
                </Table>
            </Panel>

            <Panel header="Files">
                <Table bordered fill>
                    <tbody>
                        <tr>
                            <th className="col-xs-4">Original Files</th>
                            <td className="col-xs-8">{props.files.join(", ")}</td>
                        </tr>
                        <tr>
                            <th>Encoding</th>
                            <td>{props.encoding}</td>
                        </tr>
                    </tbody>
                </Table>
            </Panel>

            <EditSample />
        </div>
    );
};

SampleDetailGeneral.propTypes = {
    showIds: PropTypes.bool,
    canModify: PropTypes.bool,
    sampleId: PropTypes.string,
    name: PropTypes.string,
    host: PropTypes.string,
    files: PropTypes.array,
    isolate: PropTypes.string,
    lengthRange: PropTypes.string,
    encoding: PropTypes.string,
    gc: PropTypes.string,
    count: PropTypes.string,
    paired: PropTypes.bool,
    userId: PropTypes.string,
    createdAt: PropTypes.string,
    quality: PropTypes.object,
    onChangeValue: PropTypes.func
};

const mapStateToProps = (state) => {
    const detail = state.samples.detail;

    const isOwner = state.account.id === detail.user.id;

    const canModify = (
        detail.all_write ||
        (detail.group_write && state.account.groups.indexOf(detail.group) > -1) ||
        isOwner
    );

    return {
        canModify: canModify,
        sampleId: detail.id,
        name: detail.name,
        host: detail.host,
        createdAt: detail.created_at,
        isolate: detail.isolate,
        showIds: state.account.settings.show_ids,
        files: detail.files,
        paired: detail.paired,
        gc: Numeral(detail.quality.gc / 100).format("0.0 %"),
        count: Numeral(detail.quality.count).format("0.0 a"),
        encoding: detail.quality.encoding,
        lengthRange: detail.quality.length.join(" - "),
        userId: detail.user.id
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeValue: (sampleId, field, value) => {
            let update = {};
            update[field] = value;
            dispatch(updateSample(sampleId, update));
        }
    };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(SampleDetailGeneral);

export default Container;