document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    // Read config from data attribute on sidebar or a global config
    // Assuming sidebar has data attributes, or we can look for a meta tag
    const sidebarConfigStr = sidebar.getAttribute('data-sidebar-config');
    let sidebarConfig = {};
    if (sidebarConfigStr) {
        try {
            sidebarConfig = JSON.parse(sidebarConfigStr.replace(/'/g, '"')); // Simple parse attempt, better to use valid JSON in attribute
        } catch (e) {
            console.error("Error parsing sidebar config", e);
        }
    }
    
    const toggleUrl = sidebar.dataset.toggleUrl;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    let isSessionCollapsed = sidebar.dataset.sessionCollapsed === "true";

    // Function to handle sidebar collapsing based on window size
    function adjustSidebarForWindowSize() {
        const screenWidth = window.innerWidth;
        const titlebar = document.querySelector('.titlebar');
        const titlebarHeight = titlebar ? titlebar.offsetHeight : 0;

        if (screenWidth < 1100) {
            // Always collapse sidebar on small screens
            sidebar.classList.add("collapsed");
            initializeTooltips();

            // Dynamic positioning to anchor to titlebar
            // Dynamic positioning to anchor to titlebar
            if (titlebarHeight > 0) {
                 sidebar.style.top = titlebarHeight + 'px';
                 sidebar.style.height = (window.innerHeight - titlebarHeight) + 'px';
            } else {
                 // Failsafe: Stick to top if no titlebar
                 sidebar.style.top = '0px';
                 sidebar.style.height = '100vh';
            }
        } else {
            // Reset styles for large screens to let CSS take over (sticky)
            sidebar.style.top = '';
            sidebar.style.height = '';

            // Use session state for larger screens
            if (isSessionCollapsed) {
                sidebar.classList.add("collapsed");
                initializeTooltips();
            } else {
                sidebar.classList.remove("collapsed");
                deinitializeTooltips();
            }
        }
    }

    // Adjust sidebar state on load
    adjustSidebarForWindowSize();

    // Check if sidebar is collapsed on load and initialize tooltips if so
    if (sidebar.classList.contains("collapsed")) {
        initializeTooltips();
    }

    // Listen for window resize
    window.addEventListener("resize", adjustSidebarForWindowSize);

    // Toggle sidebar and update session via AJAX
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
            const isCollapsed = sidebar.classList.contains("collapsed");

            // Update tooltips immediately for all screen sizes
            if (isCollapsed) {
                initializeTooltips();
            } else {
                deinitializeTooltips();
            }

            // Only update session if screen width is >= 1100px
            if (window.innerWidth >= 1100) {
                fetch(toggleUrl, {
                    method: "POST",
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `collapsed=${isCollapsed}`
                }).then(response => response.json())
                  .then(data => {
                      if (data.status === "success") {
                          isSessionCollapsed = isCollapsed; // Update local state
                      }
                  }).catch(error => console.error("Error updating sidebar state:", error));
            }
    
            setTimeout(triggerAutoscale, 250);
        });
    }
});

// Close sidebar when clicking outside (only for small screens)
document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const screenWidth = window.innerWidth;
    
    if (sidebar && sidebarToggle && screenWidth < 1100 && !sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
        if (!sidebar.classList.contains("collapsed")) {
            sidebar.classList.add("collapsed");
            
            const toggleUrl = sidebar.dataset.toggleUrl;
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch(toggleUrl, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "collapsed=true"
            }).then(response => response.json())
              .catch(error => console.error("Error updating sidebar state:", error));

            initializeTooltips();
        }
    }
});

function initializeTooltips() {
    const sidebarItems = document.querySelectorAll(".sidebar.collapsed .list-group-item, .sidebar.collapsed .accordion-button");
    sidebarItems.forEach(item => {
        if (item._tooltip) {
            item._tooltip.dispose();
        }
        item._tooltip = new bootstrap.Tooltip(item, {
            title: item.querySelector("span").textContent,
            placement: "right",
            customClass: "tooltip-custom"
        });
    });
}

function deinitializeTooltips() {
    const sidebarItems = document.querySelectorAll(".sidebar .list-group-item, .sidebar .accordion-button");
    sidebarItems.forEach(item => {
        if (item._tooltip) {
            item._tooltip.dispose();
            delete item._tooltip;
        }
    });
}

function triggerAutoscale() {
    if (window.innerWidth > 1100) {
        const autoscaleButton = document.querySelector('.modebar-btn[data-title="Reset axes"]');
        if (autoscaleButton) {
            autoscaleButton.click();
        }
    }
}
