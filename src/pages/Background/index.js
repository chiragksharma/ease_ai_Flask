var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:5000/summary?url=9T_wv6D8PYo", true);
xhr.onload = function () {
    var text = xhr.responseText;
    console.log(text)
    // const p = document.getElementById("output");
    // p.innerHTML = text;
    // btn.disabled = false;
    // btn.innerHTML = "Summarise";
}
xhr.send();