var states = {}

$(function () {
    $('.search-form').submit(function (event) {
        event.preventDefault();
        getQuery();
    });
    window.onscroll = function (event) {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight)
            getNextPage();
    }
});

function getQuery() {
    states.searchQuery = $('[type="text"]').val();
    states.startIndex = 0;
    resetAll();
    getDatafromApi();
}

function resetAll() {
    $('.books').empty();
    states.items = undefined;

}

function getNextPage() {
    states.startIndex = states.startIndex + 40;
    getDatafromApi();
}

function getDatafromApi() {
    $.getJSON("https://www.googleapis.com/books/v1/volumes", {
        q: states.searchQuery,
        startIndex: states.startIndex,
        maxResults: 40,
    }, function (response) {
        if (response.items != undefined) {
            var items = extractData(response.items);
            if (states.items == undefined)
                states.items = items;
            else
                states.items = states.items.concat(items);
            createOverview();
        }
    });
}

function extractData(response) {
    var items = [];
    response.forEach(function (item) {
        if (item.volumeInfo != undefined)
            if (item.volumeInfo.title != undefined)
                if (item.volumeInfo.imageLinks != undefined)
                    if (item.volumeInfo.imageLinks.thumbnail != undefined) {
                        var thumbnail = item.volumeInfo.imageLinks.thumbnail;
                        var title = item.volumeInfo.title;
                        var subtitle = (item.volumeInfo.subtitle != undefined) ? item.volumeInfo.subtitle : null;
                        var author = (item.volumeInfo.authors != undefined) ? item.volumeInfo.authors[0] : null;
                        var description = (item.volumeInfo.description != undefined) ? item.volumeInfo.description : null;
                        if (item.saleInfo != undefined)
                            var buyLink = (item.saleInfo.buyLink != undefined) ? item.saleInfo.buyLink : null;
                        items.push({
                            thumbnail: thumbnail,
                            title: title,
                            subtitle: subtitle,
                            author: author,
                            description: description,
                            buyLink: buyLink
                        });
                    }
    });
    return items;
}

function createOverview() {
    if (states.items.length > 0) {
        $('.empty-view').hide();
        for (var i = states.startIndex; i < states.items.length; i++) {
            item = states.items[i];
            $('.books').append("<div class='book card' id=" + i + ">" +
                "<img src='" + item.thumbnail + "'>" +
                "<p>" + item.title + "</p>" +
                "</div>");
        }
        $('.book').click(function () {
            createDetailContent(this.id);
            $('.book-detail').show();
        });
    }
}

function createDetailContent(index) {
    item = states.items[index];
    $('.close').click(function () {
        $('.book-detail').hide();
    });
    $('.book-subtitle').show();
    $('.book-author').show();
    $('.book-description').show();
    $('.book-buy').show();
    $('.book-cover').attr('src', item.thumbnail);
    $('.book-title').html(item.title);
    (item.subtitle == null) ? $('.book-subtitle').hide() : $('.book-subtitle').html(item.subtitle);
    (item.author == null) ? $('.book-author').hide() : $('.book-author').html(item.author);
    (item.description == null) ? $('.book-description').hide() : $('.book-description').html(item.description);
    (item.buyLink == null) ? $('.book-buy').hide() : $('.book-buy').attr('href', item.buyLink);
}