"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";


export default function Page() {

	const handleSignIn = async () => {
		await signIn.social({
			provider: "github",
			callbackURL: "/",
		});
	}

	return (
		<div className="w-full">
			<div className="flex items-center flex-col justify-center w-full md:py-10">
				<div className="md:w-[400px]">
					<Button onClick={handleSignIn}>
						Sign in with GitHub
					</Button>
				</div>
			</div>
		</div>
	);
}
