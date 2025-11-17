import React, { CSSProperties, useEffect, useRef } from 'react';
import mapboxgl, { LayerSpecification } from 'mapbox-gl';
// @ts-ignore
import mapboxglCompare from 'mapbox-gl-compare';

import {
  clusteredPointCfg,
  clusteredPointsNumbersCfg,
  mapConfig,
  sourceId,
  unclusteredLayerCfg,
} from '../../constants/config';
// import bigGeoJSON from '../../constants/datasets/1500000.geojson';
// import bigGeoJSON from '../../constants/datasets/1000000.geojson';
// @ts-ignore
import bigGeoJSON from '../../constants/datasets/150000.geojson';
// import bigGeoJSON from '../../constants/datasets/15000.geojson';
import { mapStyle } from './styles';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';

const Map = () => {
  const mapRef = useRef(null);
  const beforeMapContainerRef = useRef(null);
  const afterMapContainerRef = useRef(null);
  const comparisonContainerRef = useRef(null);

  const { style, center, zoom } = mapConfig;

  useEffect(() => {
    // some development servers will run this hook more than once
    // return if the map has already been initialized
    if (mapRef.current) return;

    mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;

    const beforeMap = new mapboxgl.Map({
      container: beforeMapContainerRef.current!,
      ...mapConfig,
    });

    beforeMap.on('load', () => {
      beforeMap.addSource(sourceId, {
        type: 'geojson',
        data: bigGeoJSON,
      });

      beforeMap.addLayer({ ...unclusteredLayerCfg } as LayerSpecification);
    });

    const afterMap = new mapboxgl.Map({
      container: afterMapContainerRef.current!,
      ...mapConfig,
    });

    afterMap.on('load', () => {
      afterMap.addSource(sourceId, {
        type: 'geojson',
        data: bigGeoJSON,
        cluster: true,
        clusterMaxZoom: 5,
        clusterRadius: 50,
      });

      afterMap.addLayer({ ...unclusteredLayerCfg } as LayerSpecification);
      afterMap.addLayer({ ...clusteredPointCfg } as LayerSpecification);
      afterMap.addLayer({ ...clusteredPointsNumbersCfg } as LayerSpecification);
    });

    mapRef.current = new mapboxglCompare(
      beforeMap,
      afterMap,
      comparisonContainerRef.current,
    );
  }, [style, center, zoom]);

  return (
    <div
      id="comparison-container"
      ref={comparisonContainerRef}
      style={mapStyle.container as CSSProperties}
    >
      <div
        id="before"
        ref={beforeMapContainerRef}
        style={mapStyle.map as CSSProperties}
      ></div>
      <div
        id="after"
        ref={afterMapContainerRef}
        style={mapStyle.map as CSSProperties}
      ></div>
    </div>
  );
};

export default Map;
