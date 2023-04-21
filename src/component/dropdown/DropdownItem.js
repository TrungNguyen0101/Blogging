import React from 'react';

const DropdownItem = ({ show, children, ...props }) => {
    return (
        <div {...props}>
            {show && (
                <div className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-100 ">{children}</div>
            )}
        </div>
    );
};

export default DropdownItem;