# Generated manually to repair local databases missing the EmailOTP table.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_employerprofile_company_name"),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE TABLE IF NOT EXISTS accounts_emailotp (
                    id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
                    created_at datetime NOT NULL,
                    updated_at datetime NOT NULL,
                    otp varchar(6) NOT NULL,
                    expires_at datetime NOT NULL,
                    is_verified bool NOT NULL,
                    purpose varchar(3) NOT NULL,
                    user_id bigint NOT NULL REFERENCES accounts_user(id)
                        DEFERRABLE INITIALLY DEFERRED
                );
                CREATE INDEX IF NOT EXISTS accounts_emailotp_user_id_idx
                    ON accounts_emailotp (user_id);
            """,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
