# Cluster
Cluster Financial App

David's Dev Environment:
I develop on Mac, Windows and Linux computers. To keep all of the server environments the same and similar to how they will be run on servers I use Virtual Box VM's that are provisioned and managed by Vagrant. Vangrant provides a synced folder between the host and guest machines. Vagrant also makes it easy to start and stop VM's from the command line, it makes it easy to ssh into the guest and it runs the provision script the first time the VM is created.

  Using these tools, it should be easy to get the project setup. Inside of the guest's `/vagrant/cluster` folder:

## Installing NodeJS Dependencies
From the guest command line:

`cd /vagrant/cluster`

`npm install`

## Generating untracked files for credentials
From the guest command line:

`cd /vagrant/cluster/scripts`

`./generate_credential.sh` will copy the template files from cluster/config/credentials_template to cluster/credentials, which is an untracked file. 

## Populating the mysql database
From the guest command line:

`cd /vagrant/cluster`

`nodejs scripts/create_database.js` will populate the database with appropriate tables.

## Starting the Server
From the guest command line:

`PORT=8000 npm start` should start the vm and be accessible from the host port 8080.
