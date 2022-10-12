const initMap = () => {
	return new Promise((resolve) => {
		require(['esri/WebMap'], (WebMap) => {
			const map = new WebMap({
				portalItem: {
					id: '2e8a3ccdfd6d42a995b79812b3b0ebc6',
				},
				layers: [],
			});

			resolve(map);
		});
	});
};

export { initMap };
