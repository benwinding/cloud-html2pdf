#!/usr/bin/python

from wkhtmltopdf import wkhtmltopdf
wkhtmltopdf(url='example.com', output_file='~/example.pdf')