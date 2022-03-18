const {form} = document.forms
// const body = document.querySelector('body')
// const containerTable = document.querySelector('#containerTable')
// const containerHead = document.querySelector('#tableHead')
const containerBody = document.querySelector('#tableBody')
// const textArea = document.querySelector('#inputText')

let arrToExcel = []

//обработчик кнопки копирования данных
const copyTableButton = document.querySelector('#buttonCopyTable')
copyTableButton.addEventListener('click', (event) => {
    event.preventDefault()
    makeSound()
    copyArrCreator()
    copy2DToClipboard(arrToExcel)
})

//функция добавления данных в массив для копирования
const copyArrCreator = () => {
    let formInput = JSON.parse(form.elements.inputText.value)
    for (let i = 0; i<formInput.length; i++) {
    arrToExcel.push(Object.values(formInput[i]))

    }
    createPopupMessage('(данные таблицы скопирован)')
}


//фукнция добавления всплывающего сообщения
const tableTitle = document.querySelector('#tableTitle')
const createPopupMessage = (text) => {
    const appendText = document.createElement('div')
    appendText.className = 'appendText'
    appendText.textContent = text

    tableTitle.append(appendText)
    setTimeout(()=>{appendText.textContent = ''}, 1500)

    // tableTitle.append()
}



//функция создания таблицы
const createTable = (element) => {
    const tableRow = document.createElement('tr')
    tableRow.className = 'tableRow'
    containerBody.append(tableRow)
    for (let data in element) {
        const tableData = document.createElement('td')
        tableData.className = 'tableData'
        tableData.innerHTML = `${element[data]}`
        tableRow.append(tableData)
    }
}

//обработчик кнопки создания таблицы
form.addEventListener('submit', (event) => {
    event.preventDefault()
    makeSound()
    containerBody.innerHTML = ''
    let formInput = JSON.parse(form.elements.inputText.value)
    formInput.forEach(elem => createTable(elem))
})

//обработчик кнопки сохранения файла
const downloadButton = document.querySelector('#buttonDownload')
downloadButton.addEventListener('click', (event) => {
    event.preventDefault()
    makeSound()
    writeFile(prompt('введите имя файла'), `${form.elements.inputText.value}`)
})

//функция сохранения файла
function writeFile(name, value) {
    let val = value
    if (value === undefined) {
        val = ""
    }
    const download = document.createElement("a")
    download.href = "data:text/plain;content-disposition=attachment;filename=file," + val
    download.download = name
    download.style.display = "none"
    download.id = "download"
    document.body.appendChild(download)
    document.getElementById("download").click()
    document.body.removeChild(download)
}


//функция копирования данных таблицы
function copy2DToClipboard(array) {
    var csv = '', row, cell;
    for (row = 0; row < array.length; row++) {
        for (cell = 0; cell < array[row].length; cell++) {
            csv += (array[row][cell] + '').replace(/[\n\t]+/g, ' ');
            if (cell + 1 < array[row].length) csv += '\t';
        }
        if (row + 1 < array.length) csv += '\n';
    }
    copyTextToClipboard(csv);
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

//функция создания звука
const makeSound = (action = 'click') => {
    const audio = new Audio()
    if (action === 'click') {
        audio.src = './src/sounds/click.mp3'
    }
    audio.preload = 'auto'
    audio.play()
}

// const shareButton = document.querySelector('#buttonShare')
// shareButton.addEventListener('click',(event)=>{
//     event.preventDefault()
//
//     if (navigator.canShare && navigator.canShare({ files: filesArray })) {
//         navigator.share({
//             files: filesArray,
//             title: 'Фотографии из отпуска',
//             text: 'Фото с 27 сентября по 14 октября.',
//         })
//             .then(() => console.log('Удалось поделиться.'))
//             .catch((error) => console.log('Не удалось поделиться', error));
//     } else {
//         console.log(`Ваша система не поддерживает обмен файлами.`);
//     }
//
// })


//
//
// //fileSave
// var _global = typeof window === 'object' && window.window === window
//     ? window : typeof self === 'object' && self.self === self
//         ? self : typeof global === 'object' && global.global === global
//             ? global
//             : this
//
// function bom(blob, opts) {
//     if (typeof opts === 'undefined') opts = {autoBom: false}
//     else if (typeof opts !== 'object') {
//         console.warn('Deprecated: Expected third argument to be a object')
//         opts = {autoBom: !opts}
//     }
//
//     // prepend BOM for UTF-8 XML and text/* types (including HTML)
//     // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
//     if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
//         return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type})
//     }
//     return blob
// }
//
// function download(url, name, opts) {
//     var xhr = new XMLHttpRequest()
//     xhr.open('GET', url)
//     xhr.responseType = 'blob'
//     xhr.onload = function () {
//         saveAs(xhr.response, name, opts)
//     }
//     xhr.onerror = function () {
//         console.error('could not download file')
//     }
//     xhr.send()
// }
//
// function corsEnabled(url) {
//     var xhr = new XMLHttpRequest()
//     xhr.open('HEAD', url, false)
//     try {
//         xhr.send()
//     } catch (e) {
//     }
//     return xhr.status >= 200 && xhr.status <= 299
// }
//
// function click(node) {
//     try {
//         node.dispatchEvent(new MouseEvent('click'))
//     } catch (e) {
//         var evt = document.createEvent('MouseEvents')
//         evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
//             20, false, false, false, false, 0, null)
//         node.dispatchEvent(evt)
//     }
// }
//
// var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)
//
// var saveAs = _global.saveAs || (
//     (typeof window !== 'object' || window !== _global)
//         ? function saveAs() { /* noop */
//         }
//
//         : ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
//         ? function saveAs(blob, name, opts) {
//             var URL = _global.URL || _global.webkitURL
//             var a = document.createElement('a')
//             name = name || blob.name || 'download'
//
//             a.download = name
//             a.rel = 'noopener' // tabnabbing
//
//             if (typeof blob === 'string') {
//                 a.href = blob
//                 if (a.origin !== location.origin) {
//                     corsEnabled(a.href)
//                         ? download(blob, name, opts)
//                         : click(a, a.target = '_blank')
//                 } else {
//                     click(a)
//                 }
//             } else {
//                 a.href = URL.createObjectURL(blob)
//                 setTimeout(function () {
//                     URL.revokeObjectURL(a.href)
//                 }, 4E4) // 40s
//                 setTimeout(function () {
//                     click(a)
//                 }, 0)
//             }
//         }
//
//         : 'msSaveOrOpenBlob' in navigator
//             ? function saveAs(blob, name, opts) {
//                 name = name || blob.name || 'download'
//
//                 if (typeof blob === 'string') {
//                     if (corsEnabled(blob)) {
//                         download(blob, name, opts)
//                     } else {
//                         var a = document.createElement('a')
//                         a.href = blob
//                         a.target = '_blank'
//                         setTimeout(function () {
//                             click(a)
//                         })
//                     }
//                 } else {
//                     navigator.msSaveOrOpenBlob(bom(blob, opts), name)
//                 }
//             }
//
//             : function saveAs(blob, name, opts, popup) {
//                 popup = popup || open('', '_blank')
//                 if (popup) {
//                     popup.document.title =
//                         popup.document.body.innerText = 'downloading...'
//                 }
//
//                 if (typeof blob === 'string') return download(blob, name, opts)
//
//                 var force = blob.type === 'application/octet-stream'
//                 var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
//                 var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)
//
//                 if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
//                     var reader = new FileReader()
//                     reader.onloadend = function () {
//                         var url = reader.result
//                         url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
//                         if (popup) popup.location.href = url
//                         else location = url
//                         popup = null // reverse-tabnabbing #460
//                     }
//                     reader.readAsDataURL(blob)
//                 } else {
//                     var URL = _global.URL || _global.webkitURL
//                     var url = URL.createObjectURL(blob)
//                     if (popup) popup.location = url
//                     else location.href = url
//                     popup = null // reverse-tabnabbing #460
//                     setTimeout(function () {
//                         URL.revokeObjectURL(url)
//                     }, 4E4) // 40s
//                 }
//             }
// )
//
// _global.saveAs = saveAs.saveAs = saveAs
//
// if (typeof module !== 'undefined') {
//     module.exports = saveAs;
// }
//
//
// function saveStaticDataToFile() {
//     let blob = new Blob([form.elements.inputText.value],
//         {type: "text/plain;charset=utf-8"});
//     saveAs(blob, prompt('введите имя файла'));
// }









