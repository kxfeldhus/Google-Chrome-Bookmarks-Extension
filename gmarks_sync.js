// getGoogleBookmarks();
// getChromeBookmarks();
mergeBookmarks();

function getGoogleBookmarks(){
    bookmarks = new Array();
    var xhr = new XMLHttpRequest();
    xhr.open("GET","http://www.google.com/bookmarks/?output=xml&num=10000",true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4){
            list = document.createElement('ul');
            bookmarks = xhr.responseXML.documentElement.getElementsByTagName('bookmark');
        };
    };
    xhr.send(null);
    return bookmarks;
}


function displayBookmarks(){
    list = document.createElement('ul');
    for(var i=0; i < bookmarks.length; i++){
        var bookmark = bookmarks[i];
        list_item = document.createElement('li');
        bookmark_title = bookmark.childNodes[0].firstChild.nodeValue;
        bookmark_url = bookmark.childNodes[1].firstChild.nodeValue;

        paragraph = document.createElement('p');
        bookmark_link = document.createElement('A');
        bookmark_link_text = document.createTextNode(bookmark_title);
        open_bookmark_in_new_tab = 'chrome.tabs.create({url:' + "'" +  bookmark_url + "'" + '})';

        bookmark_link.setAttribute('href',bookmark_url);
        bookmark_link.setAttribute('onclick', open_bookmark_in_new_tab);
        bookmark_link.appendChild(bookmark_link_text);

        list_item.appendChild(bookmark_link);
        list.appendChild(list_item);
    }
    document.body.appendChild(list);
}

function createAllMergedBookmarks(){
    for(var i=0; i < bookmarks.length; i++){
        var bookmark = bookmarks[i];

        bookmark_title = bookmark.childNodes[0].firstChild.nodeValue;
        bookmark_url = bookmark.childNodes[1].firstChild.nodeValue;

        chrome.bookmarks.create({'parentId': '2', 'title': bookmark_title, 'url': bookmark_url});
    }
}


function createAllBookmarks(){
    for(var i=0; i < bookmarks.length; i++){
        var bookmark = bookmarks[i];

        bookmark_title = bookmark.childNodes[0].firstChild.nodeValue;
        bookmark_url = bookmark.childNodes[1].firstChild.nodeValue;

        chrome.bookmarks.create({'parentId': '2', 'title': bookmark_title, 'url': bookmark_url});
    }
}


function getChromeBookmarks(){
    chrome.bookmarks.getTree(function(bookmarkTreeNode) {displayChromeBookmarks(bookmarkTreeNode);});
}


function getAndMergeChromeBookmarks(){
    chrome.bookmarks.getTree(function(bookmarkTreeNode) {mergeChromeBookmarks(bookmarkTreeNode);});
}

function displayChromeBookmarks(chromeBookmarks){
    for(var i=0; i < chromeBookmarks.length; i++){
        bookmarks = chromeBookmarks[i].children;
        for(var n=0; n < bookmarks[1].children.length; n++){
           // console.log(bookmarks[1].children[n]);
        }
    }
    return bookmarks[1].children;
}


function mergeBookmarks(){
    chromeBookmarks = getChromeBookmarks();
    googleBookmarks = getGoogleBookmarks();
    for(var i=0; i < chromeBookmarks.length; i++){
        for(var n=0; n < googleBookmarks.length; n++){
            if(googleBookmarks['url'] == chromeBookmarks['url']){
                chromeBookmarks.splice(i,1);
            }
        }
    }
    merged = chromeBookmarks.concat(googleBookmarks);
    console.log('a');
}