import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  limit?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  limit = 150,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit)
    return (
      <p className="text-gray-700 break-words whitespace-pre-line">{text}</p>
    );

  return (
    <div className="text-gray-700 break-words whitespace-pre-line">
      {expanded ? text : text.slice(0, limit) + "..."}
      <button
        className="text-blue-500 hover:underline ml-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default ExpandableText;
