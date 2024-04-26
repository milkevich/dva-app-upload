import React from 'react';
import { HiCheck } from "react-icons/hi";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Filtered = ({ onClick, value, children, approved }) => {
    const filteredStyles = {
        padding: "5px 10px",
        borderRadius: "var(--border-radius)",
        backgroundColor: approved ? "#e5fce3" : "#fdeded",
        color: approved ? "#25a814" : "#ed1f1f",
        alignItems: "center",
        whiteSpace: "nowrap", 
        display: "inline-flex",
        marginRight: "5px",
        marginBottom: "5px",
    };

    const iconStyles = {
        marginBottom: "-2px",
        marginRight: "5px"
    }

    return (
        <span onClick={onClick} value={value} style={filteredStyles}>{approved ? <HiCheck style={iconStyles}/> : <HiOutlineExclamationCircle style={iconStyles}/>}{children}</span>
    );
};

export default Filtered;
