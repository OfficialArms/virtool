import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { fontSize } from "../../../../app/theme";
import { listLabels } from "../../../../labels/actions";
import { SampleLabel } from "../../Label";
import SampleLabelsDropdown from "./Dropdown";
import { SidebarHeader } from "./Header";

export const SampleLabelsList = styled.div`
    display: flex;
    flex-direction: column;
`;

const SampleLabelsItem = styled.div`
    padding: 10px 0;

    ${SampleLabel} {
        background-color: ${props => props.theme.color.white};
        margin-bottom: 5px;
    }

    > span {
        color: ${props => props.theme.color.greyDarkest};
        min-width: 24px;
    }

    p {
        color: ${props => props.theme.color.greyDarkest};
        font-size: ${fontSize.sm};
        margin: 0;
    }
`;

export const SampleLabels = ({ labels }) => {
    const sampleLabelComponents = labels.map(label => (
        <SampleLabelsItem key={label.id}>
            <SampleLabel color={label.color} name={label.name} />
            <p>{label.description}</p>
        </SampleLabelsItem>
    ));

    return (
        <React.Fragment>
            <SidebarHeader>
                Labels
                <SampleLabelsDropdown />
            </SidebarHeader>
            <SampleLabelsList>{sampleLabelComponents}</SampleLabelsList>
        </React.Fragment>
    );
};

export const mapStateToProps = state => ({
    labels: state.samples.detail.labels
});

export const mapDispatchToProps = dispatch => ({
    onGet: () => {
        dispatch(listLabels());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SampleLabels);
