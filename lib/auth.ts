import { betterAuth } from "better-auth"
import mongoClientPromise from "./db-client";
import { mongodbAdapter } from "better-auth/adapters/mongodb"

export const auth = async () => {
	const client = await mongoClientPromise();
	const db = client.db();
	return betterAuth({
		database: mongodbAdapter(db),
		socialProviders: {
			github: {
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			}
		}
	});
};