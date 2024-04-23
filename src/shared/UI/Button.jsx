import React from 'react';

const Button = ({ secondary, children, special, singular, onClick, value, width }) => {
    const buttonStyles = {
        padding: singular ? "0px" : "10px 30px",
        borderRadius: "var(--border-radius)",
        backgroundColor: secondary ? "var(--main-bg-secondary-color)" : "var(--main-color)",
        color: secondary ? "var(--main-secondary-color)" : "var(--main-bg-color)",
        cursor: "pointer",
        outline: "none",
        border: "none",
        fontWeight: special ? 800 : 400,
        height: singular && "27px",
        width: singular && "27px",
        marginBottom: "5px",
        boxSizing: "border-box",
        width: width,
    };

    return (
        <button onClick={onClick} value={value} style={buttonStyles}>{children}</button>
    );
};

export default Button;
