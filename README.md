## Bonzabiketours client-side application

### Documentation

Coming soon

### Testing and deployment

Currently only works on node 14 or earlier due to old dependency on node-sass.

To get started:

```
$ cp .env.development .env
$ npm install
$ npm start
```

### Deployment

First make sure you can ssh into production:

```
$ ssh admin@bms.bonzabiketours.com
```

If you need to add your ssh key:

```
$ ssh-copy-id -i ~/.ssh/id_ed25519.pub admin@bms.bonzabiketours.com
```

Then you can build and deploy

```
$ npm run dist
$ ./tools/deploy.sh
```

### Conventions

Coming soon

### Stack

Built with https://github.com/harryho/react-crm (MIT license, free for personal and commercial use)

### Migration from the legacy system

- check the user groups, all users by default have the "MANAGER" user group

```
groupID,groupName,groupCode
1,Admin,ADMIN
2,Manager,MANAGER
```
