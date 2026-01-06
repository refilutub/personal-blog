import Highcharts from 'highcharts';

if (typeof Highcharts === 'object') {
    const mapModule = require('highcharts/modules/map');
    if (typeof mapModule === 'function') {
        mapModule(Highcharts);
    } else if (mapModule.default && typeof mapModule.default === 'function') {
        mapModule.default(Highcharts);
    }
}

export default Highcharts;