function ViewModel() {
    var self = this;
    self.loadFile = ko.observable();
    self.localFile = function(a, b) {
        var fileList = b.target.files;

        var reader = new FileReader();
        
        // ファイル読み込み完了時
        reader.onload = function(){
            var r = "";
            try {
                // JSONに変換
                var obj = $.parseJSON(reader.result);
                r = "「$.parseJSON(reader.result)」を実行すればオブジェクトに変換してくれる";
                data = obj                
                s = new sigma({
                    graph: data,
                    container: 'container',
                    settings: {
                        defaultNodeColor: '#f1c40f'
                    }
                });                
            } catch (e) {
                // JSONではないファイルを読込んだとき
                r = "読み込みに失敗しました。";
            }

            a.loadFile(r);
        }

        // ファイルの読み込み
        reader.readAsText(fileList[0], "utf-8");
    };
}

$(document).ready(function () {
    ko.applyBindings(new ViewModel());
});
