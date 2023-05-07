const ckEditor = document.querySelector('#ckEditor');
if(ckEditor){

    DecoupledDocumentEditor
        .create(ckEditor, {
            licenseKey: '',
            mediaEmbed: {
                previewsInData:true
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
            console.error( 'Oops, something went wrong!' );
            console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
            console.error( error );
        });
}
