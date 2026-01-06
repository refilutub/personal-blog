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
        <div className="relative w-full sm:w-[90vw] h-full flex-1 min-h-0 left-1/2 -translate-x-1/2">
            <MapChart
                mapData={mapData}
                visitedPlaces={visitedPlaces}
            />
        </div>
    );
}