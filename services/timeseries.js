const unitofmeasurement = require('./unitofmeasurement');

async function addUoM( data ) {
    let dataWithUoM = [];
    for ( let i = 0; i < data.length; i++ ) {
        if ( String( data[i].unitofmeasurement ).startsWith( 'http' ) ) {
            data[i].unitofmeasurement =  await unitofmeasurement.getUoMFromFintoApi( data[i].unitofmeasurement ); 
            dataWithUoM.push(data[i]);   
            
        }
    } 
    console.log("dataWithUoM 12", dataWithUoM);

    return dataWithUoM;
}

async function generateTimeseries( data ) {
    const timepoints = generateTimepoints( data );
    const dataWithUoM = await addUoM( data );
    console.log("dataWithUoM 20", dataWithUoM);

    let timeseries = new Object();
    timeseries.w = calculateWatts( timepoints, dataWithUoM) ;
    timeseries.v = calculateVolts( timepoints, dataWithUoM );
    timeseries.j = calculateJoules( timepoints, dataWithUoM );
    timeseries.a = calculateAmpere( timepoints, dataWithUoM );
    console.log( "timeseries; " + JSON.stringify( timeseries ) );

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
            if (String(data[j].unitofmeasurement) == 'watt' && Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)) <= 1800) {
                total += Number(data[j].result);
                count++;
                timepoint = timepoints[i];
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total/count };
        w.timevaluepairs.push( timevaluepair );
    }  
    
    return w;
}

function calculateVolts(timepoints, data) {
    let timevaluepairs = [];
    let v = { uom: 'v', timevaluepairs }

    for (let i = 0; i < timepoints.length; i++) {

        let count = 0;
        let total = 0;
        let timepoint = 0;
        for (let j = 0; j < data.length; j++) {
            if (String(data[j].unitofmeasurement) == 'volt' && Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)) <= 1800) {
                total += Number(data[j].result);
                count++;
                timepoint = timepoints[i];
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total/count };
        v.timevaluepairs.push( timevaluepair );
    }  
    
    return v;
}

function calculateAmpere(timepoints, data) {
    let timevaluepairs = [];
    let a = { uom: 'a', timevaluepairs }

    for (let i = 0; i < timepoints.length; i++) {

        let count = 0;
        let total = 0;
        let timepoint = 0;
        for (let j = 0; j < data.length; j++) {
            if (String(data[j].unitofmeasurement) == 'ampère' && Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)) <= 1800) {
                total += Number(data[j].result);
                count++;
                timepoint = timepoints[i];
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total/count };
        a.timevaluepairs.push( timevaluepair );
    }  
    
    return a;
}

function calculateJoules(timepoints, data) {
    let timevaluepairs = [];
    let j = { uom: 'j', timevaluepairs }

    for (let i = 0; i < timepoints.length; i++) {

        let count = 0;
        let total = 0;
        let timepoint = 0;
        for (let j = 0; j < data.length; j++) {
            if (String(data[j].unitofmeasurement) == 'joule' && Math.abs(timepoints[i] - (data[j].resulttime.getTime() / 1000)) <= 1800) {
                total += Number(data[j].result);
                count++;
                timepoint = timepoints[i];
            } 
        }

        let timevaluepair = { time: timepoint, totalvalue: total, averagevalue: total/count };
        j.timevaluepairs.push( timevaluepair );
    }  
    
    return j;
}

  module.exports = {
    generateTimeseries
  }
