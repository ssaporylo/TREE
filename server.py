#!/usr/bin/python
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import os
import json
import shutil

PORT_NUMBER = 8183

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

def buildTree(path):
    folder_path = path.split('=')[-1]
    result={'title': folder_path, 'type': 'folder', 'childNodes': _deployTree(folder_path)}
    result["status"] = 200
    return result


def createFolder(path):
    result ={}
    folder_path = path.split('=')[-1]
    result["status"] = 400
    if os.path.isdir(folder_path):
        result["message"] = "folder exists"
    else:
        try:
            os.mkdir(folder_path)
            result["message"] = "folder created"
            result["status"] = 200
        except Exception, e:
            result["message"] = e.strerror

    return result


def deleteFolder(path):
    result = {}
    folder_path = path.split('=')[-1]
    try:
        shutil.rmtree(folder_path)
        result["message"] = "folder deleted"
        result["status"] = 200
    except Exception, e:
        result["message"] = e.strerror
        result["status"]  = 400
    return result


def renameFolder(path):
    result = {}
    names = path.split('=')[-1].split('&')
    data = '/'.join(names[0].split('/')[0:-1]) + '/' + names[-1]
    
    result["status"] = 400
    if os.path.isdir(data):
        result["message"] = 'folder exists'
    else:
        try:
            os.rename(names[0],data)
            result["message"] = "folder renamed"
            result["folder"] = data
            result["status"] = 200
        except Exception, e:
            result["message"] = e.strerror

    return result


def renameFile(path):
    result = {}
    names = path.split('=')[-1].split('&')
    data = '/'.join(names[0].split('/')[0:-1]) + '/' + names[-1]
    result["status"] = 400

    if os.path.isfile(data):
        result["message"] = 'file exists'
    else:
        try:
            os.rename(names[0],data)
            result["message"] = "file renamed"
            result["folder"] = data
            result["status"] = 200
        except Exception, e:
            result["message"] = e.strerror

    return result


def createFile(path):
    result = {}
    file_path = path.split('=')[-1]
    result["status"] = 400
    if os.path.isfile(file_path):
        result["message"] = 'file exists'

    else:
        try:
            f = open(file_path, 'w')
            f.close()
            result["message"] = 'file created'
            result["status"] = 200

        except Exception, e:
            result["message"] = e.strerror

    return result


def deleteFile(path):
    result = {}
    file_path = path.split('=')[-1]
    try:
        os.remove(file_path)
        result["message"] = 'file deleted'
        result["status"] = 200
    except Exception, e:
        result["message"] = e.strerror
        result["status"] = 400
    return result


def view(action, path):
    result = {}
    if action == "build":
        result = buildTree(path)

    elif action == "createfolder":
        result = createFolder(path)

    elif action == "deletefolder":
        result = deleteFolder(path)

    elif action == "renamefolder":
        print 4444444
        result = renameFolder(path)

    elif action == "renamefile":
        result = renameFile(path)

    elif action == "createfile":
        result = createFile(path)

    elif action == 'deletefile':
        result = deleteFile(path)

    return result

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):

    #Handler for the GET requests
    def do_GET(self):

        if self.path=="/":
            self.path="/TREE.html"
            sendReply = "Pages"

        if self.path.endswith(".html"):
            mimetype='text/html'
            sendReply = "Pages"
        elif self.path.endswith(".jpg"):
            mimetype='image/jpg'
            sendReply = "Pages"
        elif self.path.endswith(".gif"):
            mimetype='image/gif'
            sendReply = "Pages"
        elif self.path.endswith(".js"):
            mimetype='application/javascript'
            sendReply = "Pages"
        elif self.path.endswith(".css"):
            mimetype='text/css'
            sendReply = "Pages"
        elif self.path.endswith(".ico"):
            mimetype = "image/x-icon"
            sendReply = False
        else:
            mimetype='application/json'
            sendReply = 'JSON'

        result = {}
        result["status"] = 200
        action = self.path.split('=')[0][2:]

        if sendReply == "Pages":
            self.wfile.write(open(self.path[1:]).read())

        elif sendReply == "JSON":
            result = view(action,self.path)
            self.send_response(result["status"])
            self.send_header('Content-type',mimetype)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            del result["status"]

            if result:
                self.wfile.write(json.dumps(result))

        return


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