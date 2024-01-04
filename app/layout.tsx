import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageTopBar } from "@/components/page-top-bar";
import { Providers } from "@/components/providers";
import { inter } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "Codefly Tower",
  description: "Codefly Tower Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          <LayoutWrapper>
            <PageTopBar />
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
