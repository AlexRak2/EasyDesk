import React from "react";

interface RichTextDisplayProps{
    content: string;
    styling?: string;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({content, styling}) =>{

    return(
        <div       
            className={styling}
            dangerouslySetInnerHTML={{ __html: content }}>
        </div>
    );
};

export default RichTextDisplay;