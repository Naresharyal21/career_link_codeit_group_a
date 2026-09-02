# Generated manually to restore company names for employer profiles.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_remove_employerprofile_company_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="employerprofile",
            name="company_name",
            field=models.CharField(default="", max_length=100),
            preserve_default=False,
        ),
    ]
