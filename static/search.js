const searchElement = document.querySelector('#search-input');
const searchDropdownElement = document.querySelector('#search-dropdown');

let index;
var initIndex = async function () {
    if (index === undefined) {
        index = fetch("/search_index.fr.json")
        .then(
            async function(response) {
            return await elasticlunr.Index.load(await response.json());
        }
        );
    }
    let res = await index;
    return res;
}
var options = {
    bool: "AND",
    fields: {
      title: {boost: 2},
      body: {boost: 1},
    }
  };
var results = (await initIndex()).search('effondrement', options);
searchDropdownElement.classList.toggle("is-active");

document.addEventListener("click", function (event) {
    searchDropdownElement.classList.remove("is-active");
});