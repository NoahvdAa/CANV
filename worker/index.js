import { Router } from 'itty-router';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json'
};
const router = Router();

router.get('/canvas', async () => {
    const canvas = await CANVAS.get('canvas');

    return new Response(canvas, { headers });
});

router.get('/canvas/:id', async ({ params }) => {
    const { id } = params;
    if (isNaN(id) || id < 0 || id > 9999) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid ID' }), { headers });
    }

    const canvas = JSON.parse(await CANVAS.get('canvas'));
    const pixel = canvas[id];

    return new Response(JSON.stringify(pixel), { headers });
});

router.post('/canvas/bulk', async (request) => {
    const content = await request.json();

    if (typeof content !== 'object' || !content.length) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), { headers });
    }

    const canvas = JSON.parse(await CANVAS.get('canvas'));

    for (const action of content) {
        if (action.length !== 2) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), { headers });
        }

        const id = action[0];
        const color = action[1];

        if (isNaN(id) || id < 0 || id > 9999) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid ID' }), { headers });
        }

        if (isNaN(color) || color < 0 || color > 15) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid color' }), { headers });
        }

        canvas[id] = [parseInt(color), new Date().getTime()];
    }

    await CANVAS.put('canvas', JSON.stringify(canvas));

    return new Response(JSON.stringify({ success: true }), { headers });
});

router.post('/canvas/:id', async (request) => {
    const { id } = request.params;
    if (isNaN(id) || id < 0 || id > 9999) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid ID' }), { headers });
    }

    const content = await request.json();
    const { color } = content;
    if (isNaN(color) || color < 0 || color > 15) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid color' }), { headers });
    }

    const canvas = JSON.parse(await CANVAS.get('canvas'));
    canvas[id] = [parseInt(color), new Date().getTime()];

    await CANVAS.put('canvas', JSON.stringify(canvas));

    return new Response(JSON.stringify({ success: true }), { headers });
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request));
});
