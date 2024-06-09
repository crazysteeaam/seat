import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import "./Into.css"
import {useEffect, useState} from "react";

const Into = () => {

    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        fetch('/intro.md')
            .then((response) => response.text())
            .then((text) => {
                setMarkdown(text);
            });
    }, []);


    return (
        <div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="md">{markdown}</ReactMarkdown>
        </div>
    );
}


export default Into;