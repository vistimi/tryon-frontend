'use client';

import { siteConfig } from "@/config/site";

export const FooterWeb = () => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="w-full py-3 mx-auto text-center ">
			{/* <div className="border-t border-gray-300 pt-4 mt-4 w-full">
				<h2 className="text-2xl font-bold mb-4">{siteConfig.name}</h2>
				<div className="flex flex-col md:flex-row">
					<div className="mb-6 md:mb-0 flex-grow flex-shrink h-min">
						<h2 className="text-xl font-bold mb-4">Company</h2>
						<ul>
							<li className="mb-2"><a href="/about-us">About us</a></li>
							<li className="mb-2"><a href="/blogs">Blog</a></li>
							<li className="mb-2"><a href="#">Changelog</a></li>
						</ul>
					</div>
					<div className="mb-6 md:mb-0 flex-grow flex-shrink h-min">
						<h2 className="text-xl font-bold mb-4">Ressources</h2>
						<ul>
							<li className="mb-2"><a href="/new-form">New form</a></li>
							<li className="mb-2"><a href="/templates">Templates</a></li>
						</ul>
					</div>
					<div className="mb-6 md:mb-0 flex-grow flex-shrink h-min">
						<h2 className="text-xl font-bold mb-4">Support</h2>
						<ul>
							<li className="mb-2"><a href="/contact">Contact us</a></li>
							<li className="mb-2"><a href="#">Guide</a></li>
							<li className="mb-2"><a href="#">FAQs</a></li> 
						</ul>
					</div>
				</div>
			</div> */}

			{/* Social network logos */}
			{/* <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-10 ">
				<div className="flex space-x-4">
					<a href="#" className="text-gray-500 hover:text-gray-700">
						<MetaIcon size={24} />
					</a>
					<a href="#" className="text-gray-500 hover:text-gray-700">
						<XIcon size={24} />
					</a>
					<a href="#" className="text-gray-500 hover:text-gray-700">
						<InstagramIcon size={24} />
					</a>
				</div>
				<div className="flex-col ">
					<div className="flex items-start flex-wrap">
						<span> Subscribe to our newsletter: </span>
					</div>
					<FormSubscribe />
				</div>
			</div> */}

			{/* Copyright and legal */}
			<div className="flex flex-col sm:flex-row mt-10 mb-10 gap-4 justify-between ">
				<div className="text-center ">
					&copy; {currentYear} {siteConfig.name}. All rights reserved.
				</div>
				{/* <div className="flex items-center justify-center space-x-10">
					<a href="#" className=" hover:text-gray-700">
						Privacy
					</a>
					<a href="#" className=" hover:text-gray-700">
						Accessibility
					</a>
					<a href="#" className=" hover:text-gray-700">
						Terms
					</a>
				</div> */}

			</div>
		</footer>

	);
};