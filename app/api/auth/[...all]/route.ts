import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = await (async () => {
	const authInstance = await auth();
	return toNextJsHandler(authInstance);
})();