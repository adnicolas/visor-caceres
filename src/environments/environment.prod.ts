import { NgxLoggerLevel } from 'ngx-logger';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  app_name_enviroment: '',
  app_name: 'VisorCáceres',
  apis: {
    geospatialAPI: {
      baseUrl: 'http://geospatialsai.grupotecopy.es/geospatialsaiback',
      endpoints: {
        // Ubicaciones de usuario
        userLocations: '/userlocations',
        // mapas
        maps: '/maps',
        // favoritos
        favouriteMaps: '/favouritemaps',
        // compartidos
        sharedMaps: '/sharedmaps',
        // usuarios
        users: '/users',
        // Grupos de usuarios
        groups: '/groups',
        // documentos
        userDocs: '/documents',
        // login
        login: '/dologin',
        // roles
        roles: '/roles',
        // services
        services: '/services',
        // capas
        layers: '/layers',
        // incidentes
        incidents: '/incidents',

        // No usadas --> Para eliminar
        views: '/viewconfigs',
        tools: '/tools',
        toolsGroups: '/toolsgroups',
        tags: '/tags',
        categories: '/categories',
      }
    },
    geonetworkAPI: {
      baseUrl: 'http://geonetworkpre.grupotecopy.es/geonetwork360/srv/spa',
      endpoints: {
        suggest: '/suggest',
        query: '/q',
        metadataLink: '/catalog.search#/metadata'
      }
    },
    // Usado para validar si una capa cargada es de nuestro sistema
    geoserver: {
      baseUrl: 'http://srvwebdes.grupotecopy.es/geoserver27'
    }
  },

  pages: {
    login: '/login',
    visor: '/visor',
    register: '/register',
    restorePassword: '/restore-password'
  },
  // Mapa por defecto de la BBDD
  default_visor_map_id: 1,
  default_visor_map_image: 'assets/images/world_map_blank.svg',
  // thumbnaisl de mapas al 25% del tamaño visualizado
  default_visor_map_thumbnail_factor_size: 0.25,
  default_thumbnail_catalog: 'assets/images/default_thumbnail_catalog.png',
  // Vista por defecto
  map_view: {

    // Todos los parámetros que contienen coordenadas, deberan estar en el sistema definido por default_projection (https://epsg.io/)
    // default_projection: 'EPSG:3857',
    default_projection: 'EPSG:25829',

    // Centro del mapa
    // map_center: [-795556.59, 5238076.67], //EPSG:3857
    map_center: [973806.274899, 4503556.632822], // EPSG:25829

    // Zoom inicial del mapa
    initial_zoom: 6,

    // Limitaciones a la vista del mapa en la proyección definida por  default_projection
    view_constraints: {
      // Máximo extent , no puede ser null
      //  max_extent: [-18.16, 27.627, 2.6, 42.96], // epsg:4326

      max_extent: [- 164850.78, 3660417.01, 992696.57, 9571644.07], // EPSG:25829 completa

      // zoom mínimo
      min_zoom: 0
    },

    animations: {
      zoom_duration: 500,
      travel_duration: 300
    }

  },
  language_json: '/assets/i18n/',
  date_format: 'd/M/yy, H:mm',

  units: {
    dots_per_inch: 72,
    inches_per_meter: 39.3700787,
  },

  /* Configuracion de los toast para mostrar mensajes
  Posiciones:
  top-right
  top-left
  bottom-right
  bottom-left
  top-center
  bottom-center
  center
  */
  toast: {
    duration: 3000,
    position: 'bottom-center',
    mantainErrorToast: true
  },

  file_formats: '.gml,.zip,.xml,.kml,.json,.geojson,.kmz,.gpx',

  // Tamaño máximo de archivo para cargar capas propias
  file_sizes: {
    zip_max_size: 20971520, // 20 MBs
    images_max_size: 3145728 // 3 MBs
  },

  load_base_layers: true,

  // COLORES IGUALAR  A MAPA DE COLORES SASS $colors EN theme.scss
  // TODO eliminar colores en environment, tomar del servicio del tema
  colors: {
    primary: '#4c9ae7',
    secondary: '#009cbd',
    tertiary: '#f4f4f4',
    danger: '#cf2b2b',
    transparency: {
      // Transparencia para aplicar a colores
      // Ej.: CONFIG.COLORS.PRIMARY + CONFIG.COLORS_TRANSPARENCY.HIGH = #d400b8cc
      // Color primario con alta transparencia
      low: 'c9',
      medium: 'a1',
      high: '5C'
    }
  },

  // Expresiones regulares
  reg_exp: {
    // Expresión que valida las URL
    // tslint:disable-next-line:max-line-length
    url: '^(https?://)?(([\\w!~*\'().&=+$%-]+: )?[\\w!~*\'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([\\w!~*\'()-]+\\.)*([\\w^-][\\w-]{0,61})?[\\w]\\.[a-z]{2,6})(:[0-9]{1,4})?((/*)|(/+[\\w!~*\'().;?:@&=+$,%#-]+)+/*)$'
  },

  // Ubicación de la configuración de módulos
  config_module: {
    // Prefijo y sufijo del endpoint
    prefix: 'assets/module-config/',
    suffix: '.json'
  },

  // Configuracion de impresión
  print_config: {
    logo_width: 40,
    logo_height: 10,
    timeout_ms: 30000, // Timeout en milisegundos para la impresion del mapa
    paper_formats: [ // Configuración del tamaño de papel para imprimir EN MM
      {
        name: 'a0',
        h: 1189,
        w: 841
      },
      {
        name: 'a1',
        h: 841,
        w: 594
      },
      {
        name: 'a2',
        h: 594,
        w: 420
      },
      {
        name: 'a3',
        h: 420,
        w: 297
      },
      {
        name: 'a4',
        h: 297,
        w: 210
      },
      {
        name: 'a5',
        h: 210,
        w: 148
      }
    ],
  },

  foot_link: {
    URL: '',
    LINK_TEXT: 'Insertar link foot'
  },

  // Si las capas están tileadas por defecto
  tiled_default: false,

  // Cada una de las proyecciones que van a ser usadas y definidas en la app. Definiciones sacadas de https://epsg.io en el apartado PROJ.4
  all_app_projections: [
    {
      code: 'EPSG:25829',
      name: 'ETRS89 HUSO 29N',
      proj4_def: '+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    },
    {
      code: 'EPSG:25830',
      name: 'ETRS89 HUSO 30N',
      proj4_def: '+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    },
    // {
    //   code: 'EPSG:25831',
    //   name: 'ETRS89 HUSO 31N',
    //   proj4_def: '+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    // },
    // {
    //   code: 'EPSG:32629',
    //   name: 'WGS 84 HUSO 29N',
    //   proj4_def: '+proj=utm +zone=29 +datum=WGS84 +units=m +no_defs'
    // },
    // {
    //   code: 'EPSG:32630',
    //   name: 'WGS 84 HUSO 30N',
    //   proj4_def: '+proj=utm +zone=30 +datum=WGS84 +units=m +no_defs'
    // },
    {
      code: 'EPSG:4326',
      name: 'WGS 84',
      proj4_def: '+proj=longlat +datum=WGS84 +no_defs'
    },
    // {
    //   code: 'EPSG:4258',
    //   name: 'ETRS89',
    //   proj4_def: '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs'
    // },
    {
      code: 'EPSG:3857',
      name: 'WGS84 Web Mercator',
      proj4_def: '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
    }
  ],

  // Proyecciones permitidas
  // valid_projections: [
  //   {
  //     code: 'EPSG:4326',
  //     name: 'WGS 84'
  //   },
  //   {
  //     code: 'EPSG:3857',
  //     name: 'WGS84 Web Mercator',

  //   },
  //   {
  //     code: 'EPSG:25829',
  //     name: 'ETRS89 HUSO 29N',
  //   },
  //   {
  //     code: 'EPSG:25830',
  //     name: 'ETRS89 HUSO 30N',
  //   }
  // ],

  // servidores a los cuales no pedir capas wms teseladas.
  // Aquellos que contengan alguna de las cadenas del array en su dominio
  no_tiled_servers_domains: ['catastro'],

  // Configuracion de proxy
  proxy_config: {
    use_proxy: true,
    use_encode_uri: true,
    proxy_adress: 'http://geospatialsaitest.grupotecopy.es/geospatialsaiback/proxy?url=',

  },

  base_layers: [{
    id: 1,
    active: false,
    title: 'OSM Callejero',
    type: 'osm',
    options: {},
    imgUrl: 'assets/images/basemaps/osmBasic.png'
  },
  {
    id: 2,
    active: false,
    title: 'OSM Terreno',
    type: 'tileImage',
    options: {
      url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      projection: 'EPSG:3857'
    },
    imgUrl: 'assets/images/basemaps/osmTerrain.png'
  },
  {
    id: 3,
    active: false,
    title: 'CARTO Oscuro',
    type: 'tileImage',
    options: {
      url: 'http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      projection: 'EPSG:3857'
    },
    imgUrl: 'assets/images/basemaps/cartodb_dark.png'
  },
  {
    id: 4,
    active: true,
    title: 'OpenTopoMap',
    type: 'tileImage',
    options: {
      url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
      projection: 'EPSG:3857'
    },
    imgUrl: 'assets/images/basemaps/opentopomap.png'
  },
  {
    id: 5,
    active: false,
    title: 'Stamen - Toner',
    type: 'tileImage',
    options: {
      url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
      projection: 'EPSG:3857'
    },
    imgUrl: 'assets/images/basemaps/toner.png'
  },
  {
    id: 7,
    active: false,
    title: 'WMTS PNOA',
    type: 'wmts',
    options: {
      url: 'https://www.ign.es/wmts/pnoa-ma',
      layer: 'OI.OrthoimageCoverage',
    },
    imgUrl: 'assets/images/basemaps/pnoa.png'
  }
  ],

  logging: {
    // Nivel de error a mostrar por consola
    consoleLogLevel: NgxLoggerLevel.DEBUG,
    // Configuracion opcional de servidor de logs, si e configura, cambiar el nivel de serverErrorLevel
    serverLogUrl: 'http://',
    serverLogLevel: NgxLoggerLevel.OFF,
  },

  elevation_provider: {
    mdt_url: 'http://servicios.idee.es/wms-inspire/mdt',
    layers: 'EL.GridCoverage'
  },

  results_per_page: 10,
  // Longoitud mínima para inicar las busquedas
  search_min_length_term: 3,

  // default parameters comunes del SceneFilter
  default_scene_filter: {
    startDate: new Date('01/02/2010'),
    endDate: new Date(),
    sunElevation: 80,
    cloudCover: 80
  },

  // parametros del filtro por defecto para coger escenas de gdbx
  default_gdbx_filter: {
    startDate: '2014-01-01T00:00:00.000Z',
    endDate: '2019-01-31T23:59:59.999Z', // get todays date as dd/mm/yyyy string
    filters: ['(sensorPlatformName == WORLDVIEW03_VNIR) OR (sensorPlatformName == WORLDVIEW03_SWIR)'],
    limit: 50,
    searchAreaWkt: 'POLYGON ((-7.877197265625 43.75522505306928, -9.195556640625 43.17313537107136, -8.876953125 42.032974332441405, -7.119140625 42.06560675405716, -7.064208984374999 43.5326204268101))'
  },

};


