export interface VisitedPlace {
    countryCode: string;
    regions: string[];
}

export interface MapChartProps {
    mapData: any;
    visitedPlaces: VisitedPlace[];
}

export type ViewState =
    | { type: 'world'; title: string }
    | { type: 'country'; title: string; topology: any; countryCode: string };