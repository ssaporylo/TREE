document.body.children[0].onclick = function(event) {
	HideContextMenu ();
	event = event || window.event;  
	var clickedElem = event.target || event.srcElement; 
	if (hasClass(clickedElem, 'Expand') || hasClass(clickedElem, 'Content')) { 
		HideMenu();
		deselect (); 
		if (hasClass(clickedElem, 'Content') ) {
			clickedElem.classList.add ('ContentSelect');
		}    
		// Node, which clicked  /*hasClass(clickedElem, 'Expand')*/
		var node = clickedElem.parentNode;
		if (hasClass(node, 'ExpandLeaf') ) {  
			return // clicked on Leaf  
		}
		// determine New Class  
		var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
		var cur_pos = document.getElementById('cur_position').innerHTML
  		if (hasClass(node, 'ExpandOpen')){
			cur_pos = '/' + a.split('/').slice(1,-1).join('/')
		}
		else{
			cur_pos += '/' + clickedElem.innerHTML;
		}
		// change the old Class to the new one  
		// find 'open' or 'close' and change in the opposite  
		var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/  
		node.className = node.className.replace(re, '$1'+newClass+'$3');
		ChangeImageFolder(node);                
	};                
	if(hasClass(clickedElem, 'Content') && clickedElem.children[0].getAttribute('src') !=="img/document.gif") {
		InsertMenu (); 
	}           
                                                                                                                                                              
                                                                                
	var button = document.getElementById('AddElem');                      
	if(button){
		button.onclick  = function() {
			deselect ();
			var NameNode = document.getElementsByTagName('textarea')[0].value;
			if(!NameNode) {
				if(document.getElementById('NodeFolder').selected) {
					NameNode = 'New Folder'
				} 
			else{
				NameNode = 'New File'
			}
		};
	var NewNode = document.createElement('li');
	NewNode.innerHTML = '<div class=\"Expand\"></div><div class=\"Content\">'+NameNode+'</div>';
	if(clickedElem.parentNode.classList.contains('IsLast')) { 
		clickedElem.parentNode.classList.remove('IsLast');
		NewNode.classList.add('IsLast');
	}
	if(clickedElem.parentNode.classList.contains('IsRoot')) {
		NewNode.classList.add('IsRoot')
	};
	node.parentNode.insertBefore(NewNode,clickedElem.parentNode.nextSibling);
	if(document.getElementById('NodeFolder').selected) {
		NewNode.classList.add('Node');
		NewNode.innerHTML = NewNode.innerHTML + '<ul class=\'Container\'></ul>';
		NewNode.classList.add('ExpandClosed');
		NewNode.children[1].innerHTML = '<img class = "Image" src = \"img/closed.gif\">' + NameNode;
	}
	else 	if(document.getElementById('NodeFile').selected) {
			NewNode.classList.add('ExpandLeaf');
			NewNode.classList.add('Node');
			NewNode.children[1].innerHTML = '<img class = "Image" src = \"img/document.gif\">' + NameNode;
		}	
	HideMenu();    
	NewNode.classList.add('ContentSelect');
	}
}

             
            
} /* defines the action when you press the left mouse button on the tree  */

document.body.children[0].onmousedown =function (event) { 
	event = event || window.event;  
	var target = event.target || event.srcElement;
	if (event.which==3){ 
		deselect ();
		HideContextMenu ();
		target.classList.add('ContentSelect');
		InsertContextMenu(target);
	}         
}; /* defines the action when you press the right  mouse button on the tree  */ 
/*document.body.children[0].oncontextmenu= function RightMouseDown() {
	return false;
} */ /*disable the default context menu*/
document.onclick = function(event) {
	event = event || window.event;  
	var target = event.target || event.srcElement;
	var el = target.tagName;
	document.getElementById("ContentContextMenu").style.display = 'none';
	if( el == 'DIV' || el == 'OPTION' ||  el == 'SELECT' || el == 'INPUT' || el == 'TEXTAREA') {
		return
	}
	try {
		deselect();
		HideContextMenu();
		HideMenu();
	}
	catch(e){
		console.log(e);
	}

}; /*defines the action when you press the left mouse button outside the tree */   


 

 

