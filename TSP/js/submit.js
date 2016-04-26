var points = []

function getNodesJson() {
    var nodes = [];    
    for (var pid = 0; pid < points.length; pid++) {
	var node = {};
	node["id"] = "n" + pid.toString();
	node["x"] = points[pid][0];
	node["y"] = points[pid][1];
	node["size"] = 0;
	//node["label"] = pid.toString();
	nodes.push(node);
    }
    return nodes;
}

function convert(input_text) {
    arr = input_text.split(/\r\n|\r|\n/);
    line = arr[0];
    nums = line.split(' ');
    nums = nums.filter(function(x) { return x != ''; })
    if (nums.length != points.length) {
	alert("頂点数が違います");	
	return null;
    }
        
    var route = []
    for (var idx in nums) {
	var p = parseInt(nums[idx]);
	if (isNaN(p)) {
	    alert("不適切な値: " + nums[idx]);
	}
	route.push(p);
    }

    var nodes = getNodesJson();

    var sorted_route = route.slice();
    sorted_route.sort(function(x,y){return x - y;});

    for (var idx in sorted_route) {
	if (idx != sorted_route[idx]) {
	    alert("存在しない頂点: " + sorted_route[idx]);
	    return null;
	}
    }     

    var edges = [];
    for (var idx = 0; idx < route.length; idx++) {
	var s = route[idx];
	var t = route[(idx + 1) % route.length];
	var edge = {};
	edge["id"] = "e" + idx.toString();
	edge["source"] = "n" + s.toString();
	edge["target"] = "n" + t.toString();
	edges.push(edge);
    }
    
    var obj = {};
    obj["nodes"] = nodes;
    obj["edges"] = edges;
    
    var json = JSON.stringify(obj);
    
    return obj;
}

function showGraph(data) {    
    clearGraph();
    $("#container-frame").fadeIn(1000);
    var nodeColor = '#F1C40F';
    if (data["edges"] == null) {
	nodeColor = '#ECF0F1';
    }
    s = new sigma({
	graph: data,
	container: 'container',
	settings: {
	    defaultNodeColor: nodeColor
	}
    });
}

function clearGraph() {
    try {
	s.graph.clear();    
	s.refresh();	
    } catch(e) {
    }
}

function showPoints(file_name) {
    $.ajax({
	type: 'GET',
	url: './data/in/' + file_name,
	//dataType: 'html',
	success: function(text) {
	    //取得成功したら実行する処理
	    points = []
	    
	    lines = text.split(/\r\n|\r|\n/);
	    var n = parseInt(lines[0]);
	    for (var i = 0; i < n; i++) {
		var line = lines[i+1];
		var xy = line.split(' ');
		var x = parseFloat(xy[0]);
		var y = -parseFloat(xy[1]);
		points.push([x, y]);
	    }	    	    	    

	    var nodes = getNodesJson();
	    var obj = {};	    
	    obj["nodes"] = nodes;
	    showGraph(obj);
	},
	error:function() {
	    //取得失敗時に実行する処理
	    console.log("何らかの理由で失敗しました");
	}
    });    
}

function appendSelectBoxElement(selectBox, val, s) {
    var ele = document.createElement("option");
    ele.setAttribute("value", val);
    var str = document.createTextNode(s);
    ele.appendChild(str);
    selectBox.appendChild(ele);
}

function setProblemSelect() {
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
	    
	    var sb = document.settings.problem;
	    for (var i in file_list) {
		var file = file_list[i];
		appendSelectBoxElement(sb, file, file);
	    }
	},
	error:function() {
	    //取得失敗時に実行する処理
	    console.log("何らかの理由で失敗しました");
	}
    });
}

function readSuccess() {
    $("#file_submit").removeAttr("disabled");
    $("#file_button").removeClass("btn-default");
    $("#file_button").addClass("btn-success");
    $("#file_button").removeClass("btn-warning");
}

function readFailure() {
    $("#file_submit").attr("disabled", "disabled");
    $("#file_button").removeClass("btn-default");
    $("#file_button").removeClass("btn-success");
    $("#file_button").addClass("btn-warning");
}

function readWait() {
    $("#file_button").removeAttr("disabled");
    $("#file_submit").attr("disabled", "disabled");
    $("#file_button").addClass("btn-default");
    $("#file_button").removeClass("btn-success");
    $("#file_button").removeClass("btn-warning");
}

function setScore(score) {
    $("#main-progress-bar").animate({
	width: score.toString() + "%"
    }, 1000);
    $("#score p").text(score.toString() + " / 100 点");
    $("#score").show();
}

function clearScore() {
    $("#main-progress-bar").animate({
	width: "0%"
    }, 400);
    $("#score").hide();
}

function problemChanged() {
    var sb = document.settings.problem;
    var idx = sb.selectedIndex;
    if (idx == 0) {
	$(document.settings.problem).removeClass("select-primary");
	$(document.settings.problem).addClass("select-default");
	$("#file_button").attr("disabled", "disabled");
	$("#file_submit").attr("disabled", "disabled");
	return;
    }
    $(document.settings.problem).removeClass("select-default");
    $(document.settings.problem).addClass("select-primary");    
    clearScore();
    readWait();
    
    var val = sb.options[idx].value    
    showPoints(val);
    document.settings.file.value = "";
}

function fileChanged(evt) {
    var fileList = evt.target.files;
    
    var reader = new FileReader();
    
    // ファイル読み込み完了時
    reader.onload = function(){
	var data = convert(reader.result);
	if (data == null) {
	    readFailure();
	    return;
	}
	readSuccess();
	setScore(85.3);
	showGraph(data);	    
    }
    
    // ファイルの読み込み
    reader.readAsText(fileList[0], "utf-8");
}


$(document).ready(function() {
    $("select").select2({dropdownCssClass: 'dropdown-inverse'});    
    setProblemSelect();
    document.settings.file.addEventListener('change', fileChanged, false);    
});

