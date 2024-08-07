import React, { useState } from 'react';
import { HiOutlineUpload } from "react-icons/hi";
import Checkbox from '@mui/joy/Checkbox';

const Input = ({ pattern, maxLength, onChange, value, type, placeholder, def, checkbox, select, onClick, name, borderRadius }) => {
    const [uploadedFile, setUploadedFile] = useState(null); 

    const inputStyles = {
        padding: "9px",
        borderRadius: borderRadius ? borderRadius : "var(--border-radius)",
        backgroundColor: "var(--main-input-bg-color)",
        color: "var(--main-color)",
        cursor: "text",
        outline: "none",
        border: "1px solid var(--main-bg-secondary-color)",
        boxSizing: "border-box",
    };

    const selectStyles = {
        borderRadius: "var(--border-radius)",
        color: "var(--main-color)",
        cursor: "pointer",
        border: "1px solid var(--main-bg-secondary-color)",
        padding: "8px 10px 8px 10px",
        position: "relative",
        top: "2px",
        outline: "none",
        boxShadow: "0 0 0 0.1px var(--main-bg-secondary-color)",
        backgroundColor: "var(--main-input-bg-color)",
    }

    return (
        <>
            {def &&
                <>
                    <input name={name} autoComplete='on' maxLength={maxLength} pattern={pattern} style={inputStyles} placeholder={placeholder} onChange={onChange} value={value} type={type} />
                </>
            }
            {checkbox && 
            <>
                <Checkbox sx={{marginTop: "20px"}} onChange={onChange} onClick={onClick} value={uploadedFile} />
            </>
            }
            {select && 
            <>
            <select defaultValue={"Без опыта"} style={selectStyles} name="Choose on of the options" id="EXP" value={value} onChange={onChange}>
                <option value="Без опыта">Нет опыта</option>
                <option value="Меньше 3х месяцев">Меньше 3х месяцев</option>
                <option value="3 месяца или больше">3 месяца или больше</option>
                <option value="Более чем 6 месяцев">Более чем 6 месяцев</option>
            </select>
            </>
            }
        </>
    );
};

export default Input;
