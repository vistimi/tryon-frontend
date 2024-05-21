import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import { ReactNode } from "react";
import { FooterWeb } from "@/components/footer/footer";
import { NavbarWeb } from "@/components/navbar/navbar";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
		shortcut: "/logo.png",
		apple: "/apple-icon.png",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
		  index: true,
		  follow: true,
		  noimageindex: true,
		  "max-video-preview": -1,
		  "max-image-preview": "large",
		  "max-snippet": -1,
		},
	  },
};

export default function RootLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<html lang="en">
			<head/>
			<body
				className="text-foreground bg-background min-h-screen font-sans antialiased max-w"
			>
				<Providers>
					<NavbarWeb/>
					<div className="px-5 lg:px-60 py-12">
						<main>
							{children}
						</main>
						< FooterWeb />
					</div>
				</Providers>
			</body>
		</html>
	);
}