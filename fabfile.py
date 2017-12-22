import os
from contextlib import contextmanager
from fabric.api import cd, env, prefix, run, sudo, task, hide
from fabric.context_managers import settings

from fabric_settings import *

env.hosts = []


@task
def staging():
    env.hosts = ['%s@%s' % (STAGING_SERVER_SSH_USER, STAGING_SERVER)]
    env.key_filename = 'docker/ssh/staging/%s' % STAGING_SERVER_SSH_KEY_FILE
    try:
        env.password = STAGING_SERVER_SSH_PASSWORD
    except:
        pass


@task
def production():
    env.hosts = ['%s@%s' % (PRODUCTION_SERVER_SSH_USER, PRODUCTION_SERVER)]
    env.key_filename = 'docker/ssh/production/%s' % PRODUCTION_SERVER_SSH_KEY_FILE
    try:
        env.password = PRODUCTION_SERVER_SSH_PASSWORD
    except:
        pass


# Commands


@task
def deploy():
    """
    Deploys the latest tag to the production server using docker
    """
    with cd(PROJECT_ROOT):
        run('git pull -q origin master')

    with cd(PROJECT_ROOT), hide('output'):
        sudo('docker-compose build')
        sudo('docker-compose up -d')


@task
def shell():
    """
    Create django admin account
    """
    with cd(PROJECT_ROOT):
        run('docker-compose exec backend bash')


@task
def createsuperuser():
    """
    Create django admin account
    """
    with cd(PROJECT_ROOT):
        run('docker-compose exec backend python manage.py createsuperuser')


@task
def migrate():
    """
    Create django admin account
    """
    with cd(PROJECT_ROOT):
        run('docker-compose exec backend python manage.py migrate')


@task
def psql():
    """
    Create django admin account
    """
    with cd(PROJECT_ROOT):
        run('docker-compose exec --user postgres db psql')


@task
def bootstrap():
    """
    Setup server environment using docker
    """

    with hide('output'):
        # Install docker
        sudo('apt-get update')
        sudo('apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D')
        sudo("apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'")
        sudo('apt-get update')
        run('apt-cache policy docker-engine')
        sudo('apt-get install -y docker-engine')

        # Install docker-compose
        sudo('curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose')
        sudo('chmod +x /usr/local/bin/docker-compose')

        # Create project root
        with settings(warn_only=True):
            run('mkdir -p ' + PROJECT_ROOT)

        # Prepare mxtracking log file
        with cd(PROJECT_ROOT), settings(warn_only=True):
            run('mkdir log')

        # Create Postgres data folder on host
        with cd('~'), settings(warn_only=True):
                run('mkdir postgres_data')

        # Prepare mxtracking log file
        with cd(PROJECT_ROOT), settings(warn_only=True):
            run('git init')
            run('git remote add origin ' + PROJECT_GIT_REPO)

    # Generate keypair and output
    with settings(warn_only=True):
        run('ssh-keygen -f id_rsa -t rsa -N ""')
        run('cat ~/.ssh/id_rsa.pub')
