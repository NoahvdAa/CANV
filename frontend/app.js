const colors = ['FFFFFF', 'E4E4E4', '888888', '222222', 'FFA7D1', 'E50000', 'E59500', 'A06A42', 'E5D900', '94E044', '02BE01', '00D3DD', '0083C7', '0000EA', 'CF6EE4', '820080'];

var canvas = [];
var color = 3;
var pendingChanges = [];

const canv = document.getElementById('canvas');
const ctx = canv.getContext('2d');

for (var i = 0; i < 10000; i++) {
	canvas[i] = [0, null];
}

const clrs = document.getElementById('colors');
for (const color in colors) {
	const colorHex = colors[color];
	clrs.innerHTML += `<a onclick="setColor(${color});" style="background: #${colorHex};" data-color="${color}" class="color"></a>`;
}

function setColor(newColor) {
	document.querySelectorAll('.color-selected').forEach(c => c.classList.remove('color-selected'));
	document.querySelector(`[data-color='${newColor}']`).classList.add('color-selected');
	color = newColor;
}

canv.addEventListener('click', (event) => {
	const offsetLeft = canv.offsetLeft + canv.clientLeft;
	const offsetTop = canv.offsetTop + canv.clientTop;

	const x = event.pageX - offsetLeft;
	const y = event.pageY - offsetTop;

	const canvX = Math.floor(x / (canv.clientWidth / 100));
	const canvY = Math.floor(y / (canv.clientHeight / 100));

	const coord = (canvY * 100) + canvX;

	pendingChanges.push([coord, color]);

	canv[coord] = [color, new Date().getTime()];

	ctx.fillStyle = `#${colors[color].toLowerCase()}`;
	ctx.fillRect(canvX * 10, canvY * 10, 10, 10);
});

const pixelX = document.getElementById('pixel-x');
const pixelY = document.getElementById('pixel-y');
const pixelCoord = document.getElementById('pixel-coord');
const pixelLastEdited = document.getElementById('pixel-last-edited');

canv.addEventListener('mousemove', (event) => {
	const offsetLeft = canv.offsetLeft + canv.clientLeft;
	const offsetTop = canv.offsetTop + canv.clientTop;

	const x = event.pageX - offsetLeft;
	const y = event.pageY - offsetTop;

	const canvX = Math.floor(x / (canv.clientWidth / 100));
	const canvY = Math.floor(y / (canv.clientHeight / 100));

	const coord = (canvY * 100) + canvX;
	const lastModified = canvas[coord][1];

	pixelX.innerText = canvX;
	pixelY.innerText = canvY;
	pixelCoord.innerText = coord;
	pixelLastEdited.innerText = lastModified ? new Date(lastModified).toLocaleString() : 'never';
});

async function updateCanvas() {
	const response = await fetch('https://canv-worker.noahvdaa.workers.dev/canvas');
	canvas = await response.json();

	drawCanvas();
}

function drawCanvas() {
	ctx.fillStyle = '#ffffff';
	ctx.fillRect(0, 0, 100, 100);

	for (var y = 0; y < 100; y++) {
		for (var x = 0; x < 100; x++) {
			const coord = (y * 100) + x;
			const color = colors[canvas[coord][0]];
			ctx.fillStyle = `#${color.toLowerCase()}`;
			ctx.fillRect(x * 10, y * 10, 10, 10);
		}
	}
}

async function savePendingChanges() {
	if (pendingChanges.length === 0) return;

	const changesPending = pendingChanges;
	pendingChanges = [];

	await fetch('https://canv-worker.noahvdaa.workers.dev/canvas/bulk', {
		method: 'POST',
		body: JSON.stringify(changesPending)
	});
}

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState !== 'hidden') return;
	if (pendingChanges.length === 0) return;
	// Use beacon API to try and save the last changes.
	navigator.sendBeacon('https://canv-worker.noahvdaa.workers.dev/canvas/bulk', JSON.stringify(pendingChanges));
});

setTimeout(updateCanvas, 100);
setInterval(async () => {
	await savePendingChanges();
	await updateCanvas();
}, 15000);
setColor(color);