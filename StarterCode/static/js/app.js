
const init = () => {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then(data => 
        {
            const sampleIDs = data["names"];
            const dropDown = d3.select("#selDataset");
        
            //add option tags into the dropdown tag
            sampleIDs.map(x => dropDown.append("option").text(x).attr("value", x));
            
            //plot the first peron's id onload
            optionChanged(sampleIDs[0])
        }
    );
};

function optionChanged(id){
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then(data => 
        {   
            /////////////////////////////////////////// Bar Chart ///////////////////////////////////////////////
            // remove the graph
            Plotly.purge('bar');
            Plotly.purge('bubble');
            Plotly.purge('gauge');
            
            const sampleData = data["samples"];

            const thisIDData = sampleData.filter(d => d.id == id)[0];

            const allIDs = thisIDData["otu_ids"];
            const allSampleVal = thisIDData["sample_values"];
            const allLabels = thisIDData["otu_labels"];
            

            const xSampleValues =  allSampleVal.slice(0, 10).reverse();
            const yOtuIDNames = allIDs.map(d => "OTU " + d).slice(0, 10).reverse();
            const labelOtu = allLabels.slice(0, 10).reverse();

            const trace1 = {
                x: xSampleValues,
                y: yOtuIDNames,
                text: labelOtu,
                type: "bar",
                orientation: "h"
            }

            const layout1 = {
                title: `Sample ${id}'s Data`,
                xaxis: {
                    title: {
                      text: 'Sample Values',
                      font: {
                        size: 18,
                      }
                    },
                  },
                yaxis:{
                    title:{
                        text: "Sample ID"
                    }
                }
            };

            let traces = [trace1];
            Plotly.plot("bar", traces, layout1);


            /////////////////////////////////////////////// Bubble Chart ////////////////////////////////////////
            
            const maxID = Math.max(...allIDs);

            const trace2 = {
                x: allIDs,
                y: allSampleVal,
                text: allLabels,
                mode: "markers",
                marker:{
                    color: allIDs.map(x => maxID - x),
                    size: allSampleVal,
                }
            }
            
            const layout2 = {
                title: `Sample ${id}'s Data`,
                xaxis: {
                    title: {
                      text: 'OTU ID',
                      font: {
                        size: 18,
                      }
                    },
                  },
                yaxis:{
                    title:{
                        text: "Sample Values"
                    }
                }
            }

            traces = [trace2];

            Plotly.plot("bubble", traces, layout2);
            


            ///////////////////////////////////////////// Demographic ///////////////////////////////////////////

            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1, string.length);
            }

            const thisPerson = Object.entries(data["metadata"].filter(d => d.id == id)[0]);
            const demoInfoRef = d3.select('#sample-metadata');

            //remove everything thats already there
            demoInfoRef.selectAll("*").remove()

            thisPerson.map(d => {
                demoInfoRef.append('p').text(capitalizeFirstLetter(d[0]) + ': '+ d[1])
                demoInfoRef.append('hr')
            })

            //////////////////////////////////////////// Gauge /////////////////////////////////////////////////

            const colors = [
                [245, 245, 220], // Beige
                [220, 236, 173],
                [195, 226, 126],
                [170, 215, 80],
                [145, 205, 33],
                [120, 194, 0],
                [94, 174, 0],
                [69, 153, 0],
                [44, 133, 0],
                [18, 112, 0],    // Green
            ];

            const N = Array.from(Array(10).keys());

            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: thisPerson[thisPerson.length - 1][1],
                    title: { text: "Belly Button Washing Frequency" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        bar: {color: null},
                        axis: { range: [null, 10] },
                        steps: colors.map((d, idx) => {
                            const r = d[0];
                            const g = d[1];
                            const b = d[2];
                            return { range: [idx, idx + 1], color: `rgb(${r}, ${g}, ${b})`, text: `${idx}-${idx + 1}` }
                        })
                    },
                }
            ];

            // normalize the belly button angle -> map 0 - 10 to an angle from 0 - 180
            var angle = 180 - (180 * (data[0].value / (data[0].gauge.axis.range[1])));

            //create anootationn for the gauge meter
            var annotations = N.map(idx =>{
                const angleOffset = -Math.PI/45;
                const x = 0.5 + 0.45 * Math.cos(Math.PI - idx * Math.PI / 10 + Math.sqrt(idx) * angleOffset);
                const y = .25 + 0.45 * Math.sin(Math.PI - idx * Math.PI / 10 + Math.sqrt(idx) * angleOffset);
                return {
                    x: x,
                    y: y,
                    showarrow: false,
                    text: `${idx}-${idx + 1}`
                }
            })
            

            var layout = { 
                width: 600, 
                height: 450, 
                margin: { t: 0, b: 0 },
                //create a line/needle using the value of the belly button wash
                shapes: [{
                    type: 'line',
                    x0: 0.5,
                    y0: 0.25,
                    x1: 0.5 + 0.4 * Math.cos(angle * Math.PI / 180),
                    y1: .25 + 0.4 * Math.sin(angle * Math.PI / 180),
                    line: {
                        color: 'black',
                        width: 3
                    }
                }],
                annotations: annotations
            };

            Plotly.newPlot('gauge', data, layout);

        }
    );
};

init();