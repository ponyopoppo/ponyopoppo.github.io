
function appendProblem(id, problem, top) {
    var td_id = "<td>" + id.toString() + "</td>";
    var td_name = "<td>" + problem.split('.')[0] + "</td>";
    var td_top = "<td>" + top + "</td>"
    var td_input = "<td><a href=data/in/" + problem + "><span class=\"fui-document\"></span></a></td>";
    var td_submit = "<td><a href=submit.html#" + problem + "><span class=\"fui-upload\"></span></a></td>";
    
    
    $("#problem_list").append("<tr>" + td_id + td_name + td_top + td_input + td_submit + "</tr>");
}

function setProblems() {        
    $.ajax({
	type: 'GET',
	url: './data/file_list',
	//dataType: 'html',
	success: function(text) {
	    lines = text.split(/\r\n|\r|\n/);
	    file_list = [];
	    for (var i in lines) {
		var line = lines[i];
		if (line != "") {
		    file_list.push(line);
		}
	    }
	    
	    for (var i in file_list) {
		var file = file_list[i];
		appendProblem(parseInt(i)+1, file, 100);
	    }
	},
	error:function() {
	    //取得失敗時に実行する処理
	    console.log("何らかの理由で失敗しました");
	}
    });

}

$(document).ready(function() {
    setProblems();
});

