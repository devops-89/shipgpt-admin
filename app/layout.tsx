import type { Metadata } from "next";
import { scienceGothic, poppins } from "@/utils/fonts";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReduxProvider } from "@/redux/provider";
export const metadata: Metadata = {
  title: "Ship Gpt",
  description: "Ship Gpt",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${scienceGothic.variable} ${poppins.variable}`}>
        <AppRouterCacheProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
