import type { PropsWithChildren } from "react";

type TextVariant =
  | "body"
  | "title"
  | "headline"
  | "subtitle"
  | "caption"
  | "footnote"
  | "callout";

type Props = PropsWithChildren<{
  variant?: TextVariant;
}>;

const variantClasses: Record<TextVariant, string> = {
  body: "text-base",
  title: "text-2xl font-bold",
  headline: "text-xl font-semibold",
  subtitle: "text-lg font-semibold",
  caption: "text-sm text-muted-foreground",
  footnote: "text-base text-muted-foreground",
  callout: "text-lg font-medium",
};

const elements: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  body: "p",
  title: "h1",
  headline: "h2",
  subtitle: "h3",
  caption: "span",
  footnote: "span",
  callout: "p",
};

export function Text({ children, variant = "body" }: Props) {
  const Component = elements[variant];

  return <Component className={variantClasses[variant]}>{children}</Component>;
}
