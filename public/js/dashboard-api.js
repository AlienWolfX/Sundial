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
                            <i class="fas fa-eye"></i>
                        `;
                        listDiv.appendChild(item);
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
