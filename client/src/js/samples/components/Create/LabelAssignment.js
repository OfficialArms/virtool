import React, { useEffect } from "react";
import { get } from "lodash-es";
import { connect } from "react-redux";
import { listLabels } from "../../../labels/actions";
import { getLabels } from "../../../labels/selectors";
import { LabelDropdown } from "./LabelDropdown";

// import styled from "styled-components";

import { Select } from "../../../base";

export const LabelAssignment = ({ labels, onLoadLabels }) => {
    useEffect(() => {
        onLoadLabels();
        console.log("labels = ", labels);
    }, [labels.length]);

    const labelComponents = labels.map(label => (
        <option key={label.id} value={label.id} onClick={() => console.log(`You selected ${label.name}`)}>
            {label.name}
        </option>
    ));

    return (
        // <React.Fragment>
        //     <Select name="labels">{labelComponents}</Select>
        // </React.Fragment>
        <LabelDropdown items={labels} className={"test"} />
    );
};

export const mapStateToProps = state => ({
    // show: routerLocationHasState(state, "removeLabel"),
    labels: getLabels(state),
    error: get(state, "errors.UPDATE_SAMPLE_ERROR.message", "")
});

export const mapDispatchToProps = dispatch => ({
    onLoadLabels: () => {
        dispatch(listLabels());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LabelAssignment);
