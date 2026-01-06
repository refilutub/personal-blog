'use client';

import React, { useState, useMemo, useCallback } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from './highcharts-config';
import { MapChartProps, ViewState } from './MapChart.types';

const MapChart = ({ mapData: initialMapData, visitedPlaces }: MapChartProps) => {
    const [view, setView] = useState<ViewState>({ type: 'world', title: '' });
    const [isLoading, setIsLoading] = useState(false);

    const worldData = useMemo(() => {
        return visitedPlaces.map(p => [p.countryCode, 1] as [string, number]);
    }, [visitedPlaces]);

    const getRegionData = useCallback((countryCode: string) => {
        const place = visitedPlaces.find(p => p.countryCode === countryCode);
        return place?.regions ? place.regions.map(r => [r, 1] as [string, number]) : [];
    }, [visitedPlaces]);

    const handleDrilldown = async (point: any) => {
        const key = point['hc-key'] || point.properties?.['hc-key'] || point['iso-a2'];

        if (!key || view.type === 'country') return;

        setIsLoading(true);
        try {
            const res = await fetch(`https://code.highcharts.com/mapdata/countries/${key}/${key}-all.topo.json`);
            if (!res.ok) throw new Error('Map fetch failed');

            const topology = await res.json();

            setView({
                type: 'country',
                title: point.name,
                topology,
                countryCode: key
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setView({ type: 'world', title: '' });
    };

    const options: Highcharts.Options = useMemo(() => {
        const isWorld = view.type === 'world';
        const mapData = isWorld ? initialMapData : view.topology;
        const seriesData = isWorld ? worldData : getRegionData(view.countryCode);

        return {
            chart: {
                map: mapData,
                backgroundColor: 'transparent',
                plotBackgroundColor: 'transparent',
                spacing: [10,10,10,10],
                renderTo: 'container',
                reflow: true,
                height: '100%',
            },
            title: { text: view.title },
            legend: { enabled: false },
            mapNavigation: {
                enabled: true,
                enableButtons: false,
                enableMouseWheelZoom: true,
            },
            mapView: isWorld ? {
                projection: { name: 'WebMercator' },
                center: [20, 40],
                zoom: 3.2,
            } : undefined,
            series: [{
                type: 'map',
                data: seriesData,
                mapData: mapData,
                name: view.title || 'World',
                borderColor: isWorld ? '#555' : '#777',
                borderWidth: isWorld ? 0 : 1,
                nullColor: '#333',
                color: '#FFCB05',
                allAreas: true,
                states: {
                    hover: { color: '#FFE066' },
                    select: { enabled: false }
                },
                point: {
                    events: {
                        click: function () {
                            handleDrilldown(this);
                        }
                    }
                }
            }],
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b>'
            }
        };
    }, [view, initialMapData, worldData, getRegionData]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            {view.type === 'country' && (
                <button
                    onClick={handleBack}
                    disabled={isLoading}
                    className="absolute top-2 left-2 z-50 px-3 py-2 bg-yellow-400 text-black rounded font-bold shadow-md hover:bg-yellow-300 transition-colors"
                >
                    ← Back to World
                </button>
            )}

            <HighchartsReact
                key={view.type + (view.type === 'country' ? view.countryCode : '')}
                highcharts={Highcharts}
                constructorType={'mapChart'}
                options={options}
                containerProps={{
                    style: {
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0
                    }
                }}
            />
        </div>
    );
};

export default MapChart;