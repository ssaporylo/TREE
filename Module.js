function buildTree(result){
	var treeJSON = {title: "root", type: "folder", childNodes: [
		{title: "folder 1", type: "folder", childNodes: [
			{title: "file 1", type: "file"}
		]},
		{title: "folder 2", type: "folder", childNodes: [
			{title: "subfolder", type: "folder", childNodes: []},
			{title: "file 2", type: "file"}
		]},
		{title: "folder 3", type: "folder", childNodes: []}
	]}

	contextMenu =  ContextMenu;
	contextMenu.addItems([
		{id: "create_folder", value: "Create folder"}, 
		{id: "create_file", value: "Create file"},
		{id: "rename_selected", value: "Rename selected"},
		{id: "delete_selected", value: "Delete selected"}
	]);

	treeView = TreeView;
	treeView.BuildTree(result);
	treeView.onItemRightClick = function(clickedElem){
		
		contextMenu.show(clickedElem);
	}
	treeView.onItemLeftClick = function(clickedElem) { 
		contextMenu.hide(document.getElementById('ContentContextMenu'));
		this.Show(clickedElem)}
	
	
	contextMenu.onItemClick = function(selectedId){
		if (selectedId == "create_folder"){
			 treeView.addNode("folder");
		} else if (selectedId == "create_file"){
			 treeView.addNode("file");
		} else if (selectedId == "delete_selected"){
			treeView.removeNode ()
		}
		   else if (selectedId == "rename_selected"){
			treeView.renameNode ()
		}
	}
}


var TreeView = (function() {
	function init (ElemArray,parentNode,El) { 
		var domElement = render(ElemArray,parentNode,El);
		bindEvents(domElement);
		return domElement;
	}
	function render (ElemArray,parentNode,El) {
		var newLI = document.createElement('li');
		newLI.classList.add('Node');
		newLI.innerHTML = '<div  class=\"Expand\"></div><div  class=\"Content\"></div>';
		newLI.children[1].innerHTML = '<img class = \"Image\">' + ElemArray.title;
		var newLiDiv = newLI.children[1];
		if (!ElemArray.childNodes) {
			newLI.classList.add('ExpandLeaf');
			newLiDiv.children[0].setAttribute('src', 'img/document.gif');
			if (El) {
				newLI.classList.add('IsRoot')
			}
			parentNode.appendChild(newLI);
		}
		else {	
			var newUL = document.createElement('ul');
			newUL.setAttribute("path", parentNode.getAttribute("path") + '/' + ElemArray.title);
			newUL.classList.add('Container');
			newLI.classList.add('ExpandClosed');
			if (El) { 
				newLI.classList.add('IsRoot')
			}
			newLiDiv.children[0].setAttribute('src', 'img/closed.gif');
			newLI.appendChild(newUL);
			parentNode.appendChild(newLI);
			if (ElemArray.childNodes[0]){ 
				Create (ElemArray, newLI.children[2]);
			}
		}
			
		
		return newLI
	}
	function bindEvents (domElement, OldName){ 
		NewName = OldName? OldName : 'NewNode';
		if (domElement) {
			domElement.addEventListener( "click", onLeftClick);
			domElement.children[1].addEventListener("contextmenu", onRightClick);
		}
		var InBox =  domElement.getElementsByTagName('input')[0];

		if(InBox) {
			InBox.setAttribute("oldname", OldName);
			InBox.focus();
			InBox.addEventListener("blur", ElemOnBlur)
		}
		
	}
	function DeleteNode (node) {
		/*var node = clickedElem.parentNode;*/
		var nodeParent = node.parentNode;
		if(node.classList.contains('IsLast')) {
			var NumberPreviousEl = +(nodeParent.children.length - 2);
			if(nodeParent.children[NumberPreviousEl]) {   
				nodeParent.children[NumberPreviousEl].classList.add('IsLast')
			}
		}
		nodeParent .removeChild(node); 
	}
	function CheckName (clickedElem,newElem) {
		node = clickedElem.parentNode;
		nodeParent = node.parentNode;
		for (i=0;i<nodeParent.children.length; i++) {
			var CompareElem =nodeParent.children[i];
                			var CloseContent = '<img class="Image" src="img/closed.gif">' + newElem;
              			var OpenContent = '<img class="Image" src="img/open.gif">' + newElem;
              			var File = '<img class="Image" src="img/document.gif">'+ newElem;
			var contentEl = CompareElem.children[1].innerHTML;
			if (contentEl == '<img class="Image" src="img/open.gif">') { 
				continue;
			}
               			if (contentEl === OpenContent || contentEl == CloseContent || contentEl == File )  {
				var r = newElem.length;
				if(newElem.charAt(r-3) == '(' && newElem.charAt(r-2) >-1 && newElem.charAt(r-1) == ')') {
					var number = +newElem.charAt(r-2) + 1;
					newElem = newElem.substring(0,r-2)  + number + ')';	
				}
				else {
					newElem= newElem +'('+ 1 + ')';
				}
				return CheckName (clickedElem,newElem);
			}	
		
		}
		 return newElem;		
	}
	function sendRequest(node_path, node, operation){
		var link = "http://localhost:8182/?" + operation + "="+ node_path;

		$.ajax(link, {
    			type: 'GET',
				crossDomain: true,
				dataType: 'json',
				async: false,
    			data: {

    			},
				success: function (data, status, settings){
					alert(data.message);
					if (operation == "deletefolder" || operation == 'deletefile'){
						DeleteNode(node);
					}
					else if(operation == "createfolder"){
						change_Name(node, node_path);
					}
					else if (operation == "renamefolder"){
						change_Name(node, data.folder);
					}
					else if (operation == "renamefile"){
						change_Name(node, data.folder);
					}
					else if (operation == "createfile" && !data.error){
						change_Name(node,node_path);
					}


				},
				error: function(error){

					var message = JSON.parse(error.responseText).message;
					alert(message);
					if (operation == "createfolder" || operation == "createfile") {
						try {
							node.previousSibling.classList.add("IsLast");
						}
						catch (err) {
							console.log(err);
						}
						node.parentNode.removeChild(node);
					}
					else if (operation == "renamefolder" || operation == "renamefile"){
							node.children[1].lastChild.outerHTML = node.children[1].lastChild.getAttribute("oldname");

					}
				}
  			})
	}

	function ElemOnBlur (e) {
		var target = e.target;
		var node = target.parentNode;
		var NodeParent = node.parentNode;
		if (NodeParent.lastChild.getAttribute("path")) {
			if (target.getAttribute("oldname") != "undefined") {
				var node_path = NodeParent.parentNode.getAttribute("path") + '/' + target.getAttribute("oldname") + '&' + target.value;
				sendRequest(node_path, NodeParent, "renamefolder");

			}
			else {
				var node_path = NodeParent.parentNode.getAttribute("path") + '/' + target.value;
				sendRequest(node_path, NodeParent, "createfolder");
			}
		}
		else{
			if (target.getAttribute("oldname") != "undefined") {
				var node_path = NodeParent.parentNode.getAttribute("path") + '/' + target.getAttribute("oldname") + '&' + target.value;
				sendRequest(node_path, NodeParent, "renamefile");

			}
			else {
				var node_path = NodeParent.parentNode.getAttribute("path") + '/' + target.value;
				sendRequest(node_path, NodeParent, "createfile");
			}

		}
	}

	function change_Name(node, node_path){
		var target = node.children[1].lastChild;
		var node = target.parentNode;
		var NodeParent = node.parentNode;
		if (target.value) {
			node.children[0].insertAdjacentHTML("afterEnd", CheckName (node,target.value))
			node.removeChild(target);
		}
		else {	
			node.removeChild(target);
             			node.children[0].insertAdjacentHTML("afterEnd", CheckName (node,NewName));
		}

		if (!NodeParent.nextSibling) {
			NodeParent.classList.add('IsLast');
		}
		if(NodeParent.previousSibling )	{
			NodeParent.previousSibling.classList.remove('IsLast');
		}
		if(NodeParent.lastChild.getAttribute("path")) {
			NodeParent.lastChild.setAttribute("path", node_path);
		}
	}

  	function onLeftClick (event) {
		var clickedElem = event.target ;
		event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
		if (TreeView.onItemLeftClick){ 
			TreeView.onItemLeftClick(clickedElem);
		}
	}
	function onRightClick(event){
		var clickedElem = event.target;
		if (TreeView.onItemRightClick){ 
			TreeView.onItemRightClick(clickedElem);
		}
	}
	function Create(Array, parentNode) {
		if ( !parentNode )	{
			 document.getElementById('cur_position').innerHTML = Array.title;
			 var El =document.createElement('div');
			 El.innerHTML = Array.title + '<ul class=\"Container\" path=' + Array.title + '></ul>';
		                  document.body.appendChild(El);
			 parentNode = El.children[0];
			 /*parentNode = document.getElementsByClassName("Container")[0];
			 El= parentNode.parentNode;*/
		}
		for (var i = 0; i< Array.childNodes.length; i++) {
			var Li = init(Array.childNodes[i],parentNode,El);
			if (i+1 == +Array.childNodes.length) { 
				Li.classList.add('IsLast')
			}
			
		}
	}
	function deselect () {
			 var SelectedElem = document.getElementsByClassName('ContentSelect')[0];
 			if (SelectedElem) { 
 				SelectedElem.classList.remove ('ContentSelect');
			}
	
	} //  deselects item Node
	function hasClass(elem, className) {  
			return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)  
	} /*checks existence  Class*/     
	function ChangeImageFolder(node) {
		SecondChildrenLi = node.children[1];
		image = SecondChildrenLi.children[0];
		image.setAttribute('src', (image.getAttribute('src') == 'img/closed.gif') ? 'img/open.gif' : 'img/closed.gif' )
	} /* change image 'Folder'*/

	function ShowNodeContent (clickedElem) {
		deselect ();
		if (hasClass(clickedElem, 'Content') ) {
			clickedElem.classList.add ('ContentSelect');
		}    
		// Node, which clicked  /*hasClass(clickedElem, 'Expand')*/
	 	var node = clickedElem.parentNode;
            		var nodeParent = node.parentNode;
		if (hasClass(node, 'ExpandLeaf') ) {  
			return // clicked on Leaf  
		}
		// determine New Class

		var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
		var cur_pos = document.getElementById('cur_position').innerHTML;
		cur_pos = hasClass(node, 'ExpandClosed') ? node.lastChild.getAttribute('path') : node.parentNode.getAttribute('path');
  		document.getElementById('cur_position').innerHTML = cur_pos;
  		// change the old Class to the new one  
		// find 'open' or 'close' and change in the opposite  
		var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/  
		node.className = node.className.replace(re, '$1'+newClass+'$3');
		ChangeImageFolder(node); 
	}  
	function RenameNode () { 
		clickedElem = document.getElementsByClassName('ContentSelect')[0];
		var node = clickedElem.parentNode;		
		var OldName = clickedElem.childNodes[1].nodeValue;
		OldView = clickedElem.innerHTML;
		SelectItem = clickedElem;
		var image = clickedElem.children[0].outerHTML;
		clickedElem.innerHTML = clickedElem.children[0].outerHTML + '<input id = \'InputElem\' type =\'text\'></input>';
		rename = document.getElementById('InputElem');
		rename.setAttribute('value',OldName );
		rename.style.background = 'red';
		rename.focus();
		bindEvents (node, OldName);
	}
	return	{
		BuildTree: function(treeJSON) {
			Create(treeJSON)
		},
		Show: function (clickedElem) {
			ShowNodeContent (clickedElem)
		},
		addNode: function(type){ 
			 var element = document.getElementsByClassName('ContentSelect')[0];
			 var NodeParent = element.parentNode;
			 if(NodeParent.classList.contains('ExpandClosed')){
				ShowNodeContent(element)
			}
			 if (type == 'folder') {
				init({title: "<input></input>", type: "folder", childNodes: [] },element.nextSibling)
			}
			else{
				init({title: "<input></input>", type: "file"},element.nextSibling)
			}	
		},
		removeNode: function(){
			var element = document.getElementsByClassName('ContentSelect')[0];
			var node = element.parentNode;
			try {
				var node_path = element.nextSibling.getAttribute("path");
				sendRequest(node_path, node, "deletefolder");
			}
			catch(e){
				var node_path = element.parentNode.parentNode.getAttribute("path") + '/' + element.innerHTML.split('>')[1]
				sendRequest(node_path, node, "deletefile");
			}

		},
		renameNode: function(){ 
			RenameNode()
		},
		onItemRightClick: null
	} 	

})();



var ContextMenu = (    function() {
	function init (ElemArray,tooltipElem) {
		var domElement = render(ElemArray,tooltipElem);
		bindEvents(domElement);
		return domElement;
	}
	function render (ElemArray,tooltipElem) {
		var domElement =document.createElement('span');
		domElement.setAttribute('id', ElemArray.id);
		domElement.innerHTML = ElemArray.value;
		var elem = document.createElement('br');
		tooltipElem.appendChild(domElement);
		tooltipElem.appendChild(elem);
		return domElement;
	}
	function bindEvents (domElement){
		 domElement.addEventListener( "click", onClick );		
		domElement.addEventListener( "mouseover", onMouseOver);
		domElement.addEventListener( "mouseout", onMouseOut);
		
	}
	function onMouseOver(e) {
		e = e || event;
		var target = e.target || e.srcElement;
		target.style.background = "pink";
		
	}
	function onMouseOut(e){  
		e = e || event;
		var target = e.target || e.srcElement;
		target.style.background = "";
	};
	function onClick (event){
		var clickedElement = event.target
		ContextMenu.hide (clickedElement.parentNode);
		contextMenu.onItemClick ( clickedElement.getAttribute('id'))
		
		
	}
	function CreateItems (Array) { 
		var tooltipElem = document.createElement('div');
		tooltipElem.setAttribute('id', 'ContentContextMenu');
		tooltipElem.className = 'tooltip';
		tooltipElem.style.display = 'none';
		document.body.appendChild(tooltipElem);
		for (i=0;i<Array.length; i++) {	
			init(Array[i],tooltipElem)
		}
		
	}
	function deselect () {
		 var SelectedElem = document.getElementsByClassName('ContentSelect')[0];
 		if (SelectedElem) { 
 			SelectedElem.classList.remove ('ContentSelect');
		}
	}
	function getCoords(elem) {
		var box = elem.getBoundingClientRect();
                
		var body = document.body;
		var docEl = document.documentElement;
		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;

		var top  = box.top +  scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return { 
			top: Math.round(top), left: Math.round(left) 
		}; 
	} /*get top and right coordinates element*/
	function getPageScroll() {
		if (window.pageXOffset != undefined) {
			return {
				left: pageXOffset, 
				top: pageYOffset 
			}
		}
		var html = document.documentElement;
		var body = document.body;

		var top = html.scrollTop || body && body.scrollTop || 0;
		top -= html.clientTop;
		var left = html.scrollLeft || body && body.scrollLeft || 0;  
		left -= html.clientLeft;

		return { top: top, left: left };
	} /* get top and right coordinates page scroll*/
	function AllocationContextMenu (clickedElem) {
		var tooltipElem =  document.getElementById ('ContentContextMenu');
		tooltipElem.style.display = 'inline';
                                    deselect ();
		clickedElem.classList.add('ContentSelect'); 
		var coords = getCoords(clickedElem); 
		var scroll = getPageScroll();
		var left = coords.left + (clickedElem.offsetWidth -  tooltipElem.offsetWidth)/2^0;
		if (left < scroll.left) left = scroll.left; 
		var top = coords.top - tooltipElem.offsetHeight - 5;
		if (top < scroll.top) {
			top = coords.top + clickedElem.offsetHeight + 5;
		}
		var el = document.createElement('span');
		el.innerHTML = clickedElem.innerHTML;
		document.body.appendChild(el);
		var NameNodeHeight = el.offsetHeight;
		var NameNodeWidth = el.offsetWidth + el.offsetLeft;
		document.body.removeChild(el);
		tooltipElem.style.left = coords.left  + NameNodeWidth +'px'; 
		tooltipElem.style.top = coords.top  + NameNodeHeight +'px';
	}

	
	return {
		init: init,
		show: function(clickedElem){ 
			  AllocationContextMenu (clickedElem);
		},
		hide: function(elem){ 
			elem.style.display = 'none' 
		},
		addItems: function(Array) {
			CreateItems (Array)
		},
		onItemClick: null
	}
})();

window.onload = function (){
	var name = prompt("Enter path",'/');
	var link = "http://localhost:8182/?build=" + name;
	$.ajax(link, {
    			type: 'GET',
				crossDomain: true,
				dataType: 'json',
				async: false,
    			data: {

    			},
				success: function (data){
					console.log('1111111111');
					buildTree(data);

				},
				error: function(error){
					var data = JSON.parse(error.responseText);
					buildTree(data[0]);
				}
  			})
};
document.body.oncontextmenu=function () { 
	return false;  
}
