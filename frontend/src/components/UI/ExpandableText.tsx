import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  limit?: number;
};

const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  limit = 150,
}) => {
  const [expanded, setExpanded] = useState(false);

  return text.length <= limit ? (
    <span className="break-words whitespace-pre-line w-full inline-block">
      {text}
    </span>
  ) : (
    <span className="break-words whitespace-pre-line w-full inline-block">
      {expanded ? text : text.slice(0, limit) + "..."}
      <button
        className="text-blue-500 hover:underline ml-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </span>
  );
};

export default ExpandableText;
