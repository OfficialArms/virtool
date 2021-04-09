import React, { useEffect, useState } from "react";
import { map, get } from "lodash-es";
import { connect } from "react-redux";
import { listLabels } from "../../../labels/actions";
import { getLabels } from "../../../labels/selectors";

// import styled from "styled-components";

import { Button, Checkbox, Select } from "../../../base";

// const LibraryTypeSelectBoxContainer = styled.div`
//     display: grid;
//     grid-template-columns: 1fr 1fr 1fr;
//     grid-gap: ${props => props.theme.gap.column};
// `;

export const LabelAssignment = ({ labels, onLoadLabels }) => {
    useEffect(() => {
        onLoadLabels();
        console.log("labels = ", labels);
    }, [labels.length]);

    return (
        <React.Fragment>
            <h1>LabelAssignment Component</h1>
        </React.Fragment>
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
