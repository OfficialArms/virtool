import React from "react";
import { map } from "lodash-es";
// import styled from "styled-components";

import { Button, Checkbox, Select } from "../../../base";

// const LibraryTypeSelectBoxContainer = styled.div`
//     display: grid;
//     grid-template-columns: 1fr 1fr 1fr;
//     grid-gap: ${props => props.theme.gap.column};
// `;

export const LabelAssignment = ({ label }) => {
    // const labels = map(this.props.labels, label => (
    //     <Item
    //         key={label.id}
    //         name={label.name}
    //         color={label.color}
    //         description={label.description}
    //         id={label.id}
    //         removeLabel={this.onRemove}
    //         editLabel={this.onEdit}
    //     />
    // ));

    const values = ["1", "2", "three", "4"];
    const test = map(values, value => (
        <option key={value}>
            <Button children={value}></Button>
        </option>
    ));
    const props = { children: values };
    return (
        <React.Fragment>
            <h1 style={{ textAlign: "center" }}>this is the label assignment thingy</h1>
            <Select>{test}</Select>
        </React.Fragment>
    );
};

// export const mapDispatchToProps = dispatch => ({
//     onLoadLabels: () => {
//         dispatch(listLabels());
//     }
// });
