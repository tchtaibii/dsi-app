import React from 'react'

function Error({ statusCode, setStatus }) {
    return (
        <div style={{ backgroundColor: statusCode.color }} className="statusBar">
            <h1>{statusCode.status}</h1>
            <p>{statusCode.text}</p>
            <div onClick={() => {
                setStatus((state) => ({
                    ...state,
                    is: false
                }))
            }} className="exitB">
                <svg style={{ width: "1rem", height: "1rem", cursor: "pointer" }} width={"1.5rem"} height={"1.5rem"} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 1.91357L17.0864 0L9.5 7.58643L1.91357 0L0 1.91357L7.58643 9.5L0 17.0864L1.91357 19L9.5 11.4136L17.0864 19L19 17.0864L11.4136 9.5L19 1.91357Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}

export default Error