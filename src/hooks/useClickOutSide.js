import React from "react";

export default function useClickOutSide(dom = "button") {
    const [show, setShow] = React.useState(false);
    const nodeRef = React.useRef(null);
    React.useEffect(() => {
        function handleClick(e) {
            // console.log(e.target);
            if (
                nodeRef &&
                !nodeRef.current.contains(e.target) &&
                !e.target.matches(dom)
            ) {
                setShow(false);
            }
            //   else {
            //   console.log("in side");
            // }
        }
        document.addEventListener("click", handleClick);
        // console.log("Render");
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, [dom]);
    return { nodeRef, setShow, show };
}
