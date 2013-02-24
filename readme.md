# Onepage : static one page site generator

## Description
Onepage is a one page site generator ...

## Features
* Easy content, layout and style edition
* Server instance preview - watch mode
* Easy site navigation - arrows & swipe
* Default template suported by touch devices - swipe & responsive layout
* Markdown - work from your favourite IDE
* Simple Jade templating
* Less style engine
* Custom color scheme definition
* Quick to deploy (rsync)

## Instalation
```bash
$ npm install onepage -g
```
The first thing you nedd to do is to find the `conf.exapmle.json` file in your project `res` folder and rename it to `config.json`

## Usage
### Create new project/site
```bash
$ onepage newsite <folder_name>
```
This command creates a new onepage project in a folder you are currently in, then you enter the folder:
```bash
$ cd <folder_name>
```
and continue to work with the following comands:

### Launch preview / watch mode
```bash
$ onepage watch
```
In this mode a server instance observes every change in your markdown, jade & less files.

### One time compilation
```bash
$ onepage compile
```

### Add a new page

```bash
$ onepage addpage <page_name>
```

### Deploy to a remote server

If you are ready to move your files to a server (and you have provided your server data in the configuration file):
```bash
$ onepage deploy
```
## Configuration
You will find a configuration file in your project directory under `res` folder.

Things to configure: your site title, deployment server data...


## Creating & editing pages

```markdown
---
xxx
---
```

### Customization


## TODO