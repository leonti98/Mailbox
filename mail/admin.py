from django.contrib import admin
from .models import User, Email

# admin.site.register(User)
# admin.site.register(Email)


Customize User admin interface
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_active", "is_superuser")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)


# Customize Email admin interface
@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ("id", "subject", "sender", "timestamp", "read", "archived")
    list_filter = ("read", "archived", "timestamp")
    search_fields = ("subject", "sender__username", "sender__email")
    raw_id_fields = ("user", "sender", "recipients")  # Useful for large datasets
    filter_horizontal = ("recipients",)  # Enables a better UI for ManyToMany fields
    date_hierarchy = "timestamp"

    def get_queryset(self, request):
        # Optimize query by prefetching related fields
        queryset = super().get_queryset(request)
        return queryset.select_related("user", "sender").prefetch_related("recipients")


# Register your models here.
admin.site.register(User)
admin.site.register(Email)