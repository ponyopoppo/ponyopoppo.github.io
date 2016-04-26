
function appendRanking(id, row) {
    var td_id = document.createElement("td");
    td_id.appendChild(document.createTextNode(id));
    
    var name = row[0];
    var td_name = document.createElement("td");
    td_name.appendChild(document.createTextNode(name));

    var score = row[1];
    var td_score = document.createElement("td");
    td_score.appendChild(document.createTextNode(score));

    var tr = document.createElement("tr");
    tr.appendChild(td_id);
    tr.appendChild(td_name);
    tr.appendChild(td_score);
    
    document.querySelector("#ranking_list").appendChild(tr);
}

function setRanking() {
    var lst = [["Alice", "100.0"],
	       ["Bob", "90.0"],
	       ["Charlie", "80.0"],
	       ["Dave", "70.0"],
	       ["Eve", "60.0"]];
    for (var id in lst) {
	appendRanking((parseInt(id)+1).toString(), lst[id]);
    }
}

$(document).ready(function() {
    setRanking();
});

