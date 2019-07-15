# Resvu - Html2Pdf API
This project contains the implementation for a HTTP endpoint which performs 2 useful functions involving the conversion of:

[x] HTML string to PDF 
[ ] HTML string to a thumbnail

## Using this
Below are the access details for each API endpoint

#### /html2pdf

```
POST "https://{HOST}/html2pdf"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world.pdf"
}
```

#### /html2image (NOT IMPLEMENTED YET)

```
POST "https://{HOST}/html2image"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world",
	"type": "png",
	"width": "100",
	"height": "100"
}
```

## Running This
This uses a node webserver, which is contained within a Docker image. This can be deployed with little configuration changes to many different platforms.

### Locally

### Build
``` bash
yarn build && docker build -t pdf-server .
```

### Run
``` bash
docker run -ti -p 8080:8080 pdf-server
```

## Deploy

``` bash
./deploy.sh
```