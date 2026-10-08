from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0008_repair_emailotp_table"),
    ]

    operations = [
        migrations.AddField(
            model_name="emailotp",
            name="email",
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
    ]
