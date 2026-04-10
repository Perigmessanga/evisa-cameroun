from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('visa_applications', '0004_visaapplication_birth_country_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='visaapplication',
            name='last_completed_step',
            field=models.PositiveIntegerField(default=0, verbose_name='Dernière étape complétée'),
        ),
    ]
