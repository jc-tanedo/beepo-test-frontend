export function getFileNames() {
    return fetch('http://localhost:3000/scripts/file-names')
        .then(res => res.json())
        .catch(handleError);
}

export function getOptions() {
    return fetch('http://localhost:3000/scripts/options')
        .then(res => res.json())
        .catch(handleError);
}

export function getScript(id) {
    return fetch(`http://localhost:3000/scripts/${id}`)
        .then(res => res.json())
        .catch(handleError);
}

export function uploadScript(file, contents) {

    const body = JSON.stringify({
        file_name: file.name,
        body: contents
    });

    return fetch(`http://localhost:3000/scripts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        }
    )
        .then(res => res.json())
        .catch(handleError);
}

function handleError(error) {
    console.log('Error calling api', error);
    alert(`Error occurred while calling api: ${error.toString()}`);

    return {
        message: error.toString(),
        data: []
    };
}

export default {
    getFileNames,
    getScript,
    getOptions,
    uploadScript
};
