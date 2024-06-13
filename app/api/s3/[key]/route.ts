import { NextRequest, NextResponse } from "next/server";
import { getS3Object, getS3SrcByKey } from "../get-image-by-key";

// NOTE: make sure to update next.config.js with the correct routes after deployment
async function _s3StreamResponse(key: string) {
	const { Body, ContentType } = await getS3Object(key);

	if (!Body || !ContentType) {
		return NextResponse.json({ error: "Image not found" }, { status: 404 });
	}

	const response = new NextResponse(Body as BodyInit);
	response.headers.set("Content-Type", ContentType);
	return response;
}

type GetOptions = {
	params: {
		key: string;
	};
}

export async function GET(_: NextRequest, { params }: GetOptions) {
	// return s3StreamResponse(params.key);
	const src = await getS3SrcByKey(params.key, {
		expiresIn: 60 * 60,
	});
	return NextResponse.json({ src });
}