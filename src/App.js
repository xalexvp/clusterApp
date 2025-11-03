import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import mapboxglCompare from 'mapbox-gl-compare';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

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

        const afterMap = new mapboxgl.Map({
            container: afterMapContainerRef.current,
            style,
            config: {
                basemap: {
                    theme: 'monochrome',
                    lightPreset: 'night'
                }
            },
            center,
            zoom
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
