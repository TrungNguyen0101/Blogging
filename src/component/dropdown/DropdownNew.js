import React from "react";
import useClickOutSide from "../../hooks/useClickOutSide";

const DropdownNew = ({ show, setShow, nodeRef, select, children }) => {
	return (
		<div
			className="transition-all relative w-full max-w-[400px] cursor-pointer z-50"
			ref={nodeRef}
		>
			<div
				className="transition-all flex items-center justify-between p-5 bg-[#E7ECF3] rounded cursor-pointer font-medium"
				onClick={() => {
					setShow(!show);
				}}
			>
				<span>{select ? `${select}` : "Select"}</span>
				<span>
					{show ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M5 15l7-7 7 7"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					)}
				</span>
			</div>
			<div className="absolute top-full left-0 w-full bg-white shadow-sm">
				{children}
			</div>
		</div>
	);
};

export default DropdownNew;
