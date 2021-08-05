function generateTimeseries(data) {
    let timepoints = generateTimepoints(data);
    let timeseries = new Object();
    timeseries.w = calculateWatts(timepoints, data);
    console.log( "timeseries; " + JSON.stringify(timeseries) );

    return timeseries;
}

function generateTimepoints(data) {
    let firstTime = Number.MAX_VALUE;
    let lastTime = 0;

    for (let i = 0; i < data.length; i++) {
        if ((data[i].resulttime.getTime() / 1000) < firstTime) {
            firstTime = data[i].resulttime.getTime() / 1000;
        } 
        if ((data[i].resulttime.getTime() / 1000) > lastTime) {
            lastTime = data[i].resulttime.getTime() / 1000;
        } 
    }

    let timepoints = [];
    let pointone = firstTime + 1800;
    timepoints.push(pointone);

    for (let i = pointone + 3600; i < lastTime; i += 3600) {
        timepoints.push(i);
    } 
    
    return timepoints;
}

function calculateWatts(timepoints, data) {
    let timevaluepairs = [];
    let w = { uom: 'w', timevaluepairs }

    for (let i = 0; i < timepoints.length; i++) {

        let count = 0;
        let total = 0;
        let timepoint = 0;
        for (let j = 0; j < data.length; j++) {
            if (String(data[j].unitofmeasurement) == 'http://finto.fi/ucum/en/page/r59' && Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)) <= 1800) {
                total += Number(data[j].result);
                count++;
                timepoint = timepoints[i];
                console.log("Math.abs(timepoints[j] - (data[i].resulttime.getTime() / 1000) <= 1800): " + Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)));
                console.log("total: " + total);
                console.log("data[i].unitofmeasurement: " + data[j].unitofmeasurement);
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total/count };
        w.timevaluepairs.push( timevaluepair );
    }  
    
    return w;
}

  module.exports = {
    generateTimeseries
  }
