'use strict'

document.addEventListener('DOMContentLoaded', function() {

    
    
    const item1 = document.getElementById('item1'); 
    const item2 = document.getElementById('item2'); 
    const item3 = document.getElementById('item3'); 
    const item = [item1, item2, item3];
    const searchList = document.getElementById('searchlist');
    let datas = JSON.parse(localStorage.getItem('key1'));
    let options = JSON.parse(localStorage.getItem('key2'));
    let searchWord;

    setOption();

    function setOption() {
        if (options === null) {
            options = [];
            clearOption();
            return;
        }
        if (options.length === 0) {
            clearOption();
            return;
        } else {
            clearOption();
            for (let i = 0, len = options.length; i < len; i++) {
                for (let j = 0; j < 3; j++) {
                    const option = document.createElement('option');
                    option.textContent = options[i];
                    item[j].appendChild(option);
                }
            }
        }
    }

    function clearOption() {
        for (let i = 0; i < 3; i++) {
            item[i].innerHTML = '';
            const option = document.createElement('option');
            option.textContent = '選択してください';
            option.value = "";
            option.selected = true;
            item[i].appendChild(option);
        }
    }

    document.getElementById('additem').addEventListener('click', function() {
        const btnAddItem = document.getElementById('btnadditem');
        if (btnAddItem.value === '') {
            window.alert('項目を入力してください');
            return;
        }
        for (let i = 0, len = options.length; i < len; i++) {
            if (btnAddItem.value === options[i]) {
                window.alert('項目がすでに存在します');
                return;
            }
        }
        for (let i = 0; i < 3; i++) {
            const option = document.createElement('option');
            option.textContent = btnAddItem.value;
            item[i].appendChild(option);
        }
        options.push(btnAddItem.value);
        btnAddItem.value = "";
        localStorage.setItem('key2', JSON.stringify(options));
    }, false);

    document.getElementById('deleteitem').addEventListener('click', function() {
        if (item1.value === '') {
            window.alert('項目を選択してください');
            return;
        }
        if (window.confirm(`項目:${item1.value}のメモがすべて削除されますがよろしいですか？`)) {
            datas = datas.filter (function(item) {
                if (item1.value !== item.item) {
                    return true;
                }
            }) 
            localStorage.setItem('key1', JSON.stringify(datas));
            for (let i = 0, len = options.length;  i < len; i++) {
                if (item1.value === options[i]) {
                    options.splice(i, 1);
                    localStorage.setItem('key2', JSON.stringify(options));
                    setOption();
                }
            }
        }
    })

    document.getElementById('add').addEventListener('click', function() {
        if (datas === null) {
            datas = [];
        }
        const inputTitle = document.getElementById('inputTitle');
        const inputText = document.getElementById('inputText');
        const date = new Date();
        const data = {add: date.toLocaleDateString(), item: item[1].value, title: inputTitle.value, text: inputText.value};
        if (item2.value === '') {
            window.alert('項目を選択してください');
            return;
        }
        if (inputTitle.value === "") {
            window.alert('題名を入力してください');
            return;
        }
        datas.push(data);
        inputTitle.value = "";
        inputText.value = "";
        localStorage.setItem('key1', JSON.stringify(datas));
    }, false);

    function sortOption() {
        const ul = document.createElement('ul');
        const li1 = document.createElement('li');
        const li2 = document.createElement('li');
        const li3 = document.createElement('li');
        const li4 = document.createElement('li');
        li1.textContent = 'すべて削除';
        li2.textContent = '新しい順';
        li3.textContent = '古い順';
        li4.textContent = '五十音順';
        li1.onclick = allDelete;
        li2.onclick = sortNew;
        li3.onclick = sortOld;
        li4.onclick = sortOrder;
        searchList.appendChild(ul);
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
    }

    document.getElementById('search').addEventListener('click', function() {
        if (datas === null) {
            datas = [];
        }
        if (item3.value === "") {
            window.alert('項目を選択してください');
            return;
        }
        const stack = searchList.innerHTML;
        searchList.classList.add('searching');
        searchList.innerHTML = '';
        searchWord = item3.value;
        checkDisplayNotes();
        if (searchList.innerHTML === '') {
            window.alert('メモが存在しません');
            searchList.innerHTML = stack;
            if (!searchList.innerHTML) {
                searchList.classList.remove('searching');
            }
            return;
        }
        sortOption();
    })

    document.getElementById('allsearch').addEventListener('click', function() {
        if (datas === null) {
            datas = [];
        }
        searchWord = null;
        const stack = searchList.innerHTML;
        searchList.innerHTML = '';
        displayNotes();
        if (searchList.innerHTML === '') {
            window.alert('メモが存在しません');
            searchList.innerHTML = stack;
            if (!searchList.innerHTML) {
                searchList.classList.remove('searching');
            }
            return;
        }
        searchList.classList.add('searching');
        sortOption();
        sortNew();
    })
    
    function checkDisplayNotes() {
        for (let i = 0, len = datas.length; i < len; i++) {
            if (searchWord === datas[i].item) {
                const div = document.createElement('div');
                const a = document.createElement('a');
                div.innerHTML = `追加日時:${datas[i].add}<br>項目:${datas[i].item}<br>題名:${datas[i].title}<br>詳細:${datas[i].text}`;
                a.textContent = '×';
                a.onclick = deleteNote;
                searchList.appendChild(div);
                div.appendChild(a);
            }
        }
    }

    function displayNotes() {
        for (let i = 0, len = datas.length; i < len; i++) {
            const div = document.createElement('div');
            const a = document.createElement('a');
            div.innerHTML = `追加日時:${datas[i].add}<br>項目:${datas[i].item}<br>題名:${datas[i].title}<br>詳細:${datas[i].text}`;
            a.textContent = '×';
            a.onclick = deleteNote;
            searchList.appendChild(div);
            div.appendChild(a);
        }
    }

    function allDelete() {
        if (window.confirm('表示されているメモはすべて削除されますがよろしいですか？')) {
            if (searchWord) {
                datas = datas.filter(function(item) {
                    if (searchWord !== item.item) {
                        return true;
                    }
                }) 
                localStorage.setItem('key1', JSON.stringify(datas));
                for (let i = 0, len = options.length;  i < len; i++) {
                    if (searchWord === options[i]) {
                        options.splice(i, 1);
                        localStorage.setItem('key2', JSON.stringify(options));
                        setOption();
                    }
                }
                searchList.classList.remove('searching');
                searchList.innerHTML = '';
                return;
            }
            localStorage.clear();
            datas = [];
            options = [];
            searchList.classList.remove('searching');
            searchList.innerHTML = '';
            clearOption();
        }
    }

    function sortNew() {
        const oldDatas = datas.slice();
        datas = datas.reverse();
        searchList.innerHTML = '';
        sortOption();
        if (searchWord) {
            checkDisplayNotes();
            datas = oldDatas;
            return;
        }
        displayNotes();
        datas = oldDatas;
    }
    
    function sortOld() {
        searchList.innerHTML = '';
        sortOption();
        if (searchWord) {
            checkDisplayNotes();
            return;
        }
        displayNotes();
    }

    function sortOrder() {
        const orderDatas = datas.slice();
        datas = datas.sort(function(x, y) {
            return x.title.localeCompare(y.title, 'ja');
        })
        searchList.innerHTML = '';
        sortOption();
        if (searchWord) {
            checkDisplayNotes();
            datas = orderDatas;
            return;
        }
        displayNotes();
        datas = orderDatas;
    }

    function deleteNote(e) {
        const subDatas = [];
        const subOptions = [];
        const src = e.srcElement;
        const div = src.parentNode;
        const children = searchList.childNodes;
        for (let i = 0, len = datas.length; i < len; i++) {
            const text = `追加日時:${datas[i].add}<br>項目:${datas[i].item}<br>題名:${datas[i].title}<br>詳細:${datas[i].text}<a>×</a>`;
            if (div.innerHTML !== text) {
                subDatas.push(datas[i]);
                if (!subOptions.includes(datas[i].item)) {
                    subOptions.push(datas[i].item);
                }
            }
        }
        datas = subDatas;
        localStorage.setItem('key1', JSON.stringify(datas));
        options = subOptions;
        localStorage.setItem('key2', JSON.stringify(options));
        setOption();
        div.remove();
        if (children.length < 2) {
            searchList.innerHTML = '';
            searchList.classList.remove('searching');
        }
    }

}, false)