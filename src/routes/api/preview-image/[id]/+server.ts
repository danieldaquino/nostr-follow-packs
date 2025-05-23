import { error } from '@sveltejs/kit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    const { id } = params;
    
    // Validate the id to prevent directory traversal attacks
    if (!id || !id.match(/^[a-zA-Z0-9-]+$/)) {
        throw error(400, 'Invalid image ID');
    }
    
    // Determine the image path based on environment
    const cacheDir = process.env.VERCEL 
        ? '/tmp/preview-images' 
        : path.join(process.cwd(), 'static/preview-images');
    const imagePath = path.join(cacheDir, `${id}.png`);
    
    // Check if the image exists
    if (!fs.existsSync(imagePath)) {
        throw error(404, 'Image not found');
    }
    
    try {
        // Read the image file
        const imageBuffer = fs.readFileSync(imagePath);
        
        // Return the image with appropriate headers
        return new Response(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=3600'
            }
        });
    } catch (err) {
        console.error(`Error serving image ${id}:`, err);
        throw error(500, 'Error reading image file');
    }
};