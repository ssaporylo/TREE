#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import os
import json
import shutil

PORT_NUMBER = 8182

def _deployTree(elem):
    f=[]
    folder = []

    for i in os.walk(elem):
        f.extend(i)
        break
    if len(f)> 0:
    	folder.extend({'title': i,'type': 'folder', 'childNodes':_deployTree(f[0] + '/' + i)} for i in f[1])

    try:
        folder.extend({'title': i, 'type': 'file'} for i in f[2])
    except:
        pass
    return folder

def _createFolder(path):
    os.mkdir(path)

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):

    #Handler for the GET requests
    def do_GET(self):
        if self.path=="/":
            self.path="/TREE.html"
        if self.path.endswith(".html"):
            mimetype='text/html'
            sendReply = True
        elif self.path.endswith(".jpg"):
            mimetype='image/jpg'
            sendReply = True
        elif self.path.endswith(".gif"):
            mimetype='image/gif'
            sendReply = True
        elif self.path.endswith(".js"):
            mimetype='application/javascript'
            sendReply = True
        elif self.path.endswith(".css"):
            mimetype='text/css'
            sendReply = True
        else:
            mimetype='application/json'
            sendReply = False

        self.send_response(200)
        self.send_header('Content-type',mimetype)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        action = self.path.split('=')[0][2:]
        if sendReply == True:
            self.wfile.write(open(self.path[1:]).read())
        else:
            if action == "build":
                folder_path = self.path.split('=')[-1]
                data = {'title': folder_path, 'type': 'folder', 'childNodes': _deployTree(folder_path)}
                self.wfile.write(json.dumps(data))
            elif action == "create":
                folder_path = self.path.split('=')[-1]
                print folder_path + '// create folder'
                os.mkdir(folder_path)
                self.wfile.write(json.dumps({"message": "folder created"}))
            elif action == "delete":
                folder_path = self.path.split('=')[-1]
                shutil.rmtree(folder_path)
                self.wfile.write(json.dumps({"message": "folder delete"}))
            elif action == "rename":
                names = self.path.split('=')[-1].split('&')
                data = '/'.join(names[0].split('/')[0:-1]) + '/' + names[-1]
                print names[0], '///', data
                os.rename(names[0],data)
                self.wfile.write(json.dumps({"message": "folder rename", "folder": data}))
            elif action == "createfile":
                file_path = self.path.split('=')[-1]
                print file_path
                res = {}
                try:
                    f = open(file_path, 'r')
                    res["message"] = 'file exists'
                    res["error"] = 'True'
                except IOError:
                    res["message"] = 'file created'
                    f = open(file_path, 'w')
                f.close()
                self.wfile.write(json.dumps(res))
            elif action == 'deletefile':
                file_path = self.path.split('=')[-1]
                os.remove(file_path)
                self.wfile.write(json.dumps({"message": "file delete"}))
        return
        #
        # Send the html message

try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print 'Started httpserver on port ' , PORT_NUMBER

    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print '^C received, shutting down the web server'
    server.socket.close()