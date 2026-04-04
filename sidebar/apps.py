from django.apps import AppConfig


class SidebarConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sidebar'
    
    def ready(self):
        """
        Called when Django starts.
        Import discovery module to ensure it's available.
        """
        # Import to make discovery available
        from . import discovery  # noqa: F401

