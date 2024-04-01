d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
.then(data => 
    {
        const selectedElement = 940;
        const sampleIDs = data["names"];
        const dropDown = d3.select("#selDataset");
    
        //add option tags into the dropdown tag
        sampleIDs.map(x => dropDown.append("option").text(x).attr("value", x));
        
        const sampleData = data["samples"];

        // const groupedData = sampleData.map(d => [d.otu_ids.slice(0, 10),
        //                                    d.otu_labels.slice(0, 10), 
        //                                    d.sample_values.slice(0, 10)])
        // console.log(groupedData);
    }
);


function optionChanged(value){
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json")
    .then(data => 
        {
            // remove the graph
            Plotly.purge('bar');
            
            const selectedElement = value;
            const sampleData = data["samples"];

            const thisIDData = sampleData.filter(d => d.id == value)[0];
            
            console.log(thisIDData);

            const xSampleValues = thisIDData["sample_values"].slice(0, 10).reverse();

            const yOtuID = thisIDData["otu_ids"].map(d => "OTU " + d).slice(0, 10).reverse();

            const labelOtu = thisIDData["otu_labels"].slice(0, 10).reverse();

            console.log(xSampleValues);
            console.log(yOtuID);
            console.log(labelOtu);

            const trace1 = {
                x: xSampleValues,
                y: yOtuID,
                text: labelOtu,
                type: "bar",
                orientation: "h"
            }

            const layout = {
                title: `Sample ${value}'s Data`
            }
            let traces = [trace1]
            Plotly.plot("bar", traces, layout);
        }
    );
};