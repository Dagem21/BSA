import logo from "@/assets/logos/CBELogo.svg";
import Image from "next/image";

export function Logo() {
	return (
		<div className="relative h-8 max-w-[10.847rem]">
			<Image
				src={logo}
				alt="CBE logo"
				role="presentation"
				quality={100}
			/>
		</div>
	);
}
