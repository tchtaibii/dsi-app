import { useState } from "react";

const InputNumber = ({value, SetValue}) => {
    
    const increment = () => {
        SetValue((state: number) => state + 1);
    }

    const decrement = () => {
        if (value > 1)
            SetValue((state: number) => state - 1);
    }

    return (
        <div className="input-number">
            <div onClick={decrement}>&minus;</div>
            <span>{value}</span>
            <div onClick={increment}>&#43;</div>
        </div>
    )
}

export default InputNumber;
