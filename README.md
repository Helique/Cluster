# Cluster
Cluster Financial App

David's Dev Environment:
I develop on Mac, Windows and Linux computers. To keep all of the server environments the same and similar to how they will be run on servers I use Virtual Box VM's that are provisioned and managed by Vagrant. Vangrant provides a synced folder between the host and guest machines. Vagrant also makes it easy to start and stop VM's from the command line, it makes it easy to ssh into the guest and it runs the provision script the first time the VM is created.

  Using these tools, it should be easy to get the project setup. Inside of the guest's `/vagrant/cluster` folder:
`npm install` inside the cluster folder should install everything needed by npm.

`scripts/generate_credential.sh` will copy the template files to `cluster/config`. 

`node scripts/createdatabase.js` will populate the database with appropriate tables.

`PORT=8000 npm start` should start the vm and be accessible form the host port 8080.
