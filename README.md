# dora-pdf

This Express.js service will serve a PDF generated from an headless Chrome for an arbitrary URL.

## Usage

- To get a PDF named `monpdf.pdf` for the page `http://mon-service.com/mapage`, you have to set the `PAGE_URL_PREFIX` environment variable to `http://mon-service.com` and create a link like:

```
  <a href="https://<thisservicehostname>/print?page=%2Fmapage&name=monpdf.pdf">Download PDF</a>
```

- The /ping endpoint can be used as a heartbeat for the service. It will return the string "ok" and a 200 status code.

## Installation on Scalingo

- Create a Scalingo application linked to the repository.

  as concurrency is not managed by this service, you should probably use S or M type containers. More information in the [nodejs-buildpack documentation](https://github.com/Scalingo/nodejs-buildpack#reasonable-defaults-for-concurrency)

- Setup the environnement variables:

  - `STACK` should be set to `heroku-18`
  - `PAGE_URL_PREFIX` should be set to the prefix of the URL you'll want to print (see `Usage`)
  - `PDF_NAME` should be the default downloaded PDF filename; it will be used in case the `name` query var is missing

## Future improvements

- The generated PDF should probably be cached
