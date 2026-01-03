import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to forward FormData as-is
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Get the target URL from query params
        const targetUrl = req.query.target as string;

        if (!targetUrl) {
            return res.status(400).json({ error: 'Missing target URL' });
        }

        // Collect the raw body
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(chunks);

        // Forward the request to the n8n webhook
        const response = await fetch(targetUrl, {
            method: 'POST',
            body: rawBody,
            headers: {
                'Content-Type': req.headers['content-type'] || 'application/octet-stream',
            },
        });

        // Get response data
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = { success: true, message: await response.text() };
        }

        // Return the response
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Proxy request failed'
        });
    }
}
