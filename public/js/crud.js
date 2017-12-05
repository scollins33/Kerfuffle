// CREATE the target
$('#createQuestion').on('click', function (event) {
    event.preventDefault();

    console.log('Trying to create new question');

    const newQuestion = {
        questionText: $('#questionText').val().trim(),
        answerA: $('#ansA').val().trim(),
        answerB: $('#ansB').val().trim(),
        answerC: $('#ansC').val().trim(),
        answerD: $('#ansD').val().trim(),
        correct: $('#correct').val().trim()
    };

    $.post('/admin/create/', newQuestion, () => {
        console.log('Entry Created');
    });
});

// DELETE the target
$('#deleteQuestion').on('click', function (event) {
    event.preventDefault();

    console.log('Trying to delete a question');

    const id = $('#questionID').val().trim();

    $.ajax({
        method: "DELETE",
        url: "/admin/delete/" + id
    })
        .done(() => {
            console.log('Entry deleted');
        })
        .fail(() => {
            console.log('Failed to delete');
        });
});