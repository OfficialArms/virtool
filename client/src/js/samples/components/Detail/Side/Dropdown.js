import { xor } from "lodash-es";
import React, { useCallback } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Dropdown, DropdownMenuItem, DropdownMenuList, Icon } from "../../../../base";
import { getLabels } from "../../../../labels/selectors";
import { updateSample } from "../../../sagas";
import { getSampleLabels } from "../../../selectors";
import { SampleLabel } from "../../Label";
import { SidebarHeaderButton } from "./Header";

export const SampleLabelsDropdownItem = ({ color, description, name, onClick }) => {
    const handleSelect = useCallback(() => onClick(id), [id, onClick]);

    return (
        <DropdownMenuItem onSelect={handleSelect}>
            <SampleLabel color={color} name={name} />
        </DropdownMenuItem>
    );
};

export const SampleLabelsDropdownMenuList = styled(DropdownMenuList)`
    width: 320px;
    min-height: 200px;
    overflow-y: scroll;
`;

export const SampleLabelsDropdown = ({ allLabels, sampleLabels, sampleId, onUpdate }) => {
    console.log(allLabels, sampleLabels);

    const handleToggle = useCallback(
        labelId => {
            onUpdate(
                sampleId,
                xor(
                    sampleLabels.map(label => label.id),
                    [labelId]
                )
            );
        },
        [sampleId, sampleLabels, onUpdate]
    );

    const sampleLabelIds = sampleLabels.map(label => label.id);

    const labelComponents = allLabels.map(label => (
        <SampleLabelsDropdownItem
            key={label.id}
            checked={sampleLabelIds.includes(label.id)}
            {...label}
            onClick={handleToggle}
        />
    ));

    return (
        <Dropdown>
            <SidebarHeaderButton>
                <Icon name="pen" />
            </SidebarHeaderButton>
            <SampleLabelsDropdownMenuList>Fart{labelComponents}</SampleLabelsDropdownMenuList>
        </Dropdown>
    );
};

export const mapStateToProps = state => ({
    allLabels: getLabels(state),
    sampleLabels: getSampleLabels(state)
});

export const mapDispatchToProps = dispatch => ({
    onUpdate: (sampleId, labels) => dispatch(updateSample(sampleId, { labels }))
});

export default connect(mapStateToProps, mapDispatchToProps)(SampleLabelsDropdown);
