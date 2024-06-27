'use client'

import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} 
from "@nextui-org/navbar";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/navbar/themeSwitcher";
import { Logo } from "@/components/navbar/logo";

export const NavbarWeb = () => {

	return (
		<NextUINavbar maxWidth='full' position="sticky" className="sm:px-14">

			<NavbarContent justify="start">
				<NavbarBrand as="li" className="gap-3">

					{/* {Logo} */}
					<Link
						className="flex justify-start items-center w-32"
						href="/"
					>
						<Logo/>
						<p
							className="pl-4 data-[active=true]:text-inherit data-[active=true]:font-bold text-xl tracking-tight font-semibold text-default-foreground"
						>
							{siteConfig.name}
						</p>
					</Link>

					{/* {Menu website} */}
					<ul className="hidden md:flex gap-5 ml-5">
					{siteConfig.navBarItems.map((item) => (
						<NavbarItem key={item.href}>
							<Link
								className="data-[active=true]:text-primary data-[active=true]:font-medium text-default-foreground"
								href={item.href}
							>
								{item.label}
							</Link>
						</NavbarItem>
					))}
				</ul>
				<NavbarMenuToggle className="flex md:hidden h-10 w-min"/>
				
				</NavbarBrand>
			</NavbarContent>


			<NavbarContent
				className="gap-2 "
				justify="end"
			>

				{/* {Darkmode button} */}
				{/* <NavbarItem className="flex gap-2">
					<ThemeSwitch />
				</NavbarItem> */}

			</NavbarContent>


			<NavbarMenu>
				<div className="mx-4 mt-2 flex-col gap-2">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color="primary"
								href={item.href}
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
