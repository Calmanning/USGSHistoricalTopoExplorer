import { initMap } from './Map.js?v=0.01';

//NOTE: Initializes the basemap to be used in the view.
const map = await initMap();
console.log('show me the map', map);

const initView = async () => {
	return new Promise((resolve, reject) => {
		require(['esri/views/MapView'], (MapView) => {
			const view = new MapView({
				container: 'viewDiv',
				map: map,
				zoom: 4,
				center: [-100, 36],
			});

			view
				? resolve(view)
				: reject('error initalizing view', console.log(error));
		});
	});
};

export { initView, map };
