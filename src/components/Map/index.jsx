import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import mapboxglCompare from 'mapbox-gl-compare';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

import bigGeoJSON from '../../constants/large_deposits.geojson';
import {
    clusteredPointCfg,
    clusteredPointsNumbersCfg,
    mapConfig,
    sourceId,
    unclusteredLayerCfg
} from "../../constants/config";
import {mapStyle} from "./styles";

// extend mapboxgl, adding the Compare class
mapboxgl.Compare = mapboxglCompare;

const Map = () => {
    const mapRef = useRef();
    const beforeMapContainerRef = useRef();
    const afterMapContainerRef = useRef();
    const comparisonContainerRef = useRef();

    const {style, center, zoom} = mapConfig;

    useEffect(() => {
        // some development servers will run this hook more than once
        // return if the map has already been initialized
        if (mapRef.current) return;

        mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;

        const beforeMap = new mapboxgl.Map({
            container: beforeMapContainerRef.current,
            ...mapConfig
        });

        beforeMap.on('load', () => {
            beforeMap.addSource(sourceId, {
                'type': 'geojson',
                'data': bigGeoJSON
            });

            beforeMap.addLayer({...unclusteredLayerCfg});
        });

        const afterMap = new mapboxgl.Map({
            container: afterMapContainerRef.current,
            ...mapConfig
        });

        afterMap.on('load', () => {
            afterMap.addSource(sourceId, {
                'type': 'geojson',
                'data': bigGeoJSON,
                cluster: true,
                clusterMaxZoom: 5,
                clusterRadius: 50
            });

            afterMap.addLayer({...unclusteredLayerCfg});
            afterMap.addLayer({...clusteredPointCfg});
            afterMap.addLayer({...clusteredPointsNumbersCfg});
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
            style={mapStyle.container}
        >
            <div id="before" ref={beforeMapContainerRef} style={mapStyle.map}></div>
            <div id="after" ref={afterMapContainerRef} style={mapStyle.map}></div>
        </div>
    );
};

export default Map;
