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
    console.log("Start Index:" + states.startIndex);
    $('.books').empty();
    states.items = undefined;
    getDatafromApi();
}

function getNextPage() {
    states.startIndex = states.startIndex + 40;
    console.log("Start index: " + states.startIndex);
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
            console.log("Items Length: " + states.items.length);
            createOverview();
        } else console.log("End of data");
    });
}

function extractData(response) {
    console.log("Extract data");
    var items = [];
    response.forEach(function (item) {
        if (item.volumeInfo != undefined) {
            if (item.volumeInfo.imageLinks != undefined)
                if (item.volumeInfo.imageLinks.thumbnail != undefined)
                    var thumbnail = item.volumeInfo.imageLinks.thumbnail;
                else
                    var thumbnail = "images/white.jpg";
            if (item.volumeInfo.title != undefined)
                var title = item.volumeInfo.title;
            else
                var title = "Book Name not found";
            if (item.volumeInfo.subtitle != undefined)
                var subtitle = item.volumeInfo.subtitle;
            else
                var subtitle = "No subtitle for this book";
            if (item.volumeInfo.authors != undefined)
                var author = item.volumeInfo.authors[0];
            else
                var author = "Unknown author";
            if (item.volumeInfo.description != undefined)
                var description = item.volumeInfo.description;
            else
                var description = "No description found";
            if (item.saleInfo != undefined) {
                if (item.saleInfo.buyLink != undefined)
                    var buyLink = item.saleInfo.buyLink;
                else
                    var buyLink = null;
            }
            items.push({
                thumbnail: thumbnail,
                title: title,
                subtitle: subtitle,
                author: author,
                description: description,
                buyLink: buyLink
            });
        } else console.log("No volumeInfo");
    });
    return items;
}

function createOverview() {
    console.log("Creating Overview");
    for (var i = states.startIndex; i < states.items.length; i++) {
        item = states.items[i];
        $('.books').append("<div class='book' id=" + i + ">" +
            "<img src='" + item.thumbnail + "'>" +
            "<p>" + item.title + "</p>" +
            "</div>");
    }
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
    $('.book-cover').attr('src', item.thumbnail);
    $('.book-title').html(item.title);
    $('.book-subtitle').html(item.subtitle);
    $('.book-author').html(item.author);
    $('.book-description').html(item.description);
    if (item.buyLink == null)
        $('.book-buy').hide();
    else
        $('.book-buy').attr('href', item.buyLink);
}
//TODO: Create empty state when no books are found
//TODO: Allow user to exit detail state by clicking outside the box