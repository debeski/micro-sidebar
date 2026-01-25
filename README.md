# Micro Sidebar

A reusable RTL Django sidebar app for Web Apps.

[![PyPI version](https://badge.fury.io/py/micro-sidebar.svg)](https://pypi.org/project/micro-sidebar/)

## Requirements

-   **Django**: >= 5.1
-   **Bootstrap**: 5 (Required for consistent styling)

## Installation

1.  **Install:**
    ```bash
    pip install micro-sidebar
    # OR
    pip install git+https://github.com/debeski/micro-sidebar.git
    ```

2.  **Add to `INSTALLED_APPS`:**
    In your `settings.py`:
    ```python
    INSTALLED_APPS = [
        ...
        'sidebar',
        ...
    ]
    ```

3.  **Configure URLs:**
    In your project's `urls.py`:
    ```python
    from django.urls import path, include

    urlpatterns = [
        ...
        path('sidebar/', include('sidebar.urls')),
        ...
    ]
    ```

4.  **Add to your Base Template:**
    In your `base.html` (or equivalent), include the sidebar. It is designed to sit to the right of your main content. 
    
    Example structure using Flexbox:
    ```html
    <body>
        <div class="d-flex">
            <!-- Sidebar -->
            {% include "sidebar/content.html" %}

            <!-- Main Content -->
            <div class="flex-grow-1">
                {% block content %}{% endblock %}
            </div>
        </div>
        
        <!-- Bootstrap JS (Required) -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    ```

## Customization

### Overriding Content
The sidebar comes with a default template. To customize the links and content, create a file named `content.html` inside `templates/sidebar/` in your project's `templates` directory.

**Path:** `your_project/templates/sidebar/content.html`

The default sidebar logic expects specific classes like `.list-group-item` and `.accordion-item` for the collapsible features to work correctly with the provided JS.

### Positioning
The sidebar is sticky by default. If your app has a top navigation bar (titlebar), the sidebar will automatically adjust its position below it on small screens. If no titlebar is detected, it will stick to the top of the viewport.

## RTL / LTR Support
This sidebar is primarily designed for **RTL (Right-to-Left)** interfaces (e.g., Arabic). 
While it may theoretically work in LTR environments if standard Bootstrap files are used instead of RTL versions, this has **not been fully tested**. 
> *Future updates are planned to support dynamic language switching between RTL and LTR.*

## Version History

| Version | Changes |
| :--- | :--- |
| **v1.0.0** | Initial Release. |
| **v1.0.1** | Fixed titlebar positioning bug causing overlap/gaps. |
| **v1.0.2** | Improved documentation clarity and added usage instructions. |
