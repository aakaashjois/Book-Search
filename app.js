var states = {
    source: "https://www.googleapis.com/books/v1/volumes",
}

function getQuery() {
    states.searchQuery = $('[type="text"]').val();
    states.startIndex = 0;
    states.maxResults = 40;
    $('.js-books').empty();
    getDatafromApi();
}

function getDatafromApi() {
    var query = {
        q: states.searchQuery,
        startIndex: states.startIndex,
        maxResults: states.maxResults,
    }
    $.getJSON(states.source, query, extractData);
}

function extractData(response) {
    states.response = response;
    items = response.items;
    items.forEach(function(item, index){
        $('.js-books').append(
            "<div class='book'>" +
            "<img src='"+item.volumeInfo.imageLinks.thumbnail+"'>" + 
            "<label>" + item.volumeInfo.title+"</label>");
    });
}