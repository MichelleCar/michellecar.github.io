//---------------------------1------------------------------------
// 1. Use the D3 library to read in samples.json from the 
// URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.

// Load the URL into a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then((data) => {
    console.log(data);
  });


//--------------------------2-----------------------------------
// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

// STEP 1: Start first by initializing the dashboard when the browser is opened
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the dropdown selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add samples to dropdown menu
        names.forEach((id) => {

            // Log the value of "id" for each iteration of the loop
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list as the default when the page is launched
        let first_sample = names[0];

        // Log the value of the first sample
        console.log(first_sample);

        // Build the initial plots
        metaData(first_sample);
        barChart(first_sample);
        bubbleChart(first_sample);
        gaugeChart(first_sample);

    });
};

// STEP 2: Build the bar chart
function barChart(first_sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleData = data.samples;

        // Filter based on the value of the sample
        let value = sampleData.filter(result => result.id == first_sample);

        // Get the first index from the array
        let dataValue = value[0];

        // Get the otu_ids, labels, and sample values
        let sample_values = dataValue.sample_values;
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout of the plot
        let layout = {
            autosize: false,
            width: 500,
            height: 500,
            margin: {
              l: 100,
              r: 100,
              b: 50,
              t: 100,
              pad: 15
            },
            
            title: "Top 10 Operational Taxonomic Units (OTU)"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace1], layout)
    });
};


//--------------------------3-----------------------------------
// 3. Create a bubble chart that displays each sample.
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.


// Build the bubble chart
function bubbleChart(first_sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleData = data.samples;

        // Filter based on the value of the sample
        let value = sampleData.filter(result => result.id == first_sample);

        // Get the first index from the array
        let dataValue = value[0];

        // Get the otu_ids, lables, and sample values
        let sample_values = dataValue.sample_values;
        let otu_ids = dataValue.otu_ids;
        let otu_labels = dataValue.otu_labels;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace2 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout of the plot
        let layout = {
            title: "Bacteria Present Per Operational Taxonomic Unit",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace2], layout)
    });
};


//--------------------------3-----------------------------------
// 3. Create a bubble chart that displays each sample.
// https://plotly.com/javascript/gauge-charts/

// Build the gauge chart
function gaugeChart(first_sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the first sample
        let value = metadata.filter(result => result.id == first_sample);

        // Log the array of metadata objects after they have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Use Object.entries to get the key/value pairs and put into the demographics box on the page
        let washingFrequency = Object.values(valueData)[6];
        
        // Set up the trace for the gauge chart
        let trace3 = {
            value: washingFrequency,
            domain: {x: [0,1], y: [0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: {color: "black", size: 16}
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [0,10], tickmode: "linear", tick0: 2, dtick: 2},
                bar: {color: "black"},
                steps: [
                    {range: [0, 1], color: "rgb(215,48,39)"},
                    {range: [1, 2], color: "rgb(244,109,67)"},
                    {range: [2, 3], color: "rgb(253,174,97)"},
                    {range: [3, 4], color:  "rgb(254,224,144)"},
                    {range: [4, 5], color:  "rgb(224,243,248)"},
                    {range: [5, 6], color: "rgb(171,217,233)"},
                    {range: [6, 7], color: "rgb(116,173,209)"},
                    {range: [7, 8], color:  "rgb(69,117,180)"},
                    {range: [8, 9], color: "rgb(49,54,149)"},
                    {range: [9, 10], color: "rgb(44,47,93)"},
                ]
            } 
        };

        // Set up the Layout
        let layout = {
            width: 400, 
            height: 300,
            margin: {
                l: 50,
                r: 50,
                b: 20,
                t: 50,
                pad: 10
            }
        };

        // Call Plotly to plot the gauge chart
        Plotly.newPlot("gauge", [trace3], layout)
    });
};



//-------------------------4 & 5----------------------------------
// 4. Display the sample metadata, i.e., an individual's demographic information.
// 5. Display each key-value pair from the metadata JSON object somewhere on the page.


// Display metadata info
function metaData(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value);

        // Get the first index from the array
        let dataValue = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(dataValue).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};


//--------------------------6-----------------------------------
// 6. Update all the plots when a new sample is selected. 

// On selection of a new sample 
d3.selectAll("#selDataset").on("change", sampleChanged);

// Function called by DOM changes
function sampleChanged() { 
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let new_sample = dropdownMenu.property("value");

    // Log the new value
    console.log(new_sample); 

    // Call function to update the charts
    metaData(new_sample);
    barChart(new_sample);
    bubbleChart(new_sample);
    gaugeChart(new_sample);
};

// Update the restyled plot's values
function updatePlotly(newdata) {
  Plotly.restyle("values", [newdata]);
};

init();