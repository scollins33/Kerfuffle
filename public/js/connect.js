$('#joinPost').on('click', function (event) {
    event.preventDefault();

    const room = $('#joinRoom').val().trim();
    const joinURL = '/rooms/' + room;

    $.post(joinURL, function (data, status) {
        console.log(`POST Room # ${room}`);
        console.log(data);
        window.location = data;
    });
});