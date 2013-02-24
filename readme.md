# Onepage : a static one-page site generator

## Description
Onepage generates a one-page navigable static website from markdown files.

## Features
* Http server - watch mode
* Quick deploy to a remote server using rsync
* Default layout for desktop and mobile touch devices
* Markdown - work from your favourite IDE
* simple jade templating
* less css styling
* Custom color scheme definition

## Installation
```bash
$ npm install onepage -g
```

## Usage
### Create new project/site
```bash
$ onepage new <folder_name>
```
This command creates a new onepage project in a folder you are currently in; next in a newly created folder:

### Launch preview / watch mode
```bash
$ onepage watch
```
In this mode a server instance observes every change in your markdown, jade & less files. You have to point you browser to [http://localhost:8000](http://localhost:8000)

### One time compilation
```bash
$ onepage compile
```

### Add a new page

```bash
$ onepage addpage <page_name>
```
You can find all your markdown files in the `<your_project_folder>/res/_pages` folder

Options for each created page are in it's head section (before `//***//` mark).

Here you can set:

* the page title (longer, as it appears in the page title section)
* the menu title (shorter)
* hash name - slug
* menu icon - all you have to do is write the second part (after `icon-`) of the icon name. The full list of icons: [Elusive Icons](http://aristeides.com/elusive-iconfont/)

### Deploy to a remote server

If you are ready to move your files to a server (and you have provided your server data in the configuration file):
```bash
$ onepage deploy
```
## Configuration
You will find a configuration file in your project folder in the `res` folder.


## Customization

### Color schemes
Set the color scheme in the `config.json` file. You can add you own color scheme to the `<your_project_folder>/res/less/color-themes` folder.

### CSS styling
You will find all styling files in the `<your_project_folder>/res/less` folder. If in watch mode (cli command `onepage watch`) all changes are applied as you save the less file.

### Jade templates customization
All your templates are in `<your_project_folder>/res/templates` folder.