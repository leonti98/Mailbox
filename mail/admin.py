from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Email

# Register the custom User model with the UserAdmin
admin.site.register(User, UserAdmin)

# Register the Email model
admin.site.register(Email)
