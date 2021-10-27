import { Router } from 'itty-router';

const router = Router();

router.get('/canvas', async () => {
    const canvas = await CANVAS.get('canvas');
    return new Response(canvas);
});

router.get('/canvas/:id', async ({ params }) => {
    const { id } = params;
    if (isNaN(id) || id < 0 || id > 9999) {
        return new Response('Invalid ID');
    }

    const canvas = JSON.parse(await CANVAS.get('canvas'));
    const pixel = canvas[id];

    return new Response(JSON.stringify(pixel));
});

router.post('/canvas/:id', async (request) => {
    const { id } = request.params;
    if (isNaN(id) || id < 0 || id > 9999) {
        return new Response('Invalid ID');
    }

    const content = await request.json();
    const { color } = content;
    if (isNaN(color) || color < 0 || color > 15) {
        return new Response('Invalid color');
    }

    const canvas = JSON.parse(await CANVAS.get('canvas'));
    canvas[id] = [parseInt(color), new Date().getTime()];

    await CANVAS.put('canvas', JSON.stringify(canvas));

    return new Response('ok');
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

addEventListener('fetch', (e) => {
    e.respondWith(router.handle(e.request));
});
