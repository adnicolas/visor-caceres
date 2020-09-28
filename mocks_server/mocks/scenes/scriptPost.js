//Ejemplo de proceso de respuesta procesando el json de entrada
let scenes = [
  {
    "id": "0",
    "timestamp": 1557705600,
    "cloudCover": 0.02,
    "sunElevation": 62.5078207901742,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/5/13/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-9.000237999548792 44.253408577534294,-8.347967365962251 44.25154770511989,-7.9646261142874 44.170410313884034,-7.628590691720773 44.09352942702028,-7.647518084924158 43.25680344156262,-9.000234112798234 43.26479938161411,-9.000237999548792 44.253408577534294))",
    "type": "SENTINEL"
  },
  {
    "id": "1",
    "timestamp": 1542153600,
    "cloudCover": 0.0,
    "sunElevation": 63.327585011579,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NH/2019/5/13/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-9.000234450965056 43.35284638738093,-9.000230739739445 42.364080926081904,-7.699936408330028 42.356709812544885,-7.6650876276297595 42.44647016095474,-7.645565204646067 43.344825960074395,-9.000234450965056 43.35284638738093))",
    "type": "SENTINEL"
  },
  {
    "id": "2",
    "timestamp": 1544634723,
    "cloudCover": 2.94,
    "sunElevation": 60.7327883413545,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NH/2019/5/3/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-9.000234450965056 43.35284638738093,-9.000230739739445 42.364080926081904,-7.698602290877957 42.35669467526145,-7.665191847205249 42.441561674802045,-7.645565204646067 43.344825960074395,-9.000234450965056 43.35284638738093))",
    "type": "SENTINEL"
  },
  {
    "id": "3",
    "timestamp": 1556582400,
    "cloudCover": 3.29,
    "sunElevation": 59.0113166248976,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NH/2019/4/30/1/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.664826600534275 42.4587584982039,-7.666997340294396 42.356331534440834,-8.871223455255887 42.36400860850572,-8.786379154751982 42.6295300342537,-8.203213728205373 42.54638185246714,-7.664826600534275 42.4587584982039))",
    "type": "SENTINEL"
  },
  {
    "id": "4",
    "timestamp": 1556409600,
    "cloudCover": 1.05,
    "sunElevation": 58.4032216079907,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/4/28/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-9.000237999548792 44.253408577534294,-9.000234112798234 43.26479938161411,-7.647518084924158 43.25680344156262,-7.625072671865788 44.24513356156721,-9.000237999548792 44.253408577534294))",
    "type": "SENTINEL"
  },
  {
    "id": "5",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "6",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "7",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "8",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "9",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "10",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "11",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "12",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "13",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "14",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "15",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "16",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "17",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "18",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "19",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "20",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  },
  {
    "id": "21",
    "timestamp": 1553990400,
    "cloudCover": 7.51,
    "sunElevation": 47.6182663594072,
    "thumbnail": "https://sentinel-s2-l1c.eos.com/tiles/29/T/NJ/2019/3/31/0/preview.jpg",
    "satelliteName": "sentinel2",
    "geometryWKT": "POLYGON((-7.647518084924158 43.25680344156262,-8.57045822354614 43.263992919535056,-8.246688582621957 44.25092470048595,-7.625072671865788 44.24513356156721,-7.647518084924158 43.25680344156262))",
    "type": "SENTINEL"
  }
]

let filter = JSON.parse(request.body);
if (filter) {
  if (filter.hasOwnProperty('sunElevation')) {
    scenes = scenes.filter(scene => scene.sunElevation <= filter.sunElevation);
  }
  if (filter.hasOwnProperty('cloudCover')) {
    scenes = scenes.filter(scene => scene.cloudCover <= filter.cloudCover);
  }
  if (filter.hasOwnProperty('endDate')) {
    scenes = scenes.filter(scene => scene.timestamp <= filter.endDate);
  }
  if (filter.hasOwnProperty('startDate')) {
    scenes = scenes.filter(scene => scene.timestamp >= filter.startDate);
  }
}
// Paginación

const totalResults = scenes.length;
const partialScenes = scenes.slice((filter.page - 1) * filter.resultsPerPage, filter.page * filter.resultsPerPage);
const response = {
  pagination: {
    totalResults: totalResults,
    page: filter.page,
    resultsPerPage: filter.resultsPerPage,
    totalPages: Math.ceil(totalResults / filter.resultsPerPage)
  },
  results: partialScenes
}

module.exports = response;
