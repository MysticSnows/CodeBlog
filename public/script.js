const ckEditor = document.querySelector('#ckEditor');
if (ckEditor) {

    DecoupledDocumentEditor
        .create(ckEditor, {
            licenseKey: '',
            extraAllowedContent: 'iframe[*]',
            mediaEmbed: {
                previewsInData: true
            },
        })
        .then(editor => {
            window.editor = editor;

            // Set a custom container for the toolbar.
            document.querySelector('.document-editor__toolbar').appendChild(editor.ui.view.toolbar.element);
            document.querySelector('.ck-toolbar').classList.add('ck-reset_all');

            // Update hidden input field on form submission
            const myForm = document.querySelector('.contentForm');
            const hiddenInput = myForm.querySelector('#hiddenCkEditorInput');
            myForm.addEventListener('submit', event => {
                hiddenInput.value = editor.getData();
            });
        })
        .catch(error => {
            console.error('Oops, something went wrong!');
            console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
            console.error(error);
        });
}



$(document).ready(function () {
    // // Initially disable the markdown tab if CKEditor has content
    // if ($('#ckEditor').text().trim().length > 0) {
    //     $('#markdown-tab').addClass('disabled');
    //     $('#markdown').removeClass('show active');
    //     $('#ckeditor-tab').addClass('active');
    //     $('#ckeditor').addClass('show active');
    // }
    // // Initially disable CKEditor if markdown has content
    // else if ($('#markdown-field').val().trim().length > 0) {
    //     $('#ckeditor-tab').addClass('disabled');
    //     $('#ckeditor').removeClass('show active');
    //     $('#markdown-tab').addClass('active');
    //     $('#markdown').addClass('show active');
    // }

    // When CKEditor content changes
    $('#ckEditor').on('input', function () {
        // If CKEditor becomes empty
        if ($(this).text().trim().length == 0) {
            $('#markdown-tab').removeClass('disabled');
            $('#markdown-tab').click();
            $('#ckeditor-tab').addClass('disabled');
        }
        // If CKEditor has content
        else {
            $('#markdown-tab').addClass('disabled');
            $('#ckeditor-tab').removeClass('disabled');
        }
    });

    // When markdown content changes
    $('#markdown-field').on('input', function () {
        // If markdown becomes empty
        if ($(this).val().trim().length == 0) {
            $('#ckeditor-tab').removeClass('disabled');
            $('#ckeditor-tab').click();
            $('#markdown-tab').addClass('disabled');
        }
        // If markdown has content
        else {
            $('#ckeditor-tab').addClass('disabled');
            $('#markdown-tab').removeClass('disabled');
        }
    });
});
