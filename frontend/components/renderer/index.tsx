import { FC, ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { NormalComponents } from "react-markdown/lib/complex-types";
import remarkGfm from "remark-gfm";
import styles from "./renderer.module.css";
import rehypeRaw from "rehype-raw";
import remarkImages from "remark-images";
import clsx from "clsx";
import remarkGemoji from "remark-gemoji";
import { slugify } from "@/helpers/slufigy";

export const Renderer: FC<{ children: ReactNode; classes?: string }> = ({
  children,
  classes,
}) => {
  const components:
    | Partial<
        Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
      >
    | undefined = useMemo(() => {
    return {
      h1: ({ node, children, ...props }) => (
        <h1
          className={styles.h1}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h1>
      ),
      h2: ({ node, children, ...props }) => (
        <h2
          {...props}
          className={styles.h2}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h2>
      ),
      h3: ({ node, children, ...props }) => (
        <h3
          {...props}
          className={styles.h3}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
          id={children ? slugify(children.toString()) : ""}
        >
          <a href={`#${children ? slugify(children.toString()) : ""}`}>
            {children}
          </a>
        </h3>
      ),
      h4: ({ node, ...props }) => (
        <h4
          {...props}
          className={styles.h4}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
        />
      ),
      h5: ({ node, ...props }) => (
        <h5
          {...props}
          className={styles.h5}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
        />
      ),
      h6: ({ node, ...props }) => (
        <h6
          {...props}
          className={styles.h6}
          style={{
            ...props.style,
            color: "#ffffff",
          }}
        />
      ),
      ul: ({ node, ...props }) => (
        <ul {...props} className={"list-disc ml-4"} />
      ),
      ol: ({ node, ...props }) => (
        <ol {...props} className={"list-decimal ml-4"} />
      ),
    };
  }, []);
  return (
    <div className={clsx("text-[#eaeaea]")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkImages, remarkGemoji]}
        components={components}
        skipHtml={false}
        rehypePlugins={[rehypeRaw]}
        className={clsx(styles.renderer, classes)}
      >
        {children as string}
      </ReactMarkdown>
    </div>
  );
};
