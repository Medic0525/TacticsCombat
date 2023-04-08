function getDICT(url,callback) {
    let request = $.get(url);
    request.done(function(result){
        callback(result);
    })
    request.fail(function(jqXHR, textStatus, errorThrown) {
        callback(["fail",{
                "jqXHR": jqXHR,
                "textStatus": textStatus,
                "errorThrown": errorThrown
            }
        ])
    })
}

export function getContents(url, callback) {
    getDICT(url, data => callback(data));
  }