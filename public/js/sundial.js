document.addEventListener("DOMContentLoaded", function () {
    // Battery Chart
    if (document.querySelector("#batteryChart")) {
        var batteryOptions = {
            chart: {
                type: "line",
                height: 200,
            },
            series: [
                {
                    name: "Voltage (V)",
                    data: [12.0, 12.2, 12.5, 12.7, 12.5],
                },
                {
                    name: "Current (A)",
                    data: [1.0, 1.1, 1.2, 1.3, 1.2],
                },
            ],
            xaxis: {
                categories: ["1 AM", "2 AM", "3 AM", "4 AM", "5 AM"],
            },
            title: {
                align: "center",
            },
            colors: ["#008FFB", "#FF4560"],
        };
        var batteryChart = new ApexCharts(
            document.querySelector("#batteryChart"),
            batteryOptions
        );
        batteryChart.render();
    } else {
        console.error("Element #batteryChart not found.");
    }

    // Solar Panel Chart
    if (document.querySelector("#solarPanelChart")) {
        var solarPanelOptions = {
            chart: {
                type: "line",
                height: 200,
            },
            series: [
                {
                    name: "Voltage (V)",
                    data: [17.5, 18.0, 18.2, 18.5, 18.0],
                },
                {
                    name: "Current (A)",
                    data: [2.3, 2.4, 2.5, 2.6, 2.5],
                },
            ],
            xaxis: {
                categories: ["1 AM", "2 AM", "3 AM", "4 AM", "5 AM"],
            },
            title: {
                align: "center",
            },
            colors: ["#00E396", "#775DD0"],
        };
        var solarPanelChart = new ApexCharts(
            document.querySelector("#solarPanelChart"),
            solarPanelOptions
        );
        solarPanelChart.render();
    } else {
        console.error("Element #solarPanelChart not found.");
    }

    // Bulb Chart
    if (document.querySelector("#bulbChart")) {
        var bulbOptions = {
            chart: {
                type: "line",
                height: 200,
            },
            series: [
                {
                    name: "Voltage (V)",
                    data: [12, 12, 12, 12, 12], // Corrected voltage to 12V
                },
                {
                    name: "Current (A)",
                    data: [0.7, 0.8, 0.8, 0.9, 0.8],
                },
            ],
            xaxis: {
                categories: ["1 AM", "2 AM", "3 AM", "4 AM", "5 AM"],
            },
            title: {
                align: "center",
            },
            colors: ["#FEB019", "#FF4560"],
        };
        var bulbChart = new ApexCharts(
            document.querySelector("#bulbChart"),
            bulbOptions
        );
        bulbChart.render();
    } else {
        console.error("Element #bulbChart not found.");
    }
});

function showReadings(
    streetlight,
    batteryVoltage,
    batteryCurrent,
    solarVoltage,
    solarCurrent,
    bulbVoltage,
    bulbCurrent,
    status
) {
    // Update the card text
    document.getElementById(
        "streetlightStatus"
    ).innerHTML = `<strong>Status:</strong> <span class="${getStatusClass(
        status
    )}">${status}</span>`;

    document.getElementById("batteryChart").innerHTML = "";
    document.getElementById("solarPanelChart").innerHTML = "";
    document.getElementById("bulbChart").innerHTML = "";

    // Initialize charts
    new ApexCharts(document.querySelector("#batteryChart"), {
        chart: { type: "line", height: 200 },
        series: [
            { name: "Voltage (V)", data: [batteryVoltage] },
            { name: "Current (A)", data: [batteryCurrent] },
        ],
        xaxis: { categories: ["Now"] },
    }).render();

    new ApexCharts(document.querySelector("#solarPanelChart"), {
        chart: { type: "line", height: 200 },
        series: [
            { name: "Voltage (V)", data: [solarVoltage] },
            { name: "Current (A)", data: [solarCurrent] },
        ],
        xaxis: { categories: ["Now"] },
    }).render();

    new ApexCharts(document.querySelector("#bulbChart"), {
        chart: { type: "line", height: 200 },
        series: [
            { name: "Voltage (V)", data: [bulbVoltage] },
            { name: "Current (A)", data: [bulbCurrent] },
        ],
        xaxis: { categories: ["Now"] },
    }).render();
}

function getStatusClass(status) {
    switch (status) {
        case "Active":
            return "text-success";
        case "Inactive":
            return "text-warning";
        case "Maintenance":
            return "text-danger";
        default:
            return "text-muted";
    }
}
