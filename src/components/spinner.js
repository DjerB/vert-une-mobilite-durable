import React from 'react';
import { Spinner } from 'reactstrap';

const CustomSpinner = ({ marginY, height, width }) => (
    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-75" style={marginY && { marginTop: marginY, marginBottom: marginY }}>
        <Spinner animation="border" variant="info" role="status" style={{ height: height ? height : "15vw", width: width ? width : "15vw" }} />
    </div>
);

export default CustomSpinner;