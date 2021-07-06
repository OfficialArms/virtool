import PropTypes from "prop-types";
import React from "react";
import { InputGroup, InputLabel } from "../../../base";
import { MultiSubtractionSelector } from "../../../subtraction/components/MultiSubtractionSelector";

export const SubtractionSelector = ({ subtractions, value, onChange }) => {
    return (
        <InputGroup>
            <InputLabel>Subtraction</InputLabel>
            <MultiSubtractionSelector
                name="Subtraction"
                noun="Subtractions"
                subtractions={subtractions}
                selected={value}
                onChange={onChange}
            />
        </InputGroup>
    );
};

SubtractionSelector.propTypes = {
    subtractions: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func
};
