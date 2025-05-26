document.addEventListener("DOMContentLoaded", function () {
    function fetchAndUpdateSummary() {
        fetch(window.SUNDIAL_API_BASE + "/readings/summary")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    document.getElementById("totalDevices").textContent =
                        data.count ?? "0";
                    document.getElementById("activeCount").textContent =
                        "Active: " + (data.active ?? "0");
                    document.getElementById("inactiveCount").textContent =
                        "Inactive: " + (data.inactive ?? "0");
                    document.getElementById("maintenanceCount").textContent =
                        "Maintenance: " + (data.maintenance ?? "0");
                } else {
                    document.getElementById("totalDevices").textContent =
                        "Error";
                    document.getElementById("activeCount").textContent =
                        "Active: ...";
                    document.getElementById("inactiveCount").textContent =
                        "Inactive: ...";
                    document.getElementById("maintenanceCount").textContent =
                        "Maintenance: ...";
                }
            })
            .catch(() => {
                document.getElementById("totalDevices").textContent = "Error";
                document.getElementById("activeCount").textContent =
                    "Active: ...";
                document.getElementById("inactiveCount").textContent =
                    "Inactive: ...";
                document.getElementById("maintenanceCount").textContent =
                    "Maintenance: ...";
            });
    }

    let lastMaintenanceIds = [];

    function fetchAndDisplayStreetlights() {
        fetch(window.SUNDIAL_API_BASE + "/readings/streetlight")
            .then((response) => response.json())
            .then((data) => {
                const listDiv = document.getElementById("streetlightList");
                listDiv.innerHTML = "";
                let maintenanceDevices = [];

                if (
                    data.data &&
                    Array.isArray(data.data) &&
                    data.data.length > 0
                ) {
                    data.data.forEach((streetlight) => {
                        // Status color (realtime)
                        let statusClass = "bg-secondary";
                        let underlineClass = "";
                        if (streetlight.status === "Active")
                            statusClass = "bg-success";
                        else if (streetlight.status === "Inactive")
                            statusClass = "bg-danger";
                        else if (streetlight.status === "Maintenance") {
                            statusClass = "bg-warning";
                            maintenanceDevices.push(streetlight);
                            underlineClass =
                                "text-decoration-underline font-weight-bold";
                        }

                        // Create item
                        const item = document.createElement("div");
                        item.className =
                            "az-list-item d-flex justify-content-between align-items-center mb-2";
                        item.innerHTML = `
                            <span class="sundial_streetlight">
                                <span class="status-dot ${statusClass}"></span>
                                <strong class="${underlineClass}">${streetlight.name}</strong>
                                <small class="ml-2 text-muted">
                                    <i class="fas fa-map-marker-alt"></i> ${streetlight.location}
                                </small>
                            </span>
                            <i class="fas fa-eye" style="cursor:pointer" data-id="${streetlight.id}"></i>
                        `;
                        listDiv.appendChild(item);

                        item.querySelector(".fa-eye").addEventListener(
                            "click",
                            function (e) {
                                const streetlightId =
                                    this.getAttribute("data-id");
                                selectStreetlight(
                                    streetlightId,
                                    streetlight.name
                                );
                            }
                        );
                    });

                    const currentMaintenanceIds = maintenanceDevices
                        .map((d) => d.id)
                        .sort();
                    const lastIdsStr = lastMaintenanceIds.join(",");
                    const currentIdsStr = currentMaintenanceIds.join(",");
                    if (
                        maintenanceDevices.length > 0 &&
                        typeof Swal !== "undefined" &&
                        currentIdsStr !== lastIdsStr
                    ) {
                        lastMaintenanceIds = currentMaintenanceIds;
                        const names = maintenanceDevices
                            .map((d) => `${d.name} (${d.location})`)
                            .join(", ");
                        Swal.fire({
                            title: "Maintenance Alert",
                            text: `The following streetlight(s) need maintenance: ${names}`,
                            icon: "warning",
                            confirmButtonText: "OK",
                        });
                    } else if (maintenanceDevices.length === 0) {
                        lastMaintenanceIds = [];
                    }
                } else {
                    listDiv.innerHTML =
                        '<div class="text-muted">No streetlights found.</div>';
                    lastMaintenanceIds = [];
                }
            })
            .catch(() => {
                document.getElementById("streetlightList").innerHTML =
                    '<div class="text-danger">Failed to load streetlights.</div>';
            });
    }

    fetchAndUpdateSummary();
    fetchAndDisplayStreetlights();

    setInterval(fetchAndUpdateSummary, 2000);
    setInterval(fetchAndDisplayStreetlights, 2000);
});

let selectedStreetlightId = null;
let readingsInterval = null;

// Store last chart data for comparison
let lastReadingsHash = null;
let batteryChart = null;
let solarPanelChart = null;
let bulbChart = null;

function selectStreetlight(streetlightId, streetlightName) {
    selectedStreetlightId = streetlightId;
    // Show loading state
    document.getElementById(
        "streetlightStatus"
    ).innerHTML = `<strong>Status:</strong> <span class="text-muted">Loading...</span>`;
    document.getElementById("batteryChart").innerHTML = "";
    document.getElementById("solarPanelChart").innerHTML = "";
    document.getElementById("bulbChart").innerHTML = "";

    // Clear previous interval if any
    if (readingsInterval) clearInterval(readingsInterval);

    // Reset last readings hash so first fetch always updates
    lastReadingsHash = null;

    // Fetch immediately and then every 5 seconds
    fetchStreetlightReadings(streetlightId, streetlightName);
    readingsInterval = setInterval(
        () => fetchStreetlightReadings(streetlightId, streetlightName),
        5000
    );
}

function fetchStreetlightReadings(streetlightId, streetlightName) {
    fetch(window.SUNDIAL_API_BASE + `/readings/${streetlightId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.data && data.data.length > 0) {
                // Show the latest reading
                const status = data.streetlight_status;
                document.getElementById(
                    "streetlightStatus"
                ).innerHTML = `<strong>Status:</strong> <span class="text-info">${
                    status || "N/A"
                }</span>`;

                // Prepare timeline (show last 5 readings)
                const lastReadings = data.data.slice(-5);

                // Battery
                const batteryVoltages = lastReadings.map((r) => r.voltage_batt);
                const batteryCurrents = lastReadings.map((r) => r.current_batt);

                // Solar
                const solarVoltages = lastReadings.map((r) => r.voltage_solar);
                const solarCurrents = lastReadings.map((r) => r.current_solar);

                // Bulb
                const bulbVoltages = lastReadings.map((r) => r.voltage_load);
                const bulbCurrents = lastReadings.map((r) => r.current_load);

                // Timestamps
                const labels = lastReadings.map((r) => {
                    const d = new Date(r.created_at);
                    return `${d.getHours()}:${String(d.getMinutes()).padStart(
                        2,
                        "0"
                    )}:${String(d.getSeconds()).padStart(2, "0")}`;
                });

                // Create a hash of the readings to detect changes
                const readingsHash = JSON.stringify({
                    batteryVoltages,
                    batteryCurrents,
                    solarVoltages,
                    solarCurrents,
                    bulbVoltages,
                    bulbCurrents,
                    labels,
                });

                if (readingsHash !== lastReadingsHash) {
                    lastReadingsHash = readingsHash;

                    // Only create charts if they don't exist
                    if (!batteryChart) {
                        batteryChart = new ApexCharts(
                            document.querySelector("#batteryChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    {
                                        name: "Voltage (V)",
                                        data: batteryVoltages,
                                    },
                                    {
                                        name: "Current (A)",
                                        data: batteryCurrents,
                                    },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        batteryChart.render();
                    } else {
                        batteryChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        batteryChart.updateSeries([
                            { name: "Voltage (V)", data: batteryVoltages },
                            { name: "Current (A)", data: batteryCurrents },
                        ]);
                    }

                    if (!solarPanelChart) {
                        solarPanelChart = new ApexCharts(
                            document.querySelector("#solarPanelChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    {
                                        name: "Voltage (V)",
                                        data: solarVoltages,
                                    },
                                    {
                                        name: "Current (A)",
                                        data: solarCurrents,
                                    },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        solarPanelChart.render();
                    } else {
                        solarPanelChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        solarPanelChart.updateSeries([
                            { name: "Voltage (V)", data: solarVoltages },
                            { name: "Current (A)", data: solarCurrents },
                        ]);
                    }

                    if (!bulbChart) {
                        bulbChart = new ApexCharts(
                            document.querySelector("#bulbChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    { name: "Voltage (V)", data: bulbVoltages },
                                    { name: "Current (A)", data: bulbCurrents },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        bulbChart.render();
                    } else {
                        bulbChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        bulbChart.updateSeries([
                            { name: "Voltage (V)", data: bulbVoltages },
                            { name: "Current (A)", data: bulbCurrents },
                        ]);
                    }
                }
                // else: no update needed, data is the same

                // After getting the latest reading (inside fetchStreetlightReadings)
                const latest = data.data[data.data.length - 1];
                document.getElementById("batteryVoltageValue").textContent =
                    latest.voltage_batt ?? "";
                document.getElementById("batteryCurrentValue").textContent =
                    latest.current_batt ?? "";
                document.getElementById("solarVoltageValue").textContent =
                    latest.voltage_solar ?? "";
                document.getElementById("solarCurrentValue").textContent =
                    latest.current_solar ?? "";
                document.getElementById("bulbVoltageValue").textContent =
                    latest.voltage_load ?? "";
                document.getElementById("bulbCurrentValue").textContent =
                    latest.current_load ?? "";
            } else {
                document.getElementById(
                    "streetlightStatus"
                ).innerHTML = `<strong>Status:</strong> <span class="text-muted">No readings found</span>`;
                document.getElementById("batteryChart").innerHTML = "";
                document.getElementById("solarPanelChart").innerHTML = "";
                document.getElementById("bulbChart").innerHTML = "";
                lastReadingsHash = null;
                batteryChart = null;
                solarPanelChart = null;
                bulbChart = null;

                // If no readings found
                document.getElementById("batteryVoltageValue").textContent = "";
                document.getElementById("batteryCurrentValue").textContent = "";
                document.getElementById("solarVoltageValue").textContent = "";
                document.getElementById("solarCurrentValue").textContent = "";
                document.getElementById("bulbVoltageValue").textContent = "";
                document.getElementById("bulbCurrentValue").textContent = "";
            }
        })
        .catch(() => {
            document.getElementById(
                "streetlightStatus"
            ).innerHTML = `<strong>Status:</strong> <span class="text-danger">Failed to load readings</span>`;
        });
}

// Add this helper function at the top or bottom of your file
function updateLastUpdated() {
    const el = document.querySelector(
        ".card-dashboard-new .card-header small.text-muted"
    );
    if (el) {
        const now = new Date();
        // Format: Month Day, Year, h:mm:ss am/pm
        const options = { year: "numeric", month: "long", day: "numeric" };
        const dateStr = now.toLocaleDateString(undefined, options);
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
        el.textContent = `Last Updated: ${dateStr}, ${timeStr}`;
    }
}

function fetchAndDisplayStreetlights() {
    fetch(window.SUNDIAL_API_BASE + "/readings/streetlight")
        .then((response) => response.json())
        .then((data) => {
            const listDiv = document.getElementById("streetlightList");
            listDiv.innerHTML = "";
            let maintenanceDevices = [];

            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                data.data.forEach((streetlight) => {
                    // Status color (realtime)
                    let statusClass = "bg-secondary";
                    let underlineClass = "";
                    if (streetlight.status === "Active")
                        statusClass = "bg-success";
                    else if (streetlight.status === "Inactive")
                        statusClass = "bg-danger";
                    else if (streetlight.status === "Maintenance") {
                        statusClass = "bg-warning";
                        maintenanceDevices.push(streetlight);
                        underlineClass =
                            "text-decoration-underline font-weight-bold";
                    }

                    // Create item
                    const item = document.createElement("div");
                    item.className =
                        "az-list-item d-flex justify-content-between align-items-center mb-2";
                    item.innerHTML = `
                            <span class="sundial_streetlight">
                                <span class="status-dot ${statusClass}"></span>
                                <strong class="${underlineClass}">${streetlight.name}</strong>
                                <small class="ml-2 text-muted">
                                    <i class="fas fa-map-marker-alt"></i> ${streetlight.location}
                                </small>
                            </span>
                            <i class="fas fa-eye" style="cursor:pointer" data-id="${streetlight.id}"></i>
                        `;
                    listDiv.appendChild(item);

                    item.querySelector(".fa-eye").addEventListener(
                        "click",
                        function (e) {
                            const streetlightId = this.getAttribute("data-id");
                            selectStreetlight(streetlightId, streetlight.name);
                        }
                    );
                });

                const currentMaintenanceIds = maintenanceDevices
                    .map((d) => d.id)
                    .sort();
                const lastIdsStr = lastMaintenanceIds.join(",");
                const currentIdsStr = currentMaintenanceIds.join(",");
                if (
                    maintenanceDevices.length > 0 &&
                    typeof Swal !== "undefined" &&
                    currentIdsStr !== lastIdsStr
                ) {
                    lastMaintenanceIds = currentMaintenanceIds;
                    const names = maintenanceDevices
                        .map((d) => `${d.name} (${d.location})`)
                        .join(", ");
                    Swal.fire({
                        title: "Maintenance Alert",
                        text: `The following streetlight(s) need maintenance: ${names}`,
                        icon: "warning",
                        confirmButtonText: "OK",
                    });
                } else if (maintenanceDevices.length === 0) {
                    lastMaintenanceIds = [];
                }
            } else {
                listDiv.innerHTML =
                    '<div class="text-muted">No streetlights found.</div>';
                lastMaintenanceIds = [];
            }
            updateLastUpdated();
        })
        .catch(() => {
            document.getElementById("streetlightList").innerHTML =
                '<div class="text-danger">Failed to load streetlights.</div>';
            updateLastUpdated();
        });
}

// And in fetchStreetlightReadings:
function fetchStreetlightReadings(streetlightId, streetlightName) {
    fetch(window.SUNDIAL_API_BASE + `/readings/${streetlightId}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.data && data.data.length > 0) {
                // Show the latest reading
                const status = data.streetlight_status;
                document.getElementById(
                    "streetlightStatus"
                ).innerHTML = `<strong>Status:</strong> <span class="text-info">${
                    status || "N/A"
                }</span>`;

                // Prepare timeline (show last 5 readings)
                const lastReadings = data.data.slice(-5);

                // Battery
                const batteryVoltages = lastReadings.map((r) => r.voltage_batt);
                const batteryCurrents = lastReadings.map((r) => r.current_batt);

                // Solar
                const solarVoltages = lastReadings.map((r) => r.voltage_solar);
                const solarCurrents = lastReadings.map((r) => r.current_solar);

                // Bulb
                const bulbVoltages = lastReadings.map((r) => r.voltage_load);
                const bulbCurrents = lastReadings.map((r) => r.current_load);

                // Timestamps
                const labels = lastReadings.map((r) => {
                    const d = new Date(r.created_at);
                    return `${d.getHours()}:${String(d.getMinutes()).padStart(
                        2,
                        "0"
                    )}:${String(d.getSeconds()).padStart(2, "0")}`;
                });

                // Create a hash of the readings to detect changes
                const readingsHash = JSON.stringify({
                    batteryVoltages,
                    batteryCurrents,
                    solarVoltages,
                    solarCurrents,
                    bulbVoltages,
                    bulbCurrents,
                    labels,
                });

                if (readingsHash !== lastReadingsHash) {
                    lastReadingsHash = readingsHash;

                    // Only create charts if they don't exist
                    if (!batteryChart) {
                        batteryChart = new ApexCharts(
                            document.querySelector("#batteryChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    {
                                        name: "Voltage (V)",
                                        data: batteryVoltages,
                                    },
                                    {
                                        name: "Current (A)",
                                        data: batteryCurrents,
                                    },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        batteryChart.render();
                    } else {
                        batteryChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        batteryChart.updateSeries([
                            { name: "Voltage (V)", data: batteryVoltages },
                            { name: "Current (A)", data: batteryCurrents },
                        ]);
                    }

                    if (!solarPanelChart) {
                        solarPanelChart = new ApexCharts(
                            document.querySelector("#solarPanelChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    {
                                        name: "Voltage (V)",
                                        data: solarVoltages,
                                    },
                                    {
                                        name: "Current (A)",
                                        data: solarCurrents,
                                    },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        solarPanelChart.render();
                    } else {
                        solarPanelChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        solarPanelChart.updateSeries([
                            { name: "Voltage (V)", data: solarVoltages },
                            { name: "Current (A)", data: solarCurrents },
                        ]);
                    }

                    if (!bulbChart) {
                        bulbChart = new ApexCharts(
                            document.querySelector("#bulbChart"),
                            {
                                chart: {
                                    type: "line",
                                    height: 200,
                                    animations: { enabled: true },
                                },
                                series: [
                                    { name: "Voltage (V)", data: bulbVoltages },
                                    { name: "Current (A)", data: bulbCurrents },
                                ],
                                xaxis: { categories: labels },
                            }
                        );
                        bulbChart.render();
                    } else {
                        bulbChart.updateOptions({
                            xaxis: { categories: labels },
                        });
                        bulbChart.updateSeries([
                            { name: "Voltage (V)", data: bulbVoltages },
                            { name: "Current (A)", data: bulbCurrents },
                        ]);
                    }
                }
                // else: no update needed, data is the same

                // After getting the latest reading (inside fetchStreetlightReadings)
                const latest = data.data[data.data.length - 1];
                document.getElementById("batteryVoltageValue").textContent =
                    latest.voltage_batt ?? "";
                document.getElementById("batteryCurrentValue").textContent =
                    latest.current_batt ?? "";
                document.getElementById("solarVoltageValue").textContent =
                    latest.voltage_solar ?? "";
                document.getElementById("solarCurrentValue").textContent =
                    latest.current_solar ?? "";
                document.getElementById("bulbVoltageValue").textContent =
                    latest.voltage_load ?? "";
                document.getElementById("bulbCurrentValue").textContent =
                    latest.current_load ?? "";
            } else {
                document.getElementById(
                    "streetlightStatus"
                ).innerHTML = `<strong>Status:</strong> <span class="text-muted">No readings found</span>`;
                document.getElementById("batteryChart").innerHTML = "";
                document.getElementById("solarPanelChart").innerHTML = "";
                document.getElementById("bulbChart").innerHTML = "";
                lastReadingsHash = null;
                batteryChart = null;
                solarPanelChart = null;
                bulbChart = null;

                // If no readings found
                document.getElementById("batteryVoltageValue").textContent = "";
                document.getElementById("batteryCurrentValue").textContent = "";
                document.getElementById("solarVoltageValue").textContent = "";
                document.getElementById("solarCurrentValue").textContent = "";
                document.getElementById("bulbVoltageValue").textContent = "";
                document.getElementById("bulbCurrentValue").textContent = "";
            }
            updateLastUpdated();
        })
        .catch(() => {
            document.getElementById(
                "streetlightStatus"
            ).innerHTML = `<strong>Status:</strong> <span class="text-danger">Failed to load readings</span>`;
            updateLastUpdated();
        });
}
