# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-17 14:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('entity', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='charity',
            name='logo',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='entity.Medium'),
        ),
        migrations.AlterField(
            model_name='donor',
            name='logo',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='donor_having_as_logo', to='entity.Medium'),
        ),
        migrations.AlterField(
            model_name='donor',
            name='video',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='donor_having_as_video', to='entity.Medium'),
        ),
    ]
