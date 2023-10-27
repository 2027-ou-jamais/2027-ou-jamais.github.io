const searchElement = document.querySelector('#search-input');
const searchDropdownElement = document.querySelector('#search-dropdown');


function debounce(func, wait) {
    let timeout;

    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);

        timeout = setTimeout(function () {
        timeout = null;
        func.apply(context, args);
        }, wait);
    };
}

let index = null;;
const initIndex = async function () {
    if (index === null) {
        index = fetch("/search_index.fr.json")
        .then(async function(response) {
            return await elasticlunr.Index.load(await response.json());
        });
    }
    let res = await index;
    return res;
}
"keyup focus".split(" ").forEach((ev) => {
    searchElement.addEventListener(ev, debounce(async (e) => {
        if (!e.target.value) {
            return;
        }

        const results = (await initIndex()).search(e.target.value, {
            bool: "AND",
            fields: {
            title: {boost: 3},
            description: {boost: 2},
            body: {boost: 1},
            }
        });
        searchDropdownElement.replaceChildren();
        if (results.length > 0) {
            results.forEach(result => {
                const item = document.createElement('a')
                item.classList.add('dropdown-item')
                item.href = result.ref
                item.text = result.doc.title
                searchDropdownElement.appendChild(item);
                });
        } else {
            const item = document.createElement('a')
            item.classList.add('dropdown-item')
            item.href = '#'
            item.text = 'Aucun résultat'
            searchDropdownElement.appendChild(item);
        }
        searchDropdownElement.classList.remove("is-hidden");
    }, 150));
})

document.addEventListener("click", function (event) {
    searchDropdownElement.classList.add("is-hidden");
});