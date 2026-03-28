#!/usr/bin/python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

httpd = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
print("Serving flipboard at http://localhost:8080")
httpd.serve_forever()