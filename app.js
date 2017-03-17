var states = {
    source: "https://www.googleapis.com/books/v1/volumes",
}

$(function () {
    $('.search-form').submit(function (event) {
        event.preventDefault();
        getQuery();
    });
});

function getQuery() {
    states.searchQuery = $('[type="text"]').val();
    states.startIndex = 0;
    states.maxResults = 40;
    $('.books').empty();
    getDatafromApi();
}

function getDatafromApi() {
    var query = {
        q: states.searchQuery,
        startIndex: states.startIndex,
        maxResults: states.maxResults,
    }
    $.getJSON(states.source, query, function (response) {
        if (response != undefined) {
            states.items = response.items;
            createOverview(states.items);
        }
    });
}

function createOverview(items) {
    items.forEach(function (item, index) {
        $('.books').append(
            "<div class='book' id=" + index + ">" +
            "<img src='" + item.volumeInfo.imageLinks.thumbnail + "'>" +
            "<p>" + item.volumeInfo.title + "</p>" +
            "</div>");
    });
    $('.book').click(function () {
        createDetailContent(this.id);
        $('.book-detail').show();
    });
}

function createDetailContent(index) {
    item = states.items[index];
    $('.close').click(function () {
        $('.book-detail').hide();
    });
    $('.book-cover').attr('src', item.volumeInfo.imageLinks.thumbnail);
    $('.book-title').html(item.volumeInfo.title);
    $('.book-subtitle').html(item.volumeInfo.subtitle);
    $('.book-author').html(item.volumeInfo.authors[0]);
    $('.book-description').html(item.volumeInfo.description);
    $('.book-buy').attr('href', item.saleInfo.buyLink);
}

//TODO: Show books below header
//TODO: Create empty state when no books are found
//TODO: Allow user to exit detail state by clicking outside the box