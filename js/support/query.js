//TODO: Figure out the earlest year for the US topo maps.
//NOTE: earlyMaps is unix timestamp that dates back to Dec 31, 1878. Prior to the first US topo maps.
const earlyMaps = -2871734822;
const queryOutfields = '*';
//outfields that might be used for the application
// [
// 	'Map_Name',
// 	'year',
// 	'DateCurren',
// 	'Map_Scale',
// 	'Download_GeoPDF',
// 	'View_FGDC_Metadata_XML',
// 	'View_Thumbnail_Image',
// 	'File_name',
// 	'DownloadG',
// ].join(',');

const clickQuery = async (mapPoint) => {
	//NOTE: This should create a new date to represent the present day every time the query has been called.
	const today = new Date();

	return new Promise((resolve, reject) => {
		const url =
			'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

		const params = {
			where: '1=1',
			time: `${earlyMaps}, ${today}`,
			geometry: JSON.stringify(mapPoint),
			geometryType: 'esriGeometryPoint',
			spatialRel: 'esriSpatialRelIntersects',
			returnGeometry: false,
			returnQueryGeometry: true,
			outFields: queryOutfields,
			f: 'json',
		};
		axios
			.get(url, {
				params,
			})
			.then((response) => {
				console.log(response.data.features);
				const singleMap = response.data.features[0].attributes.OBJECTID;
				resolve(singleMap);
			})
			.catch((error) => {
				reject('problem querying the topo image server', console.log(error));
			});
	});
};

const extentQuery = async (viewExtent) => {
	console.log('extent query try');
	return new Promise((resolve, reject) => {
		const url =
			'https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/query';

		const params = {
			where: '1=1',
			geometry: JSON.stringify(viewExtent),
			geometryType: 'esriGeometryEnvelope',
			spatialRel: 'esriSpatialRelIntersects',
			returnGeometry: false,
			returnQueryGeometry: true,
			outFields: queryOutfields,
			f: 'json',
		};
		axios
			.get(url, {
				params,
			})
			.then((response) => {
				// console.log(response)
				const topoMapsInExtent = response.data.features;
				console.log(topoMapsInExtent);

				let mapsList = topoMapsInExtent.map((topo) => ({
					topo,
					OBJECTID: topo.attributes.OBJECTID,
					date: topo.attributes.Date_On_Map,
					mapName: topo.attributes.Map_Name,
					mapScale: `1:${topo.attributes.Map_Scale}`,
					location: `${topo.attributes.Map_Name}, ${topo.attributes.Primary_State}`,
					thumbnail: `https://utility.arcgis.com/usrsvcs/servers/06ee78ba612c446f940d68e22a6b091b/rest/services/USGS_Historical_Topographic_Maps/ImageServer/${topo.attributes.OBJECTID}/info/thumbnail`,
					mapCenterGeographyX: topo.attributes.CenterX,
					mapCenterGeographyY: topo.attributes.CenterY,
					downloadLink: topo.attributes.DownloadG,
				}));
				console.log(mapsList);

				const order = mapsList.sort((a, b) => {
					console.log(a.date);
					let mapOrder = a.date - b.date;
					return mapOrder;
				});
				console.log(order);
				resolve(topoMapsInExtent);
			});
	});
};

export { clickQuery, extentQuery };
