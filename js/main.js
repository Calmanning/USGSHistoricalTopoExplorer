// import './loaders/View.js';
import { initView } from './map/View.js?v=0.01';
import { extentQuery } from './support/query.js';

const initApp = async () => {
	try {
		//Initializes the mapView
		const view = await initView();

		//Recognizing when the view is ready.
		view.when().then(console.log('webmap'));

		require(['esri/core/reactiveUtils'], (reactiveUtils) => {
			reactiveUtils.when(
				() => view?.stationary,
				async () => {
					if (view.stationary && view.zoom > 11) {
						await extentQuery(view.extent);
					}
				}
			);
		});
	} catch (err) {
		console.log('problem', err);
	}
};

initApp();
