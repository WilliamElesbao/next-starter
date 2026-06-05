import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/shadcn/utils";
import { Providers } from "@/providers/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Starter",
  description:
    "An open-source starter kit built for developers who want to accelerate product development with best practices.",
  icons: {
    icon: "/nextjs.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body className={`${roboto.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
