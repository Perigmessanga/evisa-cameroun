from django.contrib import admin
from django.apps import apps

app_models = apps.get_app_config('audit').get_models()  # nom de l'app sans le préfixe 'apps.'
for model in app_models:
    admin.site.register(model)


