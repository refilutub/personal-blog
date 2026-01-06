'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from './highcharts-config';
import { MapChartProps, ViewState } from './MapChart.types';

const MapChart = ({ mapData: initialMapData, visitedPlaces }: MapChartProps) => {
    const [view, setView] = useState<ViewState>({ type: 'world', title: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [chartHeight, setChartHeight] = useState<number | null>(null);
    const chartRef = useRef<HighchartsReact.RefObject | null>(null);

    useEffect(() => {
        const updateHeight = () => {
            setChartHeight(window.innerHeight);
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        window.addEventListener('orientationchange', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('orientationchange', updateHeight);
        };
    }, []);

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
        if (view.type === 'country') {
            setView({ type: 'world', title: '' });
        } else {
            // Center on Europe
            const chart = chartRef.current?.chart;
            if (chart) {
                const mapView = (chart as any).mapView;
                if (mapView && typeof mapView.setView === 'function') {
                    // Center on Europe (lon, lat, zoom)
                    mapView.setView(null, [20, 50], 4);
                }
            }
        }
    };

    const handleZoomIn = useCallback(() => {
        const chart = chartRef.current?.chart;
        if (chart && typeof (chart as any).mapZoom === 'function') {
            // mapZoom with value < 1 zooms in
            (chart as any).mapZoom(0.5);
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        const chart = chartRef.current?.chart;
        if (chart && typeof (chart as any).mapZoom === 'function') {
            // mapZoom with value > 1 zooms out
            (chart as any).mapZoom(2);
        }
    }, []);

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
                height: chartHeight || '100%',
                events: {
                    load: function() {
                        // Ensure mapView is accessible after chart loads
                    }
                }
            },
            title: { text: view.title },
            legend: { enabled: false },
            mapNavigation: {
                enabled: true,
                enableButtons: false,
                enableMouseWheelZoom: true,
            },
            mapView: {
                projection: { name: 'WebMercator' },
                center: isWorld ? [20, 40] : undefined,
                zoom: isWorld ? 3.2 : undefined,
            },
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
    }, [view, initialMapData, worldData, getRegionData, chartHeight]);

    return (
        <div className="relative w-full h-full overflow-hidden" style={{ height: '100%', width: '100%' }}>
            <div className="absolute bottom-16 right-4 z-50 flex flex-col gap-1.5">
                <button
                    onClick={handleZoomIn}
                    className="w-6 h-6 rounded-lg bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                    aria-label="Zoom in"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-6 h-6 rounded-lg bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                    aria-label="Zoom out"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
                <button
                    onClick={handleBack}
                    disabled={isLoading}
                    className="w-6 h-6 rounded-lg bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                    aria-label="Home"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </button>
            </div>

            <HighchartsReact
                ref={chartRef}
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