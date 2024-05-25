'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Icons } from './icons';

export function CodeBlocks({ code }: { code: string }) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyClick = () => {
		navigator.clipboard.writeText(code);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};



	return (
		<pre onClick={handleCopyClick} className="flex cursor-pointer justify-between items-center bg-gray-900 rounded-md p-4 text-gray-400 font-mono overflow-x-hidden">
			<code className='truncate'>npx create-next-app -e https://github.com/arfan-rfn/next-template</code>
			<Button
				variant="ghost"
				size="icon"
				onClick={handleCopyClick}
			>
				{isCopied ? <Icons.Check className="size-4" /> : <Icons.Copy className="size-4" />}

			</Button>
		</pre>
		// <div>
		// 	<pre>
		// 		<code>{code}</code>
		// 	</pre>
		// 	<button onClick={handleCopyClick}>{isCopied ? 'Copied!' : 'Copy'}</button>
		// </div>
	);
};
