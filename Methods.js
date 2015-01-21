 function deselect () {
	 var SelectedElem = document.getElementsByClassName('ContentSelect')[0];
 	if (SelectedElem) { 
 		SelectedElem.classList.remove ('ContentSelect');
	}
	else {
		return
	}
} //  deselects item Node

function InsertContextMenu(clickedElem){
	HideMenu();
	HideContextMenu ();
	var node = clickedElem.parentNode;
	var nodeParent = node.parentNode;
	if(clickedElem.children[0].getAttribute('src') !=="img/document.gif") {
		var tooltip = '<span id = \'Rename\'>Rename</span></br><span id = \'Delete\'>Delete</span></br><span id =   \'CreateChildFile\'>Create child  file</span></br><span id  =                 		\'CreateChildFolder\'>Create child  folder<\span>'; 
	}
	else { 
	var tooltip = '<span id = \'Rename\'>Rename</span></br><span id = \'Delete\'>Delete</span>';
	} 
	var tooltipElem = document.createElement('div');
	tooltipElem.setAttribute('id', 'ContentContextMenu');
	tooltipElem.className = 'tooltip';
	tooltipElem.innerHTML = tooltip; 
	document.body.children[0].appendChild(tooltipElem);
	AllocationContextMenu (clickedElem, tooltipElem);
	SelectMenuItems ();
	RenameNode (clickedElem);
	DeleteNode (node, nodeParent );
	CreateChild (node);  
                
} /* create Context Menu and determine functional its buttom*/

function AllocationContextMenu (clickedElem, tooltipElem) {
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


function SelectMenuItems () {
	document.getElementById('ContentContextMenu').onmouseover = function(e) {
		e = e || event;
		var targetContextMenu = e.target || e.srcElement;
		if (targetContextMenu.tagName == 'DIV') {
			return
		}
		targetContextMenu.style.background = "pink";
		targetContextMenu.onmouseout = function(){
			targetContextMenu.style.background = "";
		};
	} 

}

function RenameNode (clickedElem) { 
	document.getElementById('Rename').onclick = function() {
		OldName = clickedElem.childNodes[1].nodeValue;
		var image = clickedElem.children[0].outerHTML;
		clickedElem.innerHTML = clickedElem.children[0].outerHTML + '<input id = \'InputElem\' type =\'text\'></input>';
		var rename = document.getElementById('InputElem');
		rename.setAttribute('value',OldName );
		rename.style.background = 'red';
		HideContextMenu ();
		rename.focus();
		rename.onblur = function() {
			if(!rename.value) { 
				clickedElem.innerHTML=image + OldName;
			}
			else { 
				NewName = rename.value; 
				rename.parentNode.removeChild(rename);
				clickedElem.innerHTML= image + NewName ; 
			}
		};
	} 
}

function DeleteNode (node, nodeParent ) {
	document.getElementById('Delete').onclick = function() {
		HideContextMenu ();
		if(node.classList.contains('IsLast')) {
			var NumberPreviousEl = +(nodeParent.children.length - 2);
				if(nodeParent.children[NumberPreviousEl]) {   
					nodeParent.children[NumberPreviousEl].classList.add('IsLast')
				}
		}
	nodeParent .removeChild(node); 
	};
}

function CreateChild (node) {
	if(document.getElementById('CreateChildFile'))  {
		document.getElementById('CreateChildFile').onclick = function() {
			HideContextMenu ();
			var InsertImage = '<img class = "Image" src = \"img/document.gif\">';
			CreateChildNode (node, InsertImage);
		}
	}
	if(document.getElementById('CreateChildFolder')) {
		document.getElementById('CreateChildFolder').onclick = function() {
			var folder =0 ;
			var InsertImage = '<img class = "Image" src = "img/closed.gif">';
			CreateChildNode (node, InsertImage,folder);      
		}
	} 

}


function HideContextMenu () {
	var OpenMenu = document.getElementById('ContentContextMenu');
	if(OpenMenu) {
		OpenMenu.parentNode.removeChild(OpenMenu)
	}
	else {
		return
	} 
} /* hide ContextMenu*/ 
function InsertMenu () {
	var elem = document.createElement('form');
	elem.setAttribute('id', 'forma');
	elem.innerHTML =   'Create neighboring node</br>Type<select><option id =\'NodeFile\'>File</option><option id = \'NodeFolder\'>Folder</option>                              	</select></br>Name</br><textarea></textarea></br><input id = \'AddElem\' type =\'button\' value = \'Add node\'></input> ';
	document.body.appendChild(elem);
} /* insert Menu textarea under body*/
function HideMenu() {
	var forma = document.getElementById('forma');                            
	if (forma) {
		forma.parentNode.removeChild(forma)
	}
	else {
		return
	}
} /* hideMenu */
function ChangeImageFolder(node) {SecondChildrenLi = node.children[1];
	image = SecondChildrenLi.children[0];
	if(image.getAttribute('src') == 'img/closed.gif') {
		image.setAttribute('src', 'img/open.gif')
	}
	else  {
		image.setAttribute('src', 'img/closed.gif')
	}
} /* change image 'Folder'*/

function CreateChildNode (node,Icon, folder) { 
	var NewLi = document.createElement('li');
	NewLi.innerHTML = '<div class=\"Expand\"></div><div class=\"Content\">'+Icon+'<input  value= \"NewFile\"></input></div>'; 
	NewLi.classList.add('Node'); 
	NewLi.classList.add('ExpandLeaf');
	NewLi.classList.add('IsLast');
	if (folder == 0) { 
		NewLi.innerHTML = NewLi.innerHTML + '<ul class= \'Container\'></ul>';
		NewLi.classList.remove('ExpandLeaf');
		NewLi.classList.add('ExpandClosed');
	}
	var ContentFolder = node.children[2];
	var number = ContentFolder.children.length - 1;
	if(ContentFolder.children[0]) {
		ContentFolder.children[number].classList.remove('IsLast');
	}
	ContentFolder.appendChild(NewLi);
	node.classList.remove('ExpandClosed');
	node.classList.add('ExpandOpen');
	var InBox =  node.getElementsByTagName('input')[0];                                                                                                                                                                                                                  	InBox.classList.add('ContentSelect');
	InBox.focus();
	InBox.onblur = function() {
		if (InBox.value) {
			var InBoxContent = InBox.value;
			NewLi.children[1].removeChild(InBox);
			NewLi.children[1].innerHTML = Icon + InBoxContent;
                                                              																	}
		else {
		NewLi.children[1].removeChild(InBox);
		NewLi.children[1].innerHTML = Icon +'NewFile';
		}
	} 
} /* create childNodes*/
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

function hasClass(elem, className) {  
	return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)  
} /*chtcks existence  Class*/

