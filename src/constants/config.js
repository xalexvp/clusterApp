export const sourceId = 'unclustered-points';

export const mapConfig = {
    style: 'mapbox://styles/mapbox/standard',
    center: [33, 50],
    zoom: 5,
    config: {
        basemap: {
            theme: 'monochrome'
        }
    },
}

// налаштування для некластеризованих точок (окремих родовищ)
export const unclusteredLayerCfg = {
    'id': 'unclustered-points-layer',
    'type': 'circle',
    'source': sourceId,
    filter: ['!', ['has', 'point_count']], // Фільтр: не має властивості 'point_count' (тобто не кластер)
    paint: {
        'circle-radius': 2,
        'circle-stroke-width': 1,
        'circle-color': 'red',
        'circle-stroke-color': 'white'
    }
}

// налаштування для кластеризованих об'єктів (згрупованих родовищ)
export const clusteredPointCfg = {
    'id': 'clustered-points-layer',
    'type': 'circle',
    'source': sourceId,
    filter: ['has', 'point_count'], // Фільтр: має властивість 'point_count' (тобто кластер)
    paint: {
        // Використовуємо 'step' для динамічного розміру кола залежно від кількості точок
        'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6', // Колір для кластерів < 100 точок
            100, '#f1f075', // Колір для кластерів >= 100 точок
            750, '#f28cb1'  // Колір для кластерів >= 750 точок
        ],
        'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, // Радіус 20px для < 100 точок
            100, 30, // Радіус 30px для >= 100 точок
            750, 40  // Радіус 40px для >= 750 точок
        ]
    }
}

// налаштування для відображення лічільників кластеризованих об'єктів (згрупованих родовищ)
export const clusteredPointsNumbersCfg = {
    'id': 'clusters-counters-layer',
    'type': 'symbol',
    'source': sourceId,
    filter: ['has', 'point_count'], // Фільтр: має властивість 'point_count' (тобто кластер)
    layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14
    },
    paint: {
        'text-color': '#555e65'
    }
}
