# Micro Sidebar - A Reusable RTL Django Sidebar App

[![PyPI version](https://badge.fury.io/py/micro-sidebar.svg)](https://pypi.org/project/micro-sidebar/)

**RTL** lightweight, reusable django app that provides a dynamic sidebar for your django projects.

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

## Auto-Discovery Mode (New in v2.0.0)

The sidebar can **automatically discover** your list views and generate navigation items!

### Setup

1. **Add context processor** to `settings.py`:
    ```python
    TEMPLATES = [{
        'OPTIONS': {
            'context_processors': [
                ...
                'sidebar.context_processors.sidebar_context',
            ],
        },
    }]
    ```

2. **Use in your sidebar template:**
    ```html
    {% extends "sidebar/main.html" %}
    {% load sidebar_tags %}

    {% block items %}
        {% auto_sidebar %}
    {% endblock %}
    ```

That's it! The sidebar will automatically find all URLs with `list` in their name (e.g., `decree_list`), match them to models, and display `verbose_name_plural` as labels.

### Configuration (Optional)

Add to `settings.py`:
```python
SIDEBAR_AUTO = {
    'ENABLED': True,                    # Enable auto-discovery
    'URL_PATTERNS': ['list'],           # Keywords to match in URL names
    'EXCLUDE_APPS': ['admin', 'auth'],  # Apps to exclude
    'EXCLUDE_MODELS': [],               # Specific models to exclude
    'CACHE_TIMEOUT': 3600,              # Cache timeout in seconds
    'DEFAULT_ICON': 'bi-list',          # Default Bootstrap icon
    'DEFAULT_ITEMS': {},                # See "Default Items" section below
    'EXTRA_ITEMS': {},                  # See "Extra Items" section below
}
```

### Default Items Configuration

Use `DEFAULT_ITEMS` to customize auto-discovered items (labels, icons, ordering) without modifying your models:

```python
SIDEBAR_AUTO = {
    # ...
    'DEFAULT_ITEMS': {
        'decree_list': {          # Key is the URL name
            'label': 'Decisions', # Override display label
            'icon': 'bi-gavel',   # Override icon
            'order': 10,          # Sort order (lower = first)
        },
        'incoming_list': {
            'order': 20,          # Only setting order
        }
    }
}
```

Items not in `DEFAULT_ITEMS` will use defaults:
- **Label**: Model's `verbose_name_plural`
- **Icon**: `DEFAULT_ICON`
- **Order**: 100

### Extra Items (Non-Model URLs)

For URLs that don't map to a model (e.g., management pages), use `EXTRA_ITEMS`:

```python
SIDEBAR_AUTO = {
    # ... other config ...
    'EXTRA_ITEMS': {
        'الإدارة': {  # Group name (accordion header)
            'icon': 'bi-gear',
            'items': [
                {
                    'url_name': 'manage_sections',
                    'label': 'إدارة الأقسام',
                    'icon': 'bi-diagram-3',
                    'permission': 'documents.manage_sections',
                },
                {
                    'url_name': 'manage_users',
                    'label': 'إدارة المستخدمين',
                    'icon': 'bi-people',
                    'permission': 'is_staff',      # or a special check to Only show to staff users.
                },
            ]
        }
    }
}
```

Then in your sidebar template:
```html
{% extends "sidebar/main.html" %}
{% load sidebar_tags %}

{% block items %}
    {% auto_sidebar %}
    {% extra_sidebar %}
{% endblock %}
```

Extra items appear at the bottom of the sidebar, grouped in Bootstrap accordions.

## Customization

### Override Default Menu
The sidebar uses a block-based template system. To define your own menu items:

1. Create a new template (e.g., `templates/sidebar_menu.html`).
2. Extend `sidebar/main.html`.
3. Override the `{% block items %}`.

**Example `sidebar_menu.html`:**
```html
{% extends "sidebar/main.html" %}

{% block items %}
<a href="{% url 'home' %}" class="list-group-item list-group-item-action">
    <i class="bi bi-house me-2" style="font-size: 24px;"></i>
    <span>Home</span>
</a>
<a href="{% url 'settings' %}" class="list-group-item list-group-item-action">
    <i class="bi bi-gear me-2" style="font-size: 24px;"></i>
    <span>Settings</span>
</a>
{% endblock %}
```

Then, include your custom template in `base.html`:
```html
{% include "sidebar_menu.html" %}
```

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
| **v1.1.0** | Renamed `content.html` to `main.html` for clarity. Refactored to use `{% block items %}` for easier extension. |
| **v1.2.0** | **New Theme Implementation:** Redesigned UI with rounded pill-shaped items, tactile micro-animations, and a refined color palette. Improved responsiveness with dynamic top-offset calculations and inline FOUC fixes for small screens. Fixed tooltip stickiness bug. |
| **v1.2.1** | **Positioning Fix:** Added `align-self: flex-start` to resolve 60px vertical offset in flex containers. Removed legacy `sidebar-top-offset` CSS variable and JS calculations. Added `box-shadow: none` and `outline: none` to accordion buttons to remove focus ring. Fixed page flickering on wider screens by constraining sidebar height with `calc(100vh - header-height)`. |
| **v1.2.2** | **CSP Compliance:** Added `nonce` attribute support to inline scripts for Content Security Policy compliance. |
| **v2.0.0** | **Auto-Discovery:** New feature that introspects Django URL patterns and models to automatically generate sidebar navigation items. Adds `{% auto_sidebar %}` template tag, context processor, and configuration options. |
| **v2.1.0** | **Refactor & Enhancements:** Decoupled customization from models by introducing `DEFAULT_ITEMS` setting for overriding auto-discovered items' labels/icons/order. Added `EXTRA_ITEMS` setting for manual, permission-aware sidebar links grouped in accordions with `{% extra_sidebar %}` tag. Removed deprecated model-level `sidebar_*` attributes. |
| **v2.2.0** | **Drag-and-Drop Reordering:** New reorder toggle in sidebar toolbar (visible in expanded mode only). Click to enable reorder mode with shake animation. Drag items to reorder with visual drop indicator. Order persists to localStorage. Default order applies only if no user customization exists. Accordion headers remain fixed. |