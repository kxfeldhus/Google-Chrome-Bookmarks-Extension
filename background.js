function init(){
    updateChromeBookmarks();
}

function updateGoogleBookmarks(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET","http://www.google.com/bookmarks/?output=xml&num=10000",true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4){
            xhr.responseXML.documentElement.getElementsByTagName('bookmark');
        };
    };
    xhr.send(null);
}


function updateChromeBookmarks(){
    chrome.bookmarks.getTree(function(bookmarkTreeNode) {
                                 var chromeBookmarks = bookmarkTreeNode[0].children[1].children;
                                 var xhr = new XMLHttpRequest();
                                 xhr.open("GET","http://www.google.com/bookmarks/?output=xml&num=10000",true);
                                 xhr.onreadystatechange = function() {
                                     if (xhr.readyState == 4){
                                         var googleBookmarks = xhr.responseXML.documentElement.getElementsByTagName('bookmark');
                                         var gmarks = [];
                                         var labels = [];
                                         for(var i=0; i < googleBookmarks.length; i++){
                                             var gmark = { };
                                             for(var n=0; n < googleBookmarks[i].childNodes.length; n++){
                                                 if(googleBookmarks[i].childNodes[n].nodeName == 'labels'){
                                                     var label = googleBookmarks[i].childNodes[n].firstChild.childNodes[0].nodeValue;
                                                     gmark['label'] = label;
                                                     labels.push(label);
                                                 }
                                                 // gmark[googleBookmarks[i].childNodes[n].nodeName] = googleBookmarks[i].childNodes[n].firstChild.nodeValue;
                                             }
                                             var b_url = googleBookmarks[i].childNodes[1].firstChild.nodeValue;
                                             var b_title = googleBookmarks[i].childNodes[0].firstChild.nodeValue;
                                             var b_label = gmark['label'];
                                             gmark = {url: b_url, title: b_title, label: b_label};
                                             gmarks.push(gmark);
                                         }
                                         
                                         /* BEGIN: Create labels that do not exist  */
                                         var newLabels = labels.uniq();
                                         var labelsToCreate = [];
                                         for(var z=0;z < newLabels.length; z++){
                                             var newLabel = newLabels[z];
                                             var labelExists = chromeBookmarks.find(function(n){return (n.title == newLabel) ? true : false ;});
                                             if(labelExists){
                                                 true;
                                             } else {
                                                 labelsToCreate.push(newLabel);
                                             }
                                         }
                                         labelsToCreate.each(function(n){chrome.bookmarks.create({'parentId': '2', 'title': n});});
                                         /* END: Create labels that do not exist  */

                                         /* BEGIN: Create bookmarks that do not exist  */
                                         var bookmarksToCreate = [];
                                         for(var z=0;z < gmarks.length; z++){
                                             var googleBookmark = gmarks[z];

                                             var bookmarkExists = chromeBookmarks.find(function(n){return (n.url == googleBookmark.url) ? true : false ;});
                                             if(bookmarkExists){
                                                 true;
                                             } else {
                                                 bookmarksToCreate.push(googleBookmark);
                                                 false;
                                             }
                                         }
                                         console.log(bookmarksToCreate);
                                         // bookmarksToCreate.each(function(n){chrome.bookmarks.create({'parentId': '2', 'title': n['title']});});
                                         /* END: Create bookmarks that do not exist  */
                                     };

                                 };
                                 xhr.send(null);
                             });
}



function mergeBookmarks(chromeBookmarks, googleBookmarks){
    var merged = [];
    for(var i=0; i < chromeBookmarks.length; i++){
        var chromeBookmark = chromeBookmarks[i];
        for(var n=0; n < googleBookmarks.length; n++){
            var googleBookmark = googleBookmarks[n];
            if(chromeBookmark['url'] == googleBookmark['url']){
                true;
            } else {
                merged.push(googleBookmark);
            }
        }
    }

    if(merged.length > 0){
        console.log(merged);
        //createBookmarks(merged);
    }
}


function createBookmarks(bookmarks){
    console.log(bookmarks);
    for(var i=0; i < bookmarks.length; i++){
        var bookmark = bookmarks[i];
        console.log(bookmark);
        var bookmark_title = bookmark['title'];
        var bookmark_url = bookmark['url'];

        chrome.bookmarks.create({'parentId': '2', 'title': bookmark_title, 'url': bookmark_url});
    }
}