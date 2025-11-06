import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import mapboxglCompare from 'mapbox-gl-compare';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

import bigGeoJSON from './large_deposits.geojson';

// extend mapboxgl, adding the Compare class
mapboxgl.Compare = mapboxglCompare;

const mapConfig = {
    style: 'mapbox://styles/mapbox/standard',
    center: [33, 50],
    zoom: 5
}

const App = () => {
    const mapRef = useRef();
    const beforeMapContainerRef = useRef();
    const afterMapContainerRef = useRef();
    const comparisonContainerRef = useRef();

    const mapStyle = { position: 'absolute', top: 0, bottom: 0, width: '100%' };

    const {style, center, zoom} = mapConfig;

    useEffect(() => {
        // some development servers will run this hook more than once
        // return if the map has already been initialized
        if (mapRef.current) return;

        mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;

        const beforeMap = new mapboxgl.Map({
            container: beforeMapContainerRef.current,
            style,
            config: {
                basemap: {
                    theme: 'monochrome'
                }
            },
            center,
            zoom
        });

        beforeMap.on('load', () => {
            beforeMap.addSource('unclustered-points', {
                'type': 'geojson',
                'data': bigGeoJSON
            });

            // Стилі для некластеризованих точок (окремих родовищ)
            beforeMap.addLayer({
                'id': 'unclustered-points-layer',
                'type': 'circle',
                'source': 'unclustered-points',
                filter: ['!', ['has', 'point_count']], // Фільтр: не має властивості 'point_count' (тобто не кластер)
                paint: {
                    'circle-radius': 2,
                    'circle-stroke-width': 1,
                    'circle-color': 'red',
                    'circle-stroke-color': 'white'
                }
            });
        });

        const afterMap = new mapboxgl.Map({
            container: afterMapContainerRef.current,
            style,
            config: {
                basemap: {
                    theme: 'monochrome',
                }
            },
            center,
            zoom
        });

        afterMap.on('load', () => {
            afterMap.addSource('unclustered-points', {
                'type': 'geojson',
                'data': bigGeoJSON,
                cluster: true,
                clusterMaxZoom: 5,
                clusterRadius: 50
            });

            afterMap.addLayer({
                'id': 'unclustered-points-layer',
                'type': 'circle',
                'source': 'unclustered-points',
                filter: ['!', ['has', 'point_count']], // Фільтр: не має властивості 'point_count' (тобто не кластер)
                paint: {
                    'circle-radius': 2,
                    'circle-stroke-width': 1,
                    'circle-color': 'red',
                    'circle-stroke-color': 'white'
                }
            });

            afterMap.addLayer({
                'id': 'clustered-points-layer',
                'type': 'circle',
                'source': 'unclustered-points',
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
            });

            afterMap.addLayer({
                'id': 'cluster-count-layer',
                'type': 'symbol',
                'source': 'unclustered-points',
                filter: ['has', 'point_count'], // Фільтр: має властивість 'point_count' (тобто кластер)
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });
        });


        mapRef.current = new mapboxgl.Compare(
            beforeMap,
            afterMap,
            comparisonContainerRef.current
        );
    }, [style, center, zoom]);

    return (
        <div
            id="comparison-container"
            ref={comparisonContainerRef}
            style={{ height: '98vh', position: 'relative' }}
        >
            <div id="before" ref={beforeMapContainerRef} style={mapStyle}></div>
            <div id="after" ref={afterMapContainerRef} style={mapStyle}></div>
        </div>
    );
};

export default App;
