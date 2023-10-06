import { FunctionComponent } from "react";
import remarkGfm from 'remark-gfm'
import ReactMarkdown, { Options } from "react-markdown";

interface MarkdownProps extends Options {}

const Markdown: FunctionComponent<MarkdownProps> = ({ className = "markdown", children }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} className={className}>{children}</ReactMarkdown>;
};

export default Markdown;
