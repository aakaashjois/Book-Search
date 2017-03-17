var states = {
}

$(function () {
    $('.search-form').submit(function (event) {
        event.preventDefault();
        console.log("Getting query");
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
    getDatafromApi();
}

function getNextPage() {
    console.log("Get Next Page");
    states.startIndex = states.startIndex + states.items.length;
    console.log("Next Start index: " + states.startIndex);
    getDatafromApi();
}

function getDatafromApi() {
    console.log("Getting data from API");
    $.getJSON("https://www.googleapis.com/books/v1/volumes", {
        q: states.searchQuery,
        startIndex: states.startIndex,
        maxResults: 40,
    }, function (response) {
        if (response != undefined) {
            if (states.items == undefined) {
                states.items = response.items;
                console.log("Created new state: " + states.items.length);
            }
            else {
                states.items = states.items.concat(response.items);
                console.log("Append state: " + states.items.length);
            }
            createOverview();
        }
    });
}

function createOverview() {
    console.log("Creating Overview");
    for (var i = states.startIndex; i < states.items.length; i++) {
        item = states.items[i];
        console.log("index:" + i);
        $('.books').append(
            "<div class='book' id=" + i + ">" +
            "<img src='" + item.volumeInfo.imageLinks.thumbnail + "'>" +
            "<p>" + item.volumeInfo.title + "</p>" +
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