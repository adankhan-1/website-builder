import { useState } from "react";

export default function Editor() {
  const [content, setContent] = useState({
    heading: "Welcome to My Site!",
    paragraph: "Edit this text to describe your website.",
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Website Editor</h1>

      <input
        type="text"
        value={content.heading}
        onChange={(e) => setContent({ ...content, heading: e.target.value })}
        className="w-full text-2xl font-bold p-2 border rounded mb-4"
      />

      <textarea
        value={content.paragraph}
        onChange={(e) => setContent({ ...content, paragraph: e.target.value })}
        className="w-full p-2 border rounded h-32"
      />

      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h2 className="text-xl font-semibold">{content.heading}</h2>
        <p className="mt-2">{content.paragraph}</p>
      </div>
    </div>
  );
}