import os
import shutil
import pwd
import grp
import time
from collections import OrderedDict

def deployTree(elem):
    f=[]
    folder = []

    for i in os.walk(elem):
        f.extend(i)
        break
    if len(f)> 0:
    	folder.extend({'title': i,'type': 'folder', 'childNodes':deployTree(f[0] + '/' + i)} for i in f[1])

    try:
        folder.extend({'title': i, 'type': 'file'} for i in f[2])
    except:
        pass
    return folder

def buildTree(path):
    folder_path = path.split('=')[-1]
    result={'title': folder_path, 'type': 'folder', 'childNodes': deployTree(folder_path)}
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



def infoFolder(path):
    result = {"status": 200}
    folder_path = path.split('=')[-1]
    try:
        statistic = os.stat(folder_path)
    except Exception, e:
        result["message"] = e.strerror
        result["status"] = 400
        return result
    (mode, ino, dev, nlink, uid, gid, size, atime, mtime, ctime) = statistic
    res = OrderedDict()
    res['Create_time'] =  time.ctime(mtime)
    res['User'] = pwd.getpwuid(uid)[0]
    res['Group'] = grp.getgrgid(gid)[0]
    res['Size'] = size
    res['Folders'] = 0
    res['Files'] = 0
    for (name,directories,files) in os.walk(folder_path):
        if directories:
            res['Folders']+=len(directories)

        if files:
           count = 0
           for i in files:
                if i.endswith('~'):
                    continue
                count+=1
           res['Files'] +=count
    result['data'] =''
    for i in res:
        result['data'] += "<span><b>{0}</b>: {1}</span>;  ".format(i.replace('_', ' '), res[i])
    return result


def infoFile(path):
    result = {"status": 200}
    folder_path = path.split('=')[-1]
    try:
        statistic = os.stat(folder_path)
    except Exception, e:
        result["message"] = e.strerror
        result["status"] = 400
        return result
    (mode, ino, dev, nlink, uid, gid, size, atime, mtime, ctime) = statistic
    res = OrderedDict()
    res['Create_time'] =  time.ctime(mtime)
    res['User'] = pwd.getpwuid(uid)[0]
    res['Group'] = grp.getgrgid(gid)[0]
    res['Size'] = size
    result['data'] =''
    for i in res:
        result['data'] += "<span><b>{0}</b>: {1}</span>;  ".format(i.replace('_', ' '), res[i])
    return result

def openFile(path):
    file_path = path.split('=')[-1]
    result = {"status": 200}
    try:
        os.system('gedit {}'.format(file_path))
    except Exception, e:
        result["message"] = e.strerror
        result["status"] = 400
    return result

