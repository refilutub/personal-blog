'use client';

import dynamic from 'next/dynamic';

const MapChart = dynamic(() => import('@/components/MapChart/MapChart'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
});

import mapData from '@highcharts/map-collection/custom/world-highres3.topo.json';
import visitedPlaces from '@/app/data/visited-places.json';

export default function BeenTo() {
    return (
        <div className="fixed inset-0 w-screen h-screen z-0" style={{ height: '100dvh' }}>
            <MapChart
                mapData={mapData}
                visitedPlaces={visitedPlaces}
            />
        </div>
    );
}