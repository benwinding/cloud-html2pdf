# Resvu - Html2Pdf API
This project contains the implementation for a HTTP endpoint which performs 2 useful functions involving the conversion of:

[x] HTML string to PDF 
[x] HTML string to a thumbnail (base64)
[x] img url string to an img (smaller)

## Using this
Below are the access details for each API endpoint

#### /pdf/generate

```
POST "https://{HOST}/pdf/generate"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world.pdf",
	"imageResolution": "150"
}
```

#### /html/base64thumb

```
POST "https://{HOST}/html/base64thumb"
body = {
	"html": "<html><div>Hello World</div></html>",
	"filename": "hello_world",
	"type": "png",
	"width": "100",
	"height": "100"
}
```

#### /img/urlshrink

```
GET "https://{HOST}/img/urlshrink"
query = {
	"url": "https://example.com/image.png",
	"widthmax": 500
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